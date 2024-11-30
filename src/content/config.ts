import { defineCollection, z } from 'astro:content';

const courses = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    order: z.number().optional(),
    codeExamples: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      code: z.string(),
    })).optional(),
  }),
});

export const collections = {
  'courses': courses,
};
