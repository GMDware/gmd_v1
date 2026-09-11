/**
 * GMDware NEXUS Motion Language:
 * - Fluid, organic, continuous, spatial
 * - Soft spring physics & orbital morphing
 * - Particle drift and floating transforms
 */

export const nexusMotion = {
  transition: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1], // Smooth organic fluid ease
  },
  orbitalFade: {
    initial: { opacity: 0, scale: 0.95, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.02, y: -12 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  pulseGlow: {
    animate: {
      scale: [1, 1.04, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  staggerNodes: {
    animate: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
};
