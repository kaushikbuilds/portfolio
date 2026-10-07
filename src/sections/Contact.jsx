import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUpRight, FiCheck, FiCopy } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

// TODO: apni asli details daalo
const LINKS = {
  email: 'kaushik8653911@gmail.com',
  github: 'https://github.com/kaushikbuilds',
  linkedin: 'https://linkedin.com/in/your-username',
}

const EMAILJS = {
  serviceId:  'service_ce0jq9p',
  templateId: 'template_64uwm6v',
  publicKey: 'Z628VhGBTQHja8JPM',
}
const EMPTY = { name: '', email: '' }
const PHRASES = ["Let's work together", 'Open for internships', 'Freelance projects', 'Say hello']

const css = `
@keyframes ct-marquee { to { transform: translateX(-50%) } }
@keyframes ct-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
.ct-marquee { animation: ct-marquee 36s linear infinite }
.ct-marquee:hover { animation-play-state: paused }
.ct-in { animation: ct-in .6s ease-out both }
@media (prefers-reduced-motion: reduce) { .ct-marquee, .ct-in { animation: none } }
`

const Contact = ({ dark = true }) => {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const bodyRef = useRef(null)

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [sentName, setSentName] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [copied, setCopied] = useState(false)
  const [time, setTime] = useState('')

  const done = status === 'sent'

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      }).format(new Date())
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 30000)
    return () => clearInterval(id)
  }, [])

  // "Me" scroll pe grey se white
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ct-fill',
        { color: dark ? '#525252' : '#a3a3a3' },
        {
          color: dark ? '#ffffff' : '#111111',
          ease: 'none',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [dark])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      // 1) Heading: label upar aata hai, phir words mask se ooper uthte hain, phir marquee left se khulta hai
      gsap
        .timeline({ scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true } })
        .from('.ct-eyebrow', { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' })
        .from('.ct-word', { yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.12, clearProps: 'transform' }, '-=0.3')
        .fromTo(
          '.ct-marquee-wrap',
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath,opacity' },
          '-=0.4'
        )

    
      gsap
        .timeline({ scrollTrigger: { trigger: bodyRef.current, start: 'top 82%', once: true } })
        .from('.ct-l', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' })
        .from('.ct-row', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, clearProps: 'transform,opacity' }, 0.1)
        .fromTo(
          '.ct-send',
          { clipPath: 'inset(0 50% 0 50% round 9999px)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0% round 9999px)', opacity: 1, duration: 0.9, ease: 'power3.out', clearProps: 'clipPath,opacity' },
          '-=0.3'
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const set = (key) => (e) => {
    if (status === 'error') setStatus('idle')
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const { serviceId, templateId, publicKey } = EMAILJS
    if ([serviceId, templateId, publicKey].some((k) => !k || k.startsWith('YOUR_'))) {
      console.error('EmailJS keys not set. Fill the EMAILJS object at the top of Contact.jsx.')
      setError('EmailJS keys not set in Contact.jsx')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name.trim(),
          reply_to: form.email.trim(),
          message: 'New contact request from your portfolio.',
        },
        { publicKey }
      )
      setSentName(form.name.trim().split(' ')[0])
      setSentTo(form.email.trim())
      setForm(EMPTY)
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS error:', err)
      setError('Could not send. Please try again.')
      setStatus('error')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: mailto link still works */
    }
  }

  const t = dark
    ? {
        text: 'text-white',
        fillBase: 'text-neutral-600',
        muted: 'text-neutral-400',
        faint: 'text-neutral-500',
        line: 'border-white/10',
        lineHot: 'bg-white',
        rowHover: 'hover:bg-white/[0.025]',
        numOn: 'group-focus-within/row:text-white',
        ph: 'placeholder:text-neutral-700',
        stroke: 'rgba(255,255,255,0.3)',
        btn: 'bg-white text-black',
        btnCircle: 'bg-black text-white',
        ghost: 'border-white/15 hover:border-white/50 hover:bg-white/[0.04]',
      }
    : {
        text: 'text-neutral-900',
        fillBase: 'text-neutral-400',
        muted: 'text-neutral-500',
        faint: 'text-neutral-400',
        line: 'border-black/10',
        lineHot: 'bg-neutral-900',
        rowHover: 'hover:bg-black/[0.025]',
        numOn: 'group-focus-within/row:text-neutral-900',
        ph: 'placeholder:text-neutral-300',
        stroke: 'rgba(0,0,0,0.3)',
        btn: 'bg-neutral-900 text-white',
        btnCircle: 'bg-white text-neutral-900',
        ghost: 'border-black/15 hover:border-black/50 hover:bg-black/[0.04]',
      }

  const row = `ct-row group/row relative grid grid-cols-[auto_1fr] gap-x-5 border-b px-2 py-7 transition-colors sm:gap-x-8 sm:px-4 sm:py-9 ${t.line} ${t.rowHover}`
  const num = `pt-1.5 font-mono text-xs transition-colors sm:pt-3 ${t.faint} ${t.numOn}`
  const q = `block text-sm ${t.faint}`
  const bigField = `mt-1 w-full bg-transparent text-3xl font-medium tracking-tight outline-none sm:text-4xl ${t.ph}`
  const hot = `pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within/row:scale-x-100 ${t.lineHot}`
  const pill = `inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ghost}`

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden px-4 py-28 sm:px-10">
      <style>{css}</style>

      <div ref={headRef} className="text-center">
        <p className={`ct-eyebrow text-xs font-semibold tracking-[0.2em] ${t.faint}`}>SAY HELLO</p>
        <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <span className={`ct-word inline-block ${t.text}`}>Contact</span>
          </span>{' '}
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <span className={`ct-word ct-fill inline-block ${t.fillBase}`}>Me</span>
          </span>
        </h2>
      </div>

      {/* Giant outlined marquee */}
      <div
        aria-hidden="true"
        className="ct-marquee-wrap mt-16 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="ct-marquee flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
              {PHRASES.map((p) => (
                <span key={p} className="flex items-center gap-8">
                  <span
                    className="text-6xl font-black tracking-tight sm:text-8xl"
                    style={{ WebkitTextStroke: `1px ${t.stroke}`, color: 'transparent' }}
                  >
                    {p}
                  </span>
                  <span className={`text-3xl ${t.text}`}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div ref={bodyRef} className="mx-auto mt-20 grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ---------- Left: direct contact ---------- */}
        <div className={`lg:col-span-5 ${t.text}`}>
          <p className={`ct-l text-xs font-semibold tracking-[0.2em] ${t.faint}`}>OR WRITE DIRECTLY</p>

          <a
            href={`mailto:${LINKS.email}`}
            className="ct-l group mt-4 inline-flex items-start gap-2 break-all text-3xl font-semibold tracking-tight underline-offset-8 hover:underline sm:text-4xl"
          >
            {LINKS.email}
            <FiArrowUpRight
              aria-hidden="true"
              className="mt-1 shrink-0 text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>

          <div className="ct-l mt-5">
            <button type="button" onClick={copyEmail} className={pill}>
              {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
          </div>

          <div className={`ct-l mt-12 border-t ${t.line}`}>
            <div className={`flex items-center justify-between gap-4 border-b py-4 ${t.line}`}>
              <span className={`text-sm ${t.faint}`}>Based in</span>
              <span className="text-right">
                West Bengal, India
                <span className={`ml-2 font-mono text-xs ${t.muted}`}>{time || '--'} IST</span>
              </span>
            </div>
            <div className={`flex items-center justify-between gap-4 border-b py-4 ${t.line}`}>
              <span className={`text-sm ${t.faint}`}>Status</span>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </span>
            </div>
          </div>

          <div className="ct-l mt-8 flex flex-wrap gap-3">
            <a href={LINKS.github} target="_blank" rel="noreferrer" className={pill}>
              <FaGithub aria-hidden="true" />
              GitHub
              <FiArrowUpRight aria-hidden="true" className={t.muted} />
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className={pill}>
              <FaLinkedinIn aria-hidden="true" />
              LinkedIn
              <FiArrowUpRight aria-hidden="true" className={t.muted} />
            </a>
          </div>
        </div>

        {/* ---------- Right: form ---------- */}
        <div className={`lg:col-span-7 ${t.text}`}>
          {done ? (
            <div className="ct-in flex h-full flex-col justify-center py-6">
              <p className="text-5xl font-bold tracking-tight sm:text-7xl">
                Thank you,
                <br />
                {sentName}.
              </p>
              <p className={`mt-6 flex items-center gap-2 text-lg ${t.muted}`}>
                <FiCheck aria-hidden="true" className="text-emerald-500" />
                Sent. I will reply to {sentTo} soon.
              </p>
              <div className="mt-8">
                <button type="button" onClick={() => setStatus('idle')} className={pill}>
                  Write another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className={`border-t ${t.line}`}>
                <label className={row}>
                  <span className={num}>01</span>
                  <span>
                    <span className={q}>What&apos;s your name?</span>
                    <input
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set('name')}
                      className={bigField}
                    />
                  </span>
                  <span className={hot} />
                </label>

                <label className={row}>
                  <span className={num}>02</span>
                  <span>
                    <span className={q}>Where can I reply?</span>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="you@gmail.com"
                      value={form.email}
                      onChange={set('email')}
                      className={bigField}
                    />
                  </span>
                  <span className={hot} />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`ct-send group mt-8 flex w-full items-center justify-between rounded-full py-3 pl-8 pr-3 text-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${t.btn}`}
              >
                {status === 'sending' ? 'Sending…' : 'Get in touch'}
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-transform duration-300 group-hover:rotate-45 ${t.btnCircle}`}
                >
                  {status === 'sending' ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <FiArrowUpRight aria-hidden="true" />
                  )}
                </span>
              </button>

              <p role="alert" className="mt-3 min-h-5 pl-2 text-sm text-red-500">
                {status === 'error' && error}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Contact