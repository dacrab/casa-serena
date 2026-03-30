import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
export const sel       = (n: string) => `[data-anim="${n}"]`;
export const isPointer = window.matchMedia('(pointer: fine)').matches;
export const isMobile  = window.innerWidth <= 768;
export const scrollTo  = (target: string | number | HTMLElement, duration = 1.0) =>
  gsap.to(window, { scrollTo: target, duration, ease: 'power3.inOut' });

