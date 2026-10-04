import { useEffect, useRef } from "react";

function useCinematic(ref, { direction = "up", delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = {
      up: "translateY(56px)",
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

function componentName(title) {
  return title.replace(/[^a-zA-Z0-9]+/g, "");
}

const PROJECTS = [
  {
    title: "Project One",
    description: "what it does and who it's for",
    stack: ["React", "Tailwind", "Firebase"],
    image: "https://www.vecteezy.com/free-photos/cat-pic",
    live: "",
    code: "",
  },
  {
    title: "Project Two",
    description: "what it does and who it's for",
    stack: ["JavaScript", "Node.js", "REST API"],
    image: "https://media.istockphoto.com/id/910314172/photo/portrait-of-a-surprised-cat-scottish-straight-closeup.jpg?s=1024x1024&w=is&k=20&c=bsb9QLzNtvSfhHxNknYRL_XHSyPUoze8-Y3FUEz3Z4g=",
    live: "https://www.instagram.com/?hl=en",
    code: "",
  },
  {
    title: "Project Three",
    description: "what it does and who it's for",
    stack: ["React", "Three.js", "GSAP"],
    image: "",
    live: "",
    code: "",
  },
];

function CodePanel({ project, dark }) {
  const c = dark
    ? { tag: "#61DAFB", attr: "#9CDCFE", str: "#CE9178", comment: "#6A9955", punct: "rgba(255,255,255,0.55)", num: "rgba(255,255,255,0.25)" }
    : { tag: "#0B7285", attr: "#8250DF", str: "#116329", comment: "#6E7781", punct: "rgba(0,0,0,0.5)", num: "rgba(0,0,0,0.3)" };

  const Line = ({ n, children }) => (
    <div className="flex gap-4">
      <span className="w-4 text-right select-none shrink-0" style={{ color: c.num }}>{n}</span>
      <span className="flex-1 whitespace-pre-wrap break-all">{children}</span>
    </div>
  );

  const name = componentName(project.title);

  return (
    <pre className="font-mono text-[12.5px] leading-relaxed">
      <code>
        <Line n={1}>
          <span style={{ color: c.punct }}>function </span>
          <span style={{ color: c.tag }}>{name}</span>
          <span style={{ color: c.punct }}>() {"{"}</span>
        </Line>
        <Line n={2}><span style={{ color: c.punct }}>&nbsp;&nbsp;return (</span></Line>
        <Line n={3}>
          <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;</span>
          <span style={{ color: c.tag }}>ProjectCard</span>
        </Line>
        <Line n={4}>
          <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span style={{ color: c.attr }}>title</span>
          <span style={{ color: c.punct }}>=</span>
          <span style={{ color: c.str }}>"{project.title}"</span>
        </Line>
        <Line n={5}>
          <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span style={{ color: c.attr }}>stack</span>
          <span style={{ color: c.punct }}>={"{["}</span>
          {project.stack.map((s, i) => (
            <span key={s}>
              <span style={{ color: c.str }}>"{s}"</span>
              {i < project.stack.length - 1 && <span style={{ color: c.punct }}>, </span>}
            </span>
          ))}
          <span style={{ color: c.punct }}>{"]}"}</span>
        </Line>
        {project.live && (
          <Line n={6}>
            <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span style={{ color: c.attr }}>live</span>
            <span style={{ color: c.punct }}>=</span>
            <span style={{ color: c.str }}>"{project.live}"</span>
          </Line>
        )}
        <Line n={7}><span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&gt;</span></Line>
        <Line n={8}>
          <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span style={{ color: c.comment, fontStyle: "italic" }}>{"{/* " + project.description + " */}"}</span>
        </Line>
        <Line n={9}>
          <span style={{ color: c.punct }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/</span>
          <span style={{ color: c.tag }}>ProjectCard</span>
          <span style={{ color: c.punct }}>&gt;</span>
        </Line>
        <Line n={10}><span style={{ color: c.punct }}>&nbsp;&nbsp;);</span></Line>
        <Line n={11}><span style={{ color: c.punct }}>{"}"}</span></Line>
      </code>
    </pre>
  );
}

// ─── One project entry: code + live preview split ───────────────────────────
function ProjectEntry({ project, dark, delay }) {
  const ref = useRef(null);
  useCinematic(ref, { direction: "up", delay });

  return (
    <div
      ref={ref}
      className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
        dark
          ? "bg-white/[0.03] border-white/10 hover:border-[#61DAFB]/40"
          : "bg-white border-black/8 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="grid md:grid-cols-2">
        {/* Code side */}
        <div className={`p-5 md:border-r ${dark ? "border-white/10" : "border-black/8"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: "#61DAFB" }} />
            <span className={`font-mono text-[11px] ${dark ? "text-white/40" : "text-gray-400"}`}>
              {componentName(project.title)}.jsx
            </span>
          </div>
          <CodePanel project={project} dark={dark} />
        </div>

        {/* Live preview side */}
        <div className="flex flex-col">
          <div className={`flex items-center gap-2 px-5 py-3 border-b ${dark ? "border-white/10" : "border-black/8"}`}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
            <span className={`font-mono text-[11px] ${dark ? "text-white/40" : "text-gray-400"}`}>
              Live preview
            </span>
          </div>
          <div className={`relative flex-1 min-h-[200px] ${dark ? "bg-white/[0.02]" : "bg-black/[0.03]"}`}>
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-mono text-xs ${dark ? "text-white/20" : "text-black/20"}`}>
                  &lt;{componentName(project.title)} /&gt;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer status bar */}
      <div className={`flex items-center justify-between px-5 py-3 border-t font-mono text-[11px] ${dark ? "border-white/10 text-white/40" : "border-black/8 text-gray-400"}`}>
        <span>{project.title}</span>
        <div className="flex items-center gap-4">
          {project.code && (
            <a href={project.code} target="_blank" rel="noreferrer" className="hover:text-[#61DAFB] transition-colors">
              source
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="hover:text-[#61DAFB] transition-colors">
              live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ dark = true }) {
  const headingRef = useRef(null);
  useCinematic(headingRef, { direction: "up", delay: 0 });

  return (
    <section
      id="projects"
      className={`relative py-24 px-6 transition-colors duration-300 ${dark ? "" : "bg-gray-50"}`}
    >
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${dark ? "text-white/35" : "text-gray-400"}`}>
            Selected work
          </p>
          <h2 className={`text-4xl sm:text-5xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            My <span className={dark ? "text-white/30" : "text-gray-400"}>Projects</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectEntry key={p.title} project={p} dark={dark} delay={0.1 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}