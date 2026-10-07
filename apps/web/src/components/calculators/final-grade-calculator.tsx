"use client";

import {
  useState,
} from "react";

import {
  safeCalculateFinalGrade,
  type FinalGradeCalculationResult,
} from "@education/calculators";

type FieldName =
  | "currentGrade"
  | "completedWeight"
  | "desiredGrade";

type FormState =
  Record<
    FieldName,
    string
  >;

const initialForm:
  FormState = {
  currentGrade: "80",
  completedWeight: "70",
  desiredGrade: "85",
};

export function FinalGradeCalculator() {
  const [form, setForm] =
    useState<FormState>(
      initialForm,
    );

  const [result, setResult] =
    useState<FinalGradeCalculationResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function updateField(
    field: FieldName,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setResult(null);
    setErrors([]);
  }

  function resetCalculator() {
    setForm(initialForm);
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
      safeCalculateFinalGrade({
        currentGrade:
          parse(
            form.currentGrade,
          ),

        completedWeight:
          parse(
            form.completedWeight,
          ),

        desiredGrade:
          parse(
            form.desiredGrade,
          ),
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
              Final exam target
            </span>

            <h2>
              Find the grade you need
            </h2>
          </div>

          <button
            type="button"
            className="calculator-reset"
            onClick={
              resetCalculator
            }
          >
            Reset
          </button>
        </div>

        {errors.length > 0 ? (
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

        <div className="final-grade-fields">
          <label>
            <span>
              Current grade
            </span>

            <div className="percentage-input">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={
                  form.currentGrade
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "currentGrade",
                    event.target
                      .value,
                  )
                }
              />

              <span aria-hidden="true">
                %
              </span>
            </div>
          </label>

          <label>
            <span>
              Course weight completed
            </span>

            <div className="percentage-input">
              <input
                type="number"
                min="0"
                max="99.99"
                step="0.01"
                inputMode="decimal"
                value={
                  form.completedWeight
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "completedWeight",
                    event.target
                      .value,
                  )
                }
              />

              <span aria-hidden="true">
                %
              </span>
            </div>
          </label>

          <label>
            <span>
              Desired overall grade
            </span>

            <div className="percentage-input">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={
                  form.desiredGrade
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "desiredGrade",
                    event.target
                      .value,
                  )
                }
              />

              <span aria-hidden="true">
                %
              </span>
            </div>
          </label>
        </div>

        <div className="calculator-actions calculator-actions--end">
          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate final grade
          </button>
        </div>
      </div>

      <aside
        className="calculator-result"
        aria-live="polite"
      >
        <span className="calculator-label">
          Required final grade
        </span>

        {result ? (
          <>
            <div className="gpa-result">
              <strong>
                {Math.max(
                  0,
                  result.requiredFinalGrade,
                ).toFixed(2)}
                %
              </strong>

              <span>
                Final worth{" "}
                {result.finalWeight.toFixed(
                  2,
                )}
                %
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>
                  Current contribution
                </span>

                <strong>
                  {result.currentContribution.toFixed(
                    2,
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Maximum overall
                </span>

                <strong>
                  {result.maximumOverallGrade.toFixed(
                    2,
                  )}
                  %
                </strong>
              </div>
            </div>

            <div className="result-message">
              {result.status ===
              "above-normal-range" ? (
                <>
                  <strong>
                    Target requires
                    more than 100%
                  </strong>

                  <p>
                    You would need{" "}
                    {result.requiredFinalGrade.toFixed(
                      2,
                    )}
                    % on the remaining
                    assessment. Under a
                    normal 100% maximum,
                    the target is not
                    currently reachable
                    without extra credit
                    or another grading
                    adjustment.
                  </p>
                </>
              ) : result.status ===
                "already-secured" ? (
                <>
                  <strong>
                    Target already
                    secured
                  </strong>

                  <p>
                    Your completed work
                    already contributes
                    enough points to
                    reach the requested
                    overall grade. A
                    negative mathematical
                    requirement is shown
                    here as 0%.
                  </p>
                </>
              ) : (
                <>
                  <strong>
                    Your target
                  </strong>

                  <p>
                    You need about{" "}
                    {result.requiredFinalGrade.toFixed(
                      2,
                    )}
                    % on the remaining
                    assessment to finish
                    with{" "}
                    {
                      form.desiredGrade
                    }
                    % overall.
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <div>
              <span>
                0.00%
              </span>
            </div>

            <h3>
              Your required grade will
              appear here.
            </h3>

            <p>
              Enter your current grade,
              completed course weight
              and target grade.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}