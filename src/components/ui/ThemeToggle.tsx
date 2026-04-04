'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.92 }}
      className="relative"
    >
      {/* Pill track */}
      <motion.div
        className="relative w-[52px] h-7 rounded-full overflow-hidden flex items-center"
        animate={{
          backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,237,213,0.9)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(251,146,60,0.3)',
        }}
        style={{ border: '1px solid' }}
        transition={{ duration: 0.4 }}
      >
        {/* Stars (dark mode) */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              key="stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-2 flex flex-col gap-[3px] items-end"
            >
              <div className="w-[3px] h-[3px] rounded-full bg-white/50" />
              <div className="w-[2px] h-[2px] rounded-full bg-white/30" />
              <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sun rays (light mode) */}
        <AnimatePresence>
          {!isDark && (
            <motion.div
              key="rays"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-2 flex flex-col gap-[3px]"
            >
              <div className="w-[3px] h-[3px] rounded-full bg-orange-400/60" />
              <div className="w-[2px] h-[2px] rounded-full bg-amber-400/50" />
              <div className="w-[3px] h-[3px] rounded-full bg-orange-400/60" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sliding knob */}
        <motion.div
          className="absolute top-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-lg z-10"
          animate={{
            left: isDark ? '3px' : 'calc(100% - 25px)',
            backgroundColor: isDark
              ? 'hsl(220, 40%, 20%)'
              : 'hsl(38, 95%, 60%)',
            boxShadow: isDark
              ? '0 0 8px rgba(148,163,184,0.3), 0 2px 4px rgba(0,0,0,0.4)'
              : '0 0 12px rgba(251,146,60,0.5), 0 2px 4px rgba(0,0,0,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.svg
                key="moon"
                initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                width="11" height="11" viewBox="0 0 24 24" fill="none"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  fill="rgba(203,213,225,0.9)"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="sun"
                initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                width="11" height="11" viewBox="0 0 24 24" fill="none"
              >
                <circle cx="12" cy="12" r="4" fill="white" />
                <path
                  d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="white" strokeWidth="2" strokeLinecap="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
