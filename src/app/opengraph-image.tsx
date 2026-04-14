import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Muhamad Ega Nugraha — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #090b16 0%, #0f1629 50%, #090b16 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          top: -100, left: -100,
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          bottom: -80, right: -80,
        }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1 }}>
          {/* Logo badge */}
          <div style={{
            background: 'rgba(99,102,241,0.9)',
            borderRadius: 16, padding: '12px 24px',
            fontSize: 18, color: 'white', fontWeight: 700, letterSpacing: 2,
          }}>
            ega.dev
          </div>

          <div style={{ fontSize: 60, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.1 }}>
            Muhamad Ega Nugraha
          </div>

          <div style={{ fontSize: 28, color: '#6366f1', fontWeight: 500, textAlign: 'center' }}>
            Software Engineer & SAP B1 Technical Consultant
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {['Next.js', 'Flutter', 'TypeScript', 'SAP B1'].map((tech) => (
              <div key={tech} style={{
                padding: '6px 16px', borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8', fontSize: 16,
              }}>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
