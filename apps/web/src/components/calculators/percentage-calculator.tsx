"use client";

import {
  useState,
} from "react";

import {
  safeCalculatePercentage,
  type PercentageResult,
} from "@education/calculators";

export function PercentageCalculator() {
  const [part, setPart] =
    useState("25");

  const [whole, setWhole] =
    useState("200");

  const [result, setResult] =
    useState<PercentageResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function update(
    setter:
      React.Dispatch<
        React.SetStateAction<string>
      >,
    value: string,
  ) {
    setter(value);
    setResult(null);
    setErrors([]);
  }

  function reset() {
    setPart("25");
    setWhole("200");
    setResult(null);
    setErrors([]);
  }

  function parse(
    value: string,
  ) {
    return value.trim() === ""
      ? Number.NaN
      : Number(value);
  }

  function calculate() {
    const calculation =
      safeCalculatePercentage({
        part: parse(part),
        whole: parse(whole),
      });

    if (!calculation.success) {
      setResult(null);

      setErrors(
        calculation.errors.map(
          (error) =>
            error.message,
        ),
      );

      return;
    }

    setErrors([]);
    setResult(
      calculation.data,
    );
  }

  return (
    <div className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-panel__header">
          <div>
            <span className="calculator-label">
              Percentage
            </span>

            <h2>
              What percent is X of Y?
            </h2>
          </div>

          <button
            type="button"
            className="calculator-reset"
            onClick={reset}
          >
            Reset
          </button>
        </div>

        {errors.length ? (
          <div
            className="calculator-errors"
            role="alert"
            aria-live="assertive"
          >
            <strong>
              Check your entries
            </strong>

            <ul>
              {errors.map(
                (error) => (
                  <li key={error}>
                    {error}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : null}

        <div className="final-grade-fields percentage-fields">
          <label>
            <span>
              Part (X)
            </span>

            <input
              type="number"
              step="any"
              inputMode="decimal"
              value={part}
              onChange={(
                event,
              ) =>
                update(
                  setPart,
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Whole (Y)
            </span>

            <input
              type="number"
              step="any"
              inputMode="decimal"
              value={whole}
              onChange={(
                event,
              ) =>
                update(
                  setWhole,
                  event.target.value,
                )
              }
            />
          </label>
        </div>

        <div className="calculator-actions calculator-actions--end">
          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate percentage
          </button>
        </div>
      </div>

      <aside
        className="calculator-result"
        aria-live="polite"
      >
        <span className="calculator-label">
          Result
        </span>

        {result ? (
          <>
            <div className="gpa-result">
              <strong>
                {result.percentage.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits:
                      6,
                  },
                )}
                %
              </strong>

              <span>
                {result.part} is this
                percentage of{" "}
                {result.whole}
              </span>
            </div>

            <div className="result-message">
              <strong>
                Calculation
              </strong>

              <p>
                {result.part} /{" "}
                {result.whole} x 100
                ={" "}
                {result.percentage.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits:
                      6,
                  },
                )}
                %
              </p>
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <div>
              <span>0%</span>
            </div>

            <h3>
              Your percentage will
              appear here.
            </h3>

            <p>
              Enter the part and whole,
              then calculate.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}