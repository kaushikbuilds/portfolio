import { useEffect, useRef, useState } from 'react'
import { FiMessageCircle, FiSend, FiX, FiArrowDown } from 'react-icons/fi'

// =====================================================================
// SIRF YAHAN APNI ASLI INFO BHARO. Bot sirf isi se jawab deta hai,
// is liye jo yahan likha hai wahi sach hona chahiye.
// =====================================================================
const PROFILE = {
  name: 'Kaushik Mondal',
  email: 'kaushik8653911@gmail.com', // Contact section ke LINKS.email jaisa hi rakho
  location: 'West Bengal, India',
  summary:
    'Kaushik is a frontend developer who builds clean, modern and responsive web experiences, and enjoys turning ideas into interactive, user-friendly websites.',
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'GSAP', 'Three.js', 'Node.js', 'Firebase', 'REST APIs', 'Git/GitHub', 'Figma'],
  experience: 'Kaushik has about 1.5 years of experience and has built 5+ projects.',
  dsa: 'He is practicing DSA and Java, and has solved 100+ DSA problems.',
  // TODO: apne asli projects likho, jaise 'Weather app (React, REST API)'
  projects: [],
}

const SUGGESTIONS = [
  { label: 'Skills', q: 'What are his skills?' },
  { label: 'Projects', q: 'What projects has he built?' },
  { label: 'Experience', q: 'How much experience does he have?' },
  { label: 'Contact', q: 'How can I contact him?' },
]

const has = (id) => (typeof document !== 'undefined' && document.getElementById(id) ? id : null)

// Har intent: keywords + reply. Reply me text aur optional "go" (section id) hota hai.
const INTENTS = [
  {
    words: ['hi', 'hello', 'hey', 'namaste'],
    reply: () => ({
      text: `Hi! I answer questions about ${PROFILE.name}'s portfolio. Ask about his skills, projects, experience or how to contact him.`,
    }),
  },
  {
    words: ['thanks', 'thank', 'thx'],
    reply: () => ({ text: "You're welcome!" }),
  },
  {
    words: ['who', 'about', 'yourself', 'introduce', 'background', 'tell me'],
    reply: () => ({ text: PROFILE.summary, go: has('about'), goLabel: 'Open About' }),
  },
  {
    words: ['skill', 'tech', 'stack', 'technology', 'technologies', 'language', 'framework', 'react', 'javascript', 'tailwind', 'gsap', 'node', 'html', 'css', 'three', 'firebase', 'figma'],
    reply: () => ({
      text: `Kaushik works with ${PROFILE.skills.join(', ')}.`,
      go: has('about'),
      goLabel: 'See skills',
    }),
  },
  {
    words: ['experience', 'years', 'fresher', 'how long'],
    reply: () => ({ text: PROFILE.experience }),
  },
  {
    words: ['dsa', 'java', 'algorithm', 'leetcode', 'practice', 'practicing'],
    reply: () => ({ text: PROFILE.dsa }),
  },
  {
    words: ['project', 'built', 'made', 'demo', 'portfolio work'],
    reply: () => ({
      text: PROFILE.projects.length
        ? `Here are some of his projects: ${PROFILE.projects.join('; ')}.`
        : 'You can see his projects in the Projects section.',
      go: has('projects'),
      goLabel: 'Open Projects',
    }),
  },
  {
    words: ['cv', 'resume', 'download'],
    reply: () => ({
      text: 'You can download his CV from the About section.',
      go: has('about'),
      goLabel: 'Open About',
    }),
  },
  {
    words: ['where', 'location', 'based', 'live', 'city', 'india', 'bengal'],
    reply: () => ({ text: `Kaushik is based in ${PROFILE.location}.` }),
  },
  {
    words: ['hire', 'internship', 'job', 'freelance', 'opportunity', 'opportunities', 'role', 'contact', 'email', 'mail', 'reach', 'connect', 'message'],
    reply: () => ({
      text: `The best way is the contact form, or email him at ${PROFILE.email}.`,
      go: has('contact'),
      goLabel: 'Open contact form',
    }),
  },
]

const FALLBACK = {
  text: `I don't have an answer for that yet. I can tell you about ${PROFILE.name}'s skills, projects, experience, DSA practice, location, or how to contact him.`,
}

const norm = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9+# ]/g, ' ')} `

// Baad mein asli AI lagana ho to sirf ye function badalna (Cloudflare Worker ko fetch).
// Abhi ye keyword matching se chalta hai.
const getReply = async (question) => {
  const text = norm(question)
  let best = null
  let bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const w of intent.words) {
      if (text.includes(` ${w} `) || (w.length > 3 && text.includes(w))) score++
    }
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best ? best.reply() : FALLBACK
}

const goTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  if (window.lenis) window.lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'smooth' })
}

const AskKaushik = ({ dark = true }) => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      text: `Hi! Ask me anything about ${PROFILE.name}'s portfolio.`,
    },
  ])
  const [value, setValue] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = async (question) => {
    const q = question.trim()
    if (!q || typing) return
    setMsgs((m) => [...m, { from: 'user', text: q }])
    setValue('')
    setTyping(true)
    const reply = await getReply(q)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', ...reply }])
    }, 450)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    ask(value)
  }

  const t = dark
    ? {
        panel: 'border-white/10 bg-[#0a0a0a] text-white',
        divide: 'border-white/10',
        muted: 'text-neutral-400',
        faint: 'text-neutral-500',
        bot: 'border border-white/10 bg-white/[0.05]',
        user: 'bg-white text-black',
        field: 'border-white/10 bg-white/[0.04] focus-within:border-white/40',
        chip: 'border-white/15 text-neutral-300 hover:border-white/50',
        fab: 'bg-white text-black',
        link: 'border-white/20 hover:border-white/60',
      }
    : {
        panel: 'border-black/10 bg-white text-neutral-900',
        divide: 'border-black/10',
        muted: 'text-neutral-500',
        faint: 'text-neutral-400',
        bot: 'border border-black/10 bg-black/[0.04]',
        user: 'bg-neutral-900 text-white',
        field: 'border-black/10 bg-black/[0.03] focus-within:border-black/40',
        chip: 'border-black/15 text-neutral-600 hover:border-black/50',
        fab: 'bg-neutral-900 text-white',
        link: 'border-black/20 hover:border-black/60',
      }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Panel */}
      <div
        inert={!open}
        role="dialog"
        aria-label={`Ask ${PROFILE.name}`}
        className={`absolute bottom-16 right-0 flex h-[30rem] w-[min(92vw,22rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 motion-reduce:transition-none ${t.panel} ${
          open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0'
        }`}
      >
        <div className={`flex items-center gap-3 border-b px-5 py-4 ${t.divide}`}>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Ask Kaushik</p>
            <p className={`flex items-center gap-1.5 text-xs ${t.muted}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Automated answers, not a live AI
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 ${t.muted}`}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        >
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] ${m.from === 'user' ? 'self-end' : 'self-start'}`}
            >
              <div
                className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-snug ${
                  m.from === 'user' ? `rounded-br-md ${t.user}` : `rounded-bl-md ${t.bot}`
                }`}
              >
                {m.text}
              </div>
              {m.go && (
                <button
                  type="button"
                  onClick={() => {
                    goTo(m.go)
                    setOpen(false)
                  }}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.link}`}
                >
                  {m.goLabel || 'Go there'}
                  <FiArrowDown aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
          {typing && (
            <div className={`self-start rounded-2xl rounded-bl-md px-4 py-2.5 text-sm ${t.bot} ${t.muted}`}>
              Typing…
            </div>
          )}
        </div>

        <div className={`flex gap-2 overflow-x-auto border-t px-4 py-3 [scrollbar-width:none] ${t.divide}`}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => ask(s.q)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.chip}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="px-4 pb-4">
          <div className={`flex items-center gap-2 rounded-full border py-1 pl-4 pr-1 transition-colors ${t.field}`}>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask about skills, projects…"
              aria-label="Your question"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!value.trim() || typing}
              aria-label="Send question"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 ${t.fab}`}
            >
              <FiSend aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Ask Kaushik'}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 ${t.fab}`}
      >
        {open ? <FiX aria-hidden="true" /> : <FiMessageCircle aria-hidden="true" />}
      </button>
    </div>
  )
}

export default AskKaushik