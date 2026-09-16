'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface AtelierPageTransitionProps {
  children: React.ReactNode;
}

export const AtelierPageTransition: React.FC<AtelierPageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1], // Editorial deceleration curve
        }}
        className="w-full flex-1 flex flex-col relative"
      >
        {/* Subtle Editorial Top Accent Sweep on page entrance */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 z-50 origin-left pointer-events-none"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
};
