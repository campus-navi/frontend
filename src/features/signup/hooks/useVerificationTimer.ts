import { useEffect, useState } from 'react';

function getRemainingTime(targetTime: number | null) {
  if (!targetTime) {
    return 0;
  }

  return Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
}

export function useVerificationTimer(targetTime: number | null) {
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(targetTime));

  useEffect(() => {
    setTimeLeft(getRemainingTime(targetTime));
  }, [targetTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft(getRemainingTime(targetTime));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime, timeLeft]);

  return {
    timeLeft,
    isRunning: timeLeft > 0,
  };
}
