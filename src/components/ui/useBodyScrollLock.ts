import { useEffect } from 'react';

type ScrollLockSnapshot = {
  bodyLeft: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyRight: string;
  bodyTop: string;
  bodyTouchAction: string;
  bodyWidth: string;
  htmlOverscrollBehavior: string;
  htmlOverflow: string;
  scrollY: number;
};

type BodyScrollLockOptions = {
  touchAction?: string;
};

let activeLockCount = 0;
let snapshot: ScrollLockSnapshot | null = null;

function getCurrentScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function lockBodyScroll(options: BodyScrollLockOptions = {}) {
  if (activeLockCount === 0) {
    const { body, documentElement } = document;
    const scrollY = getCurrentScrollY();

    snapshot = {
      bodyLeft: body.style.left,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyRight: body.style.right,
      bodyTop: body.style.top,
      bodyTouchAction: body.style.touchAction,
      bodyWidth: body.style.width,
      htmlOverscrollBehavior: documentElement.style.overscrollBehavior,
      htmlOverflow: documentElement.style.overflow,
      scrollY,
    };

    documentElement.style.overflow = 'hidden';
    documentElement.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  }

  if (options.touchAction) {
    document.body.style.touchAction = options.touchAction;
  }

  activeLockCount += 1;
}

function unlockBodyScroll() {
  activeLockCount = Math.max(activeLockCount - 1, 0);

  if (activeLockCount > 0 || !snapshot) {
    return;
  }

  const { body, documentElement } = document;
  const restoredScrollY = snapshot.scrollY;

  documentElement.style.overflow = snapshot.htmlOverflow;
  documentElement.style.overscrollBehavior = snapshot.htmlOverscrollBehavior;
  body.style.position = snapshot.bodyPosition;
  body.style.top = snapshot.bodyTop;
  body.style.left = snapshot.bodyLeft;
  body.style.right = snapshot.bodyRight;
  body.style.width = snapshot.bodyWidth;
  body.style.overflow = snapshot.bodyOverflow;
  body.style.touchAction = snapshot.bodyTouchAction;
  snapshot = null;

  window.scrollTo(0, restoredScrollY);
}

export function useBodyScrollLock(isLocked: boolean, options?: BodyScrollLockOptions) {
  const touchAction = options?.touchAction;

  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    lockBodyScroll({ touchAction });

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked, touchAction]);
}
