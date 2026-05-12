import { useSyncExternalStore } from 'react';

const NOTICE_INTEREST_PROMPT_DISMISSED_KEY = 'notice-interest-prompt-dismissed';
const listeners = new Set<() => void>();
let hasDismissedNoticeInterestPromptFallback = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function readDismissedFromSessionStorage() {
  try {
    return sessionStorage.getItem(NOTICE_INTEREST_PROMPT_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeDismissedToSessionStorage() {
  try {
    sessionStorage.setItem(NOTICE_INTEREST_PROMPT_DISMISSED_KEY, 'true');
    hasDismissedNoticeInterestPromptFallback = false;
  } catch {
    hasDismissedNoticeInterestPromptFallback = true;
  }
}

function removeDismissedFromSessionStorage() {
  hasDismissedNoticeInterestPromptFallback = false;

  try {
    sessionStorage.removeItem(NOTICE_INTEREST_PROMPT_DISMISSED_KEY);
  } catch {
    // If sessionStorage is unavailable, there is nothing persisted to clear.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getHasDismissedNoticeInterestPrompt() {
  return readDismissedFromSessionStorage() || hasDismissedNoticeInterestPromptFallback;
}

export function dismissNoticeInterestPrompt() {
  writeDismissedToSessionStorage();
  emitChange();
}

export function resetNoticeInterestPromptDismiss() {
  removeDismissedFromSessionStorage();
  emitChange();
}

export function useHasDismissedNoticeInterestPrompt() {
  return useSyncExternalStore(subscribe, getHasDismissedNoticeInterestPrompt, () => false);
}
