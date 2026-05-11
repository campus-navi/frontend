import { useSyncExternalStore } from 'react';

const NOTICE_INTEREST_PROMPT_DISMISSED_KEY = 'notice-interest-prompt-dismissed';
const listeners = new Set<() => void>();

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
  } catch {
    // If sessionStorage is unavailable, keep the modal closable for this render cycle.
  }
}

function removeDismissedFromSessionStorage() {
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
  return readDismissedFromSessionStorage();
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
