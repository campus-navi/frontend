import type { UniversitySummary } from '@/api/modules/university';

const MOCK_UNIVERSITIES: UniversitySummary[] = [
  { campusId: 1, universityName: '가천대학교', emailDomain: 'gachon.ac.kr' },
  { campusId: 2, universityName: '건국대학교', emailDomain: 'konkuk.ac.kr' },
  { campusId: 3, universityName: '경북대학교', emailDomain: 'knu.ac.kr' },
  { campusId: 4, universityName: '경희대학교', emailDomain: 'khu.ac.kr' },
  { campusId: 5, universityName: '고려대학교', emailDomain: 'korea.ac.kr' },
  { campusId: 6, universityName: '고려대학교(세종 캠퍼스)', emailDomain: 'korea.ac.kr' },
  { campusId: 7, universityName: '국민대학교', emailDomain: 'kookmin.ac.kr' },
  { campusId: 8, universityName: '동국대학교', emailDomain: 'dongguk.edu' },
  { campusId: 9, universityName: '부산대학교', emailDomain: 'pusan.ac.kr' },
  { campusId: 10, universityName: '서강대학교', emailDomain: 'sogang.ac.kr' },
  { campusId: 11, universityName: '서울과학기술대학교', emailDomain: 'seoultech.ac.kr' },
  { campusId: 12, universityName: '서울대학교', emailDomain: 'snu.ac.kr' },
  { campusId: 13, universityName: '서울시립대학교', emailDomain: 'uos.ac.kr' },
  { campusId: 14, universityName: '성균관대학교', emailDomain: 'skku.edu' },
  { campusId: 15, universityName: '세종대학교', emailDomain: 'sejong.ac.kr' },
  { campusId: 16, universityName: '숙명여자대학교', emailDomain: 'sookmyung.ac.kr' },
  { campusId: 17, universityName: '숭실대학교', emailDomain: 'soongsil.ac.kr' },
  { campusId: 18, universityName: '아주대학교', emailDomain: 'ajou.ac.kr' },
  { campusId: 19, universityName: '연세대학교', emailDomain: 'yonsei.ac.kr' },
  { campusId: 20, universityName: '연세대학교(미래캠퍼스)', emailDomain: 'yonsei.ac.kr' },
  { campusId: 21, universityName: '이화여자대학교', emailDomain: 'ewha.ac.kr' },
  { campusId: 22, universityName: '인하대학교', emailDomain: 'inha.edu' },
  { campusId: 23, universityName: '전남대학교', emailDomain: 'jnu.ac.kr' },
  { campusId: 24, universityName: '전북대학교', emailDomain: 'jbnu.ac.kr' },
  { campusId: 25, universityName: '중앙대학교', emailDomain: 'cau.ac.kr' },
  { campusId: 26, universityName: '충남대학교', emailDomain: 'cnu.ac.kr' },
  { campusId: 27, universityName: '충북대학교', emailDomain: 'chungbuk.ac.kr' },
  { campusId: 28, universityName: '한국외국어대학교', emailDomain: 'hufs.ac.kr' },
  { campusId: 29, universityName: '한양대학교', emailDomain: 'hanyang.ac.kr' },
  { campusId: 30, universityName: '한양대학교 ERICA', emailDomain: 'hanyang.ac.kr' },
  { campusId: 31, universityName: '홍익대학교', emailDomain: 'hongik.ac.kr' },
];

export function getMockUniversities() {
  return [...MOCK_UNIVERSITIES].sort((left, right) => left.universityName.localeCompare(right.universityName, 'ko-KR'));
}
