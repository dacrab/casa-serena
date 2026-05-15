import gsap from 'gsap';

type Mode = 'arrival' | 'departure';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const fmtMonth = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
const fmtDay   = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });

const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromYmd = (s: string) => { const [y, m, d] = s.split('-').map(Number) as [number, number, number]; return new Date(y, m - 1, d); };
const $ = (id: string) => document.getElementById(id);

export function initBooking() {
  const form = $('enquire-form');
  if (!form) return;

  const calWrap = $('cal-wrap')!, calGrid = $('cal-grid')!, calTitle = $('cal-title')!;
  const dateRoot = $('date-section')!, arrBtn = $('btn-arrival')!, depBtn = $('btn-departure')!;
  const arrInput = $('arrival') as HTMLInputElement | null;
  const depInput = $('departure') as HTMLInputElement | null;
  if (!calWrap || !calGrid || !calTitle || !dateRoot || !arrBtn || !depBtn) return;

  const t = today();
  const sel: Record<Mode, string | null> = { arrival: null, departure: null };
  let viewYear = t.getFullYear(), viewMonth = t.getMonth(), active: Mode | null = null;

  const cellCls = (isPast: boolean, isEnd: boolean, inRange: boolean) => {
    const b = 'text-center text-sm py-2 min-h-[36px] ';
    if (isPast)  return b + 'text-cream/15 cursor-not-allowed';
    if (isEnd)   return b + 'bg-terracotta text-cream cursor-pointer font-medium';
    if (inRange) return b + 'bg-terracotta/20 text-cream cursor-pointer';
    return b + 'text-cream/70 hover:text-terracotta cursor-pointer';
  };

  const render = () => {
    calTitle.textContent = fmtMonth.format(new Date(viewYear, viewMonth));
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInM = new Date(viewYear, viewMonth + 1, 0).getDate();
    const arrDate = sel.arrival ? fromYmd(sel.arrival) : null;
    const depDate = sel.departure ? fromYmd(sel.departure) : null;

    let html = DAYS.map(d => `<div class="text-center label-xs text-driftwood/50 py-1">${d}</div>`).join('');
    html += '<div></div>'.repeat(firstDow);
    for (let n = 1; n <= daysInM; n++) {
      const cell = new Date(viewYear, viewMonth, n), key = ymd(cell);
      const isPast = cell < t;
      const isEnd = !isPast && !!((arrDate && key === ymd(arrDate)) || (depDate && key === ymd(depDate)));
      const inRange = !!(arrDate && depDate && cell > arrDate && cell < depDate);
      const attr = isPast ? '' : `role="button" tabindex="0" data-key="${key}"`;
      html += `<div class="${cellCls(isPast, isEnd, inRange)}" ${attr}>${n}</div>`;
    }
    calGrid.innerHTML = html;
    calGrid.querySelectorAll<HTMLElement>('[data-key]').forEach(el => {
      const k = el.dataset.key!;
      el.addEventListener('click', () => pick(k));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } });
    });
    setLabel('val-arrival', sel.arrival ? fmtDay.format(fromYmd(sel.arrival)) : 'Select date', !!sel.arrival);
    setLabel('val-departure', sel.departure ? fmtDay.format(fromYmd(sel.departure)) : 'Select date', !!sel.departure);
    setActive('lbl-arrival', active === 'arrival');
    setActive('lbl-departure', active === 'departure');
  };

  const setLabel = (id: string, text: string, set: boolean) => {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
    el.className = `text-sm ${set ? 'text-cream' : 'text-cream/40'}`;
  };
  const setActive = (id: string, on: boolean) => {
    const el = $(id);
    if (el) el.className = `label-xs block mb-0.5 ${on ? 'text-terracotta' : 'text-driftwood/60'}`;
  };

  const pick = (key: string) => {
    if (!active) return;
    sel[active] = key;
    if (sel.arrival && sel.departure && sel.arrival >= sel.departure) sel.departure = null;
    if (arrInput) arrInput.value = sel.arrival ?? '';
    if (depInput) depInput.value = sel.departure ?? '';
    if (active === 'arrival' && !sel.departure) { active = 'departure'; render(); }
    else close();
  };

  const open = (mode: Mode) => {
    active = mode;
    const d = sel[mode] ? fromYmd(sel[mode]!) : t;
    viewYear = d.getFullYear(); viewMonth = d.getMonth();
    render();
    calWrap.hidden = false;
    gsap.fromTo(calWrap, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.18 });
  };
  const close = () => {
    active = null;
    gsap.to(calWrap, { opacity: 0, y: -6, duration: 0.15, onComplete: () => { calWrap.hidden = true; } });
    render();
  };

  arrBtn.addEventListener('click', e => { e.stopPropagation(); active === 'arrival' ? close() : open('arrival'); });
  depBtn.addEventListener('click', e => { e.stopPropagation(); active === 'departure' ? close() : open('departure'); });
  document.addEventListener('click', e => { if (!dateRoot.contains(e.target as Node)) close(); });
  $('cal-prev')?.addEventListener('click', e => { e.stopPropagation(); if (--viewMonth < 0) { viewMonth = 11; viewYear--; } render(); });
  $('cal-next')?.addEventListener('click', e => { e.stopPropagation(); if (++viewMonth > 11) { viewMonth = 0; viewYear++; } render(); });

  // Validation + submit
  const showError = (input: HTMLElement, msg: string) => {
    input.classList.add('border-red-400');
    let err = input.nextElementSibling;
    if (!err?.classList.contains('field-error')) {
      err = document.createElement('p');
      err.className = 'field-error text-red-400 text-xs mt-1';
      input.after(err);
    }
    err!.textContent = msg;
  };
  const clearError = (input: HTMLElement) => {
    input.classList.remove('border-red-400');
    const err = input.nextElementSibling;
    if (err?.classList.contains('field-error')) err.remove();
  };

  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = $('name') as HTMLInputElement, emailEl = $('email') as HTMLInputElement;
    [nameEl, emailEl].forEach(clearError);
    let valid = true;
    if (!nameEl.value.trim()) { showError(nameEl, 'Please enter your name'); valid = false; }
    if (!emailEl.value.trim()) { showError(emailEl, 'Please enter your email'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) { showError(emailEl, 'Please enter a valid email'); valid = false; }
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      form.innerHTML = `
        <div class="text-center py-8">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-terracotta flex items-center justify-center">
            <svg class="w-6 h-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
          </div>
          <p class="text-cream text-xl font-serif italic mb-2">Thank you.</p>
          <p class="text-cream/60 text-sm">We'll respond within 24 hours with availability and next steps.</p>
        </div>`;
    }, 800);
  });
}
