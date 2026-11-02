import { onPageLoad } from '../scripts/lifecycle';

function init() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const intros = Array.from(document.querySelectorAll<HTMLElement>('[data-intro]'));
  const counts = new Map<Element, number>();

  for (const el of intros) {
    const group = el.closest('section, main, footer, nav') ?? document.body;
    const index = counts.get(group) ?? 0;
    el.style.transitionDelay = `${index * 120}ms`;
    counts.set(group, index + 1);
  }

  const frame = requestAnimationFrame(() => {
    for (const el of intros) el.classList.add('revealed');
  });

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}

onPageLoad(init);
