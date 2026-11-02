import estate from '../assets/images/estate.webp';
import terrace from '../assets/images/terrace.webp';
import garden from '../assets/images/garden.webp';
import architecture from '../assets/images/architecture.webp';

export const suites = [
  {
    name: 'Caldera Suite',
    tagline: 'Where sky meets sea',
    index: '01',
    image: estate,
    imageAlt: 'The Caldera Suite terrace and plunge pool above the Aegean',
    description:
      'Our signature suite occupies the entire upper floor. Floor-to-ceiling glass frames an unbroken panorama of the caldera — from the volcanic islands to the open Aegean.',
    size: '95 m²',
    view: 'Caldera & Aegean',
    price: '€2,800',
    features: ['Private infinity plunge pool', 'Outdoor dining terrace', 'Fireplace', 'Walk-in dressing room', 'Wine fridge'],
  },
  {
    name: 'Aegean Suite',
    tagline: 'Suspended above the blue',
    index: '02',
    image: terrace,
    imageAlt: 'A whitewashed dome above the deep blue Aegean',
    description:
      'Cantilevered over the cliff edge, the Aegean Suite feels like sleeping on the water itself. A wraparound balcony traces the curve of the caldera.',
    size: '72 m²',
    view: 'Open sea',
    price: '€2,200',
    features: ['Heated plunge pool', 'Daybed terrace', 'Rainfall shower with sea view', 'Handmade ceramics'],
  },
  {
    name: 'Garden Suite',
    tagline: 'Rooted in the earth',
    index: '03',
    image: garden,
    imageAlt: 'Plants and whitewashed walls above the caldera',
    description:
      "Set within the estate's terraced gardens, this ground-level retreat opens directly onto a private courtyard of bougainvillea and olive trees.",
    size: '68 m²',
    view: 'Garden & partial sea',
    price: '€1,800',
    features: ['Private walled courtyard', 'Outdoor stone bathtub', 'Kitchenette', 'Direct garden access'],
  },
  {
    name: 'Cliff Studio',
    tagline: 'Intimate. Essential.',
    index: '04',
    image: architecture,
    imageAlt: 'Sculpted whitewashed cave architecture',
    description:
      'A sculpted cave suite carved into the volcanic rock. Minimal in footprint but maximal in atmosphere — whitewashed curves, absolute silence.',
    size: '45 m²',
    view: 'Caldera',
    price: '€1,200',
    features: ['Cave architecture', 'Caldera-view balcony', 'Curated minibar', 'Complimentary breakfast'],
  },
];
