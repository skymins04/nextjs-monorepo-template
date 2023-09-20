import { useEffect, useRef, useState } from 'react';

export const useCarousel = (
  maxLength: number,
  intervalTime = 5000,
): readonly [number, (idx: number) => void] => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const setIncreaseIndexInterval = (
    maxLength: number,
    intervalTime: number,
  ) => {
    timerRef.current = setInterval(() => {
      setIndex((idx) => {
        if (idx === maxLength - 1) return 0;
        return idx + 1;
      });
    }, intervalTime);
  };

  const setIndexManual = (idx: number) => {
    if (idx >= 0 && idx < maxLength) {
      clearIncreaseIdxInterval();
      setIndex(idx);
      setIncreaseIndexInterval(maxLength, intervalTime);
    }
  };

  const clearIncreaseIdxInterval = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearIncreaseIdxInterval();
    if (maxLength > 1) {
      setIncreaseIndexInterval(maxLength, intervalTime);
    }
  }, [maxLength, intervalTime]);

  return [index, setIndexManual];
};
