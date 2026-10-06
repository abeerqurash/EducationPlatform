export const siteConfig = {
  name: "Education Platform",

  description:
    "Education, test preparation, academic calculators and student intelligence platform.",

  defaultLocale: "en",

  supportedLocales: ["en"] as const,

  social: {
    facebook: null,
    instagram: null,
    linkedin: null,
    youtube: null,
    x: null,
    tiktok: null,
  },
} as const;

export type SupportedLocale =
  (typeof siteConfig.supportedLocales)[number];