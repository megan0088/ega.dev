'use client';

import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrintButton() {
  return (
    <div className="fixed top-5 right-5 z-50 flex gap-2 print:hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={14} />
        Portfolio
      </Link>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        <Printer size={14} />
        Save as PDF
      </button>
    </div>
  );
}
