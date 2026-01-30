import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidekickAction, SidekickConfig } from '../types';
import { bodyVariants, eyeVariants, shadowVariants } from '../utils/animationVariants';
import { SidekickVFX_v2 } from './SidekickVFX_v2';

interface SidekickProps {
  action: SidekickAction;
  config: SidekickConfig;
  audioVolume: number;
  onActionComplete: () => void;
}

export const Sidekick: React.FC<SidekickProps> = ({ 
  action, 
  config, 
  audioVolume,
  onActionComplete 
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [fidget, setFidget] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevAction, setPrevAction] = useState(action);

  // Transition Anticipation Logic (Disney Principle: Anticipation)
  // When action changes, briefly "squash/blink" before showing new state
  useEffect(() => {
    if (action !== prevAction) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevAction(action);
      }, 150); // 150ms blink transition
      return () => clearTimeout(timer);
    }
  }, [action, prevAction]);

  // Fidget Logic (Disney Principle: Secondary Action)
  // When IDLE, randomly trigger small organic movements
  useEffect(() => {
    if (action !== SidekickAction.IDLE || isTransitioning) {
      setFidget(null);
      return;
    }

    const triggerFidget = () => {
      const fidgets = ['FIDGET_WIGGLE', 'FIDGET_GLANCE', 'FIDGET_BOUNCE'];
      const randomFidget = fidgets[Math.floor(Math.random() * fidgets.length)];
      setFidget(randomFidget);
      
      // Clear fidget after duration
      setTimeout(() => setFidget(null), 2000);

      // Schedule next fidget
      timeoutId = setTimeout(triggerFidget, Math.random() * 4000 + 3000);
    };

    let timeoutId = setTimeout(triggerFidget, 3000);
    return () => clearTimeout(timeoutId);
  }, [action, isTransitioning]);

  // Blink Logic
  useEffect(() => {
    const triggerBlink = () => {
      if (
        action === SidekickAction.IDLE || 
        action === SidekickAction.WAITING
      ) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
      const nextBlink = Math.random() * 4000 + 2000;
      timeoutId = setTimeout(triggerBlink, nextBlink);
    };
    let timeoutId = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(timeoutId);
  }, [action]);

  // Auto-reset Logic
  useEffect(() => {
    const persistentStates = [
      SidekickAction.IDLE, 
      SidekickAction.THINKING, 
      SidekickAction.WAITING,
      SidekickAction.SAD,
      SidekickAction.SLEEPY, 
      SidekickAction.ANGRY
    ];

    if (!persistentStates.includes(action)) {
      const timer = setTimeout(() => {
        onActionComplete();
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [action, onActionComplete]);

  // Audio reactivity
  const audioScale = config.isAudioReactive ? 1 + (audioVolume * 0.2) : 1;

  // Visual State Determination
  const currentBodyVariant = isTransitioning ? 'TRANSITION' : (fidget && action === SidekickAction.IDLE ? fidget : action);
  const currentEyeState = isTransitioning ? 'TRANSITION' : (isBlinking || action === SidekickAction.SLEEPY ? 'TRANSITION' : (fidget && action === SidekickAction.IDLE ? fidget : action));

  // Helper for asymmetric eyes
  const getLeftEyeVariant = () => {
    if (isTransitioning) return eyeVariants.TRANSITION;
    if (fidget === 'FIDGET_GLANCE') return eyeVariants.FIDGET_GLANCE;
    
    if (action === SidekickAction.CONFUSED) return { ...eyeVariants[action], scaleY: 0.5, y: -2 };
    if (action === SidekickAction.SAD) return { ...eyeVariants[action], rotate: 15 };
    if (action === SidekickAction.ANGRY) return { ...eyeVariants[action], rotate: 20 };
    if (action === SidekickAction.SILLY) return { ...eyeVariants[action], scale: 1.4, y: -3 };
    if (action === SidekickAction.SLEEPY) return eyeVariants.SLEEPY;
    
    return eyeVariants[currentEyeState] || eyeVariants.IDLE;
  };

  const getRightEyeVariant = () => {
    if (isTransitioning) return eyeVariants.TRANSITION;
    if (fidget === 'FIDGET_GLANCE') return eyeVariants.FIDGET_GLANCE;

    if (action === SidekickAction.CONFUSED) return { ...eyeVariants[action], scaleY: 1.2, y: 2 };
    if (action === SidekickAction.SAD) return { ...eyeVariants[action], rotate: -15 };
    if (action === SidekickAction.ANGRY) return { ...eyeVariants[action], rotate: -20 };
    if (action === SidekickAction.SILLY) return { ...eyeVariants[action], scale: 0.8, y: 3 };
    if (action === SidekickAction.SLEEPY) return eyeVariants.SLEEPY;

    return eyeVariants[currentEyeState] || eyeVariants.IDLE;
  };

  const eyeColor = action === SidekickAction.LOVE ? '#E11D48' : '#1E293B';

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      className="cursor-grab touch-none select-none relative flex flex-col items-center"
    >
      <div className="relative">
        {/* Main Body */}
        <motion.div
          variants={bodyVariants}
          animate={currentBodyVariant as any}
          className="relative flex flex-col items-center z-10"
          style={{ scale: audioScale }}
        >
          {/* Canvas VFX Layer */}
          <SidekickVFX_v2 action={action} scale={config.scale} />

          {/* Antenna */}
          <div className="absolute -top-6 flex flex-col items-center z-0" style={{ transformOrigin: 'bottom center' }}>
             <motion.div 
               animate={{ 
                 rotate: action === SidekickAction.NOD ? [0, -10, 10, 0] : (fidget === 'FIDGET_WIGGLE' ? [0, -5, 5, 0] : 0) 
               }}
               transition={{ duration: 0.5 }}
               className="w-1.5 h-6 bg-slate-400 rounded-full shadow-sm"
             />
             <motion.div 
               animate={{ 
                 scale: action === SidekickAction.IDEA ? [1, 1.5, 1] : 1,
                 backgroundColor: action === SidekickAction.IDEA ? '#FCD34D' : '#94A3B8',
                 boxShadow: action === SidekickAction.IDEA ? '0 0 15px #FCD34D' : 'none'
               }}
               className="w-4 h-4 rounded-full absolute -top-1.5 border-2 border-white/50" 
             />
          </div>

          {/* Body Shape */}
          <div
            className="relative flex items-center justify-center transition-colors duration-500 z-10"
            style={{
              width: 140 * config.scale,
              height: 125 * config.scale,
              backgroundColor: config.color,
              borderRadius: '42px',
              boxShadow: `
                inset 0 6px 15px rgba(255,255,255,0.4), 
                inset 0 -8px 20px rgba(0,0,0,0.1), 
                0 4px 10px rgba(0,0,0,0.05)
              `
            }}
          >
            {/* Top Gloss Highlight - Dynamic Lighting Effect */}
            <motion.div 
              animate={{ x: fidget === 'FIDGET_GLANCE' ? [0, 5, -5, 0] : 0 }}
              transition={{ duration: 2 }}
              className="absolute top-2 w-[80%] h-[35%] bg-gradient-to-b from-white/40 to-transparent rounded-full opacity-80 pointer-events-none"
            />

            {/* Face Container */}
            <div className="flex space-x-6 items-center justify-center w-full h-full relative pt-4">
              
              {/* Cheeks */}
              <motion.div 
                animate={{ opacity: action === SidekickAction.HAPPY || action === SidekickAction.LOVE || action === SidekickAction.SILLY ? 0.6 : 0.2 }}
                className="absolute top-[55%] left-3 w-7 h-5 bg-rose-400 blur-md rounded-full" 
              />
              <motion.div 
                animate={{ opacity: action === SidekickAction.HAPPY || action === SidekickAction.LOVE || action === SidekickAction.SILLY ? 0.6 : 0.2 }}
                className="absolute top-[55%] right-3 w-7 h-5 bg-rose-400 blur-md rounded-full" 
              />

              {/* Eyes */}
              <motion.div
                variants={eyeVariants}
                animate={getLeftEyeVariant() as any}
                className="w-7 h-10 rounded-full relative overflow-hidden shadow-inner"
                style={{ 
                  height: (isBlinking || action === SidekickAction.SLEEPY || isTransitioning) ? 4 : 40,
                  backgroundColor: eyeColor
                }}
              >
                {!isBlinking && !isTransitioning && action !== SidekickAction.SLEEPY && (
                  <>
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full opacity-90" />
                    <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                  </>
                )}
              </motion.div>

              <motion.div
                variants={eyeVariants}
                animate={getRightEyeVariant() as any}
                className="w-7 h-10 rounded-full relative overflow-hidden shadow-inner"
                style={{ 
                  height: (isBlinking || action === SidekickAction.SLEEPY || isTransitioning) ? 4 : 40,
                  backgroundColor: eyeColor
                }}
              >
                 {!isBlinking && !isTransitioning && action !== SidekickAction.SLEEPY && (
                  <>
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full opacity-90" />
                    <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                  </>
                )}
              </motion.div>

              {/* Mouth Expressions */}
              <AnimatePresence>
                {/* Thinking Mouth */}
                {action === SidekickAction.THINKING && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute bottom-6 w-3 h-3 border-2 border-slate-700/50 rounded-full"
                    style={{ y: 15 }}
                  />
                )}
                
                {/* Surprise Mouth */}
                {action === SidekickAction.SURPRISED && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute bottom-5 w-5 h-6 bg-slate-800 rounded-[40%]"
                    style={{ y: 10 }}
                  />
                )}

                {/* Happy Mouth */}
                {action === SidekickAction.HAPPY && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    viewBox="0 0 24 12"
                    className="absolute bottom-6 w-8 h-4 stroke-slate-800 stroke-[3] fill-none"
                    style={{ y: 10 }}
                  >
                    <path d="M2 2C2 2 7 12 12 12C17 12 22 2 22 2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                )}

                {/* Silly Mouth */}
                {action === SidekickAction.SILLY && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 16, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="absolute bottom-4 w-6 bg-rose-400 rounded-b-xl border-2 border-rose-500"
                    style={{ y: 12 }}
                  />
                )}

                {/* Angry Mouth */}
                {action === SidekickAction.ANGRY && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 12 }}
                    exit={{ width: 0 }}
                    className="absolute bottom-6 h-1 bg-slate-800 rounded-full"
                    style={{ y: 12 }}
                  />
                )}

                {/* Sleepy Mouth */}
                {action === SidekickAction.SLEEPY && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-6 w-3 h-3 bg-blue-200/50 rounded-full"
                    style={{ y: 12, x: 5 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Ground Shadow */}
        <motion.div 
           variants={shadowVariants}
           animate={currentBodyVariant as any}
           className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 rounded-[50%] blur-md z-0"
        />
      </div>
    </motion.div>
  );
};