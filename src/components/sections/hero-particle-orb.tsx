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

function roundedRectanglePoint(
  progress: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
) {
  const cornerRadius = Math.min(radius, halfWidth, halfHeight);
  const horizontalLength = Math.max(0, halfWidth - cornerRadius) * 2;
  const verticalLength = Math.max(0, halfHeight - cornerRadius) * 2;
  const arcLength = Math.PI * cornerRadius * 0.5;
  const perimeter = horizontalLength * 2 + verticalLength * 2 + arcLength * 4;
  let distance = ((progress % 1) + 1) % 1 * perimeter;

  const line = (length: number, startX: number, startY: number, endX: number, endY: number) => {
    const ratio = length === 0 ? 0 : distance / length;
    return {
      x: mix(startX, endX, ratio),
      y: mix(startY, endY, ratio),
      normalX: startY === endY ? 0 : startX > 0 ? 1 : -1,
      normalY: startX === endX ? 0 : startY > 0 ? 1 : -1,
    };
  };
  const arc = (startAngle: number, centerX: number, centerY: number) => {
    const angle = startAngle + (distance / arcLength) * Math.PI * 0.5;
    return {
      x: centerX + Math.cos(angle) * cornerRadius,
      y: centerY + Math.sin(angle) * cornerRadius,
      normalX: Math.cos(angle),
      normalY: Math.sin(angle),
    };
  };

  if (distance <= horizontalLength) {
    return line(horizontalLength, -halfWidth + cornerRadius, -halfHeight, halfWidth - cornerRadius, -halfHeight);
  }
  distance -= horizontalLength;
  if (distance <= arcLength) return arc(-Math.PI * 0.5, halfWidth - cornerRadius, -halfHeight + cornerRadius);
  distance -= arcLength;
  if (distance <= verticalLength) {
    return line(verticalLength, halfWidth, -halfHeight + cornerRadius, halfWidth, halfHeight - cornerRadius);
  }
  distance -= verticalLength;
  if (distance <= arcLength) return arc(0, halfWidth - cornerRadius, halfHeight - cornerRadius);
  distance -= arcLength;
  if (distance <= horizontalLength) {
    return line(horizontalLength, halfWidth - cornerRadius, halfHeight, -halfWidth + cornerRadius, halfHeight);
  }
  distance -= horizontalLength;
  if (distance <= arcLength) return arc(Math.PI * 0.5, -halfWidth + cornerRadius, halfHeight - cornerRadius);
  distance -= arcLength;
  if (distance <= verticalLength) {
    return line(verticalLength, -halfWidth, halfHeight - cornerRadius, -halfWidth, -halfHeight + cornerRadius);
  }
  distance -= verticalLength;
  return arc(Math.PI, -halfWidth + cornerRadius, -halfHeight + cornerRadius);
}

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

export function HeroParticleOrb({
  logoScale = 1,
  scrollEffects = true,
}: {
  logoScale?: number;
  scrollEffects?: boolean;
} = {}) {
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
      const scrollY = scrollEffects ? window.scrollY : 0;
      const anchorBounds = anchor.getBoundingClientRect();
      const heroCenterX = anchorBounds.left + anchorBounds.width * 0.5;
      const heroCenterY = anchorBounds.top + anchorBounds.height * 0.5;
      const heroScale =
        Math.min(anchorBounds.width, anchorBounds.height) * 0.33 * logoScale;
      const travelProgress = scrollEffects
        ? reducedMotion
          ? scrollY > 24 ? 1 : 0
          : smootherstep(scrollY / Math.max(compact ? 640 : 900, height * 1.12))
        : 0;

      const contactBounds = document.getElementById("contact-particle-target")?.getBoundingClientRect();
      const contactProgress = scrollEffects && contactBounds
        ? reducedMotion
          ? contactBounds.top < height * 0.78 ? 1 : 0
          : smootherstep((height * 0.94 - contactBounds.top) / (height * 0.48))
        : 0;

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
      const travelVisibility =
        smootherstep(travelProgress) *
        (1 - smootherstep(contactProgress));
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
        const halfContactWidth = contactBounds ? contactBounds.width * 0.5 : compact ? 144 : 216;
        const halfContactHeight = contactBounds ? contactBounds.height * 0.5 : compact ? 44 : 56;
        const cornerRadius = Math.min(compact ? 25 : 31, halfContactHeight * 0.58);
        const borderProgress = particle.phase / TAU;
        const borderPoint = roundedRectanglePoint(borderProgress, halfContactWidth, halfContactHeight, cornerRadius);
        const isCornerNode = index % 10 === 0;
        const cornerIndex = Math.floor(index / 10) % 4;
        const cornerCenters = [
          { x: -halfContactWidth + cornerRadius, y: -halfContactHeight + cornerRadius },
          { x: halfContactWidth - cornerRadius, y: -halfContactHeight + cornerRadius },
          { x: halfContactWidth - cornerRadius, y: halfContactHeight - cornerRadius },
          { x: -halfContactWidth + cornerRadius, y: halfContactHeight - cornerRadius },
        ];
        const cornerAngles = [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75];
        const cornerCenter = cornerCenters[cornerIndex];
        const cornerAngle = cornerAngles[cornerIndex] + Math.sin(particle.phase * 2.7) * 0.46;
        const cornerSpread = cornerRadius + (particle.depth - 0.5) * 8;
        const borderThickness = (particle.depth - 0.5) * (compact ? 4.5 : 6.5);
        const finalBorderX = isCornerNode
          ? cornerCenter.x + Math.cos(cornerAngle) * cornerSpread
          : borderPoint.x + borderPoint.normalX * borderThickness;
        const finalBorderY = isCornerNode
          ? cornerCenter.y + Math.sin(cornerAngle) * cornerSpread
          : borderPoint.y + borderPoint.normalY * borderThickness;
        const borderFloat = reducedMotion ? 0 : Math.sin(time * 1.55 + particle.phase * 1.7) * (0.55 + particle.depth * 1.05);
        const contactParticleProgress = reducedMotion
          ? contactProgress
          : smootherstep(clamp((contactProgress - delay * 0.22) / (1 - delay * 0.22)));
        const floatingWeight = smootherstep(contactParticleProgress);
        const floatingAmplitude = (compact ? 1.7 : 2.5) * (0.55 + particle.depth * 0.85) * (isCornerNode ? 0.62 : 1);
        const floatingX = reducedMotion
          ? 0
          : (
              Math.sin(time * (0.62 + particle.speed * 0.08) + particle.phase * 1.9) * 0.64 +
              Math.cos(time * 0.37 + particle.phase * 3.2) * 0.36
            ) * floatingAmplitude * floatingWeight;
        const floatingY = reducedMotion
          ? 0
          : (
              Math.cos(time * (0.54 + particle.speed * 0.07) + particle.phase * 1.45) * 0.68 +
              Math.sin(time * 0.31 + particle.phase * 2.65) * 0.32
            ) * floatingAmplitude * 1.18 * floatingWeight;
        const contactBorderX =
          contactCenterX +
          finalBorderX +
          borderPoint.normalX * borderFloat +
          floatingX;
        const contactBorderY =
          contactCenterY +
          finalBorderY +
          borderPoint.normalY * borderFloat +
          floatingY;
        const streamSide = particle.lane < 0.5 ? -1 : 1;
        const streamOriginX = contactCenterX + streamSide * (halfContactWidth + (compact ? 54 : 112));
        const streamOriginY = contactCenterY + Math.sin(particle.phase * 1.8) * halfContactHeight * 0.56;
        const streamPull = Math.sin(contactParticleProgress * Math.PI);
        const magneticX = mix(travellingX, streamOriginX, streamPull * 0.82);
        const magneticY = mix(travellingY, streamOriginY, streamPull * 0.82);
        const baseX = mix(magneticX, contactBorderX, contactParticleProgress);
        const baseY = mix(magneticY, contactBorderY, contactParticleProgress);
        positions[index * 2] = baseX;
        positions[index * 2 + 1] = baseY;

        const color = GALAXY_PALETTE[Math.floor((particle.depth * 0.74 + particle.lane * 0.26) * GALAXY_PALETTE.length) % GALAXY_PALETTE.length];
        const twinkle = reducedMotion ? 1 : 0.7 + Math.sin(time * (1.1 + particle.speed) + particle.phase) * 0.3;
        const depthBrightness = 0.35 + depthCycle * 0.65;
        const contactIntensity = smootherstep(contactProgress);
        const alpha = clamp(
          particle.alpha *
            twinkle *
            depthBrightness *
            mix(1, isCornerNode ? 0.86 : 0.52, contactIntensity),
        );
        const size =
          particle.size *
          (0.52 + depthCycle * 1.24) *
          mix(1, isCornerNode ? 0.68 : 0.46, contactIntensity);

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
  }, [logoScale, mounted, scrollEffects]);

  return (
    <div ref={anchorRef} className="hero-particle-orb hero-particle-c" aria-hidden="true">
      <div className="hero-particle-orb__glow" />
      {mounted
        ? createPortal(<canvas ref={canvasRef} className="hero-particle-orb__canvas" />, document.body)
        : null}
    </div>
  );
}
