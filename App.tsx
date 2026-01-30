import React, { useState, useEffect, useCallback } from 'react';
import { Sidekick } from './components/Sidekick';
import { ControlPanel } from './components/ControlPanel';
import { ReactionBar } from './components/ReactionBar';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { SidekickAction, SidekickConfig } from './types';
import { Volume2, Trash2 } from 'lucide-react';

const DEFAULT_CONFIG: SidekickConfig = {
  color: '#BAE6FD', // Sky blue default
  isAudioReactive: false,
  scale: 1,
};

function App() {
  const [currentAction, setCurrentAction] = useState<SidekickAction>(SidekickAction.IDLE);
  const [config, setConfig] = useState<SidekickConfig>(DEFAULT_CONFIG);
  const [message, setMessage] = useState<string[]>([]);

  // Hook for audio analysis (only active if configured)
  const { volume } = useAudioAnalyzer(config.isAudioReactive);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '1': setCurrentAction(SidekickAction.NOD); break;
        case '2': setCurrentAction(SidekickAction.SHAKE); break;
        case '3': setCurrentAction(SidekickAction.EMPHASIS); break;
        case '4': setCurrentAction(prev => prev === SidekickAction.THINKING ? SidekickAction.IDLE : SidekickAction.THINKING); break;
        case 'Escape': setCurrentAction(SidekickAction.IDLE); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleActionComplete = useCallback(() => {
    setCurrentAction(SidekickAction.IDLE);
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleWordClick = (word: string) => {
    setMessage(prev => [...prev, word]);
    speak(word);
    setCurrentAction(SidekickAction.NOD);
  };

  const handleSpeakSentence = () => {
    if (message.length === 0) return;
    const sentence = message.join(' ');
    speak(sentence);
    setCurrentAction(SidekickAction.EMPHASIS);
  };

  const handleClear = () => {
    setMessage([]);
    setCurrentAction(SidekickAction.SHAKE);
  };

  return (
    <div className="min-h-screen relative bg-[#FFFBEB] text-slate-800 font-sans selection:bg-orange-100 overflow-hidden">
      
      {/* Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50 z-0">
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
         <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
         <div className="absolute -bottom-20 left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <main className="relative max-w-5xl mx-auto p-4 md:p-8 pt-6 pb-40 z-10 flex flex-col h-screen">
        <header className="mb-6 text-center shrink-0">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-slate-800 tracking-tight" style={{ fontFamily: 'sans-serif' }}>
            My Talking Helper
          </h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start h-full overflow-y-auto pb-32">
          
          {/* Interactive Communication Board */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl shadow-orange-100/50 border-4 border-white flex flex-col relative">
            
            {/* Message Display Area */}
            <div className="bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-100 mb-4 min-h-[120px] flex flex-col justify-between shadow-inner">
              <div className="flex flex-wrap gap-2 mb-2 content-start min-h-[50px]">
                {message.length === 0 ? (
                  <span className="text-slate-400 text-lg font-medium self-center">Tap to speak...</span>
                ) : (
                  message.map((word, idx) => (
                    <span key={idx} className="bg-white px-3 py-1.5 rounded-xl shadow-sm border-b-2 border-slate-200 text-slate-700 font-bold text-lg animate-in fade-in zoom-in duration-200">
                      {word}
                    </span>
                  ))
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                 <button 
                   onClick={handleClear}
                   disabled={message.length === 0}
                   className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30"
                   aria-label="Clear message"
                 >
                   <Trash2 size={24} />
                 </button>
                 <button 
                   onClick={handleSpeakSentence}
                   disabled={message.length === 0}
                   className="flex-1 px-4 py-3 text-lg font-bold bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 active:bg-indigo-700 shadow-[0_4px_0_rgb(67,56,202)] hover:shadow-[0_2px_0_rgb(67,56,202)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
                 >
                   <Volume2 size={24} />
                   Speak It!
                 </button>
              </div>
            </div>

            {/* Symbol Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { word: 'I Want', color: 'bg-green-100 border-green-200 text-green-800' },
                { word: 'To Go', color: 'bg-blue-100 border-blue-200 text-blue-800' },
                { word: 'Home', color: 'bg-orange-100 border-orange-200 text-orange-800' },
                { word: 'Yes', color: 'bg-teal-100 border-teal-200 text-teal-800' },
                { word: 'No', color: 'bg-rose-100 border-rose-200 text-rose-800' },
                { word: 'Help', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
                { word: 'Stop', color: 'bg-red-100 border-red-200 text-red-800' },
                { word: 'More', color: 'bg-purple-100 border-purple-200 text-purple-800' },
                { word: 'Finished', color: 'bg-slate-200 border-slate-300 text-slate-800' }
              ].map((item) => (
                <button
                  key={item.word}
                  onClick={() => handleWordClick(item.word)}
                  className={`
                    aspect-square group rounded-2xl flex flex-col items-center justify-center p-1
                    border-b-4 transition-all duration-150 active:border-b-0 active:translate-y-1
                    ${item.color} shadow-sm hover:brightness-95
                  `}
                >
                  <span className="text-lg font-bold pointer-events-none select-none">
                    {item.word}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Guide / Description (Visible on larger screens) */}
          <div className="hidden md:block space-y-6 pt-4">
            <div className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-white shadow-lg">
              <h3 className="font-bold text-xl mb-3 text-slate-800">Your Friend</h3>
              <p className="text-slate-600 mb-4">
                 This is your digital buddy! It helps you show how you feel.
                 Try tapping the buttons at the bottom!
              </p>
               <div className="p-4 rounded-[2rem] bg-indigo-50 border-2 border-indigo-100 text-indigo-800 text-center">
                <div className="font-bold">
                  "I'm listening and reacting!"
                </div>
            </div>
            </div>
          </div>
        </section>
      </main>

      {/* The Digital Sidekick Component - Positioned fixed above the bar */}
      <div className="fixed right-4 bottom-32 md:right-10 md:bottom-40 z-30 pointer-events-none">
         <div className="pointer-events-auto">
            <Sidekick 
                action={currentAction} 
                config={config} 
                audioVolume={volume}
                onActionComplete={handleActionComplete}
            />
         </div>
      </div>

      {/* New Reaction Bar (Bottom Dock) */}
      <ReactionBar 
        onTrigger={setCurrentAction}
        currentAction={currentAction}
      />

      {/* Control UI (Backpack) */}
      <ControlPanel 
        config={config}
        onConfigChange={setConfig}
      />

    </div>
  );
}

export default App;