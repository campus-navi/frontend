import { useEffect, useState } from 'react';

export function useVerificationTimer(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  const start = () => setTimeLeft(initialSeconds);
  const reset = () => setTimeLeft(0);

  return {
    timeLeft,
    isRunning: timeLeft > 0,
    start,
    reset,
  };
}
