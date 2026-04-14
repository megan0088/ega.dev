'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SkillsWebGLCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 3.8;

    // ── Custom GLSL shaders ───────────────────────────────
    const vertexShader = /* glsl */`
      uniform float uTime;
      varying vec3  vNormal;
      varying vec3  vWorldPos;
      varying float vDisplace;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i),             hash(i+vec3(1,0,0)), f.x),
              mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
              mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        float n = noise(position * 1.8 + uTime * 0.4);
        float disp = n * 0.12;
        vDisplace = disp;
        vWorldPos = position + normal * disp;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vWorldPos, 1.0);
      }
    `;

    const fragmentShader = /* glsl */`
      uniform float uTime;
      uniform vec3  uAmber;
      uniform vec3  uCyan;
      varying vec3  vNormal;
      varying vec3  vWorldPos;
      varying float vDisplace;

      void main() {
        // Fresnel rim
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
        rim = pow(rim, 1.8);

        // Horizontal scanlines
        float scan = step(0.48, fract(vWorldPos.y * 14.0 - uTime * 0.3));
        float scanBright = mix(0.55, 1.0, scan);

        // Energy pulse from displacement
        float pulse = smoothstep(0.0, 0.12, vDisplace + sin(uTime * 2.0) * 0.03);

        vec3 col = mix(uAmber, uCyan, rim);
        col += uCyan  * rim    * 0.6;
        col += uAmber * pulse  * 0.8;
        col *= scanBright;

        float alpha = mix(0.25, 0.92, rim) * mix(0.7, 1.0, scan);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    // ── Main mesh (IcosahedronGeometry detail=5) ──────────
    const mainGeo = new THREE.IcosahedronGeometry(1.1, 5);
    const mainMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uAmber: { value: new THREE.Color(0xf59e0b) },
        uCyan:  { value: new THREE.Color(0x06b6d4) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    scene.add(mainMesh);

    // ── Low-poly wireframe shell ──────────────────────────
    const wireMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.18,
      })
    );
    scene.add(wireMesh);

    // ── Orbit rings ───────────────────────────────────────
    function makeRing(radius: number, tube: number, color: number, opacity: number, rx: number, ry: number) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 120),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      m.rotation.x = rx;
      m.rotation.y = ry;
      scene.add(m);
      return m;
    }
    const ring1 = makeRing(1.65, 0.007, 0x06b6d4, 0.50, Math.PI / 3,  0);
    const ring2 = makeRing(1.90, 0.005, 0xf59e0b, 0.35, Math.PI / 2,  Math.PI / 5);
    const ring3 = makeRing(2.15, 0.004, 0x8b5cf6, 0.25, Math.PI / 6, -Math.PI / 4);

    // ── Particles ─────────────────────────────────────────
    const N = 280;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const amber = new THREE.Color(0xf59e0b);
    const cyan  = new THREE.Color(0x06b6d4);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2.4 + Math.random() * 1.2;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? amber : cyan;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ptGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    const ptMat = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // ── Mouse parallax ────────────────────────────────────
    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mx = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      my = -((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMove);

    // ── Animation loop ────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      (mainMat.uniforms.uTime as { value: number }).value = t;

      mainMesh.rotation.y = t * 0.28 + mx * 0.25;
      mainMesh.rotation.x = t * 0.12 + my * 0.18;
      wireMesh.rotation.y = t * 0.18;
      wireMesh.rotation.x = t * 0.09;

      ring1.rotation.z =  t * 0.50;
      ring2.rotation.z = -t * 0.35;
      ring3.rotation.z =  t * 0.22;
      ring3.rotation.x =  Math.PI / 6 + Math.sin(t * 0.4) * 0.15;

      particles.rotation.y  = t * 0.04;
      particles.rotation.x  = t * 0.02;

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
