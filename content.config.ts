import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const link = z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string(),
  target: z.string().optional(),
});

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: "data",
      source: "index.yml",
      schema: z.object({
        header: z.object({
          title: z.string(),
          description: z.string(),
          image: z.string(),
          links: z.array(link),
        }),
      }),
    }),
    portfolio: defineCollection({
      type: "data",
      source: "portfolio.yml",
      schema: z.object({
        header: z.object({
          title: z.string(),
          description: z.string(),
        }),
        projects: z.array(
          z.object({
            title: z.string(),
            description: z.string().nullable(),
            to: z.string(),
            img: z.string(),
            align: z.enum(["left", "right"]),
          }),
        ),
      }),
    }),
    blogPage: defineCollection({
      type: "data",
      source: "blog.yml",
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        date: z.date(),
        image: z.object({ src: z.string() }).optional(),
        badge: z.object({ label: z.string() }).optional(),
        authors: z
          .array(
            z.object({
              name: z.string(),
              to: z.string().optional(),
              avatar: z.object({ src: z.string() }).optional(),
            }),
          )
          .optional(),
      }),
    }),
  },
});
