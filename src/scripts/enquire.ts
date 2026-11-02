import { site } from '../lib/site';
import { onPageLoad } from './lifecycle';

function init() {
  const form = document.getElementById('enquire-form') as HTMLFormElement | null;
  if (!form) return;

  const select = form.querySelector<HTMLSelectElement>('#suite');
  const arrival = form.querySelector<HTMLInputElement>('#arrival');
  const departure = form.querySelector<HTMLInputElement>('#departure');
  if (!arrival || !departure) return;

  const suite = new URLSearchParams(location.search).get('suite');
  if (suite && select && [...select.options].some(option => option.value === suite)) {
    select.value = suite;
  }

  const today = new Date().toISOString().slice(0, 10);
  arrival.min = today;
  departure.min = today;
  arrival.addEventListener('change', () => {
    departure.min = arrival.value || today;
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const fields: [string, FormDataEntryValue | null][] = [
      ['Name', data.get('name')],
      ['Email', data.get('email')],
      ['Arrival', data.get('arrival')],
      ['Departure', data.get('departure')],
      ['Suite', data.get('suite')],
      ['Message', data.get('message')],
    ];
    const body = fields
      .map(([label, value]) => [label, String(value ?? '').trim()] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n');

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Opening your email client…';
    }

    location.href = `mailto:${site.email}?subject=${encodeURIComponent('Enquiry — Casa Serena')}&body=${encodeURIComponent(body)}`;
  });
}

onPageLoad(init);
