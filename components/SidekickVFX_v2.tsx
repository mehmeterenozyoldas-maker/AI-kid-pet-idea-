import React, { useRef, useEffect } from 'react';
import { SidekickAction } from '../types';

interface SidekickVFXProps {
  action: SidekickAction;
  scale: number;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  decay: number;
  type: 'confetti' | 'circle' | 'heart' | 'star' | 'rain' | 'text';
  text?: string;

  constructor(x: number, y: number, type: Particle['type'], color: string, scale: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.alpha = 1;
    this.life = 1.0;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    
    // Default physics
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.decay = 0.01 + Math.random() * 0.02;
    this.size = (5 + Math.random() * 5) * scale;

    this.initPhysics(scale);
  }

  initPhysics(scale: number) {
    switch (this.type) {
      case 'confetti':
        const angle = -Math.PI / 2 + (Math.random() - 0.5); // Shoot up
        const speed = (5 + Math.random() * 10) * scale;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.decay = 0.005;
        break;
      case 'rain':
        this.vx = 0;
        this.vy = (5 + Math.random() * 5) * scale;
        this.decay = 0.005; // Long life
        this.life = 1 + Math.random();
        break;
      case 'circle': // Steam
        this.vx = (Math.random() - 0.5) * scale;
        this.vy = -1 * (1 + Math.random()) * scale;
        this.decay = 0.02;
        break;
      case 'heart':
        this.vy = -1 * (1 + Math.random() * 2) * scale;
        this.vx = (Math.random() - 0.5) * 0.5 * scale;
        this.decay = 0.008;
        break;
      case 'text': // Zzz
        this.vy = -0.5 * scale;
        this.vx = 0.5 * scale;
        this.decay = 0.005;
        this.size = 20 * scale;
        break;
    }
  }

  update(dt: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;

    if (this.type === 'confetti') {
      this.vy += 0.2; // Gravity
      this.vx *= 0.98; // Air resistance
    }
    if (this.type === 'text') {
      this.x += Math.sin(Date.now() / 200) * 0.5; // Wiggle Zzz
    }
    if (this.type === 'rain' && this.y > 150) {
      this.life = 0; // Kill rain at floor
    }

    this.alpha = Math.max(0, this.life);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    switch (this.type) {
      case 'confetti':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rain':
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(-1, -this.size, 2, this.size * 2);
        break;
      case 'text':
        ctx.fillStyle = '#94A3B8';
        ctx.font = `bold ${this.size}px sans-serif`;
        ctx.fillText(this.text || 'Z', 0, 0);
        break;
      case 'heart':
        // Simple Heart Path
        const s = this.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, s/3);
        ctx.bezierCurveTo(0, -s/1.5, -s, -s/1.5, -s, s/3);
        ctx.bezierCurveTo(-s, s, 0, s*1.5, 0, s*2);
        ctx.bezierCurveTo(0, s*1.5, s, s, s, s/3);
        ctx.bezierCurveTo(s, -s/1.5, 0, -s/1.5, 0, s/3);
        ctx.fill();
        break;
      case 'star':
        // Simple Star
        ctx.beginPath();
        for(let i=0; i<5; i++) {
           ctx.lineTo(Math.cos((18 + i*72)/180*Math.PI)*this.size, 
                      -Math.sin((18 + i*72)/180*Math.PI)*this.size);
           ctx.lineTo(Math.cos((54 + i*72)/180*Math.PI)*this.size/2, 
                      -Math.sin((54 + i*72)/180*Math.PI)*this.size/2);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  }
}

export const SidekickVFX_v2: React.FC<SidekickVFXProps> = ({ action, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn Particles based on Action
      if (Math.random() < 0.2) { // Emission rate
         spawnParticles(action, scale);
      }

      // Update and Draw
      particlesRef.current.forEach((p, index) => {
        p.update(1);
        p.draw(ctx);
        if (p.life <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [action, scale]);

  const spawnParticles = (act: SidekickAction, s: number) => {
    const colors = ['#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const cw = 300; // Canvas width approx
    const ch = 300;
    
    // Burst Logic (High initial count for bursts, low for continuous)
    // Here we simulate continuous emission driven by the loop, but some states need burst
    
    switch (act) {
      case SidekickAction.HAPPY:
        // Confetti burst
        if (particlesRef.current.length < 50) {
           for (let i = 0; i < 5; i++) {
              particlesRef.current.push(new Particle(cw/2, ch/2, 'confetti', randomColor(), s));
           }
        }
        break;
      case SidekickAction.SAD:
        if (particlesRef.current.length < 40 && Math.random() > 0.5) {
          particlesRef.current.push(new Particle(cw/2 - 50 + Math.random()*100, 50, 'rain', '#60A5FA', s));
        }
        break;
      case SidekickAction.LOVE:
        if (particlesRef.current.length < 15 && Math.random() > 0.8) {
          particlesRef.current.push(new Particle(cw/2, ch/2, 'heart', '#F43F5E', s));
        }
        break;
      case SidekickAction.ANGRY:
        if (particlesRef.current.length < 30) {
           particlesRef.current.push(new Particle(cw/2 - 30 + Math.random()*60, 50, 'circle', '#475569', s));
        }
        break;
      case SidekickAction.SLEEPY:
        if (particlesRef.current.length < 5 && Math.random() > 0.95) {
           const p = new Particle(cw/2 + 20, 50, 'text', '#94A3B8', s);
           p.text = 'Z';
           particlesRef.current.push(p);
        }
        break;
      case SidekickAction.IDEA:
         if (particlesRef.current.length < 20 && Math.random() > 0.7) {
            particlesRef.current.push(new Particle(cw/2 + (Math.random()-0.5)*100, 50 + (Math.random()-0.5)*100, 'star', '#FCD34D', s));
         }
         break;
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      width={300}
      height={300}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
      style={{ width: 300 * scale, height: 300 * scale }}
    />
  );
};