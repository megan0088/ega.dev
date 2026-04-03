import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Muhamad Ega Nugraha — Software Engineer',
  description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant based in Indonesia. Building innovative digital solutions.',
  keywords: ['Software Engineer', 'Flutter', 'Next.js', 'SAP B1', 'Full Stack'],
  authors: [{ name: 'Muhamad Ega Nugraha', url: 'https://portofolio-ega-zeta.vercel.app' }],
  openGraph: {
    title: 'Muhamad Ega Nugraha — Software Engineer',
    description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant.',
    type: 'website',
    url: 'https://portofolio-ega-zeta.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhamad Ega Nugraha — Software Engineer',
    description: 'Full-stack developer, Flutter engineer, and SAP B1 Technical Consultant.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-950 text-white antialiased">
        {children}
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
      </body>
    </html>
  );
}
