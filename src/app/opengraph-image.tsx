import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Muhamad Ega Nugraha — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const FALLBACK = {
  name: 'Muhamad Ega Nugraha',
  title: 'Software Engineer',
  tech_badges: ['Swift', 'SwiftUI', 'Next.js', 'TypeScript'],
};

// Read name/title/badges from the same profile row the page uses, so the
// link preview on LinkedIn/WhatsApp always matches the site.
async function getProfile(): Promise<typeof FALLBACK> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK;
  try {
    const res = await fetch(`${url}/rest/v1/profile?select=name,title,tech_badges&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK;
    const [row] = (await res.json()) as Partial<typeof FALLBACK>[];
    return {
      name: row?.name || FALLBACK.name,
      title: row?.title || FALLBACK.title,
      tech_badges: row?.tech_badges?.length ? row.tech_badges.slice(0, 5) : FALLBACK.tech_badges,
    };
  } catch {
    return FALLBACK;
  }
}

export default async function OgImage() {
  const profile = await getProfile();
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
            {profile.name}
          </div>

          <div style={{ fontSize: 28, color: '#6366f1', fontWeight: 500, textAlign: 'center' }}>
            {profile.title}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {profile.tech_badges.map((tech) => (
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
