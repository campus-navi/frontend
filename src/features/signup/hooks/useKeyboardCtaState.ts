import { useEffect, useState } from 'react';

function isEditableElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return element.matches('input, textarea, [contenteditable="true"]');
}

function isTouchViewport() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(pointer: coarse)').matches;
}

function getKeyboardInset() {
  if (typeof window === 'undefined' || !window.visualViewport) {
    return 0;
  }

  const viewport = window.visualViewport;
  return Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
}

export function useKeyboardCtaState() {
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    let animationFrame = 0;
    const updateKeyboardInset = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        setKeyboardInset(getKeyboardInset());
      });
    };

    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);
    window.addEventListener('orientationchange', updateKeyboardInset);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      viewport.removeEventListener('resize', updateKeyboardInset);
      viewport.removeEventListener('scroll', updateKeyboardInset);
      window.removeEventListener('orientationchange', updateKeyboardInset);
    };
  }, []);

  useEffect(() => {
    const updateInputFocus = () => {
      setIsInputFocused(isEditableElement(document.activeElement));
    };

    const handleFocusOut = () => {
      window.setTimeout(updateInputFocus, 0);
    };

    updateInputFocus();
    document.addEventListener('focusin', updateInputFocus);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', updateInputFocus);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return {
    isSupported: typeof window !== 'undefined' && Boolean(window.visualViewport),
    keyboardInset,
    isKeyboardOpen: isTouchViewport() && isInputFocused && keyboardInset > 80,
  };
}
