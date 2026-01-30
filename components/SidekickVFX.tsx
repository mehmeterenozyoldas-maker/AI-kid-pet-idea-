import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidekickAction } from '../types';
import { Heart, Star, HelpCircle, AlertOctagon, Droplet, Zap } from 'lucide-react';

interface SidekickVFXProps {
  action: SidekickAction;
  scale: number;
}

export const SidekickVFX: React.FC<SidekickVFXProps> = ({ action, scale }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      <AnimatePresence>
        {/* LOVE: Floating Hearts */}
        {action === SidekickAction.LOVE && (
          <>
            {[
              { id: 1, x: -30, y: -40, delay: 0, size: 24, color: '#E11D48' },
              { id: 2, x: 30, y: -60, delay: 0.2, size: 20, color: '#FB7185' },
              { id: 3, x: 0, y: -80, delay: 0.4, size: 28, color: '#F43F5E' },
            ].map((heart) => (
              <motion.div
                key={`heart-${heart.id}`}
                initial={{ opacity: 0, scale: 0, x: heart.x, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.2, 0.8], 
                  y: heart.y 
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: heart.delay,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute z-20"
              >
                <Heart fill={heart.color} stroke="none" size={heart.size * scale} />
              </motion.div>
            ))}
          </>
        )}

        {/* HAPPY: Popping Sparkles */}
        {action === SidekickAction.HAPPY && (
          <>
            {[
              { id: 1, x: 50, y: -30, delay: 0, size: 24 },
              { id: 2, x: -50, y: -20, delay: 0.1, size: 20 },
              { id: 3, x: 40, y: 30, delay: 0.2, size: 16 },
              { id: 4, x: -40, y: 40, delay: 0.3, size: 18 },
            ].map((star) => (
              <motion.div
                key={`star-${star.id}`}
                initial={{ opacity: 0, scale: 0, x: star.x, y: star.y, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.2, 0], 
                  rotate: [0, 45, 90]
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: star.delay,
                  repeat: Infinity,
                  repeatDelay: 0.2
                }}
                className="absolute z-20"
              >
                <Star fill="#FCD34D" stroke="#F59E0B" size={star.size * scale} strokeWidth={1} />
              </motion.div>
            ))}
          </>
        )}

        {/* CONFUSED: Question Marks */}
        {action === SidekickAction.CONFUSED && (
          <>
            {[
              { id: 1, x: 50, y: -40, delay: 0, rotate: 15 },
              { id: 2, x: -45, y: -50, delay: 0.4, rotate: -15 },
            ].map((q) => (
              <motion.div
                key={`q-${q.id}`}
                initial={{ opacity: 0, scale: 0, x: q.x, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: [0.5, 1.1, 1], 
                  y: q.y,
                  rotate: q.rotate 
                }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute z-20"
              >
                <HelpCircle color="#F97316" size={32 * scale} strokeWidth={3} />
              </motion.div>
            ))}
          </>
        )}

        {/* IDEA: Light burst behind */}
        {action === SidekickAction.IDEA && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: 1.5, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -z-10"
            style={{ top: -40 * scale }}
          >
             <svg width={160 * scale} height={160 * scale} viewBox="0 0 100 100" className="opacity-60">
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(0 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(45 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(90 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(135 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(180 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(225 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(270 50 50)" />
                <path d="M50 0 L55 35 L50 40 L45 35 Z" fill="#FCD34D" transform="rotate(315 50 50)" />
             </svg>
          </motion.div>
        )}

        {/* SAD: Falling Tears */}
        {action === SidekickAction.SAD && (
          <>
            {[
              { id: 1, x: -20, delay: 0.2 },
              { id: 2, x: 20, delay: 0.8 },
            ].map((tear) => (
              <motion.div
                key={`tear-${tear.id}`}
                initial={{ opacity: 0, y: 0, x: tear.x }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: [0, 40, 80],
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: tear.delay,
                  repeat: Infinity,
                  ease: "easeIn"
                }}
                className="absolute z-30"
                style={{ top: 20 }}
              >
                <Droplet fill="#60A5FA" stroke="none" size={16 * scale} />
              </motion.div>
            ))}
          </>
        )}

        {/* SURPRISED: Shock Lines */}
        {action === SidekickAction.SURPRISED && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
              className="absolute z-20"
            >
              <AlertOctagon color="#EF4444" size={40 * scale} strokeWidth={3} />
            </motion.div>
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 bg-white rounded-[2.5rem] mix-blend-overlay"
            />
          </>
        )}

        {/* EMPHASIS: Shockwave Ring */}
        {action === SidekickAction.EMPHASIS && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.9 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 border-4 border-white rounded-[3rem] z-0 opacity-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
};