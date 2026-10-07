import type {
  Metadata,
} from "next";

import {
  ACTScoreCalculator,
} from "@/components/calculators/act-score-calculator";

import {
  ToolPageShell,
} from "@/components/tools/tool-page-shell";

import type {
  ToolPageDefinition,
} from "@/lib/tools/tool-pages";

export const metadata:
  Metadata = {
    title:
      "ACT Score Calculator",
    description:
      "Calculate your Enhanced ACT Composite from English, Math and Reading scaled scores, with optional Science and STEM results.",
    alternates: {
      canonical:
        "/tools/test-prep/act-score-calculator",
    },
    openGraph: {
      title:
        "ACT Score Calculator",
      description:
        "Calculate your Enhanced ACT Composite from English, Math and Reading scaled scores, with optional Science and STEM results.",
      type:
        "website",
    },
  };

const tool = {
  slug:
    "act-score-calculator",

  category:
    "test-prep",

  calculatorKey:
    "enhancedAct",

  name:
    "ACT Score Calculator",

  shortName:
    "ACT Score Calculator",

  eyebrow:
    "Free ACT tool",

  description:
    "Calculate your Enhanced ACT Composite from English, Math and Reading scaled section scores. Add Science optionally to see your STEM score.",

  metaDescription:
    "Calculate your Enhanced ACT Composite from English, Math and Reading scaled scores, with optional Science and STEM results.",

  badges: [
    "Free",
    "No account required",
    "Enhanced ACT",
  ],

  methodology: {
    title:
      "How the Enhanced ACT Composite is calculated",

    introduction:
      "For the Enhanced ACT, the Composite is the average of the English, Math and Reading scaled section scores, rounded to the nearest whole number. Science is optional and is not included in the Composite.",

    formula:
      "Composite = round((English + Math + Reading) / 3)",

    sections: [
      {
        title:
          "Use scaled section scores",

        paragraphs: [
          "Enter the 1–36 scaled scores reported for English, Math and Reading. This calculator does not convert raw correct-answer totals because raw-to-scaled conversions can depend on the ACT test form.",
          "Each required section must be a whole-number score from 1 through 36.",
        ],
      },
      {
        title:
          "Optional Science and STEM",

        paragraphs: [
          "Science is optional under the Enhanced ACT and is not included in the Composite calculation.",
          "When a Science score is entered, the calculator also reports a STEM score based on Math and Science.",
        ],
      },
      {
        title:
          "Current scoring model",

        paragraphs: [
          "This calculator uses the Enhanced ACT scoring model effective for the current ACT format, rather than the older four-section Composite formula.",
          "For an official score report, use the score issued by ACT. This calculator calculates from scaled section scores you provide.",
        ],
      },
    ],
  },

  details: [
    {
      label: "Composite",
      value:
        "English + Math + Reading",
    },
    {
      label: "Scale",
      value: "1–36",
    },
    {
      label: "Science",
      value: "Optional",
    },
    {
      label: "STEM",
      value:
        "Math + Science",
    },
    {
      label: "Cost",
      value: "Free",
    },
    {
      label: "Account",
      value: "Not required",
    },
  ],

  faqs: [
    {
      question:
        "Which sections count toward the ACT Composite?",

      answer:
        "Under the Enhanced ACT scoring model, English, Math and Reading are averaged to calculate the Composite.",
    },
    {
      question:
        "Does Science count toward my ACT Composite?",

      answer:
        "No. Science is optional and is reported separately. When you provide a Science score, this calculator also reports a STEM score using Math and Science.",
    },
    {
      question:
        "Should I enter raw correct answers or scaled scores?",

      answer:
        "Enter your scaled section scores from 1 to 36. This calculator intentionally does not apply one universal raw-answer conversion because ACT raw-to-scaled conversions can be form-specific.",
    },
    {
      question:
        "How is the Enhanced ACT Composite rounded?",

      answer:
        "The English, Math and Reading section scores are averaged and the result is rounded to the nearest whole number using the ACT whole-number rounding rule.",
    },
    {
      question:
        "Is this an official ACT score report?",

      answer:
        "No. This calculator applies the Enhanced ACT Composite formula to the scaled section scores you enter. Your official score is the score reported by ACT.",
    },
  ],
} satisfies ToolPageDefinition;

export default function ACTScoreCalculatorPage() {
  return (
    <ToolPageShell
      tool={tool}
      database={null}
    >
      <ACTScoreCalculator />
    </ToolPageShell>
  );
}
