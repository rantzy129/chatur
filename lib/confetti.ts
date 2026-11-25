"use client";

interface ConfettiOptions {
  origin?: { x: number; y: number };
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  decay: number;
  gravity: number;
  wobble: number;
  wobbleSpeed: number;
}

export function fireConfetti(options: ConfettiOptions = {}) {
  if (typeof window === "undefined" || !document?.body) return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Vibrant tactical palette: Obsidian Red, Gold, Black, White, Gray
  const colors = [
    "#E53935",
    "#EF4444",
    "#F59E0B",
    "#FBBF24",
    "#000000",
    "#18181B",
    "#52525B",
    "#A1A1AA",
    "#FFFFFF",
  ];

  const originX = options.origin?.x ?? width / 2;
  const originY = options.origin?.y ?? height * 0.35;
  const count = options.count ?? 80;

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    // Spread angle mostly upwards (-120deg to -60deg) with slight side scatter
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const speed = 7 + Math.random() * 9;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      vy: Math.sin(angle) * speed,
      width: 6 + Math.random() * 5,
      height: 10 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      tilt: Math.random() * 10,
      tiltSpeed: 0.1 + Math.random() * 0.15,
      opacity: 1,
      decay: 0.008 + Math.random() * 0.008,
      gravity: 0.22,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
    });
  }

  let animId: number;

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    let hasAlive = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0 || p.y > height + 50) continue;

      hasAlive = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.tilt += p.tiltSpeed;
      p.opacity -= p.decay;

      const currentTilt = Math.sin(p.tilt) * 12;
      const x = p.x + Math.sin(p.wobble) * 2;

      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(p.tilt), 1);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.restore();
    }

    if (hasAlive) {
      animId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animId = requestAnimationFrame(render);
}

