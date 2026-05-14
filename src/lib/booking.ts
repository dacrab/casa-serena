import gsap from 'gsap';

/** Casa Serena booking date-picker. Two-button range picker with a popover calendar. */

type Mode = 'arrival' | 'departure';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const fmtMonth = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
const fmtDay   = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });

const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const ymd   = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromYmd = (s: string) => {
  const [y, m, d] = s.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};

export function initBooking() {
  const form = document.getElementById('enquire-form');
  if (!form) return;

  const calWrap  = document.getElementById('cal-wrap');
  const calGrid  = document.getElementById('cal-grid');
  const calTitle = document.getElementById('cal-title');
  const dateRoot = document.getElementById('date-section');
  const arrBtn   = document.getElementById('btn-arrival');
  const depBtn   = document.getElementById('btn-departure');
  const arrInput = document.getElementById('arrival')   as HTMLInputElement | null;
  const depInput = document.getElementById('departure') as HTMLInputElement | null;
  if (!calWrap || !calGrid || !calTitle || !dateRoot || !arrBtn || !depBtn) return;

  const t = today();
  const sel: Record<Mode, string | null> = { arrival: null, departure: null };
  let viewYear  = t.getFullYear();
  let viewMonth = t.getMonth();
  let active: Mode | null = null;

  const render = () => {
    calTitle.textContent = fmtMonth.format(new Date(viewYear, viewMonth));
    const firstDow  = new Date(viewYear, viewMonth, 1).getDay();
    const daysInM   = new Date(viewYear, viewMonth + 1, 0).getDate();
    const arrDate   = sel.arrival   ? fromYmd(sel.arrival)   : null;
    const depDate   = sel.departure ? fromYmd(sel.departure) : null;

    let html = DAYS.map(d => `<div class="text-center label-xs text-driftwood/50 py-1">${d}</div>`).join('');
    for (let i = 0; i < firstDow; i++) html += '<div></div>';
    for (let n = 1; n <= daysInM; n++) {
      const cell    = new Date(viewYear, viewMonth, n);
      const key     = ymd(cell);
      const isPast  = cell < t;
      const isEnd   = (arrDate && key === ymd(arrDate)) || (depDate && key === ymd(depDate));
      const inRange = arrDate && depDate && cell > arrDate && cell < depDate;
      let cls = 'text-center text-sm py-2 min-h-[36px] ';
      if (isPast)      cls += 'text-cream/15 cursor-not-allowed';
      else if (isEnd)  cls += 'bg-terracotta text-cream cursor-pointer font-medium';
      else if (inRange)cls += 'bg-terracotta/20 text-cream cursor-pointer';
      else             cls += 'text-cream/70 hover:text-terracotta cursor-pointer';
      const intr = !isPast ? 'role="button" tabindex="0"' : '';
      html += `<div class="${cls}" ${intr} data-key="${isPast ? '' : key}">${n}</div>`;
    }
    calGrid.innerHTML = html;
    calGrid.querySelectorAll<HTMLElement>('[data-key]').forEach(el => {
      const k = el.dataset.key;
      if (!k) return;
      el.addEventListener('click', () => pick(k));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); }
      });
    });

    setLabel('val-arrival',   sel.arrival   ? fmtDay.format(fromYmd(sel.arrival))   : 'Select date', !!sel.arrival);
    setLabel('val-departure', sel.departure ? fmtDay.format(fromYmd(sel.departure)) : 'Select date', !!sel.departure);
    setActive('lbl-arrival',   active === 'arrival');
    setActive('lbl-departure', active === 'departure');
  };

  const setLabel = (id: string, text: string, set: boolean) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = `text-sm ${set ? 'text-cream' : 'text-cream/40'}`;
  };
  const setActive = (id: string, on: boolean) => {
    const el = document.getElementById(id);
    if (el) el.className = `label-xs block mb-0.5 ${on ? 'text-terracotta' : 'text-driftwood/60'}`;
  };

  const pick = (key: string) => {
    if (!active) return;
    sel[active] = key;
    if (sel.arrival && sel.departure && sel.arrival >= sel.departure) sel.departure = null;
    if (arrInput) arrInput.value = sel.arrival   ?? '';
    if (depInput) depInput.value = sel.departure ?? '';
    if (active === 'arrival' && !sel.departure) { active = 'departure'; render(); }
    else close();
  };

  const open = (mode: Mode) => {
    active = mode;
    const ex = sel[mode];
    const d = ex ? fromYmd(ex) : t;
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

  arrBtn.addEventListener('click', e => { e.stopPropagation(); active === 'arrival'   ? close() : open('arrival'); });
  depBtn.addEventListener('click', e => { e.stopPropagation(); active === 'departure' ? close() : open('departure'); });
  document.addEventListener('click', e => { if (!dateRoot.contains(e.target as Node)) close(); });
  document.getElementById('cal-prev')?.addEventListener('click', e => {
    e.stopPropagation();
    if (--viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  document.getElementById('cal-next')?.addEventListener('click', e => {
    e.stopPropagation();
    if (++viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    (e.target as HTMLFormElement).innerHTML =
      '<p class="text-cream text-xl font-serif italic">Thank you. We\'ll be in touch.</p>';
  });
}
