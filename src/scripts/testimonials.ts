import { onPageLoad } from './lifecycle';

function init() {
  const section = document.querySelector<HTMLElement>('[data-testimonials]');
  if (!section) return;

  const quotes = section.querySelectorAll<HTMLElement>('[data-testimonial]');
  const dots = section.querySelectorAll<HTMLButtonElement>('[data-dot]');
  const counter = section.querySelector<HTMLElement>('[data-testimonial-counter]');
  if (!quotes.length || !dots.length || !counter) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let paused = false;

  function show(i: number) {
    quotes[current]!.classList.add('hidden');
    dots[current]!.classList.remove('bg-terracotta');
    dots[current]!.classList.add('bg-cream/20');
    dots[current]!.removeAttribute('aria-current');

    current = i;
    quotes[current]!.classList.remove('hidden');
    dots[current]!.classList.remove('bg-cream/20');
    dots[current]!.classList.add('bg-terracotta');
    dots[current]!.setAttribute('aria-current', 'true');
    counter!.textContent = `${current + 1} / ${quotes.length}`;
  }

  const stopTimer = () => {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (reducedMotion || paused) return;
    timer = setInterval(() => show((current + 1) % quotes.length), 6000);
  };

  const pause = () => {
    paused = true;
    stopTimer();
  };

  const resume = () => {
    paused = false;
    startTimer();
  };

  const onDotClick = (event: Event) => {
    const index = Number((event.currentTarget as HTMLElement).dataset.dot);
    if (!Number.isNaN(index)) {
      show(index);
      startTimer();
    }
  };

  const onFocusOut = (event: FocusEvent) => {
    if (!section.contains(event.relatedTarget as Node | null)) resume();
  };

  dots.forEach(dot => dot.addEventListener('click', onDotClick));
  section.addEventListener('mouseenter', pause);
  section.addEventListener('mouseleave', resume);
  section.addEventListener('focusin', pause);
  section.addEventListener('focusout', onFocusOut);
  startTimer();

  return () => {
    stopTimer();
    dots.forEach(dot => dot.removeEventListener('click', onDotClick));
    section.removeEventListener('mouseenter', pause);
    section.removeEventListener('mouseleave', resume);
    section.removeEventListener('focusin', pause);
    section.removeEventListener('focusout', onFocusOut);
  };
}

onPageLoad(init);
