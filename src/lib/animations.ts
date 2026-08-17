if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = (el: Element) => el.classList.add('revealed');

  const io = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  const intros = Array.from(document.querySelectorAll<HTMLElement>('[data-intro]'));
  requestAnimationFrame(() => intros.forEach(reveal));

  // Stagger [data-intro] elements only within their own section, so items far
  // down the page don't inherit a global delay on first reveal.
  const sections = new Set<Element>([document.body]);
  intros.forEach(el => sections.add(el.closest('section, main, footer') ?? document.body));
  sections.forEach(section => {
    const group = Array.from(section.querySelectorAll<HTMLElement>('[data-intro]'));
    group.forEach((el, i) => (el.style.transitionDelay = `${i * 120}ms`));
  });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}