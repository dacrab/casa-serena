import { onPageLoad } from './lifecycle';

function init() {
  const cleanups: Array<() => void> = [];
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const dialog = document.getElementById('nav-overlay') as HTMLDialogElement | null;
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-nav-close]');

  if (nav) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');

    if (!hero) {
      nav.dataset.solid = 'true';
    } else {
      let frame = 0;

      const update = () => {
        frame = 0;
        const threshold = Math.max(0, hero.offsetHeight - 88);
        nav.dataset.solid = String(window.scrollY > threshold);
      };

      const request = () => {
        if (frame) return;
        frame = requestAnimationFrame(update);
      };

      update();
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });

      cleanups.push(() => {
        window.removeEventListener('scroll', request);
        window.removeEventListener('resize', request);
        if (frame) cancelAnimationFrame(frame);
      });
    }
  }

  if (dialog && toggle && closeButton) {
    const open = () => {
      dialog.showModal();
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => dialog.close();

    toggle.addEventListener('click', open);
    closeButton.addEventListener('click', close);

    const onDialogClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest('a')) close();
    };

    const onClose = () => {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    dialog.addEventListener('click', onDialogClick);
    dialog.addEventListener('close', onClose);

    cleanups.push(() => {
      toggle.removeEventListener('click', open);
      closeButton.removeEventListener('click', close);
      dialog.removeEventListener('click', onDialogClick);
      dialog.removeEventListener('close', onClose);
      if (dialog.open) dialog.close();
      document.body.style.overflow = '';
    });
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

onPageLoad(init);
