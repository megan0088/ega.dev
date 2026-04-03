'use client';

import { ArrowLeft } from 'lucide-react';

export default function GoBackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  );
}
