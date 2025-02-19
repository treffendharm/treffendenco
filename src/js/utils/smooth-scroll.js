import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Remove the duplicate RAF loop and just use GSAP's ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// Integrate with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

// Prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0)

// Get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  // console.log({ scroll, limit, velocity, direction, progress })
})

export default lenis 