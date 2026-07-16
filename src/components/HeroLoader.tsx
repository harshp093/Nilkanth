import React from 'react';
import { motion } from 'framer-motion';


const HeroLoader: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full bg-dark flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-[#111] to-dark" />

      {/* Cream glow orbs — smooth infinite scale pulse */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.05] blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.03] blur-[120px] pointer-events-none" />

      {/* Center loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo rocks gently — smooth sinusoidal, no jerky snapping */}
          <motion.div
            animate={{ rotate: [0, 4, -4, 2, -2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
          >
            <img
              src="/logo-full.webp"
              alt="Nilkanth Marble — The Quality Forever"
              className="h-16 md:h-20 w-auto object-contain bg-white/95 px-5 py-3.5 rounded-2xl shadow-2xl"
            />
          </motion.div>

        </motion.div>

        {/* Loading bar — linear ease avoids the visible snap at repeat boundaries */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-[#F7F5F2] to-primary rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '110%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.1 }}
          />
        </div>

        {/* Pulsing label — mirror repeat avoids opacity pop */}
        <motion.p
          className="text-white/40 text-xs tracking-widest uppercase"
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          Loading Showroom...
        </motion.p>
      </div>
    </div>
  );
};

export default HeroLoader;
