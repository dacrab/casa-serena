import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/** Builds a [data-anim="…"] attribute selector. */
export const sel = (name: string): string => `[data-anim="${name}"]`;

/** True on devices with a fine pointer (mouse/trackpad). */
export const isPointer: boolean = window.matchMedia('(pointer: fine)').matches;

/** True when the initial viewport width is ≤ 768 px. */
export const isMobile: boolean = window.innerWidth <= 768;

/** Scroll smoothly to a target element or y-position. */
export const scrollTo = (
  target: string | number | HTMLElement,
  duration = 1.0,
  offsetY = 0,
): void => {
  gsap.to(window, {
    scrollTo: typeof target === 'string' || target instanceof HTMLElement
      ? { y: target, offsetY }
      : target,
    duration,
    ease: 'power3.inOut',
  });
};

/** Animate an element in from below on scroll. */
export const fadeUp = (
  target: string | Element | Element[],
  vars: gsap.TweenVars = {},
  trigger?: string | Element,
): gsap.core.Tween =>
  gsap.from(target, {
    y: 30,
    opacity: 0,
    duration: 0.85,
    scrollTrigger: {
      trigger: (trigger ?? target) as gsap.DOMTarget,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    ...vars,
  });

