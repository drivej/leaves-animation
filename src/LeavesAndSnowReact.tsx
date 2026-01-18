import React, { useEffect, useRef } from 'react';
import { LeavesAndSnow } from './LeavesAndSnow.js';

export interface LeavesAndSnowReactProps {
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LeavesAndSnowReact: React.FC<LeavesAndSnowReactProps> = ({
  width,
  height,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<LeavesAndSnow | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create LeavesAndSnow instance
    const instance = new LeavesAndSnow({
      width,
      height,
      container: containerRef.current
    });

    instanceRef.current = instance;

    // Cleanup on unmount
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

