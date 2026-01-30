import React, { useState } from 'react';
import { SidekickConfig } from '../types';
import { 
  Mic, MicOff, X, Palette, Backpack, Volume2
} from 'lucide-react';

interface ControlPanelProps {
  config: SidekickConfig;
  onConfigChange: (config: SidekickConfig) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  onConfigChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { hex: '#BAE6FD', name: 'Sky', border: 'border-blue-300' },
    { hex: '#A7F3D0', name: 'Mint', border: 'border-emerald-300' },
    { hex: '#FBCFE8', name: 'Pink', border: 'border-pink-300' },
    { hex: '#DDD6FE', name: 'Violet', border: 'border-violet-300' },
    { hex: '#FDE68A', name: 'Gold', border: 'border-amber-300' },
    { hex: '#E2E8F0', name: 'Cloud', border: 'border-slate-300' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-white rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all z-40 border-2 border-slate-100 group"
        aria-label="Open Backpack"
        title="Customize Friend"
      >
        <div className="bg-indigo-100 p-2 rounded-xl group-hover:bg-indigo-200 transition-colors">
          <Backpack size={28} className="text-indigo-600" strokeWidth={2.5} />
        </div>
        <span className="sr-only">Customize</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md border-4 border-indigo-100 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-indigo-50 p-6 flex justify-between items-center border-b-2 border-indigo-100">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-xl shadow-sm">
               <Backpack size={24} className="text-indigo-500" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">My Backpack</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Color Picker Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-slate-400" size={20} />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Choose Color</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onConfigChange({ ...config, color: c.hex })}
                  className={`
                    relative h-16 rounded-2xl transition-all duration-300 flex items-center justify-center
                    border-4 ${c.border}
                    ${config.color === c.hex ? 'scale-110 shadow-lg ring-2 ring-indigo-400 ring-offset-2 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                  `}
                  style={{ backgroundColor: c.hex }}
                >
                  {config.color === c.hex && (
                    <span className="bg-white/30 backdrop-blur-md rounded-full p-1">
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                    </span>
                  )}
                  <span className="sr-only">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Slider */}
          <div>
             <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Friend Size</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">S</div>
               <input 
                  type="range" 
                  min="0.6" 
                  max="1.4" 
                  step="0.1"
                  value={config.scale}
                  onChange={(e) => onConfigChange({ ...config, scale: parseFloat(e.target.value) })}
                  className="flex-1 h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                />
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500">L</div>
            </div>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => onConfigChange({ ...config, isAudioReactive: !config.isAudioReactive })}
            className={`
              w-full flex items-center justify-between p-5 rounded-[2rem] transition-all border-4 shadow-sm group
              ${config.isAudioReactive 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-colors ${config.isAudioReactive ? 'bg-green-200 text-green-700' : 'bg-slate-200'}`}>
                {config.isAudioReactive ? <Mic size={24} /> : <MicOff size={24} />}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">Magic Ears</div>
                <div className="text-sm opacity-70 font-medium">
                  {config.isAudioReactive ? "I'm listening!" : "I'm resting my ears"}
                </div>
              </div>
            </div>
            
            <div className={`
              w-14 h-8 rounded-full relative transition-colors duration-300
              ${config.isAudioReactive ? 'bg-green-500' : 'bg-slate-300'}
            `}>
              <div className={`
                absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm
                ${config.isAudioReactive ? 'left-7' : 'left-1'}
              `} />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};