import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/theme-context';
import { LangProvider } from '@/lib/lang-context';
import '@/styles/globals.css';

const BASE_URL = 'https://ega-dev.vercel.app';

export const metadata: Metadata = {
  title: 'Muhamad Ega Nugraha — Software Engineer',
  description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant based in Indonesia. Building innovative digital solutions.',
  keywords: ['Software Engineer', 'Flutter', 'Next.js', 'SAP B1', 'Full Stack'],
  authors: [{ name: 'Muhamad Ega Nugraha', url: BASE_URL }],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Muhamad Ega Nugraha — Software Engineer',
    description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant.',
    type: 'website',
    url: BASE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Muhamad Ega Nugraha — Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhamad Ega Nugraha — Software Engineer',
    description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-950 text-white antialiased">
        <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js" strategy="afterInteractive" />
        <ThemeProvider>
          <LangProvider>
          {children}
          </LangProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#34d399', secondary: '#1e293b' } },
              error: { iconTheme: { primary: '#fb7185', secondary: '#1e293b' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
