import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initBooking } from './booking';

/** Casa Serena — single animation orchestrator. Components stay markup-only. */

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const D = { fast: 0.3, base: 0.6, slow: 0.8 };
const E = { out: 'power3.out', soft: 'power2.out' };
const FROM_UP = { y: 28, opacity: 0 } as const;

const $$ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(s));

/** Animate matching elements on scroll-into-view. */
const onView = (
  trigger: string | Element,
  build: (tl: gsap.core.Timeline) => void,
  start = 'top 80%',
) => {
  const tl = gsap.timeline({ scrollTrigger: { trigger, start, once: true } });
  build(tl);
};

function hero() {
  if (!document.getElementById('hero')) return;

  // Fade video in once first frame is decoded — avoids the black→pop transition.
  const video = document.querySelector<HTMLVideoElement>('#hero video');
  if (video) {
    const reveal = () =>
      gsap.to(video, { opacity: 1, duration: 0.9, ease: E.soft, overwrite: true });
    if (video.readyState >= 2) reveal();
    else video.addEventListener('loadeddata', reveal, { once: true });
    setTimeout(reveal, 1500); // safety net for blocked autoplay
  }

  // fromTo (not from): CSS pre-hides these to prevent the pre-JS flash.
  gsap.timeline({ delay: 0.15 })
    .fromTo('#hero [data-anim="label-top"]',
      { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: D.base })
    .fromTo('#hero [data-anim="title"]',
      { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: D.slow, ease: E.out }, '-=0.3')
    .fromTo('#hero [data-anim="label-bot"]',
      { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: D.base }, '-=0.4');
}

function intro() {
  if (!document.getElementById('intro')) return;
  onView('#intro', tl => {
    tl.from('#intro [data-anim="img"]',  { scale: 1.05, opacity: 0, duration: D.slow, ease: E.soft })
      .from('#intro h2',                 { y: 30, opacity: 0, duration: D.slow, ease: E.out }, '-=0.4')
      .from('#intro [data-anim="body"]', { ...FROM_UP, duration: D.base }, '-=0.4')
      .from('#intro [data-anim="stat"]', { y: 20, opacity: 0, duration: D.base, stagger: 0.1 }, '-=0.3');
  }, 'top 75%');
}

function gallery() {
  if (!document.getElementById('gallery')) return;
  onView('#gallery', tl => {
    tl.from('#gallery [data-anim="hero"]', { scale: 1.05, opacity: 0, duration: D.slow, ease: E.soft })
      .from('#gallery [data-anim="cell"]', { ...FROM_UP, duration: D.base, stagger: 0.08 }, '-=0.4');
  });
}

function amenities() {
  $$('[data-amenity]').forEach(el => {
    gsap.from(el, {
      x: -20, opacity: 0, duration: D.base,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function location() {
  if (!document.getElementById('location')) return;
  onView('#location [data-anim="content"]', tl => {
    tl.from('#location [data-anim="text"]',     { ...FROM_UP, duration: D.slow, stagger: 0.12 })
      .from('#location [data-anim="distance"]', { x: 18, opacity: 0, duration: D.base, stagger: 0.08 }, '-=0.4');
  });
}

function enquire() {
  if (!document.getElementById('enquire')) return;
  onView('#enquire', tl => {
    tl.from('#enquire [data-anim="info"] > *', { ...FROM_UP, duration: D.slow, stagger: 0.12 })
      .from('#enquire [data-anim="field"]',    { ...FROM_UP, duration: D.base, stagger: 0.08 }, '-=0.4');
  });
}

function nav() {
  const navEl   = document.querySelector<HTMLElement>('[data-nav="root"]');
  const toggle  = document.querySelector<HTMLButtonElement>('[data-nav="toggle"]');
  const overlay = document.querySelector<HTMLElement>('[data-nav="overlay"]');
  const bars    = $$('[data-nav="bar"]');
  if (!navEl || !toggle || !overlay) return;

  // CSS pre-hides logo; reduced-motion override handles that path.
  if (!reduced) {
    gsap.fromTo('[data-nav="logo"]',
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: D.base, delay: 0.1 });
  }

  let open = false;
  const setBars = (state: 'open' | 'closed') => {
    const o = state === 'open';
    gsap.to(bars[0]!, { rotate: o ?  45 : 0, y: o ?  4 : 0, duration: 0.2 });
    gsap.to(bars[1]!, { rotate: o ? -45 : 0, y: o ? -4 : 0, duration: 0.2 });
  };

  const openMenu = () => {
    open = true;
    navEl.classList.add('nav-open');
    overlay.hidden = false;
    setBars('open');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(overlay.querySelectorAll('a'),
      { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: D.base });
    overlay.querySelector<HTMLAnchorElement>('a')?.focus();
  };
  const closeMenu = () => {
    open = false;
    navEl.classList.remove('nav-open');
    setBars('closed');
    document.body.style.overflow = '';
    gsap.to(overlay, { opacity: 0, duration: D.fast,
      onComplete: () => { overlay.hidden = true; } });
    toggle.focus();
  };

  toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });

  $$('[data-nav-theme]').forEach(s => {
    const light = s.dataset.navTheme === 'light';
    ScrollTrigger.create({
      trigger: s,
      start: 'top 60px',
      end: 'bottom 60px',
      onToggle: ({ isActive }) => navEl.classList.toggle('nav-light', isActive && light),
    });
  });
}

function init() {
  // Marquee — fire-and-forget infinite loop in all motion modes (no-op if absent).
  gsap.to('.marquee', { x: '-50%', duration: 22, ease: 'none', repeat: -1 });

  nav();
  initBooking();

  if (reduced) return;

  hero();
  intro();
  gallery();
  amenities();
  location();
  enquire();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
