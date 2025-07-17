import React, { useEffect, useRef, useState } from 'react';
import './ScrollSquare.css';

const ScrollSquare: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="spacer" /> {/* для прокрутки */}
      <div ref={containerRef} className="trigger-zone" />
      <div className={`fullscreen-overlay ${visible ? 'show' : ''}`} />
    </>
  );
};

export default ScrollSquare;
