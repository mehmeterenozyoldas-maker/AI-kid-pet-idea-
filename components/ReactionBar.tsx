import React from 'react';
import { SidekickAction } from '../types';
import { 
  Smile, Frown, Zap, Brain, HelpCircle, 
  Lightbulb, Heart, AlertCircle, Sparkles, Check, X,
  Moon, Flame, Ghost
} from 'lucide-react';

interface ReactionBarProps {
  onTrigger: (action: SidekickAction) => void;
  currentAction: SidekickAction;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({ onTrigger, currentAction }) => {
  
  const groups = [
    {
      title: "Feelings",
      items: [
        { id: SidekickAction.HAPPY, label: 'Happy', icon: Sparkles, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        { id: SidekickAction.LOVE, label: 'Love', icon: Heart, color: 'bg-rose-100 text-rose-700 border-rose-200' },
        { id: SidekickAction.SILLY, label: 'Silly', icon: Ghost, color: 'bg-purple-100 text-purple-700 border-purple-200' },
        { id: SidekickAction.SAD, label: 'Sad', icon: Frown, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        { id: SidekickAction.ANGRY, label: 'Mad', icon: Flame, color: 'bg-red-100 text-red-700 border-red-200' },
        { id: SidekickAction.SURPRISED, label: 'Wow!', icon: AlertCircle, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
        { id: SidekickAction.CONFUSED, label: 'Hmm?', icon: HelpCircle, color: 'bg-orange-100 text-orange-700 border-orange-200' },
        { id: SidekickAction.SLEEPY, label: 'Tired', icon: Moon, color: 'bg-slate-200 text-slate-600 border-slate-300' },
      ]
    },
    {
      title: "Actions",
      items: [
        { id: SidekickAction.NOD, label: 'Yes', icon: Check, color: 'bg-green-100 text-green-700 border-green-200' },
        { id: SidekickAction.SHAKE, label: 'No', icon: X, color: 'bg-red-100 text-red-700 border-red-200' },
        { id: SidekickAction.THINKING, label: 'Think', icon: Brain, color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { id: SidekickAction.IDEA, label: 'Idea!', icon: Lightbulb, color: 'bg-amber-100 text-amber-700 border-amber-200' },
        { id: SidekickAction.EMPHASIS, label: 'Look', icon: Zap, color: 'bg-pink-100 text-pink-700 border-pink-200' },
      ]
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 z-40 flex justify-center pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl border-t-4 border-slate-100 rounded-[2.5rem] p-3 pointer-events-auto max-w-full overflow-hidden flex gap-2 shadow-purple-900/10">
        
        {/* Scrollable Container */}
        <div className="flex overflow-x-auto gap-6 px-2 pb-2 pt-1 no-scrollbar items-center snap-x">
          
          {groups.map((group, groupIdx) => (
            <div key={group.title} className="flex items-center gap-3 shrink-0 snap-center">
              {/* Group Label */}
              <div className="hidden md:flex writing-vertical transform -rotate-180 text-xs font-bold text-slate-300 uppercase tracking-widest h-12 justify-center">
                <span className="rotate-90 whitespace-nowrap">{group.title}</span>
              </div>

              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTrigger(item.id === currentAction ? SidekickAction.IDLE : item.id)}
                  className={`
                    group relative flex flex-col items-center justify-center w-16 h-20 md:w-20 md:h-24 gap-1.5 
                    transition-all duration-300 rounded-2xl border-b-[5px] active:border-b-0 active:translate-y-1.5
                    ${item.color}
                    ${currentAction === item.id ? 'scale-110 -translate-y-2 shadow-lg brightness-110 ring-4 ring-white' : 'hover:-translate-y-1 hover:brightness-95'}
                  `}
                >
                  <div className={`
                    p-2 rounded-full bg-white/40 shadow-sm transition-transform duration-300
                    ${currentAction === item.id ? 'rotate-12 scale-110' : 'group-hover:scale-110'}
                  `}>
                    <item.icon size={24} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs md:text-sm font-bold leading-none">{item.label}</span>
                  
                  {/* Active Indicator Dot */}
                  {currentAction === item.id && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                  )}
                </button>
              ))}
              
              {/* Divider between groups */}
              {groupIdx < groups.length - 1 && (
                <div className="w-0.5 h-12 bg-slate-200 rounded-full mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};