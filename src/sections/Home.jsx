import React, { useState, useEffect } from "react";
import ParticleTextHero from "../components/TextParticleSwarm";

function TextReveal({ text, dark, delay = 0, className = "" }) {
  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-word-reveal"
          style={{
            animationDelay: `${delay + i * 0.09}s`,
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}

function Home({ dark }) {
  return (
    <section
      id="home"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6"
    >
      <style>{`
        @keyframes word-reveal {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-word-reveal {
          animation: word-reveal 0.6s ease-out forwards;
        }
      `}</style>

      <div className="w-full h-[36vh] sm:h-[40vh]">
        <ParticleTextHero text="I'M KAUSHIK" dark={dark} />
      </div>

      <TextReveal
        text="Frontend Developer | Building clean, modern web experiences"
        dark={dark}
        delay={0.3}
        className={`max-w-2xl text-base sm:text-lg ${
          dark ? "text-white/70" : "text-gray-600"
        }`}
      />

      <div
        className="flex flex-col sm:flex-row items-center gap-4 mt-2 opacity-0 animate-word-reveal"
        style={{ animationDelay: "1.4s" }}
      >
        <a
          href="#contact"
          className={`px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 ${
            dark
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black text-white hover:bg-black/90"
          }`}
        >
          Hire Me
        </a>
        <a
          href="#projects"
          className={`px-7 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
            dark
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-black/20 text-black hover:bg-black/5"
          }`}
        >
          View Projects
        </a>
      </div>
    </section>
  );
}

export default Home;