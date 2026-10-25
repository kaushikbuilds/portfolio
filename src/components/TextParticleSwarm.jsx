import React, { useRef, useEffect } from "react";

/**
 * ParticleTextHero
 * "Swarm of points" text animation — particles assemble into the given text
 * shape, phir periodically apne aap explode (bikhar) hote hain aur smoothly
 * wapas text shape me assemble ho jaate hain — ek continuous loop me.
 *
 * Props:
 *  - text: jo text particles se banega
 *  - dark: theme (true = white dots on black, false = dark dots on light)
 *  - fontSize: text ka relative size (px)
 *  - holdDuration: text shape me kitni der particles ruke rahein (seconds)
 *  - explodeDuration: explode/scatter hone me kitna time lage (seconds)
 *  - reassembleDuration: wapas assemble hone me kitna time lage (seconds)
 */
export default function TextParticleSwarm({
  text = "I'M KAUSHIK",
  dark = true,
  fontSize = 120,
  holdDuration = 2.2,
  explodeDuration = 0.9,
  reassembleDuration = 1.4,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    let particles = [];
    let rafId;

    const dotColor = dark ? "255,255,255" : "20,20,20";

    // Cycle phases: hold -> exploding -> scattered-hold -> reassembling -> hold ...
    const PHASE = {
      HOLD: "hold",
      EXPLODING: "exploding",
      REASSEMBLING: "reassembling",
    };
    let phase = PHASE.HOLD;
    let phaseTime = 0;
    const scatteredHold = 0.5; // thoda time scattered state me bhi ruke

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d");

      const scaledFont = Math.min(fontSize, width / (text.length * 0.62));

      octx.fillStyle = "#fff";
      octx.font = `800 ${scaledFont}px Arial, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(text, width / 2, height / 2);

      const imageData = octx.getImageData(0, 0, width, height).data;

      const gap = 4;
      const points = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const idx = (y * width + x) * 4;
          const alpha = imageData[idx + 3];
          if (alpha > 128) {
            points.push({ x, y });
          }
        }
      }

      const prevLen = particles.length;
      for (let i = 0; i < points.length; i++) {
        // har particle ko ek random "explode direction/distance" assign karte hain
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 260;
        const explodeX = points[i].x + Math.cos(angle) * dist;
        const explodeY = points[i].y + Math.sin(angle) * dist;

        if (i < prevLen) {
          particles[i].tx = points[i].x;
          particles[i].ty = points[i].y;
          particles[i].ex = explodeX;
          particles[i].ey = explodeY;
        } else {
          particles.push({
            x: points[i].x,
            y: points[i].y,
            tx: points[i].x,
            ty: points[i].y,
            ex: explodeX,
            ey: explodeY,
            sx: points[i].x, // scatter-start position (jab reassemble shuru ho)
            sy: points[i].y,
            r: 1 + Math.random() * 1.2,
            wanderSeed: Math.random() * 1000,
          });
        }
      }
      if (points.length < particles.length) {
        particles.length = points.length;
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    let t = 0;
    let lastTime = performance.now();

    function draw(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;
      phaseTime += dt;

      ctx.clearRect(0, 0, width, height);

      // Phase transitions
      if (phase === PHASE.HOLD && phaseTime > holdDuration) {
        phase = PHASE.EXPLODING;
        phaseTime = 0;
      } else if (
        phase === PHASE.EXPLODING &&
        phaseTime > explodeDuration + scatteredHold
      ) {
        phase = PHASE.REASSEMBLING;
        phaseTime = 0;
        // reassemble ke liye current (scattered) position ko start point bana do
        for (const p of particles) {
          p.sx = p.x;
          p.sy = p.y;
        }
      } else if (phase === PHASE.REASSEMBLING && phaseTime > reassembleDuration) {
        phase = PHASE.HOLD;
        phaseTime = 0;
      }

      for (const p of particles) {
        const wanderX = Math.sin(t * 1.4 + p.wanderSeed) * 0.5;
        const wanderY = Math.cos(t * 1.1 + p.wanderSeed) * 0.5;

        if (phase === PHASE.HOLD) {
          // text shape me settled, halka organic wander
          p.x += (p.tx + wanderX - p.x) * 0.15;
          p.y += (p.ty + wanderY - p.y) * 0.15;
        } else if (phase === PHASE.EXPLODING) {
          const progress = Math.min(phaseTime / explodeDuration, 1);
          const eased = easeOutQuart(progress);
          p.x = p.tx + (p.ex - p.tx) * eased + wanderX;
          p.y = p.ty + (p.ey - p.ty) * eased + wanderY;
        } else if (phase === PHASE.REASSEMBLING) {
          const progress = Math.min(phaseTime / reassembleDuration, 1);
          const eased = easeInOutCubic(progress);
          p.x = p.sx + (p.tx - p.sx) * eased;
          p.y = p.sy + (p.ty - p.sy) * eased;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${dotColor},0.85)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [text, dark, fontSize, holdDuration, explodeDuration, reassembleDuration]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/**
 * Usage:
 * <section className="relative w-full h-[40vh]">
 *   <ParticleTextHero text="I'M KAUSHIK" dark={dark} />
 * </section>
 */