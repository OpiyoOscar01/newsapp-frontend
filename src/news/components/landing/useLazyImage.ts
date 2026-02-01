import { useEffect, useRef, useState } from 'react';

export const useLazyImage = (priority: 'high' | 'normal' = 'normal', rootMargin = '200px') => {
  const [isLoaded, setIsLoaded] = useState(priority === 'high');
  const [isInView, setIsInView] = useState(priority === 'high');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return {
    containerRef,
    imgRef,
    isLoaded,
    isInView,
    handleLoad,
    shouldLoad: isInView || priority === 'high'
  };
};