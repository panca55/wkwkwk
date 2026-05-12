/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, X } from 'lucide-react';

// --- Components ---

const HeartParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // relative to center
      y: Math.random() * 100 - 50,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: p.x * 4,
            y: p.y * 4 - 100,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute text-pink-400"
        >
          <Heart size={p.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const BouquetImage = () => (
  <div className="w-full h-full flex items-center justify-center">
    <img 
      src="/assets/bouquet.png" 
      alt="Bouquet of sunflowers" 
      className="w-full h-full object-contain drop-shadow-2xl"
    />
  </div>
);

export default function App() {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [loveIntensity, setLoveIntensity] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; scale: number; rotation: number }[]>([]);

  // Decay love intensity
  useEffect(() => {
    if (loveIntensity > 0) {
      const timer = setInterval(() => {
        setLoveIntensity((prev) => Math.max(0, prev - 0.5));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [loveIntensity]);

  const handleToggle = () => {
    if (!isOpen && !isOpening) {
      setIsOpening(true);
      // Delayed transition to show flap animation
      setTimeout(() => {
        setIsOpen(true);
        setIsOpening(false);
      }, 700);
    }
  };

  const handleLoveClick = () => {
    const newIntensity = Math.min(loveIntensity + 1, 30);
    setLoveIntensity(newIntensity);
    
    const count = Math.floor(2 + newIntensity / 2);
    const newBursts = Array.from({ length: count }).map(() => ({
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * (120 + newIntensity * 4),
      y: -(Math.random() * 150 + 100 + newIntensity * 5),
      scale: 0.3 + (newIntensity * 0.06) + (Math.random() * 0.4),
      rotation: (Math.random() - 0.5) * 90
    }));

    setBursts((prev) => [...prev, ...newBursts]);

    // Cleanup bursts faster for more fluid performance
    setTimeout(() => {
      setBursts((prev) => prev.filter(b => !newBursts.find(nb => nb.id === b.id)));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCE4EC] via-[#F3E5F5] to-[#E3F2FD] flex flex-col items-center justify-center p-4 relative">
      {/* Background Particles from Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-20 left-10 md:left-40 text-pink-300 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <svg className="absolute bottom-32 right-10 md:right-60 text-pink-200 opacity-40" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          .font-handwritten { font-family: 'Caveat', cursive; }
          .font-sans { font-family: 'Inter', sans-serif; }
          .font-serif-theme { font-family: 'Playfair Display', serif; }
          
          /* Custom scrollbar for the letter */
          .letter-scroll {
            scrollbar-width: thin;
            scrollbar-color: #fce4ec transparent;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
          }
          .letter-scroll::-webkit-scrollbar { width: 4px; }
          .letter-scroll::-webkit-scrollbar-track { background: transparent; }
          .letter-scroll::-webkit-scrollbar-thumb { background: #fce4ec; border-radius: 10px; }
        `}
      </style>

      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center z-10 py-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* PHASE 1: Closed State (Envelope/Button) */
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100, y: 50, rotate: -20, filter: "blur(20px)" }}
              transition={{ duration: 0.5, ease: "backIn" }}
              onClick={handleToggle}
              className="cursor-pointer group flex flex-col items-center gap-8"
              style={{ perspective: '1000px' }}
            >
              <div className="relative">
                <motion.div
                  animate={isOpening ? { scale: 1.05 } : { y: [0, -10, 0] }}
                  transition={isOpening ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-56 h-36 bg-white rounded-xl shadow-[0_30px_70px_rgba(244,114,182,0.15),0_10px_20px_rgba(0,0,0,0.02)] border border-pink-50 flex items-center justify-center overflow-visible relative"
                >
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-xl" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

                  <motion.div 
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: isOpening ? -150 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-slate-50 border-b border-pink-100 origin-top z-20 rounded-t-xl overflow-hidden shadow-sm"
                  >
                     <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
                     <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-white/50 to-transparent" />
                  </motion.div>
                  
                  <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden rounded-xl">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-pink-50/20" />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-pink-50/10 to-transparent" />
                  </div>

                  <Mail className="text-pink-300 w-12 h-12 relative z-10 drop-shadow-sm" />
                  
                  {!isOpening && (
                    <motion.div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 bg-pink-500 rounded-full p-2 shadow-lg border-2 border-white pointer-events-none"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Heart size={14} fill="white" className="text-white" />
                    </motion.div>
                  )}
                  
                  {!isOpening && (
                    <motion.div
                      className="absolute -top-3 -right-3 bg-red-400 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-md border-2 border-white z-30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                    >
                      1
                    </motion.div>
                  )}

                  <div className="absolute inset-0 z-5 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-pink-100/50" />
                    <div className="absolute top-0 left-0 h-full w-[1px] bg-pink-100/30" />
                    <div className="absolute top-0 right-0 h-full w-[1px] bg-pink-100/30" />
                  </div>
                </motion.div>
                
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-4 bg-pink-900/5 blur-xl rounded-full" />
              </div>
              <p className="font-sans text-pink-400 font-bold tracking-[0.2em] text-[10px] uppercase opacity-70">
                {isOpening ? "Opening Letter..." : "Click to open surprise"}
              </p>
            </motion.div>
          ) : (
            /* PHASE 2: Open State (Bouquet) */
            <motion.div
              key="opened"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Backdrop for closing the letter when it is open */}
                  <AnimatePresence>
                    {showLetter && (
                        <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           onClick={() => setShowLetter(false)}
                           className="fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-15 pointer-events-auto"
                        />
                    )}
                  </AnimatePresence>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="w-72 h-96 relative z-10"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BouquetImage />
                </motion.div>
              </motion.div>

              {showLetter && <HeartParticles />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: Letter UI */}
        <AnimatePresence>
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                x: 300, 
                y: -150, 
                rotate: 15, 
                scale: 0.9,
                transition: { duration: 0.6, ease: "easeIn" }
              }}
              className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-2 overflow-hidden"
            >
              <motion.div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-[280px] sm:max-w-xs rounded-lg shadow-2xl overflow-hidden relative border-t-4 border-pink-400 max-h-[85vh] flex flex-col select-text"
              >
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #90caf9 31px, #90caf9 32px)',
                    backgroundSize: '100% 32px',
                    marginTop: '40px'
                  }} 
                />
                <div className="absolute left-[2.8rem] top-0 bottom-0 w-[1px] bg-red-100" />

                <div className="p-6 relative flex flex-col min-h-0 h-full">
                  <button 
                    onClick={() => setShowLetter(false)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-pink-400 transition-colors z-30 p-1"
                  >
                    <X size={18} />
                  </button>

                  <div className="overflow-y-auto letter-scroll flex-1 pr-1 pt-12 pb-10">
                    <h2 className="font-serif-theme text-lg text-gray-800 mb-4 font-bold italic leading-tight">To the one who carries the dawn in her eyes,</h2>
                    
                    <div className="font-serif-theme text-[13px] text-gray-700 leading-relaxed italic space-y-3">
                      <p>I know these words arrive when the moon has already shifted, and the candles have dimmed. But honestly, I thought since you’re a little closer to the ground, time might move slower for you too. I forgot you're not taller than this phone hahaha!</p>
                      <p>My deepest apologies for being a wanderer lost in time, missing the exact moment to celebrate your light. But look at it this way, now your birthday feels longer, thanks to me! hahaha.</p>
                      <p>Happy Birthday, though the calendar says I’m late, my heart has been whispering this since the first second. You are a blend of grace and ethereal light, a sanctuary of kindness, and a melody that never fades.</p>
                      <p>May your year be as luminous as your spirit, and may you forgive the one who is late in words but never in love. I'll even write this extra small so you can read it easily hahaha.</p>
                    </div>

                    <div className="mt-6 text-right">
                      <p className="font-serif-theme text-sm text-pink-600 font-bold italic">With all my adoration, always.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 border-t border-pink-50 flex justify-center items-center px-6 shrink-0 relative z-10">
                  <span className="text-[8px] font-sans text-slate-400 uppercase tracking-widest font-medium">Developed by Panca Nugraha</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons Refined for Theme */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ x: showLetter ? 150 : 0, opacity: showLetter ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-8 right-8 flex flex-col gap-4 items-end z-40"
        >
          {/* Love Bursts Container */}
          <div className="absolute bottom-[52px] right-[24px] pointer-events-none">
            <AnimatePresence>
              {bursts.map((burst) => (
                <motion.div
                  key={burst.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: burst.scale, 
                    x: burst.x, 
                    y: burst.y, 
                    rotate: burst.rotation 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: burst.scale * 1.5, 
                    y: burst.y - 120, 
                    x: burst.x * 1.2 
                  }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="absolute"
                >
                  <Heart size={32} fill="currentColor" className="text-pink-500/80 drop-shadow-sm" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleLoveClick}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-pink-100 text-pink-400 hover:bg-white hover:scale-110 transition-all active:scale-90"
            >
              <Heart size={22} fill={loveIntensity > 0 ? "currentColor" : "none"} />
            </button>
          </div>
          <button 
            onClick={() => setShowLetter(true)}
            className="bg-pink-500 p-4 rounded-full shadow-[0_15px_30px_rgba(236,72,153,0.3)] text-white hover:bg-pink-600 hover:scale-110 transition-all relative"
          >
            <Mail size={28} />
            <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-pink-500 font-bold shadow-sm">1</span>
          </button>
        </motion.div>
      )}

      <footer className="fixed bottom-4 font-sans text-[9px] text-slate-400 uppercase tracking-[0.3em] font-medium opacity-50">
        Handcrafted for you • With love
      </footer>
    </div>
  );
}
