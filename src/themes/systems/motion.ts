/**
 * GMDware SYSTEMS Motion Language:
 * - Structural assembly
 * - Snapping mechanical precision
 * - Linear and crisp cubic-bezier easing
 * - Telemetry line drawing
 */

export const systemsMotion = {
  transition: {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1], // Crisp mechanical snapping
  },
  fadeIn: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  gridReveal: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};
