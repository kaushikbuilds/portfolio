import React, { useEffect, useState } from 'react'
import About from './sections/About'
import Home from './sections/Home'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import SmoothScroll from './components/SmoothScroll'
import AskKaushik from  './components/Askkaushik'

const THEME_KEY = 'theme'

// Refresh karne par bhi saved theme wapas aaye. Pehli baar default = dark.
const getInitialDark = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light') return false
    if (saved === 'dark') return true
  } catch {
    /* localStorage blocked: default dark */
  }
  return true
}

const App = () => {
  const [dark, setDark] = useState(getInitialDark)

  // Jab bhi theme badle, save karo
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <div
      className={`relative min-h-screen transition-colors duration-300 ${
        dark ? 'bg-black' : 'bg-gray-50'
      }`}
    >
      <SmoothScroll />
      <Navbar dark={dark} setDark={setDark} />

      {/* Particle background sirf Home section ke peeche */}
      <div className="relative">
        <ParticleBackground dark={dark} />
        <Home dark={dark} />
      </div>

      {/* About particle div ke BAHAR hai — isliye double nahi dikhega */}
      <About dark={dark} />
      <Projects dark={dark} />
      <Contact dark={dark} />
      <Footer dark={dark} /> 
      <AskKaushik dark={dark} />
    </div>
  )
}

export default App