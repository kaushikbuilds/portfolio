import React, { useRef, useEffect } from "react";

/**
 * ParticleWaveBackground
 * Dotted particle grid jo waves ki tarah move karta hai.
 * `dark` prop ke hisaab se color/background change hota hai.
 *
 * Props:
 *  - dark: boolean — true = dark theme colors, false = light theme colors
 *  - spacing, dotSize, waveHeight, speed: animation tuning
 */
export default function ParticleWaveBackground({
  dark = true,
  spacing = 28,
  dotSize = 1.1,
  waveHeight = 22,
  speed = 0.02,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  // Theme ke hisaab se colors
  const color = dark ? "rgba(255,255,255,0.9)" : "rgba(20,20,20,0.55)";
  const background = dark ? "#000000" : "#f5f5f4";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, cols, rows;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      timeRef.current += speed;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;

      const cx = cols / 2;
      const cy = rows / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          const dx = i - cx;
          const dy = j - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const wave =
            Math.sin(dist * 0.4 - t * 3) * waveHeight * 0.5 +
            Math.sin(i * 0.3 + t * 2) * waveHeight * 0.3;

          const offsetY = wave;

          const sizeFactor = 0.6 + 0.4 * Math.sin(dist * 0.4 - t * 3);
          const r = Math.max(0.4, dotSize * sizeFactor);

          const alpha = 0.25 + 0.65 * Math.max(0, sizeFactor);

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y + offsetY, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(draw);
    }

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [spacing, dotSize, waveHeight, speed, color, background]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}