import { site } from '../lib/site';
import { onPageLoad } from './lifecycle';

function init() {
  const form = document.getElementById('enquire-form') as HTMLFormElement | null;
  if (!form) return;

  const suite = new URLSearchParams(location.search).get('suite');
  const select = form.querySelector<HTMLSelectElement>('#suite');
  if (suite && select && [...select.options].some(o => o.value === suite)) select.value = suite;

  const arrival = form.querySelector<HTMLInputElement>('#arrival');
  const departure = form.querySelector<HTMLInputElement>('#departure');
  if (!arrival || !departure) return;

  const today = new Date().toISOString().slice(0, 10);
  arrival.min = today;
  departure.min = today;
  arrival.addEventListener('change', () => { if (arrival.value) departure.min = arrival.value; });

  const $input = (id: string) => form.querySelector<HTMLInputElement>(`#${id}`)!;
  const showError = (el: HTMLElement, msg: string) => {
    el.classList.add('border-red-400');
    let err = el.nextElementSibling;
    if (!err?.classList.contains('field-error')) {
      err = document.createElement('p');
      err.className = 'field-error text-red-400 text-xs mt-1';
      el.after(err);
    }
    err!.textContent = msg;
  };
  const clearError = (el: HTMLElement) => {
    el.classList.remove('border-red-400');
    const err = el.nextElementSibling;
    if (err?.classList.contains('field-error')) err.remove();
  };

  form.querySelectorAll<HTMLInputElement>('input, select, textarea').forEach(el =>
    el.addEventListener('input', () => clearError(el)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $input('name'), email = $input('email');
    [name, email].forEach(clearError);
    let valid = true;
    if (!name.value.trim()) { showError(name, 'Please enter your name'); valid = false; }
    if (!email.value.trim()) { showError(email, 'Please enter your email'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Please enter a valid email'); valid = false; }
    if (arrival.value && departure.value && departure.value < arrival.value) { showError(departure, 'Departure must be after arrival'); valid = false; }
    if (!valid) return;

    const arrivalValue = arrival.value;
    const departureValue = departure.value;
    const suiteValue = select?.value ?? '';
    const messageValue = form.querySelector<HTMLTextAreaElement>('#message')?.value ?? '';

    const lines = [
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      arrivalValue && `Arrival: ${arrivalValue}`,
      departureValue && `Departure: ${departureValue}`,
      suiteValue && `Suite: ${suiteValue}`,
      messageValue && `Message:\n${messageValue}`,
    ].filter(Boolean);
    const body = encodeURIComponent(lines.join('\n'));

    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Opening your email client…';
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Enquiry — Casa Serena')}&body=${body}`;
  });
}

onPageLoad(init);
