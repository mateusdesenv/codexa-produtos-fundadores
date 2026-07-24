"use client";

import { useEffect, useRef } from "react";

const LOGO_PATH =
  "/assets/codexa/homepage-products/brand/logo-icon-only.png";

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function StaticParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    const draw = () => {
      if (disposed || !image.complete || !image.naturalWidth) return;

      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const sampleSize = 256;
      const sampleCanvas = document.createElement("canvas");
      const sampleContext = sampleCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!sampleContext) return;

      sampleCanvas.width = sampleSize;
      sampleCanvas.height = sampleSize;
      sampleContext.drawImage(image, 0, 0, sampleSize, sampleSize);
      const imageData = sampleContext.getImageData(
        0,
        0,
        sampleSize,
        sampleSize,
      );
      const pixels: Array<{ x: number; y: number }> = [];
      let minimumX = sampleSize;
      let maximumX = 0;
      let minimumY = sampleSize;
      let maximumY = 0;

      for (let y = 0; y < sampleSize; y += 2) {
        for (let x = 0; x < sampleSize; x += 2) {
          const index = (y * sampleSize + x) * 4;
          const red = imageData.data[index];
          const green = imageData.data[index + 1];
          const blue = imageData.data[index + 2];
          const alpha = imageData.data[index + 3];

          if (
            alpha <= 70 ||
            green <= 70 ||
            green <= red * 1.12 ||
            green <= blue * 1.12
          ) {
            continue;
          }

          pixels.push({ x, y });
          minimumX = Math.min(minimumX, x);
          maximumX = Math.max(maximumX, x);
          minimumY = Math.min(minimumY, y);
          maximumY = Math.max(maximumY, y);
        }
      }

      if (!pixels.length) return;

      const random = seededRandom(20260724);
      const centerX = (minimumX + maximumX) * 0.5;
      const centerY = (minimumY + maximumY) * 0.5;
      const sourceScale = Math.max(
        maximumX - minimumX,
        maximumY - minimumY,
      );
      const targetScale = Math.min(width, height) * 0.7;
      const particleCount = Math.min(1550, pixels.length * 2);
      const palette = [
        [32, 232, 120],
        [108, 255, 170],
        [205, 255, 226],
        [86, 209, 231],
      ];

      context.globalCompositeOperation = "lighter";
      context.shadowBlur = Math.max(3, width * 0.012);

      for (let index = 0; index < particleCount; index += 1) {
        const point = pixels[Math.floor(random() * pixels.length)];
        const jitter = targetScale * 0.0045;
        const x =
          width * 0.5 +
          ((point.x - centerX) / sourceScale) * targetScale +
          (random() - 0.5) * jitter;
        const y =
          height * 0.5 +
          ((point.y - centerY) / sourceScale) * targetScale +
          (random() - 0.5) * jitter;
        const color = palette[Math.floor(random() * palette.length)];
        const alpha = 0.42 + random() * 0.54;
        const radius = Math.max(0.55, width * (0.0023 + random() * 0.002));

        context.beginPath();
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, .4)`;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      context.shadowBlur = 0;
    };

    image.onload = draw;
    image.src = LOGO_PATH;
    resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className="portfolio-particle-logo" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
