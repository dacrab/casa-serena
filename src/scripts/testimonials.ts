import { onPageLoad } from './lifecycle';

function init() {
  const section = document.querySelector<HTMLElement>('[data-testimonials]');
  if (!section) return;

  const quotes = Array.from(section.querySelectorAll<HTMLElement>('[data-testimonial]'));
  const dots = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-dot]'));
  const counter = section.querySelector<HTMLElement>('[data-testimonial-counter]');
  if (!quotes.length || dots.length !== quotes.length || !counter) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const show = (index: number) => {
    quotes[current]!.hidden = true;
    dots[current]!.removeAttribute('aria-current');

    current = (index + quotes.length) % quotes.length;

    quotes[current]!.hidden = false;
    dots[current]!.setAttribute('aria-current', 'true');
    counter.textContent = `${current + 1} / ${quotes.length}`;
  };

  const stop = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  };

  const start = () => {
    stop();
    if (!reducedMotion) timer = setInterval(() => show(current + 1), 6000);
  };

  const onDotClick = (event: Event) => {
    const index = Number((event.currentTarget as HTMLElement).dataset.dot);
    if (!Number.isNaN(index)) show(index);
  };

  const onFocusOut = (event: FocusEvent) => {
    if (!section.contains(event.relatedTarget as Node | null)) start();
  };

  dots.forEach(dot => dot.addEventListener('click', onDotClick));
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);
  section.addEventListener('focusin', stop);
  section.addEventListener('focusout', onFocusOut);
  start();

  return () => stop();
}

onPageLoad(init);
