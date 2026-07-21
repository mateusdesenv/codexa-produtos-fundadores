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
};

const START_ANGLE = Math.PI * 0.24;
const ARC_LENGTH = Math.PI * 1.52;
const POINTER_RADIUS = 108;
const LOGO_ICON_PATH =
  "/assets/codexa/homepage-products/brand/logo-icon-only.png";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const easeInOut = (value: number) => {
  const progress = clamp(value);
  return (
    progress *
    progress *
    progress *
    (progress * (progress * 6 - 15) + 10)
  );
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
    };
  });
}

function createLogoParticles(image: HTMLImageElement, count: number): CodexaParticle[] {
  const sampleSize = 256;
  const sampleCanvas = document.createElement("canvas");
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return createParticles(count);

  sampleCanvas.width = sampleSize;
  sampleCanvas.height = sampleSize;
  sampleContext.drawImage(image, 0, 0, sampleSize, sampleSize);

  const imageData = sampleContext.getImageData(0, 0, sampleSize, sampleSize);
  const logoPixels: Array<{ x: number; y: number }> = [];
  let minimumX = sampleSize;
  let maximumX = 0;
  let minimumY = sampleSize;
  let maximumY = 0;

  for (let y = 0; y < sampleSize; y += 1) {
    for (let x = 0; x < sampleSize; x += 1) {
      const pixelIndex = (y * sampleSize + x) * 4;
      const red = imageData.data[pixelIndex];
      const green = imageData.data[pixelIndex + 1];
      const blue = imageData.data[pixelIndex + 2];
      const alpha = imageData.data[pixelIndex + 3];
      const belongsToLogo =
        alpha > 80 && green > 80 && green > red * 1.18 && green > blue * 1.18;

      if (!belongsToLogo) continue;

      logoPixels.push({ x, y });
      minimumX = Math.min(minimumX, x);
      maximumX = Math.max(maximumX, x);
      minimumY = Math.min(minimumY, y);
      maximumY = Math.max(maximumY, y);
    }
  }

  if (logoPixels.length === 0) return createParticles(count);

  const centerX = (minimumX + maximumX) * 0.5;
  const centerY = (minimumY + maximumY) * 0.5;
  const logoScale = Math.max(maximumX - minimumX, maximumY - minimumY) * 0.5;

  return Array.from({ length: count }, () => {
    const point = logoPixels[Math.floor(Math.random() * logoPixels.length)];
    const normalizedX = (point.x - centerX) / logoScale;
    const normalizedY = (point.y - centerY) / logoScale;

    return {
      angle: Math.atan2(normalizedY, normalizedX),
      radius: Math.hypot(normalizedX, normalizedY),
      depth: Math.random(),
      size: 0.7 + Math.random() * 1.65,
      alpha: 0.3 + Math.random() * 0.68,
      phase: Math.random() * Math.PI * 2,
      speed: 0.45 + Math.random() * 0.75,
      side: normalizedX < 0 ? -1 : 1,
      lane: Math.random(),
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
    const particleCount = reducedMotion ? 850 : compact ? 1300 : 2100;
    const particles = createParticles(particleCount);
    const logoImage = new Image();
    let disposed = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const pointer = { x: 0, y: 0, active: false };

    logoImage.onload = () => {
      if (disposed) return;
      particles.splice(
        0,
        particles.length,
        ...createLogoParticles(logoImage, particleCount),
      );
    };
    logoImage.src = LOGO_ICON_PATH;

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
      const heroScale = Math.min(anchorBounds.width, anchorBounds.height) * 0.33;
      const splitProgress = reducedMotion
        ? scrollY > 24
          ? 1
          : 0
        : easeInOut(
            scrollY /
              Math.max(compact ? 660 : 900, height * (compact ? 0.9 : 1.15)),
          );
      const contactTarget = document.getElementById("contact-particle-target");
      const contactBounds = contactTarget?.getBoundingClientRect();
      const contactProgress = contactBounds
        ? reducedMotion
          ? contactBounds.top < height * 0.78
            ? 1
            : 0
          : easeInOut((height * 0.98 - contactBounds.top) / (height * 0.72))
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
        const baseSideX =
          particle.side < 0
            ? sideInset + particle.lane * sideSpread
            : width - sideInset - particle.lane * sideSpread;
        const baseSideY =
          ((particle.phase / (Math.PI * 2)) * height +
            time * (8 + particle.speed * 9) +
            particle.lane * 80) %
          (height + 100) -
          50;
        const lateralAnomalyWeight = reducedMotion
          ? 0
          : easeInOut(splitProgress) * (1 - easeInOut(contactProgress));
        const anomalyPeriod = 5.2;
        const anomalyCycle =
          0.5 + Math.sin((time / anomalyPeriod) * Math.PI * 2) * 0.5;
        const anomalyPulse = Math.pow(anomalyCycle, 4);
        const anomalyCenterY =
          height *
          (0.5 +
            Math.sin(time * 0.27 + (particle.side < 0 ? 0 : Math.PI)) * 0.24);
        const anomalyDistanceY = baseSideY - anomalyCenterY;
        const anomalyRange = Math.max(100, height * 0.18);
        const anomalyInfluence = Math.exp(
          -(anomalyDistanceY * anomalyDistanceY) /
            (2 * anomalyRange * anomalyRange),
        );
        const anomalyDirection = particle.side < 0 ? 1 : -1;
        const anomalyScale = compact ? 0.62 : 1;
        const anomalyX =
          (Math.sin(time * 1.08 + particle.phase * 1.7) *
            (4 + particle.depth * 7) +
            anomalyDirection *
              anomalyPulse *
              anomalyInfluence *
              (22 + particle.depth * 22)) *
          anomalyScale *
          lateralAnomalyWeight;
        const anomalyY =
          (Math.cos(time * 0.82 + particle.phase * 1.35) *
            (3 + particle.depth * 6) -
            anomalyDistanceY *
              anomalyInfluence *
              anomalyPulse *
              (0.08 + particle.depth * 0.07)) *
          anomalyScale *
          lateralAnomalyWeight;
        const sideX = baseSideX + anomalyX;
        const sideY = baseSideY + anomalyY;

        const contactRadius = contactScale * particle.radius + wave * 0.45;
        const contactFloatWeight = reducedMotion
          ? 0
          : easeInOut(contactProgress);
        const contactFloatX =
          Math.sin(time * 0.72 + particle.phase) *
          (0.8 + particle.depth * 2.6) *
          contactFloatWeight;
        const contactFloatY =
          Math.cos(time * 0.58 + particle.phase * 1.17) *
          (1.2 + particle.depth * 3.4) *
          contactFloatWeight;
        const contactX =
          contactCenterX + Math.cos(angle) * contactRadius + contactFloatX;
        const contactY =
          contactCenterY +
          Math.sin(angle) * contactRadius * 1.02 +
          contactFloatY;

        const normalizedLogoX = clamp(
          (Math.cos(particle.angle) * particle.radius + 1.05) / 2.1,
        );
        const waveDelay =
          normalizedLogoX * 0.32 + particle.lane * 0.035;
        const waveDuration = 1 - waveDelay;
        const waveProgress = reducedMotion
          ? splitProgress
          : easeInOut(
              clamp((splitProgress - waveDelay) / waveDuration),
            );
        const waveCompression = reducedMotion
          ? 0
          : Math.sin(waveProgress * Math.PI) *
            (1 - Math.abs(waveProgress * 2 - 1)) *
            (compact ? 14 : 24);
        const contactWaveProgress = reducedMotion
          ? contactProgress
          : 1 -
            easeInOut(
              clamp(
                ((1 - contactProgress) - waveDelay) / waveDuration,
              ),
            );
        const contactWaveCompression = reducedMotion
          ? 0
          : Math.sin(contactWaveProgress * Math.PI) *
            (1 - Math.abs(contactWaveProgress * 2 - 1)) *
            (compact ? 14 : 24);
        const splitX =
          mix(heroX, sideX, waveProgress) -
          particle.side * waveCompression;
        const splitY =
          mix(heroY, sideY, waveProgress) +
          Math.sin(particle.phase + waveProgress * Math.PI * 2) *
            waveCompression *
            0.34;
        const baseX =
          mix(splitX, contactX, contactWaveProgress) -
          particle.side * contactWaveCompression;
        const baseY =
          mix(splitY, contactY, contactWaveProgress) +
          Math.sin(
            particle.phase + contactWaveProgress * Math.PI * 2,
          ) *
            contactWaveCompression *
            0.34;
        let pointerGlow = 0;

        if (!reducedMotion && pointer.active) {
          const deltaX = baseX - pointer.x;
          const deltaY = baseY - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < POINTER_RADIUS) {
            const influence = 1 - distance / POINTER_RADIUS;
            const ripple =
              0.78 +
              Math.sin(time * 6 - distance * 0.085 + particle.phase * 0.18) *
                0.22;
            pointerGlow = easeInOut(influence) * ripple;
          }
        }

        const shimmer = reducedMotion
          ? 1
          : 0.78 + Math.sin(time * 1.15 + particle.phase) * 0.22;
        const red = 52 + Math.round(particle.depth * 42 + pointerGlow * 86);
        const green = 214 + Math.round(particle.depth * 41);
        const blue = 112 + Math.round(particle.depth * 42 + pointerGlow * 62);
        const glowAlpha = clamp(
          particle.alpha *
            shimmer *
            (1 + pointerGlow * 0.55),
        );
        const glowSize = 1 + pointerGlow * 0.52;

        context.beginPath();
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${glowAlpha})`;
        context.arc(
          baseX,
          baseY,
          particle.size * (0.82 + particle.depth * 0.32) * glowSize,
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
      disposed = true;
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
