import { useWindowSize } from '@rspress/core/runtime';
import { useEffect, useMemo, useState } from 'react';

export const useReadPercent = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [h, setH] = useState(0);
  const { height } = useWindowSize();

  useEffect(() => {
    let animRefId: number | null = null;
    const scrollElement = window || document.documentElement;
    const update = () => {
      const dom = document.querySelector<HTMLElement>('.rspress-doc');
      if (dom) {
        setH(dom.offsetHeight || 0);
      }
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setScrollTop(scrollTop);
      animRefId = null;
    };

    const handler = () => {
      if (animRefId !== null) return;

      animRefId = window.requestAnimationFrame(update);
    };

    handler();
    scrollElement?.addEventListener('scroll', handler, { passive: true });
    return () => {
      scrollElement?.removeEventListener('scroll', handler);
      if (animRefId !== null) {
        window.cancelAnimationFrame(animRefId);
      }
    };
  }, []);

  const readPercent = useMemo(() => {
    const deltaHeight = Math.min(scrollTop, height);
    return (
      Math.floor(
        Math.min(Math.max(0, ((scrollTop - 50 + deltaHeight) / h) * 100), 100),
      ) || 0
    );
  }, [h, scrollTop, height]);

  return [readPercent, scrollTop] as const;
};
