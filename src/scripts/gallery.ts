import { onPageLoad } from './lifecycle';

interface LightboxImage {
  src: string;
  alt: string;
  caption: string;
}

function init() {
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  const image = document.getElementById('lb-img') as HTMLImageElement | null;
  const caption = document.getElementById('lb-caption');
  const closeButton = document.getElementById('lb-close');
  const prevButton = document.getElementById('lb-prev');
  const nextButton = document.getElementById('lb-next');
  if (!dialog || !image || !caption || !closeButton || !prevButton || !nextButton) return;

  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox-trigger]'));
  const images: LightboxImage[] = [];

  for (const trigger of triggers) {
    const index = Number(trigger.dataset.lightboxTrigger);
    const img = trigger.querySelector('img');
    if (Number.isNaN(index) || !img) continue;
    images[index] = {
      src: img.currentSrc || img.src,
      alt: img.alt,
      caption: trigger.dataset.lightboxCaption || img.alt,
    };
  }

  if (!images.length) return;

  let current = 0;

  const show = (index: number) => {
    current = (index + images.length) % images.length;
    const item = images[current];
    if (!item) return;
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption;
  };

  const open = (index: number) => {
    show(index);
    dialog.showModal();
  };

  const onTriggerClick = (event: Event) => {
    const index = Number((event.currentTarget as HTMLButtonElement).dataset.lightboxTrigger);
    if (!Number.isNaN(index)) open(index);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    else if (event.key === 'ArrowRight') show(current + 1);
  };

  const onDialogClick = (event: MouseEvent) => {
    if (event.target === dialog) dialog.close();
  };

  let touchX = 0;
  const onTouchStart = (event: TouchEvent) => {
    touchX = event.touches[0]?.clientX ?? 0;
  };
  const onTouchEnd = (event: TouchEvent) => {
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchX;
    if (Math.abs(delta) > 50) show(delta > 0 ? current - 1 : current + 1);
  };

  triggers.forEach(trigger => trigger.addEventListener('click', onTriggerClick));
  closeButton.addEventListener('click', () => dialog.close());
  prevButton.addEventListener('click', () => show(current - 1));
  nextButton.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', onKeyDown);
  dialog.addEventListener('click', onDialogClick);
  dialog.addEventListener('touchstart', onTouchStart, { passive: true });
  dialog.addEventListener('touchend', onTouchEnd);

  return () => {
    if (dialog.open) dialog.close();
  };
}

onPageLoad(init);
