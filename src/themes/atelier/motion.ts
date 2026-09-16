/**
 * GMDware ATELIER Motion Language:
 * - Dynamic, editorial, tangible, motion-led
 * - Hardware-accelerated directional reveals & spring-damped physics
 * - Multi-plane scroll-linked parallax and 3D perspective
 * - Accessible prefers-reduced-motion fallbacks
 */

export const springPhysics = {
  soft: { damping: 25, stiffness: 180 },
  snappy: { damping: 20, stiffness: 260 },
  bouncy: { damping: 15, stiffness: 300 },
  tilt: { damping: 22, stiffness: 160 },
};

export const editorialEasing = [0.16, 1, 0.3, 1] as const;

export const atelierVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: (custom: number = 0.1) => ({
      opacity: 1,
      transition: {
        staggerChildren: custom,
        delayChildren: 0.05,
      },
    }),
  },

  slideInUp: {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: editorialEasing },
    },
  },

  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: editorialEasing },
    },
  },

  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: editorialEasing },
    },
  },

  depthZoomIn: {
    hidden: { opacity: 0, scale: 0.93, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: editorialEasing },
    },
  },

  lineReveal: {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: editorialEasing },
    },
  },

  cardHover: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -6,
      scale: 1.01,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  },
};

export const atelierMotion = {
  transition: {
    duration: 0.7,
    ease: editorialEasing,
  },
  textReveal: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.6, ease: editorialEasing },
  },
  imageReveal: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: editorialEasing },
  },
  staggerEditorial: {
    animate: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
};
