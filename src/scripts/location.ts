import 'leaflet/dist/leaflet.css';
import { site } from '../lib/site';
import { onPageLoad } from './lifecycle';

function init() {
  const target = document.getElementById('map');
  if (!target) return;

  const fallback = target.querySelector<HTMLElement>('[data-map-fallback]');
  let map: import('leaflet').Map | undefined;
  let cancelled = false;

  const observer = new IntersectionObserver(
    async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();

      try {
        const { default: L } = await import('leaflet');
        if (cancelled) return;

        const center: [number, number] = [site.geo.latitude, site.geo.longitude];
        map = L.map(target, { scrollWheelZoom: false, zoomControl: false, attributionControl: false }).setView(center, 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const pin = L.divIcon({
          className: '',
          html: '<svg width="34" height="46" viewBox="0 0 36 48" fill="none"><path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#a9512c"/><circle cx="18" cy="18" r="7" fill="#faf7f1"/></svg>',
          iconSize: [34, 46],
          iconAnchor: [17, 46],
        });
        L.marker(center, { icon: pin }).addTo(map);
        L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

        fallback?.remove();
      } catch {
        // Keep the address fallback visible if the map cannot load.
      }
    },
    { rootMargin: '400px' },
  );
  observer.observe(target);

  return () => {
    cancelled = true;
    observer.disconnect();
    map?.remove();
    map = undefined;
  };
}

onPageLoad(init);
