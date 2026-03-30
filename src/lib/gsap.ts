import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

export { gsap, ScrollTrigger };
export const sel       = (s: string) => `[data-anim="${s}"]`;
export const isPointer = window.matchMedia('(pointer: fine)').matches;
export const isMobile  = window.innerWidth <= 768;
