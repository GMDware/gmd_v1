/**
 * GMDware ATELIER Motion Language:
 * - Restrained, editorial, elegant, intentional
 * - Smooth opacity fades and quiet vertical rises
 * - Minimalist transitions without gratuitous 3D or bouncing
 */

export const atelierMotion = {
  transition: {
    duration: 0.7,
    ease: [0.19, 1, 0.22, 1], // Smooth editorial luxury ease
  },
  textReveal: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  },
  imageReveal: {
    initial: { opacity: 0, scale: 0.99 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
  staggerEditorial: {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  },
};
