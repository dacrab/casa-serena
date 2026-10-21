import { onPageLoad } from './lifecycle';

interface LightboxImage {
  src: string;
  alt: string;
}

function init() {
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  const lbImg = document.getElementById('lb-img') as HTMLImageElement | null;
  const lbCap = document.getElementById('lb-caption');
  const closeButton = document.getElementById('lb-close');
  const prevButton = document.getElementById('lb-prev');
  const nextButton = document.getElementById('lb-next');
  if (!dialog || !lbImg || !lbCap || !closeButton || !prevButton || !nextButton) return;

  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox-trigger]'));
  const images: LightboxImage[] = [];

  triggers.forEach(trigger => {
    const index = Number.parseInt(trigger.dataset.lightboxTrigger ?? '', 10);
    const img = trigger.querySelector('img');
    if (Number.isNaN(index) || !img) return;
    images[index] = {
      src: trigger.dataset.lightboxSrc || img.currentSrc || img.src,
      alt: img.alt,
    };
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-label', `View image: ${img.alt}`);
  });

  if (!images.length) return;

  let current = 0;

  const show = (i: number) => {
    current = (i + images.length) % images.length;
    const image = images[current];
    if (!image) return;
    lbImg.src = image.src;
    lbImg.alt = image.alt;
    lbCap.textContent = image.alt;
  };

  const open = (i: number) => {
    show(i);
    dialog.showModal();
  };

  const close = () => dialog.close();

  const onTriggerClick = (event: Event) => {
    const trigger = event.currentTarget as HTMLElement;
    const index = Number.parseInt(trigger.dataset.lightboxTrigger ?? '', 10);
    if (!Number.isNaN(index)) open(index);
  };

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const trigger = event.currentTarget as HTMLElement;
    const index = Number.parseInt(trigger.dataset.lightboxTrigger ?? '', 10);
    if (!Number.isNaN(index)) open(index);
  };

  const onDialogClick = (event: MouseEvent) => {
    if (event.target === dialog) close();
  };

  const onPrev = () => show(current - 1);
  const onNext = () => show(current + 1);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  };

  let touchX = 0;
  const onTouchStart = (event: TouchEvent) => {
    touchX = event.touches[0]?.clientX ?? 0;
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (!dialog.open) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchX;
    if (Math.abs(delta) > 50) show(delta > 0 ? current - 1 : current + 1);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', onTriggerClick);
    trigger.addEventListener('keydown', onTriggerKeyDown);
  });
  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', onPrev);
  nextButton.addEventListener('click', onNext);
  document.addEventListener('keydown', onKeyDown);
  dialog.addEventListener('click', onDialogClick);
  dialog.addEventListener('touchstart', onTouchStart, { passive: true });
  dialog.addEventListener('touchend', onTouchEnd);

  return () => {
    if (dialog.open) dialog.close();
    triggers.forEach(trigger => {
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onTriggerKeyDown);
    });
    closeButton.removeEventListener('click', close);
    prevButton.removeEventListener('click', onPrev);
    nextButton.removeEventListener('click', onNext);
    document.removeEventListener('keydown', onKeyDown);
    dialog.removeEventListener('click', onDialogClick);
    dialog.removeEventListener('touchstart', onTouchStart);
    dialog.removeEventListener('touchend', onTouchEnd);
  };
}

onPageLoad(init);
