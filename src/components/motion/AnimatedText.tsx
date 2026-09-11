'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  as = 'h1',
  delay = 0,
  highlightWords = [],
  highlightClass = 'text-gradient-blue',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  const Tag = as as any;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 120,
      },
    },
  };

  return (
    <Tag className={cn('overflow-hidden flex flex-wrap gap-x-[0.28em] gap-y-1', className)}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="contents"
      >
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
          const isHighlight = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
          );

          return (
            <motion.span
              variants={child}
              key={index}
              className={cn('inline-block', isHighlight && highlightClass)}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.span>
    </Tag>
  );
};
