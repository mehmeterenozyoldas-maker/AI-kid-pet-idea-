import { Variants } from 'framer-motion';

// Refined Bezier Curves for "Disney-like" fluid motion
const softSpline = [0.25, 0.1, 0.25, 1]; // General smooth
const elasticOut = [0.34, 1.56, 0.64, 1]; // Bouncy stop
const anticipation = [0.4, 0, 0.2, 1]; // Wind up
const heavy = [0.25, 0.46, 0.45, 0.94]; // Heavy object feel

export const bodyVariants: Variants = {
  IDLE: {
    y: [0, -6, 0],
    scaleY: [1, 1.02, 1],
    scaleX: [1, 0.98, 1],
    rotateZ: 0,
    transition: {
      y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      scaleY: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      scaleX: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
    }
  },
  // --- Lifelike Additions ---
  TRANSITION: {
    scaleY: 0.85,
    scaleX: 1.15,
    y: 8,
    transition: { duration: 0.15, ease: "easeOut" }
  },
  FIDGET_WIGGLE: {
    rotateZ: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  FIDGET_BOUNCE: {
    y: [0, -10, 0],
    scaleY: [1, 1.1, 1],
    transition: { duration: 0.4, ease: "easeOut" }
  },
  // --------------------------
  NOD: {
    y: [0, 8, -4, 8, 0],
    rotateX: [0, 15, -5, 5, 0],
    scaleY: [1, 0.95, 1.05, 0.98, 1],
    transition: { 
      duration: 0.7, 
      ease: softSpline 
    }
  },
  SHAKE: {
    x: [0, -10, 10, -6, 6, -3, 3, 0],
    rotateZ: [0, -3, 3, -2, 2, -1, 1, 0],
    scale: 1,
    transition: { duration: 0.6, ease: "linear" }
  },
  HAPPY: {
    y: [0, 15, -40, 0], // Anticipation Down -> Jump Up -> Land
    scaleY: [1, 0.7, 1.2, 1], // Squash -> Stretch -> Recover
    scaleX: [1, 1.3, 0.8, 1], // Broaden -> Thin -> Recover
    rotateZ: [0, 0, -5, 0],
    transition: { 
      duration: 0.7,
      times: [0, 0.15, 0.5, 1],
      ease: [anticipation, "easeOut", elasticOut] // Mixed easings
    }
  },
  SAD: {
    y: [0, 25],
    scaleY: [1, 0.9],
    scaleX: [1, 1.08],
    rotateX: 10,
    transition: {
      duration: 1.2,
      ease: heavy
    }
  },
  EMPHASIS: {
    scale: [1, 0.9, 1.3, 1],
    y: [0, 5, -10, 0],
    rotateZ: [0, -2, 2, 0],
    transition: {
      duration: 0.5,
      ease: elasticOut
    }
  },
  THINKING: {
    rotate: [0, 360],
    y: [0, -5, 0],
    scale: [1, 0.95, 1],
    transition: {
      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
      y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
    }
  },
  IDEA: {
    y: [0, 10, -35, 0],
    scale: [1, 0.8, 1.15, 1],
    rotateZ: [0, 0, 360, 360], // Spin in air
    transition: {
      duration: 0.9,
      times: [0, 0.1, 0.5, 1],
      ease: anticipation
    }
  },
  CONFUSED: {
    rotateZ: [0, -15, 10, -5, 0],
    x: [0, -15, 15, -5, 0],
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1]
    }
  },
  WAITING: {
    rotateZ: [-3, 3],
    x: [-2, 2],
    y: [0, 2],
    transition: {
      rotateZ: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      x: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      y: { duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeOut" }
    }
  },
  SURPRISED: {
    scale: [1, 1.4, 1.3],
    y: [0, -20, -15],
    scaleY: [1, 1.5, 1.3], // Tall stretch
    scaleX: [1, 0.8, 0.9], // Thin stretch
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 12
    }
  },
  LOVE: {
    scale: [1, 1.05, 1, 1.05, 1],
    y: [0, -5, 0, -5, 0],
    rotate: [0, -3, 3, -3, 0],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5
    }
  },
  SLEEPY: {
    y: [0, 4, 0],
    scaleY: [1, 0.96, 1],
    scaleX: [1, 1.02, 1],
    rotateZ: [0, 1, 0, -1, 0],
    filter: "brightness(0.95)",
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  ANGRY: {
    x: [-1, 1, -2, 2, -1, 1],
    y: [0, 2],
    scale: 1.05,
    filter: "hue-rotate(330deg) saturate(1.2)", 
    transition: {
      x: { duration: 0.2, repeat: Infinity, ease: "linear" },
      y: { duration: 0.2, y: 10 },
      filter: { duration: 0.4 }
    }
  },
  SILLY: {
    y: [0, -15, 0, -8, 0],
    rotateZ: [0, 15, -15, 5, -5, 0],
    scaleX: [1, 0.9, 1.1, 0.95, 1],
    scaleY: [1, 1.1, 0.9, 1.05, 1],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5
    }
  },
  LISTENING: {
     scale: [1, 1.05],
     transition: {
        duration: 0.3,
        yoyo: Infinity
     }
  }
};

// New Variants specifically for the ground shadow
export const shadowVariants: Variants = {
  IDLE: {
    scale: 1,
    opacity: 0.3,
    transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
  },
  TRANSITION: {
    scale: 1.2,
    opacity: 0.4,
    transition: { duration: 0.15 }
  },
  HAPPY: {
    scale: [1, 1.2, 0.5, 1], // Grows when squashing (body goes down), shrinks when jumping
    opacity: [0.3, 0.4, 0.1, 0.3], // Fades when jumping high
    transition: { 
      duration: 0.7,
      times: [0, 0.15, 0.5, 1],
      ease: [anticipation, "easeOut", elasticOut]
    }
  },
  IDEA: {
    scale: [1, 1.1, 0.4, 1],
    opacity: [0.3, 0.4, 0.1, 0.3],
    transition: {
      duration: 0.9,
      times: [0, 0.1, 0.5, 1],
      ease: anticipation
    }
  },
  SURPRISED: {
    scale: 0.6,
    opacity: 0.1,
    transition: { duration: 0.3 }
  },
  SAD: {
    scale: 1.2,
    opacity: 0.5,
    transition: { duration: 1 }
  },
  NOD: {
    scale: [1, 1.1, 1, 1.1, 1],
    transition: { duration: 0.7 }
  },
  EMPHASIS: {
    scale: [1, 1.2, 0.8, 1],
    transition: { duration: 0.5 }
  }
};

export const eyeVariants: Variants = {
  IDLE: { scale: 1, y: 0, rotate: 0 },
  TRANSITION: { scaleY: 0.1, y: 3, transition: { duration: 0.15 } }, // Blink
  FIDGET_GLANCE: { 
    x: [0, -5, -5, 5, 5, 0],
    transition: { duration: 2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
  },
  FIDGET_WIGGLE: { x: 0 },
  FIDGET_BOUNCE: { x: 0 },
  NOD: { scaleY: [1, 0.1, 1], y: [0, 2, 0], transition: { duration: 0.7 } },
  SHAKE: { x: [-1, 1], transition: { duration: 0.5 } },
  HAPPY: { scaleY: 0.3, scaleX: 1.2, y: -3, transition: { type: "spring" } }, // Happy squint
  SAD: { rotate: -15, y: 5, scaleY: 1.1 },
  SURPRISED: { scale: 1.5, y: -2 },
  ANGRY: { y: 3, rotate: -15, scaleY: 0.9 }, // Furrowed
  SLEEPY: { scaleY: 0.1, y: 3 },
  SILLY: { scale: 1.2, y: 0 },
  LOVE: { scale: 1.2, y: 0, color: '#E11D48' },
  CONFUSED: { scaleY: 1 },
  IDEA: { scale: 1.3, y: -3 },
  WAITING: { x: 3, y: 3 },
  EMPHASIS: { scale: 1.2 },
  THINKING: { y: -2, x: 2 }
};