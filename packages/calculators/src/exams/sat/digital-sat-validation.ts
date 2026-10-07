import type {
  DigitalSatInput,
  DigitalSatInputField,
  DigitalSatValidationError,
} from "./digital-sat-types";

const FIELD_RULES:
  ReadonlyArray<{
    field: DigitalSatInputField;
    label: string;
    maximum: number;
  }> = [
  {
    field:
      "readingWritingModule1Correct",

    label:
      "Reading and Writing Module 1",

    maximum: 27,
  },

  {
    field:
      "readingWritingModule2Correct",

    label:
      "Reading and Writing Module 2",

    maximum: 27,
  },

  {
    field:
      "mathModule1Correct",

    label: "Math Module 1",

    maximum: 22,
  },

  {
    field:
      "mathModule2Correct",

    label: "Math Module 2",

    maximum: 22,
  },
];

export function validateDigitalSatInput(
  input: DigitalSatInput,
): DigitalSatValidationError[] {
  const errors:
    DigitalSatValidationError[] =
    [];

  for (
    const rule of FIELD_RULES
  ) {
    const value =
      input[rule.field];

    if (
      !Number.isFinite(value)
    ) {
      errors.push({
        field: rule.field,

        message:
          `${rule.label} must be a number.`,
      });

      continue;
    }

    if (
      !Number.isInteger(value)
    ) {
      errors.push({
        field: rule.field,

        message:
          `${rule.label} must be a whole number.`,
      });

      continue;
    }

    if (
      value < 0 ||
      value > rule.maximum
    ) {
      errors.push({
        field: rule.field,

        message:
          `${rule.label} must be between 0 and ${rule.maximum}.`,
      });
    }
  }

  return errors;
}