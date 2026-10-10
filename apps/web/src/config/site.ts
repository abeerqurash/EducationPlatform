export const siteConfig = {
  name: "Education Platform",
  shortName: "EP",
  description:
    "Free calculators, test preparation, admissions tools and intelligent study resources built for students.",

  navigation: [
    {
      label: "Tools",
      href: "/tools",
    },
    {
      label: "Test Prep",
      href: "/test-prep",
    },
    {
      label: "Admissions",
      href: "/admissions",
    },
    {
      label: "Practice",
      href: "/practice",
    },
    {
      label: "Resources",
      href: "/resources",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ],

  toolCategories: [
    {
      name: "Grade Calculators",
      description:
        "Calculate grades, percentages and academic performance.",
      href: "/tools/grades",
      icon: "calculator",
    },
    {
      name: "GPA Calculators",
      description:
        "Understand and plan your GPA with accurate calculations.",
      href: "/tools/gpa",
      icon: "chart",
    },
    {
      name: "Test Prep",
      description:
        "Scores, conversions and planning tools for major exams.",
      href: "/tools/test-prep",
      icon: "book",
    },
    {
      name: "Admissions",
      description:
        "Plan applications, requirements and admission targets.",
      href: "/tools/admissions",
      icon: "graduation",
    },
    {
      name: "Study Tools",
      description:
        "Useful tools for studying, planning and productivity.",
      href: "/tools/study",
      icon: "study",
    },
    {
      name: "Math Tools",
      description:
        "Fast and accurate calculators for everyday mathematics.",
      href: "/tools/math",
      icon: "math",
    },
  ],

  popularTools: [
    {
      name: "GPA Calculator",
      description:
        "Calculate your GPA and understand where you stand.",
      href: "/tools/gpa/gpa-calculator",
      category: "Grades",
    },
    {
      name: "Grade Calculator",
      description:
        "Calculate weighted grades and required final scores.",
      href: "/tools/grades/grade-calculator",
      category: "Grades",
    },
    {
      name: "SAT Score Calculator",
      description:
        "Estimate and understand your SAT score.",
      href: "/tools/test-prep/digital-sat-score-calculator",
      category: "Test Prep",
    },
    {
      name: "Percentage Calculator",
      description:
        "Solve common percentage calculations instantly.",
      href: "/tools/math/percentage-calculator",
      category: "Math",
    },
  ],
} as const;
