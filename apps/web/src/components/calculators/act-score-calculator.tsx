"use client";

import {
  useState,
} from "react";

import {
  safeCalculateEnhancedActComposite,
  type EnhancedActCompositeResult,
} from "@education/calculators";

type ScoreField =
  | "english"
  | "math"
  | "reading"
  | "science";

type ScoreState = Record<
  ScoreField,
  string
>;

const initialScores: ScoreState = {
  english: "",
  math: "",
  reading: "",
  science: "",
};

function parseRequiredScore(
  value: string,
) {
  return value.trim() === ""
    ? Number.NaN
    : Number(value);
}

function parseOptionalScore(
  value: string,
) {
  return value.trim() === ""
    ? undefined
    : Number(value);
}

export function ACTScoreCalculator() {
  const [scores, setScores] =
    useState<ScoreState>(
      initialScores,
    );

  const [result, setResult] =
    useState<EnhancedActCompositeResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function updateScore(
    field: ScoreField,
    value: string,
  ) {
    setScores(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setResult(null);
    setErrors([]);
  }

  function resetCalculator() {
    setScores(initialScores);
    setResult(null);
    setErrors([]);
  }

  function calculate() {
    const calculation =
      safeCalculateEnhancedActComposite(
        {
          english:
            parseRequiredScore(
              scores.english,
            ),
          math:
            parseRequiredScore(
              scores.math,
            ),
          reading:
            parseRequiredScore(
              scores.reading,
            ),
          science:
            parseOptionalScore(
              scores.science,
            ),
        },
      );

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

  const fields: Array<{
    key: ScoreField;
    label: string;
    hint: string;
    optional?: boolean;
  }> = [
    {
      key: "english",
      label: "English",
      hint: "Scaled score from 1 to 36",
    },
    {
      key: "math",
      label: "Math",
      hint: "Scaled score from 1 to 36",
    },
    {
      key: "reading",
      label: "Reading",
      hint: "Scaled score from 1 to 36",
    },
    {
      key: "science",
      label: "Science",
      hint:
        "Optional scaled score from 1 to 36",
      optional: true,
    },
  ];

  return (
    <div className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-panel__header">
          <div>
            <span className="calculator-label">
              Your ACT scores
            </span>

            <h2>
              Enter section scores
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

        <p>
          Enter your scaled ACT
          section scores, not raw
          correct-answer counts.
          English, Math and Reading
          determine the Enhanced ACT
          Composite. Science is
          optional and does not change
          the Composite.
        </p>

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

        <div className="course-table">
          <div className="course-table__body">
            {fields.map(
              (field) => (
                <div
                  key={field.key}
                  className="course-row"
                >
                  <label
                    htmlFor={`act-${field.key}`}
                  >
                    {field.label}
                    {field.optional
                      ? " (optional)"
                      : ""}
                  </label>

                  <input
                    id={`act-${field.key}`}
                    name={field.key}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="36"
                    step="1"
                    value={
                      scores[
                        field.key
                      ]
                    }
                    placeholder="1–36"
                    aria-describedby={`act-${field.key}-hint`}
                    aria-invalid={
                      errors.some(
                        (error) =>
                          error
                            .toLowerCase()
                            .startsWith(
                              field.label.toLowerCase(),
                            ),
                      )
                        ? true
                        : undefined
                    }
                    onChange={(
                      event,
                    ) =>
                      updateScore(
                        field.key,
                        event.target
                          .value,
                      )
                    }
                  />

                  <span
                    id={`act-${field.key}-hint`}
                  >
                    {field.hint}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="calculator-actions">
          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate ACT score
          </button>
        </div>
      </div>

      <aside
        className="calculator-result"
        aria-live="polite"
      >
        <span className="calculator-label">
          Your result
        </span>

        {result ? (
          <>
            <div className="gpa-result">
              <strong>
                {result.composite}
              </strong>

              <span>
                ACT Composite / 36
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>
                  English
                </span>
                <strong>
                  {result.english}
                </strong>
              </div>

              <div>
                <span>
                  Math
                </span>
                <strong>
                  {result.math}
                </strong>
              </div>

              <div>
                <span>
                  Reading
                </span>
                <strong>
                  {result.reading}
                </strong>
              </div>

              <div>
                <span>
                  Science
                </span>
                <strong>
                  {result.science ??
                    "Not entered"}
                </strong>
              </div>

              <div>
                <span>
                  STEM
                </span>
                <strong>
                  {result.stem ??
                    "—"}
                </strong>
              </div>
            </div>

            <div className="result-message">
              <strong>
                Enhanced ACT Composite
              </strong>

              <p>
                The Composite is based
                on English, Math and
                Reading. Optional
                Science is reported
                separately and, when
                entered, is used with
                Math to calculate the
                STEM score.
              </p>
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <div>
              <span>—</span>
            </div>

            <h3>
              Your ACT Composite will
              appear here.
            </h3>

            <p>
              Enter English, Math and
              Reading scaled scores.
              Science is optional.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
