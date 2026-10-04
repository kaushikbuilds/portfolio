import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUp, FiMail } from 'react-icons/fi'

const LINKS = {
  email: 'kaushik8653911@gmail.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://linkedin.com/in/your-username',
}

const toTop = () => {
  if (window.lenis) window.lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

const Footer = ({ dark = true }) => {
  const t = dark
    ? {
        text: 'text-white',
        muted: 'text-neutral-400',
        faint: 'text-neutral-600',
        line: 'border-white/10',
        icon: 'text-neutral-400 hover:text-white',
        pill: 'border-white/15 text-neutral-300 hover:border-white/50 hover:text-white',
      }
    : {
        text: 'text-neutral-900',
        muted: 'text-neutral-500',
        faint: 'text-neutral-400',
        line: 'border-black/10',
        icon: 'text-neutral-500 hover:text-neutral-900',
        pill: 'border-black/15 text-neutral-600 hover:border-black/50 hover:text-neutral-900',
      }

  return (
    <footer className={`relative border-t px-4 py-8 sm:px-10 ${t.line}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className={`text-sm ${t.text}`}>
            © {new Date().getFullYear()} Kaushik Mondal
          </p>
          <p className={`mt-1 font-mono text-xs ${t.faint}`}>
            Built with React, GSAP &amp; Tailwind
          </p>
        </div>

        <div className="flex items-center gap-5">
          <a
            href={`mailto:${LINKS.email}`}
            aria-label="Email"
            className={`text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${t.icon}`}
          >
            <FiMail />
          </a>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${t.icon}`}
          >
            <FaGithub />
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={`text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${t.icon}`}
          >
            <FaLinkedinIn />
          </a>

          <button
            type="button"
            onClick={toTop}
            className={`group ml-1 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.pill}`}
          >
            Back to top
            <FiArrowUp
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer