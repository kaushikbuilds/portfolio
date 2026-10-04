
import { useState, useEffect, useRef } from "react";

// ─── Cinematic scroll reveal hook ───────────────────────────────────────────
function useCinematic(ref, { direction = "up", delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = {
      up: "translateY(56px)",
      down: "translateY(-56px)",
      left: "translateX(-70px)",
      right: "translateX(70px)",
      scale: "scale(0.85)",
    };
    el.style.opacity = "0";
    el.style.transform = t[direction] || t.up;
    el.style.transition = `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translate(0,0) scale(1)";
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

// ─── Orbiting Skills Component ──────────────────────────────────────────────
const ORBIT_RINGS = [
  {
    radius: 130,
    speed: 18,   // seconds per revolution
    skills: [
      { name: "React", color: "#61DAFB" },
      { name: "Node.js", color: "#68A063" },
      { name: "Three.js", color: "#ffffff" },
      { name: "HTML", color: "#E34F26" },
    ],
  },
  {
    radius: 185,
    speed: 28,
    reverse: true,
    skills: [
      { name: "JavaScript", color: "#F7DF1E" },
      { name: "GSAP", color: "#88CE02" },
      { name: "Tailwind", color: "#38BDF8" },
      { name: "GitHub", color: "#ffffff" },
      { name: "Git", color: "#F05032" },
    ],
  },
  {
    radius: 242,
    speed: 40,
    skills: [
      { name: "CSS", color: "#1572B6" },
      { name: "Figma", color: "#F24E1E" },
      { name: "REST API", color: "#ffffff" },
      { name: "Firebase", color: "#ffca28" },
    ],
  },
];

function OrbitSkills({ dark, photoSrc }) {
  const size = 560; // canvas logical size
  const center = size / 2;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        maxWidth: "100%",
      }}
    >
      {/* ── Orbit ring tracks ── */}
      {ORBIT_RINGS.map((ring, ri) => (
        <div
          key={ri}
          style={{
            position: "absolute",
            top: center - ring.radius,
            left: center - ring.radius,
            width: ring.radius * 2,
            height: ring.radius * 2,
            borderRadius: "50%",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
          }}
        />
      ))}

      {/* ── Spinning skill badges ── */}
      {ORBIT_RINGS.map((ring, ri) =>
        ring.skills.map((skill, si) => {
          const count = ring.skills.length;
          const angleOffset = (si / count) * 360;
          return (
            <SkillOrbitBadge
              key={`${ri}-${si}`}
              skill={skill}
              radius={ring.radius}
              center={center}
              speed={ring.speed}
              reverse={ring.reverse}
              angleOffset={angleOffset}
              dark={dark}
            />
          );
        })
      )}

      {/* ── Center photo with glowing ring ── */}
      <div
        style={{
          position: "absolute",
          top: center - 80,
          left: center - 80,
          width: 160,
          height: 160,
        }}
      >
        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: "50%",
            background: dark
              ? "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Spinning conic border */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", padding: 3, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: dark
                ? "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.9) 60deg, transparent 120deg, transparent 180deg, rgba(255,255,255,0.4) 240deg, transparent 300deg)"
                : "conic-gradient(from 0deg, transparent 0deg, rgba(80,80,80,0.7) 60deg, transparent 120deg, transparent 180deg, rgba(80,80,80,0.3) 240deg, transparent 300deg)",
              animation: "spinRing 3s linear infinite",
            }}
          />
        </div>
        {/* Photo */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 2,
            background: dark ? "#1e1e22" : "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 800,
            color: dark ? "white" : "#333",
          }}
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt="Kaushik"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : "KM"}
        </div>
      </div>

      <style>{`
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function SkillOrbitBadge({ skill, radius, center, speed, reverse, angleOffset, dark }) {
  const ref = useRef(null);
  const angle = useRef(angleOffset);
  const raf = useRef(null);

  useEffect(() => {
    let last = null;
    const degreesPerSecond = 360 / speed;

    function tick(ts) {
      if (last !== null) {
        const dt = (ts - last) / 1000;
        angle.current += (reverse ? -1 : 1) * degreesPerSecond * dt;
      }
      last = ts;

      const rad = (angle.current * Math.PI) / 180;
      const x = center + Math.cos(rad) * radius;
      const y = center + Math.sin(rad) * radius;

      if (ref.current) {
        ref.current.style.transform = `translate(${x - center}px, ${y - center}px) translate(-50%, -50%)`;
      }

      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [radius, center, speed, reverse]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: center,
        left: center,
        willChange: "transform",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border: `1px solid ${skill.color}55`,
          borderRadius: 999,
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          gap: 5,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          whiteSpace: "nowrap",
          boxShadow: `0 0 10px ${skill.color}33`,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: skill.color,
            boxShadow: `0 0 6px ${skill.color}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)",
            fontFamily: "sans-serif",
          }}
        >
          {skill.name}
        </span>
      </div>
    </div>
  );
}

// ─── Skill Bar ───────────────────────────────────────────────────────────────
function SkillBar({ name, level, dark, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setAnimated(true), delay * 1000 + 300);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-medium ${dark ? "text-white/70" : "text-gray-600"}`}>{name}</span>
        <span className={`text-xs ${dark ? "text-white/40" : "text-gray-400"}`}>{level}%</span>
      </div>
      <div className={`w-full h-1.5 rounded-full ${dark ? "bg-white/10" : "bg-black/8"}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${dark ? "bg-white" : "bg-gray-800"}`}
          style={{ width: animated ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
}

// ─── Bento Card ──────────────────────────────────────────────────────────────
function Card({ children, className = "", dark, direction = "up", delay = 0 }) {
  const ref = useRef(null);
  useCinematic(ref, { direction, delay });
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-5 border transition-all duration-300 ${dark
        ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
        : "bg-white border-black/8 shadow-sm hover:shadow-md"
        } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── MAIN About Component ─────────────────────────────────────────────────────
export default function About({ dark = true }) {
  const headingRef = useRef(null);
  const orbitRef = useRef(null);
  useCinematic(headingRef, { direction: "up", delay: 0 });
  useCinematic(orbitRef, { direction: "scale", delay: 0.2 });

  const SKILLS = [
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 90 },
    { name: "JavaScript", level: 80 },
    { name: "Taliwind CSS", level: 90 },
    { name: "React.js", level: 70 },
    { name: "GSAP", level: 70 },
    { name: "Git/GitHub", level: 75 },
  ];

  return (
    <section
      id="about"
      className={`relative py-24 px-6 overflow-hidden transition-colors duration-300 ${dark ? "" : "bg-gray-50"
        }`}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16">
          <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${dark ? "text-white/35" : "text-gray-400"}`}>
            Get to know me
          </p>
          <h2 className={`text-4xl sm:text-5xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            About <span className={dark ? "text-white/30" : "text-gray-400"}>Me</span>
          </h2>
        </div>

        {/* ── Row 1: Orbit + Bio ── */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-8">

          {/* Orbit */}
          <div ref={orbitRef} className="shrink-0 flex items-center justify-center w-full lg:w-auto overflow-hidden">
            <div style={{ transform: "scale(0.75)", transformOrigin: "center" }} className="sm:scale-100">
              <OrbitSkills dark={dark} photoSrc="/Kaushik.jpg" />
            </div>
          </div>

          {/* Bio + stats */}
          <div className="flex-1 flex flex-col gap-4 w-full">

            {/* Bio */}
            <Card dark={dark} direction="right" delay={0.3}>
              <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${dark ? "text-white/35" : "text-gray-400"}`}>
                Who am I
              </p>
              <h3 className={`text-2xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                Hi, I'm Kaushik Mondal 👋
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${dark ? "text-white/60" : "text-gray-600"}`}>
                Passionate Frontend Developer focused on building clean, modern,
                and responsive web experiences . I enjoy turning ideas into interactive and 
                user-friendly websites.
              </p>
              <a
                href="/Kaushik_CV.pdf"
                download
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 ${dark ? "bg-white text-black" : "bg-black text-white"
                  }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download CV
              </a>
            </Card>

            {/* Stats */}
            <Card dark={dark} direction="right" delay={0.45}>
              <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "text-white/35" : "text-gray-400"}`}>
                By the numbers
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "1.5+", label: "Years Exp." },
                  { value: "5+", label: "Projects" },
                  { value: "100+", label: "DSA Problems" },
                  { value: "10+", label: "Tech Stack" },
                ].map((s) => (
                  <div key={s.label} className={`text-center p-3 rounded-xl ${dark ? "bg-white/5" : "bg-black/4"}`}>
                    <div className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{s.value}</div>
                    <div className={`text-xs mt-0.5 ${dark ? "text-white/40" : "text-gray-400"}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Row 2: Skill bars + Currently ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Card dark={dark} direction="left" delay={0.5}>
            <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "text-white/35" : "text-gray-400"}`}>
              Proficiency
            </p>
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} dark={dark} delay={0.08 * i} />
            ))}
          </Card>

          <Card dark={dark} direction="right" delay={0.6}>
            <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "text-white/35" : "text-gray-400"}`}>
              Currently Focus
            </p>
            <div className="space-y-3">
              {[
                ["🚀", "Building modern web applications"],  
                ["⚡", "Learning GSAP & Three.js"],
                ["🎯", "Practicing DSA & Java"],
                ["🌍", "Based in West Bengal, India"],
              ].map(([icon, text], i) => (
                <div
                  key={text}
                  className="flex items-center gap-3 opacity-0"
                  style={{ animation: `fadeInUp 0.5s ease ${0.7 + i * 0.1}s forwards` }}
                >
                  <span className="text-base">{icon}</span>
                  <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </section>
  );
}