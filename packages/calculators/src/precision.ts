export type RoundingMode =
  | "half-up";

export const DEFAULT_ROUNDING_MODE:
  RoundingMode = "half-up";

export const MAX_DECIMAL_PLACES = 12;

function assertSupportedPrecision(
  decimals: number,
) {
  if (
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    decimals > MAX_DECIMAL_PLACES
  ) {
    throw new RangeError(
      `Decimal places must be an integer between 0 and ${MAX_DECIMAL_PLACES}.`,
    );
  }
}

function expandExponential(
  value: string,
): string {
  const match =
    /^([+-]?)(\d+)(?:\.(\d*))?[eE]([+-]?\d+)$/.exec(
      value,
    );

  if (!match) {
    return value;
  }

  const sign = match[1] ?? "";
  const integer = match[2] ?? "0";
  const fraction = match[3] ?? "";
  const exponent = Number(
    match[4] ?? "0",
  );

  const digits =
    `${integer}${fraction}`;
  const decimalIndex =
    integer.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${"0".repeat(
      -decimalIndex,
    )}${digits}`;
  }

  if (
    decimalIndex >= digits.length
  ) {
    return `${sign}${digits}${"0".repeat(
      decimalIndex - digits.length,
    )}`;
  }

  return `${sign}${digits.slice(
    0,
    decimalIndex,
  )}.${digits.slice(decimalIndex)}`;
}

function normalizeDecimalString(
  value: number,
): {
  negative: boolean;
  integer: string;
  fraction: string;
} {
  const expanded =
    expandExponential(
      Math.abs(value).toString(),
    );

  const [
    integer = "0",
    fraction = "",
  ] = expanded.split(".");

  return {
    negative:
      value < 0 ||
      Object.is(value, -0),
    integer,
    fraction,
  };
}

function incrementDigits(
  digits: string,
): string {
  const values =
    digits.split("");

  let carry = 1;

  for (
    let index =
      values.length - 1;
    index >= 0 &&
    carry === 1;
    index -= 1
  ) {
    const digit =
      Number(values[index]) +
      carry;

    values[index] =
      String(digit % 10);

    carry =
      digit >= 10 ? 1 : 0;
  }

  if (carry === 1) {
    values.unshift("1");
  }

  return values.join("");
}

export function roundHalfUp(
  value: number,
  decimals = 0,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(
      "Value must be a finite number.",
    );
  }

  assertSupportedPrecision(
    decimals,
  );

  if (value === 0) {
    return 0;
  }

  const {
    negative,
    integer,
    fraction,
  } = normalizeDecimalString(
    value,
  );

  const paddedFraction =
    fraction.padEnd(
      decimals + 1,
      "0",
    );

  const keptFraction =
    paddedFraction.slice(
      0,
      decimals,
    );

  const roundingDigit =
    Number(
      paddedFraction[
        decimals
      ] ?? "0",
    );

  let combined =
    `${integer}${keptFraction}`;

  if (roundingDigit >= 5) {
    combined =
      incrementDigits(combined);
  }

  const normalizedCombined =
    combined.padStart(
      decimals + 1,
      "0",
    );

  const resultString =
    decimals === 0
      ? normalizedCombined
      : `${normalizedCombined.slice(
          0,
          -decimals,
        )}.${normalizedCombined.slice(
          -decimals,
        )}`;

  const magnitude =
    Number(resultString);

  if (!Number.isFinite(magnitude)) {
    throw new RangeError(
      "Rounded result is outside the supported numeric range.",
    );
  }

  const result =
    negative
      ? -magnitude
      : magnitude;

  return Object.is(result, -0)
    ? 0
    : result;
}

export function roundDecimal(
  value: number,
  decimals = 0,
  mode:
    RoundingMode =
    DEFAULT_ROUNDING_MODE,
): number {
  switch (mode) {
    case "half-up":
      return roundHalfUp(
        value,
        decimals,
      );
  }
}
