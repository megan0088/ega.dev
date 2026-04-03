import Link from 'next/link';
import { Home } from 'lucide-react';
import GoBackButton from '@/components/ui/GoBackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 bg-grid flex items-center justify-center p-6">
      {/* Glow orb */}
      <div className="glow-orb w-[400px] h-[400px] bg-brand-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <p className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-purple bg-clip-text text-transparent select-none">
          404
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
          Page not found
        </h1>

        <p className="text-dark-400 text-base leading-relaxed mb-10">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          <br />
          Kembali ke portfolio utama.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow active:scale-95"
          >
            <Home size={16} />
            Back to Portfolio
          </Link>
          <GoBackButton />
        </div>

        {/* Fun code snippet */}
        <div className="mt-12 p-4 rounded-xl bg-dark-900/50 border border-white/5 text-left font-mono text-xs">
          <p className="text-dark-600 mb-1">{'// error log'}</p>
          <p>
            <span className="text-red-400">Error</span>
            <span className="text-dark-400">: </span>
            <span className="text-dark-300">Cannot find page at </span>
            <span className="text-brand-400">&apos;{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}&apos;</span>
          </p>
          <p className="text-dark-600 mt-1">{'// suggestion: go back home'}</p>
        </div>
      </div>
    </div>
  );
}
