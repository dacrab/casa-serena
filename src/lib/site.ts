const phone = '+30 22860 00000';

const address = {
  name: 'Casa Serena Estate',
  street: 'Caldera Cliffs',
  locality: 'Oia',
  region: 'Santorini',
  postalCode: '847 02',
  country: 'Greece',
  countryCode: 'GR',
} as const;

export const site = {
  name: 'Casa Serena',
  email: 'info@casaserena.com',
  phone,
  phoneHref: phone.replace(/[^\d+]/g, ''),
  address,
  addressLine: `${address.locality}, ${address.region} ${address.postalCode}, ${address.country}`,
  geo: { latitude: 36.4618, longitude: 25.3753 },
  lastUpdated: 'January 2025',
};

export const navLinks = [
  { href: '/suites', label: 'Suites' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/enquire', label: 'Enquire' },
];

export const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://facebook.com', label: 'Facebook' },
];
