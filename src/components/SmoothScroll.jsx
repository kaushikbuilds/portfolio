import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Poore page pe smooth scroll. Kuch render nahi karta.
const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    // Navbar se `window.lenis.scrollTo('#contact')` call kar sako
    window.lenis = lenis

    // GSAP ScrollTrigger ko Lenis ke saath sync
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.lenis = undefined
    }
  }, [])

  return null
}

<<<<<<< HEAD
export default SmoothScroll
=======
export default SmoothScroll
>>>>>>> 9503d132b0059f850ca3a4d0e1f7bc8df346431f
