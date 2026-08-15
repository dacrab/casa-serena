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
  intros.forEach((el, i) => (el.style.transitionDelay = `${i * 120}ms`));
  requestAnimationFrame(() => intros.forEach(reveal));

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}