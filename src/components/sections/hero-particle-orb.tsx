"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type CodexaParticle = {
  angle: number;
  radius: number;
  depth: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  side: -1 | 1;
  lane: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
};

const START_ANGLE = Math.PI * 0.24;
const ARC_LENGTH = Math.PI * 1.52;
const POINTER_RADIUS = 108;
const POINTER_FORCE = 1.35;
const RETURN_FORCE = 0.055;
const FRICTION = 0.86;
const MAX_OFFSET = 26;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const easeInOut = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

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
      side: normalized < 0.5 ? -1 : 1,
      lane: Math.random(),
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
    };
  });
}

export function HeroParticleOrb() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    const particles = createParticles(reducedMotion ? 850 : compact ? 1300 : 2100);
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const pointer = { x: 0, y: 0, active: false };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const resetPointer = () => {
      pointer.active = false;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp = 0) => {
      context.clearRect(0, 0, width, height);

      const time = reducedMotion ? 0 : timestamp * 0.001;
      const scrollY = window.scrollY;
      const anchorBounds = anchor.getBoundingClientRect();
      const anchorDocumentTop = anchorBounds.top + scrollY;
      const heroCenterX = anchorBounds.left + anchorBounds.width * 0.5;
      const heroCenterY = anchorDocumentTop - scrollY + anchorBounds.height * 0.5;
      const heroScale = Math.min(anchorBounds.width, anchorBounds.height) * 0.39;
      const splitProgress = reducedMotion
        ? scrollY > 24
          ? 1
          : 0
        : easeInOut(scrollY / Math.max(220, height * 0.32));
      const contactTarget = document.getElementById("contact-particle-target");
      const contactBounds = contactTarget?.getBoundingClientRect();
      const contactProgress = contactBounds
        ? reducedMotion
          ? contactBounds.top < height * 0.78
            ? 1
            : 0
          : easeInOut((height * 0.92 - contactBounds.top) / (height * 0.42))
        : 0;
      const contactCenterX = contactBounds
        ? contactBounds.left + contactBounds.width * 0.5
        : width * 0.78;
      const contactCenterY = contactBounds
        ? contactBounds.top + contactBounds.height * 0.5
        : height * 0.62;
      const contactScale = contactBounds
        ? Math.min(contactBounds.width, contactBounds.height) * 0.38
        : 90;
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
        const heroRadius = heroScale * particle.radius * breath + wave;
        const heroX = heroCenterX + Math.cos(angle) * heroRadius;
        const heroY = heroCenterY + Math.sin(angle) * heroRadius * 1.02;

        const sideInset = compact ? 8 : 16;
        const sideSpread = compact ? 22 : 52;
        const sideX =
          particle.side < 0
            ? sideInset + particle.lane * sideSpread
            : width - sideInset - particle.lane * sideSpread;
        const sideY =
          ((particle.phase / (Math.PI * 2)) * height +
            time * (8 + particle.speed * 9) +
            particle.lane * 80) %
          (height + 100) -
          50;

        const contactRadius = contactScale * particle.radius + wave * 0.45;
        const contactX = contactCenterX + Math.cos(angle) * contactRadius;
        const contactY = contactCenterY + Math.sin(angle) * contactRadius * 1.02;

        const splitX = mix(heroX, sideX, splitProgress);
        const splitY = mix(heroY, sideY, splitProgress);
        const baseX = mix(splitX, contactX, contactProgress);
        const baseY = mix(splitY, contactY, contactProgress);

        if (!reducedMotion && pointer.active && contactProgress < 0.92) {
          const deltaX = baseX + particle.offsetX - pointer.x;
          const deltaY = baseY + particle.offsetY - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < POINTER_RADIUS) {
            const safeDistance = Math.max(distance, 0.1);
            const influence = 1 - distance / POINTER_RADIUS;
            const force = influence * influence * POINTER_FORCE;
            particle.velocityX += (deltaX / safeDistance) * force;
            particle.velocityY += (deltaY / safeDistance) * force;
          }
        }

        particle.velocityX += -particle.offsetX * RETURN_FORCE;
        particle.velocityY += -particle.offsetY * RETURN_FORCE;
        particle.velocityX *= FRICTION;
        particle.velocityY *= FRICTION;
        particle.offsetX += particle.velocityX;
        particle.offsetY += particle.velocityY;

        const offsetDistance = Math.hypot(particle.offsetX, particle.offsetY);
        if (offsetDistance > MAX_OFFSET) {
          const limit = MAX_OFFSET / offsetDistance;
          particle.offsetX *= limit;
          particle.offsetY *= limit;
        }

        const shimmer = reducedMotion
          ? 1
          : 0.78 + Math.sin(time * 1.15 + particle.phase) * 0.22;

        context.beginPath();
        context.fillStyle = `rgba(${52 + Math.round(particle.depth * 42)}, ${214 + Math.round(particle.depth * 41)}, ${112 + Math.round(particle.depth * 42)}, ${particle.alpha * shimmer})`;
        context.arc(
          baseX + particle.offsetX,
          baseY + particle.offsetY,
          particle.size * (0.82 + particle.depth * 0.32),
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerout", resetPointer);
    window.addEventListener("blur", resetPointer);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerout", resetPointer);
      window.removeEventListener("blur", resetPointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mounted]);

  return (
    <div ref={anchorRef} className="hero-particle-orb hero-particle-c" aria-hidden="true">
      <div className="hero-particle-orb__glow" />
      {mounted
        ? createPortal(
            <canvas ref={canvasRef} className="hero-particle-orb__canvas" />,
            document.body,
          )
        : null}
    </div>
  );
}
