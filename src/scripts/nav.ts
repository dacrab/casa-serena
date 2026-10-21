import { onPageLoad } from './lifecycle';

function init() {
  const dialog = document.getElementById('nav-overlay') as HTMLDialogElement | null;
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-nav-close]');
  if (!dialog || !toggle || !closeButton) return;

  const syncState = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const setOpen = (open: boolean) => {
    syncState(open);
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  };

  const onToggle = () => setOpen(!dialog.open);
  const onCloseClick = () => setOpen(false);
  const onDialogClick = (event: MouseEvent) => {
    if ((event.target as Element | null)?.closest('a')) setOpen(false);
  };
  const onClose = () => syncState(false);
  const onCancel = (event: Event) => {
    event.preventDefault();
    setOpen(false);
  };

  toggle.addEventListener('click', onToggle);
  closeButton.addEventListener('click', onCloseClick);
  dialog.addEventListener('click', onDialogClick);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('cancel', onCancel);

  return () => {
    toggle.removeEventListener('click', onToggle);
    closeButton.removeEventListener('click', onCloseClick);
    dialog.removeEventListener('click', onDialogClick);
    dialog.removeEventListener('close', onClose);
    dialog.removeEventListener('cancel', onCancel);
    if (dialog.open) dialog.close();
    syncState(false);
  };
}

onPageLoad(init);
