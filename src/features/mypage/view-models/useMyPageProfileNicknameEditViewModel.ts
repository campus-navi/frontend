import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';
import { useProfileNicknameValidation } from '@/features/mypage/hooks/useProfileNicknameValidation';
import { useUpdateNickname } from '@/features/mypage/hooks/useUpdateNickname';

export function useMyPageProfileNicknameEditViewModel() {
  const navigate = useNavigate();
  const { data: summary, isError, isLoading } = useMyPageSummary();
  const updateNickname = useUpdateNickname();
  const isInitializedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [originalNickname, setOriginalNickname] = useState('');
  const [nickname, setNickname] = useState('');
  const nicknameValidation = useProfileNicknameValidation(
    nickname,
    originalNickname,
  );

  useEffect(() => {
    if (!summary || isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;
    setOriginalNickname(summary.nickname);
    setNickname(summary.nickname);
  }, [summary]);

  const canSubmit =
    isInitializedRef.current &&
    Boolean(nickname.trim()) &&
    nicknameValidation.isChanged &&
    nicknameValidation.validation.isValid &&
    nicknameValidation.isAvailable &&
    !updateNickname.isPending;
  const submitErrorMessage = updateNickname.isError
    ? '닉네임 수정에 실패했습니다. 다시 시도해주세요.'
    : null;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await updateNickname.mutateAsync({ nickname });
      navigate('/mypage/profile/edit', { replace: true });
    } catch {
      // Mutation state renders the API error.
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleChange = (value: string) => {
    if (updateNickname.isError) {
      updateNickname.reset();
    }

    setNickname(value);
  };

  return {
    canSubmit,
    helperText: nicknameValidation.helperText,
    helperTone: nicknameValidation.helperTone,
    isChecking: nicknameValidation.availability.status === 'checking',
    isLoading,
    loadErrorMessage: isError ? '프로필 정보를 불러오지 못했습니다.' : null,
    nickname,
    onChange: handleChange,
    onClose: () => navigate('/mypage/profile/edit'),
    onSubmit: handleSubmit,
    submitErrorMessage,
    submitting: updateNickname.isPending,
  };
}
