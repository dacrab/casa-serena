import 'leaflet/dist/leaflet.css';
import { site } from '../lib/site';
import { onPageLoad } from './lifecycle';

function init() {
  const target = document.getElementById('map');
  if (!target) return;

  const fallback = target.querySelector<HTMLElement>('[data-map-fallback]');
  let map: import('leaflet').Map | undefined;
  let cancelled = false;
  let started = false;

  const io = new IntersectionObserver(
    async entries => {
      if (started || !entries.some(e => e.isIntersecting)) return;
      started = true;
      io.disconnect();
      fallback?.classList.add('sr-only');

      try {
        const { default: L } = await import('leaflet');
        if (cancelled) return;

        const center: [number, number] = [site.geo.latitude, site.geo.longitude];
        map = L.map(target, { scrollWheelZoom: false, zoomControl: false, attributionControl: false }).setView(center, 18);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

        const pin = L.divIcon({
          className: '',
          html: `<svg width="36" height="48" viewBox="0 0 36 48" fill="none"><path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#C4714A"/><circle cx="18" cy="18" r="7" fill="#FDFAF5"/></svg>`,
          iconSize: [36, 48],
          iconAnchor: [18, 48],
        });
        L.marker(center, { icon: pin }).addTo(map);
        L.control.attribution({ position: 'bottomright', prefix: false }).addAttribution('© <a href="https://carto.com">CARTO</a>').addTo(map);

        fallback?.remove();
      } catch {
        fallback?.classList.remove('sr-only');
      }
    },
    { rootMargin: '400px' },
  );
  io.observe(target);

  return () => {
    cancelled = true;
    io.disconnect();
    map?.remove();
    map = undefined;
  };
}

onPageLoad(init);
