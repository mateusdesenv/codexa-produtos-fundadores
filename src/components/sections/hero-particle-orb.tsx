"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type GalaxyParticle = {
  angle: number;
  radius: number;
  depth: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  lane: number;
};

const TAU = Math.PI * 2;
const LOGO_ICON_PATH = "/assets/codexa/homepage-products/brand/logo-icon-only.png";
const GALAXY_PALETTE = [
  [205, 255, 226],
  [108, 255, 170],
  [32, 232, 120],
  [86, 209, 231],
] as const;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smootherstep = (value: number) => {
  const progress = clamp(value);
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
};

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

function fallbackParticles(count: number): GalaxyParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const normalized = (index + Math.random() * 0.8) / count;
    return {
      angle: Math.PI * 0.24 + normalized * Math.PI * 1.52,
      radius: 0.56 + Math.pow(Math.random(), 0.72) * 0.44,
      depth: Math.random(),
      size: 0.55 + Math.random() * 1.7,
      alpha: 0.24 + Math.random() * 0.72,
      phase: Math.random() * TAU,
      speed: 0.48 + Math.random() * 0.8,
      lane: Math.random(),
    };
  });
}

function sampleLogo(image: HTMLImageElement, count: number): GalaxyParticle[] {
  const sampleSize = 256;
  const sampleCanvas = document.createElement("canvas");
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return fallbackParticles(count);
  sampleCanvas.width = sampleSize;
  sampleCanvas.height = sampleSize;
  sampleContext.drawImage(image, 0, 0, sampleSize, sampleSize);
  const imageData = sampleContext.getImageData(0, 0, sampleSize, sampleSize);
  const pixels: Array<{ x: number; y: number }> = [];
  let minimumX = sampleSize;
  let maximumX = 0;
  let minimumY = sampleSize;
  let maximumY = 0;

  for (let y = 0; y < sampleSize; y += 1) {
    for (let x = 0; x < sampleSize; x += 1) {
      const index = (y * sampleSize + x) * 4;
      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];
      const alpha = imageData.data[index + 3];
      if (alpha <= 80 || green <= 80 || green <= red * 1.18 || green <= blue * 1.18) continue;
      pixels.push({ x, y });
      minimumX = Math.min(minimumX, x);
      maximumX = Math.max(maximumX, x);
      minimumY = Math.min(minimumY, y);
      maximumY = Math.max(maximumY, y);
    }
  }

  if (pixels.length === 0) return fallbackParticles(count);
  const centerX = (minimumX + maximumX) * 0.5;
  const centerY = (minimumY + maximumY) * 0.5;
  const scale = Math.max(maximumX - minimumX, maximumY - minimumY) * 0.5;
  return Array.from({ length: count }, () => {
    const point = pixels[Math.floor(Math.random() * pixels.length)];
    const normalizedX = (point.x - centerX) / scale;
    const normalizedY = (point.y - centerY) / scale;
    return {
      angle: Math.atan2(normalizedY, normalizedX),
      radius: Math.hypot(normalizedX, normalizedY),
      depth: Math.random(),
      size: 0.55 + Math.random() * 1.7,
      alpha: 0.24 + Math.random() * 0.72,
      phase: Math.random() * TAU,
      speed: 0.48 + Math.random() * 0.8,
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
    const particleCount = reducedMotion ? 760 : compact ? 1250 : 2050;
    const particles = fallbackParticles(particleCount);
    const positions = new Float32Array(particleCount * 2);
    const clusters = new Int16Array(particleCount);
    const logoImage = new Image();
    let disposed = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    logoImage.onload = () => {
      if (!disposed) particles.splice(0, particles.length, ...sampleLogo(logoImage, particleCount));
    };
    logoImage.src = LOGO_ICON_PATH;

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
      const heroCenterX = anchorBounds.left + anchorBounds.width * 0.5;
      const heroCenterY = anchorBounds.top + anchorBounds.height * 0.5;
      const heroScale = Math.min(anchorBounds.width, anchorBounds.height) * 0.33;
      const travelProgress = reducedMotion
        ? scrollY > 24 ? 1 : 0
        : smootherstep(scrollY / Math.max(compact ? 640 : 900, height * 1.12));

      const contactBounds = document.getElementById("contact-particle-target")?.getBoundingClientRect();
      const contactProgress = contactBounds
        ? reducedMotion
          ? contactBounds.top < height * 0.78 ? 1 : 0
          : smootherstep((height * 0.94 - contactBounds.top) / (height * 0.48))
        : 0;

      const footerBounds = document.getElementById("footer-particle-target")?.getBoundingClientRect();
      const footerProgress = footerBounds
        ? reducedMotion
          ? footerBounds.top < height * 0.82 ? 1 : 0
          : smootherstep((height * 0.82 - footerBounds.top) / (height * 0.42))
        : 0;
      const footerCenterX = footerBounds ? footerBounds.left + footerBounds.width * 0.5 : width * 0.18;
      const footerCenterY = footerBounds ? footerBounds.top + footerBounds.height * 0.5 : height * 0.7;
      const footerScale = compact ? 47 : 60;

      const productBounds = Array.from(
        document.querySelectorAll<HTMLElement>("[data-particle-attractor]"),
        (element) => element.getBoundingClientRect(),
      ).filter((bounds) => bounds.bottom > -140 && bounds.top < height + 140);
      const orbitBounds = Array.from(
        document.querySelectorAll<HTMLElement>("[data-galaxy-orbit]"),
        (element) => element.getBoundingClientRect(),
      ).filter((bounds) => bounds.bottom > -140 && bounds.top < height + 140);
      const occluderBounds = Array.from(
        document.querySelectorAll<HTMLElement>(".surface-card, [data-particle-occluder]"),
        (element) => element.getBoundingClientRect(),
      ).filter(
        (bounds) =>
          bounds.width > 0 &&
          bounds.height > 0 &&
          bounds.bottom > -32 &&
          bounds.top < height + 32,
      );
      const travelVisibility = smootherstep(travelProgress) * (1 - smootherstep(footerProgress));
      const vanishingX = width * 0.5;
      const vanishingY = height * 0.47;

      context.globalCompositeOperation = "lighter";

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const logoAngle = particle.angle + (reducedMotion ? 0 : Math.sin(time * 0.3 + particle.phase) * 0.004);
        const logoRadius = heroScale * particle.radius;
        const heroX = heroCenterX + Math.cos(logoAngle) * logoRadius;
        const heroY = heroCenterY + Math.sin(logoAngle) * logoRadius * 1.02;

        const depthCycle = ((particle.depth + scrollY * 0.00024 + time * 0.012 * particle.speed) % 1 + 1) % 1;
        const projection = 0.1 + Math.pow(depthCycle, 2.15) * 1.34;
        const starRadius = (0.18 + particle.lane * 0.92) * Math.max(width, height) * 0.72 * projection;
        const starAngle = particle.phase + Math.sin(time * 0.12 + particle.lane * TAU) * 0.12;
        let starX = vanishingX + Math.cos(starAngle) * starRadius * (width / Math.max(width, height));
        let starY = vanishingY + Math.sin(starAngle) * starRadius;
        let clusterId = -1;

        if (productBounds.length > 0 && particle.lane < 0.34) {
          clusterId = index % productBounds.length;
          const target = productBounds[clusterId];
          const centerX = target.left + target.width * 0.5;
          const centerY = target.top + target.height * 0.5;
          const orbitAngle = particle.phase + time * (0.12 + particle.speed * 0.08);
          const orbitRadiusX = target.width * (0.52 + particle.depth * 0.1);
          const orbitRadiusY = target.height * (0.52 + particle.depth * 0.12);
          const constellationX = centerX + Math.cos(orbitAngle) * orbitRadiusX;
          const constellationY = centerY + Math.sin(orbitAngle) * orbitRadiusY;
          const influence = smootherstep(1 - Math.abs(target.top + target.height * 0.5 - height * 0.5) / (height * 0.92));
          starX = mix(starX, constellationX, influence * 0.84);
          starY = mix(starY, constellationY, influence * 0.84);
        } else if (orbitBounds.length > 0 && particle.lane < 0.58) {
          clusterId = 10 + (index % orbitBounds.length);
          const target = orbitBounds[index % orbitBounds.length];
          const centerX = target.left + target.width * 0.5;
          const centerY = target.top + target.height * 0.48;
          const orbitAngle = particle.phase + time * (0.2 + particle.speed * 0.12);
          const orbitRadiusX = target.width * (0.52 + particle.depth * 0.1);
          const orbitRadiusY = target.height * (0.54 + particle.depth * 0.1);
          const orbitX = centerX + Math.cos(orbitAngle) * orbitRadiusX;
          const orbitY = centerY + Math.sin(orbitAngle) * orbitRadiusY;
          const influence = smootherstep(1 - Math.abs(centerY - height * 0.5) / (height * 0.88));
          starX = mix(starX, orbitX, influence * 0.88);
          starY = mix(starY, orbitY, influence * 0.88);
        }
        clusters[index] = clusterId;

        const normalizedLogoX = clamp((Math.cos(particle.angle) * particle.radius + 1.05) / 2.1);
        const delay = normalizedLogoX * 0.24 + particle.lane * 0.05;
        const particleTravel = reducedMotion
          ? travelProgress
          : smootherstep(clamp((travelProgress - delay) / (1 - delay)));
        const dustCompression = reducedMotion ? 0 : Math.sin(particleTravel * Math.PI) * (compact ? 14 : 25);
        const travellingX = mix(heroX, starX, particleTravel) + Math.cos(particle.phase) * dustCompression;
        const travellingY = mix(heroY, starY, particleTravel) + Math.sin(particle.phase) * dustCompression;

        const contactCenterX = contactBounds ? contactBounds.left + contactBounds.width * 0.5 : width * 0.78;
        const contactCenterY = contactBounds ? contactBounds.top + contactBounds.height * 0.5 : height * 0.62;
        const halfContactWidth = contactBounds ? contactBounds.width * 0.5 : 112;
        const halfContactHeight = contactBounds ? contactBounds.height * 0.5 : 28;
        const borderAngle = particle.phase;
        const borderCosine = Math.cos(borderAngle);
        const borderSine = Math.sin(borderAngle);
        const borderFloat = reducedMotion ? 0 : Math.sin(time * 1.4 + particle.phase * 1.7) * (0.35 + particle.depth * 0.8);
        const contactBorderX =
          contactCenterX +
          borderCosine * halfContactWidth +
          borderFloat;
        const contactBorderY =
          contactCenterY +
          borderSine * halfContactHeight +
          borderFloat * 0.35;
        const contactParticleProgress = reducedMotion
          ? contactProgress
          : smootherstep(clamp((contactProgress - delay * 0.22) / (1 - delay * 0.22)));
        const contactMembership = index % (compact ? 3 : 4) === 0 ? 1 : 0;
        const effectiveContactProgress = contactParticleProgress * contactMembership;
        const contactX = mix(travellingX, contactBorderX, effectiveContactProgress);
        const contactY = mix(travellingY, contactBorderY, effectiveContactProgress);

        const normalizedRadius = clamp(particle.radius, 0, 1);
        const celestialDepth = Math.sqrt(Math.max(0, 1 - normalizedRadius * normalizedRadius));
        const perspective = 0.9 + celestialDepth * 0.17;
        const celestialX = footerCenterX + Math.cos(logoAngle) * footerScale * particle.radius * perspective;
        const celestialY = footerCenterY + Math.sin(logoAngle) * footerScale * particle.radius * 1.02;
        const footerParticleProgress = reducedMotion
          ? footerProgress
          : smootherstep(clamp((footerProgress - delay * 0.4) / (1 - delay * 0.4)));
        const condensation = reducedMotion ? 0 : Math.sin(footerParticleProgress * Math.PI) * (compact ? 18 : 31);
        const baseX = mix(contactX, celestialX, footerParticleProgress) - Math.cos(particle.phase) * condensation;
        const baseY = mix(contactY, celestialY, footerParticleProgress) - Math.sin(particle.phase) * condensation;
        positions[index * 2] = baseX;
        positions[index * 2 + 1] = baseY;

        const color = GALAXY_PALETTE[Math.floor((particle.depth * 0.74 + particle.lane * 0.26) * GALAXY_PALETTE.length) % GALAXY_PALETTE.length];
        const twinkle = reducedMotion ? 1 : 0.7 + Math.sin(time * (1.1 + particle.speed) + particle.phase) * 0.3;
        const depthBrightness = 0.35 + depthCycle * 0.65;
        const celestialLight = 0.58 + celestialDepth * 0.72;
        const footerIntensity = smootherstep(footerProgress);
        const contactIntensity =
          smootherstep(contactProgress) *
          (1 - footerIntensity) *
          contactMembership;
        const alpha = clamp(
          particle.alpha *
            twinkle *
            mix(depthBrightness, celestialLight, footerIntensity) *
            mix(1, 0.82, contactIntensity),
        );
        const size =
          particle.size *
          mix(0.52 + depthCycle * 1.24, 0.9 + celestialDepth * 0.82, footerIntensity) *
          mix(1, 0.65, contactIntensity);

        if (travelVisibility > 0.08 && depthCycle > 0.68 && clusterId < 0 && !reducedMotion) {
          const streak = (depthCycle - 0.68) * (compact ? 22 : 38);
          context.beginPath();
          context.moveTo(baseX, baseY);
          context.lineTo(baseX - Math.cos(starAngle) * streak, baseY - Math.sin(starAngle) * streak);
          context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.18})`;
          context.lineWidth = Math.max(0.35, size * 0.34);
          context.stroke();
        }

        context.beginPath();
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        context.arc(baseX, baseY, size, 0, TAU);
        context.fill();
      }

      const heroConstellationOpacity = (1 - smootherstep(travelProgress)) * 0.46;
      const localConstellationOpacity = travelVisibility * 0.34;
      if (!reducedMotion && heroConstellationOpacity + localConstellationOpacity > 0.02) {
        let links = 0;
        const maximumLinks = compact ? 76 : 128;
        const step = compact ? 16 : 13;
        for (let first = 0; first < particles.length && links < maximumLinks; first += step) {
          const firstX = positions[first * 2];
          const firstY = positions[first * 2 + 1];
          for (let second = first + step; second < particles.length && links < maximumLinks; second += step) {
            if (clusters[first] !== clusters[second]) continue;
            const distance = Math.hypot(positions[second * 2] - firstX, positions[second * 2 + 1] - firstY);
            const maximumDistance = clusters[first] < 0 ? 72 : 88;
            if (distance < 18 || distance > maximumDistance) continue;
            const opacity = clusters[first] < 0 ? heroConstellationOpacity : localConstellationOpacity;
            context.beginPath();
            context.moveTo(firstX, firstY);
            context.lineTo(positions[second * 2], positions[second * 2 + 1]);
            context.strokeStyle = `rgba(108, 255, 170, ${opacity * (1 - distance / maximumDistance)})`;
            context.lineWidth = 0.46;
            context.stroke();
            links += 1;
          }
        }
      }

      if (occluderBounds.length > 0) {
        context.globalCompositeOperation = "destination-out";
        context.globalAlpha = 1;
        context.fillStyle = "#000";
        for (const bounds of occluderBounds) {
          context.beginPath();
          context.roundRect(
            bounds.left - 1,
            bounds.top - 1,
            bounds.width + 2,
            bounds.height + 2,
            Math.min(25, bounds.width * 0.08, bounds.height * 0.08),
          );
          context.fill();
        }
      }

      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mounted]);

  return (
    <div ref={anchorRef} className="hero-particle-orb hero-particle-c" aria-hidden="true">
      <div className="hero-particle-orb__glow" />
      {mounted
        ? createPortal(<canvas ref={canvasRef} className="hero-particle-orb__canvas" />, document.body)
        : null}
    </div>
  );
}
