import type {
  ExamDefinition,
} from "../types";

export const DIGITAL_SAT_EXAM_ID =
  "digital-sat";

export const DIGITAL_SAT_DEFINITION:
  ExamDefinition = {
  id: DIGITAL_SAT_EXAM_ID,

  name: "Digital SAT",

  version: "2026.1",

  totalScoreMin: 400,
  totalScoreMax: 1600,

  sections: [
    {
      id: "reading-writing",

      name: "Reading and Writing",

      shortName: "RW",

      scoreMin: 200,
      scoreMax: 800,

      modules: [
        {
          id: "rw-module-1",
          name:
            "Reading and Writing Module 1",
          questionCount: 27,
        },
        {
          id: "rw-module-2",
          name:
            "Reading and Writing Module 2",
          questionCount: 27,
        },
      ],
    },

    {
      id: "math",

      name: "Math",

      shortName: "Math",

      scoreMin: 200,
      scoreMax: 800,

      modules: [
        {
          id: "math-module-1",
          name: "Math Module 1",
          questionCount: 22,
        },
        {
          id: "math-module-2",
          name: "Math Module 2",
          questionCount: 22,
        },
      ],
    },
  ],
};