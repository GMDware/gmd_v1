'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export type CursorState = 'default' | 'hover' | 'project' | 'hidden';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  cursorLabel?: string;
  setCursorLabel: (label?: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: 'default',
  setCursorState: () => {},
  setCursorLabel: () => {},
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [cursorLabel, setCursorLabel] = useState<string | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for fluid trailing feel
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Only enable on pointer-fine desktop devices without reduced motion
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState, cursorLabel, setCursorLabel }}>
      {children}

      {/* Custom Desktop-Only Cursor */}
      {!isTouchDevice && isVisible && cursorState !== 'hidden' && (
        <>
          {/* Main Kinetic Cursor Follower */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
            style={{
              x: springX,
              y: springY,
            }}
          >
            {cursorState === 'default' && (
              <div className="relative flex items-center justify-center">
                {/* Center Precision Coordinate Dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
                {/* Outer Reticle Ring */}
                <div className="absolute w-6 h-6 rounded-full border border-white/20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
              </div>
            )}

            {cursorState === 'hover' && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-10 h-10 rounded-full border border-[#0066FF] bg-[#0066FF]/15 backdrop-blur-[1px] shadow-[0_0_15px_rgba(0,102,255,0.4)]"
              />
            )}

            {cursorState === 'project' && (
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-20 h-20 rounded-full bg-[#00D2FF] text-[#020408] font-mono font-black text-xs tracking-widest uppercase flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.6)]"
              >
                {cursorLabel || 'VIEW'}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </CursorContext.Provider>
  );
};
