import { defineCollection } from 'astro:content';
import { z } from 'zod';

const suites = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    price: z.string(),
    specs: z.object({
      size: z.string(),
      bed: z.string(),
      terrace: z.string(),
      view: z.string(),
      bath: z.string(),
      guests: z.string(),
    }),
    features: z.array(z.string()),
    order: z.number(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    detail: z.string(),
    order: z.number(),
  }),
});

export const collections = { suites, testimonials };
