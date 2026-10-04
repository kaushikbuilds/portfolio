import React, { useState, useEffect } from "react";
import KMLogo from "./KMLogo";

/**
 * Navbar - "Simple Navbar with Hover Effects" (DevStudio) style
 * Reference: Aceternity UI navbar component
 *
 * Desktop: pill-shaped bar, logo left, flat inline links center,
 *          sun/moon toggle, CTA pill button right.
 * Mobile: links + button hide, hamburger se slide-down menu khulta hai.
 * Dark/light mode: navbar khud bhi background/text badalta hai, na sirf icon.
 *
 * IMPORTANT: Iske kaam karne ke liye tailwind.config.js me
 *   darkMode: "class"
 * set hona zaroori hai.
 */

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  {label: "Contact", href: "#contact"}
];

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="w-full flex justify-center px-4 pt-4 relative z-50">
      <nav className="w-full max-w-5xl bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md rounded-full px-4 sm:px-6 py-3 flex items-center justify-between border border-black/10 dark:border-white/10 shadow-lg transition-colors duration-300">
        {/* Logo */}
        <a href="#home" className="flex items-center  shrink-0">
          <KMLogo className="w-13 h-13" /> {/* ← Ekdam clean component call! */}
        </a>
    

        {/* Desktop nav links - flat, no pill background */}
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-black/70 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Dark mode toggle + Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
          >
            {dark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-all duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block w-5 h-0.5 bg-black dark:bg-white rounded-full transition-transform duration-300 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-black dark:bg-white rounded-full transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-black dark:bg-white rounded-full transition-transform duration-300 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel - floats below the pill navbar */}
      <div
        className={`md:hidden absolute top-20 w-[calc(100%-2rem)] max-w-5xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-md rounded-3xl border border-black/10 dark:border-white/10 shadow-lg overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-black/80 dark:text-white/90 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
              className="w-11 h-11 flex items-center justify-center rounded-full text-black/70 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 shrink-0"
            >
              {dark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="flex-1 text-center bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-5 py-3 rounded-full"
            >
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}



  
 