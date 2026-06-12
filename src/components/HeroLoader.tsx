import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const HeroLoader: React.FC = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full bg-dark flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-[#111] to-dark" />
      
      {/* Cream glow orbs */}
      <motion.div 
        className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.05] blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F7F5F2] opacity-[0.03] blur-[120px] pointer-events-none" />

      {/* Center loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={64} className="text-primary" />
          </motion.div>
          <div className="flex flex-col items-center">
            <span className="font-heading font-bold text-3xl text-white tracking-widest">NILKANTH</span>
            <span className="text-[#F7F5F2] text-xs tracking-[0.4em] uppercase mt-1 opacity-70">The Quality Forever</span>
          </div>
        </motion.div>

        {/* Animated loading bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-[#F7F5F2] to-primary rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.p
          className="text-white/40 text-xs tracking-widest uppercase"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Showroom...
        </motion.p>
      </div>
    </div>
  );
};

export default HeroLoader;
