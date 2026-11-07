
const RESPECT_REDUCED_MOTION = true
const PLAY_ONCE = false 
const MAX_ITEMS = 40
const SELECTOR = 'h1,h2,h3,h4,p,img,button,a[href],input,textarea,li,[data-build]'
const SKIP = 'canvas,[data-build-skip]'
const KEYS = ['transition', 'opacity', 'filter']

const hasFixedAncestor = (el) => {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).position === 'fixed') return true
  }
  return false
}

function collect() {
  let list = [...document.body.querySelectorAll(SELECTOR)].filter((el) => {
    if (el.closest(SKIP) || el.querySelector('canvas')) return false
    const r = el.getBoundingClientRect()
    if (r.width < 24 || r.height < 10) return false
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false
    return !hasFixedAncestor(el)
  })
  const boxes = list.filter((e) => e.hasAttribute('data-build'))
  list = list.filter((e) => e.hasAttribute('data-build') || !boxes.some((b) => b.contains(e)))
  list = list.filter(
    (e) => e.hasAttribute('data-build') || !list.some((o) => o !== e && e.contains(o) && !o.hasAttribute('data-build'))
  )
  return list.slice(0, MAX_ITEMS)
}

export function startBuild() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.warn('[build] "reduce motion" on hai.')
    if (RESPECT_REDUCED_MOTION) return
  }
  if (PLAY_ONCE && sessionStorage.getItem('bl-played')) return

  let items
  try {
    items = collect().map((el) => {
      const orig = {}
      KEYS.forEach((k) => (orig[k] = el.style.getPropertyValue(k)))
      return { el, orig, started: false, P: [], n: 0, t0: 0, end: 0 }
    })
  } catch (e) {
    console.error('[build]', e)
    return
  }
  if (!items.length) {
    console.warn('[build] koi element nahi mila')
    return
  }
  console.log('[build] elements:', items.length)

  const byEl = new Map(items.map((it) => [it.el, it]))
  const cv = document.createElement('canvas')
  cv.className = 'bl-canvas'
  document.body.appendChild(cv)
  const ctx = cv.getContext('2d')
  const fit = () => {
    const dpr = Math.min(2, devicePixelRatio || 1)
    cv.width = innerWidth * dpr
    cv.height = innerHeight * dpr
    cv.style.width = innerWidth + 'px'
    cv.style.height = innerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  fit()

  const setP = (el, p) => {
    el.style.setProperty('transition', 'none', 'important')
    el.style.setProperty('opacity', String(p), 'important')
    el.style.setProperty('filter', `blur(${(1 - p) * 8}px)`, 'important')
  }
  // sirf wahi values wapas karo jo humne set ki thi (tumhare GSAP ki values safe rehti hain)
  const release = (it) =>
    KEYS.forEach((k) => {
      if (it.el.style.getPropertyPriority(k) !== 'important') return
      it.orig[k] ? it.el.style.setProperty(k, it.orig[k]) : it.el.style.removeProperty(k)
    })

  items.forEach((it) => setP(it.el, 0))

  let raf = 0
  let active = []
  let batch = 0
  let bt
  const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2)

  function spawn(it) {
    const r = it.el.getBoundingClientRect()
    it.n = Math.max(40, Math.min(240, Math.round((r.width * r.height) / 70)))
    const d0 = batch++ * 220
    clearTimeout(bt)
    bt = setTimeout(() => (batch = 0), 500)
    it.t0 = performance.now()
    it.end = 0
    it.P = Array.from({ length: it.n }, () => {
      const d = d0 + Math.random() * 350
      const u = 1000 + Math.random() * 600
      it.end = Math.max(it.end, d + u)
      return {
        sx: Math.random() * innerWidth, sy: Math.random() * innerHeight,
        fx: Math.random(), fy: Math.random(), d, u,
        sw: (Math.random() - 0.5) * 220, s: 0.8 + Math.random() * 1.5, ph: Math.random() * 6.28,
      }
    })
    active.push(it)
    if (!raf) raf = requestAnimationFrame(frame)
  }

  function frame(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx.fillStyle = document.documentElement.dataset.bl === 'light' ? '#111' : '#fff'
    active = active.filter((it) => {
      const r = it.el.getBoundingClientRect()
      const t = now - it.t0
      let sum = 0
      for (const p of it.P) {
        const u = Math.max(0, Math.min(1, (t - p.d) / p.u))
        const e = ease(u)
        sum += u
        const tx = r.left + p.fx * r.width, ty = r.top + p.fy * r.height
        const dx = tx - p.sx, dy = ty - p.sy, L = Math.hypot(dx, dy) || 1
        const sw = p.sw * Math.sin(Math.PI * e)
        let x = p.sx + dx * e + (-dy / L) * sw
        let y = p.sy + dy * e + (dx / L) * sw
        if (u === 0) { x += Math.sin(t / 700 + p.ph) * 8; y += Math.cos(t / 800 + p.ph) * 8 }
        ctx.globalAlpha = u < 0.85 ? 0.65 : ((1 - u) / 0.15) * 0.65
        ctx.fillRect(x, y, p.s, p.s)
      }
      setP(it.el, Math.max(0, Math.min(1, (sum / it.n - 0.6) / 0.4)))
      if (t > it.end + 300) { release(it); return false }
      return true
    })
    raf = active.length ? requestAnimationFrame(frame) : 0
    if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight)
  }

  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const it = byEl.get(e.target)
        if (!e.isIntersecting || !it || it.started) return
        it.started = true
        io.unobserve(e.target)
        spawn(it)
      }),
    { rootMargin: '0px 0px -8% 0px' }
  )
  items.forEach((it) => io.observe(it.el))
  if (PLAY_ONCE) sessionStorage.setItem('bl-played', '1')

  addEventListener('resize', fit)

  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(bt)
    io.disconnect()
    removeEventListener('resize', fit)
    cv.remove()
    items.forEach(release)
  }
}