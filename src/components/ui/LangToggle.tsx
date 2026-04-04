'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="relative flex items-center p-0.5 rounded-full border border-white/10 bg-white/5">
      {/* Sliding highlight */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-brand-600"
        animate={{ left: lang === 'en' ? '2px' : 'calc(50%)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
      <button
        onClick={() => setLang('en')}
        className={`relative z-10 w-9 py-1 text-xs font-bold tracking-wider transition-colors duration-200 rounded-full ${lang === 'en' ? 'text-white' : 'text-dark-500 hover:text-dark-300'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('id')}
        className={`relative z-10 w-9 py-1 text-xs font-bold tracking-wider transition-colors duration-200 rounded-full ${lang === 'id' ? 'text-white' : 'text-dark-500 hover:text-dark-300'}`}
      >
        ID
      </button>
    </div>
  );
}
