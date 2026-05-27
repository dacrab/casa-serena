import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initBooking } from './booking';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = { fast: 0.3, base: 0.6, slow: 0.8 };
const E = { out: 'power3.out', soft: 'power2.out' };
const $$ = (sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<HTMLElement>(sel));
const scrollTL = (trigger: string, start = 'top 80%') => gsap.timeline({ scrollTrigger: { trigger, start, once: true } });
const slideUp = (y = 28, duration = D.base) => ({ y, opacity: 0, duration });

/* ═══ NAVIGATION ═══ */

function nav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav="toggle"]');
  const overlay = document.querySelector<HTMLElement>('[data-nav="overlay"]');
  const bars = $$('[data-nav="bar"]');
  if (!toggle || !overlay) return;

  if (!reduced) gsap.fromTo('[data-nav="logo"]', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: D.base, delay: 0.1 });
  else gsap.set('[data-nav="logo"]', { opacity: 1 });

  let open = false;
  const setBars = (o: boolean) => {
    gsap.to(bars[0]!, { rotate: o ? 45 : 0, y: o ? 4 : 0, duration: 0.2 });
    gsap.to(bars[1]!, { rotate: o ? -45 : 0, y: o ? -4 : 0, duration: 0.2 });
  };
  const openMenu = () => {
    open = true;
    overlay.hidden = false;
    setBars(true);
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(overlay.querySelectorAll('a'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: D.base });
    overlay.querySelector<HTMLAnchorElement>('a')?.focus();
  };
  const closeMenu = () => {
    open = false;
    setBars(false);
    document.body.style.overflow = '';
    gsap.to(overlay, { opacity: 0, duration: D.fast, onComplete: () => { overlay.hidden = true; } });
    toggle.focus();
  };

  toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });
}

/* ═══ HOMEPAGE SECTIONS ═══ */

function hero() {
  if (!document.getElementById('hero')) return;
  const video = document.querySelector<HTMLVideoElement>('#hero video');
  if (video) {
    const reveal = () => gsap.to(video, { opacity: 1, duration: 0.9, ease: E.soft, overwrite: true });
    if (video.readyState >= 2) reveal();
    else video.addEventListener('loadeddata', reveal, { once: true });
    setTimeout(reveal, 1500);
  }
  gsap.timeline({ delay: 0.15 })
    .fromTo('#hero [data-anim="label-top"]', slideUp(), { y: 0, opacity: 1, duration: D.base })
    .fromTo('#hero [data-anim="title"]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: D.slow, ease: E.out }, '-=0.3')
    .fromTo('#hero [data-anim="label-bot"]', slideUp(), { y: 0, opacity: 1, duration: D.base }, '-=0.4');
}

function intro() {
  if (!document.getElementById('intro')) return;
  scrollTL('#intro', 'top 75%')
    .from('#intro [data-anim="img"]', { scale: 1.05, opacity: 0, duration: D.slow, ease: E.soft })
    .from('#intro [data-anim="body"]', slideUp(), '-=0.4')
    .from('#intro [data-anim="stat"]', { y: 20, opacity: 0, duration: D.base, stagger: 0.1 }, '-=0.3');
}

function gallery() {
  if (!document.getElementById('gallery')) return;
  scrollTL('#gallery')
    .from('#gallery [data-anim="hero"]', { scale: 1.05, opacity: 0, duration: D.slow, ease: E.soft })
    .from('#gallery [data-anim="cell"]', { ...slideUp(), stagger: 0.08 }, '-=0.4');
}

function amenities() {
  $$('[data-amenity]').forEach(el => {
    gsap.from(el, { x: -20, opacity: 0, duration: D.base, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
}

function location() {
  if (!document.getElementById('location')) return;
  scrollTL('#location [data-anim="content"]')
    .from('#location [data-anim="text"]', { ...slideUp(), duration: D.slow, stagger: 0.12 })
    .from('#location [data-anim="distance"]', { x: 18, opacity: 0, duration: D.base, stagger: 0.08 }, '-=0.4');
}

function enquire() {
  if (!document.getElementById('enquire')) return;
  scrollTL('#enquire')
    .from('#enquire [data-anim="info"] > *', { ...slideUp(), duration: D.slow, stagger: 0.12 })
    .from('#enquire [data-anim="field"]', { ...slideUp(), stagger: 0.08 }, '-=0.4');
}

/* ═══ SUBPAGE ANIMATIONS ═══ */

function subpageIntro() {
  const els = $$('[data-intro]');
  if (!els.length) return;
  const tl = gsap.timeline({ delay: 0.1 });
  els.forEach((el, i) => {
    const isImg = el.tagName === 'IMG' || el.querySelector('img');
    tl.fromTo(el,
      { opacity: 0, ...(isImg ? { scale: 1.03 } : { y: 20 }) },
      { opacity: 1, ...(isImg ? { scale: 1 } : { y: 0 }), duration: isImg ? D.slow : D.base, ease: isImg ? E.soft : E.out },
      i === 0 ? 0 : '-=0.3',
    );
  });
}

function subpageReveal() {
  $$('[data-reveal]').forEach(el => {
    const isImg = el.tagName === 'IMG' || el.querySelector('img');
    gsap.fromTo(el,
      { opacity: 0, ...(isImg ? { scale: 1.03 } : { y: 24 }) },
      { opacity: 1, ...(isImg ? { scale: 1 } : { y: 0 }), duration: isImg ? D.slow : D.base, ease: E.soft,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
    );
  });
}

/* ═══ INIT ═══ */

function init() {
  gsap.to('.marquee', { x: '-50%', duration: 22, ease: 'none', repeat: -1 });
  nav();
  initBooking();
  if (reduced) { gsap.set('[data-intro], [data-reveal]', { opacity: 1, y: 0, scale: 1 }); return; }
  hero(); intro(); gallery(); amenities(); location(); enquire();
  subpageIntro(); subpageReveal();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
