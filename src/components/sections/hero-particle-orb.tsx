"use client";

import { useEffect, useRef } from "react";

type CodexaParticle = {
  angle: number;
  radius: number;
  depth: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
};

const START_ANGLE = Math.PI * 0.24;
const ARC_LENGTH = Math.PI * 1.52;

function createParticles(count: number): CodexaParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const normalized = (index + Math.random() * 0.8) / count;
    const edgeBias = Math.pow(Math.random(), 0.72);

    return {
      angle: START_ANGLE + normalized * ARC_LENGTH,
      radius: 0.56 + edgeBias * 0.44,
      depth: Math.random(),
      size: 0.7 + Math.random() * 1.65,
      alpha: 0.3 + Math.random() * 0.68,
      phase: Math.random() * Math.PI * 2,
      speed: 0.45 + Math.random() * 0.75,
    };
  });
}

export function HeroParticleOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const particles = createParticles(reducedMotion ? 850 : compact ? 1300 : 2100);
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp = 0) => {
      context.clearRect(0, 0, width, height);

      const time = reducedMotion ? 0 : timestamp * 0.001;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.39;
      const breath = reducedMotion ? 1 : 1 + Math.sin(time * 0.75) * 0.012;

      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const wave = reducedMotion
          ? 0
          : Math.sin(time * particle.speed + particle.phase) * (2.2 + particle.depth * 3.5);
        const angularDrift = reducedMotion
          ? 0
          : Math.sin(time * 0.34 + particle.phase) * 0.006 * particle.depth;
        const angle = particle.angle + angularDrift;
        const radius = scale * particle.radius * breath + wave;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 1.02;
        const shimmer = reducedMotion
          ? 1
          : 0.78 + Math.sin(time * 1.15 + particle.phase) * 0.22;

        context.beginPath();
        context.fillStyle = `rgba(${52 + Math.round(particle.depth * 42)}, ${214 + Math.round(particle.depth * 41)}, ${112 + Math.round(particle.depth * 42)}, ${particle.alpha * shimmer})`;
        context.arc(x, y, particle.size * (0.82 + particle.depth * 0.32), 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });

    observer.observe(canvas);
    resize();
    draw();

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-particle-orb hero-particle-c" aria-hidden="true">
      <div className="hero-particle-orb__glow" />
      <canvas ref={canvasRef} className="hero-particle-orb__canvas" />
    </div>
  );
}
