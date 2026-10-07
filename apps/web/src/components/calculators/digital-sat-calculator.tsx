"use client";

import {
  useState,
} from "react";

import {
  safeCalculateDigitalSatEstimate,
  type DigitalSatEstimateResult,
} from "@education/calculators";

type SatFields = {
  rw1: string;
  rw2: string;
  math1: string;
  math2: string;
};

const INITIAL_VALUES: SatFields = {
  rw1: "20",
  rw2: "20",
  math1: "16",
  math2: "16",
};

function parseField(
  value: string,
) {
  if (value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

function ScoreRange({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  if (min === max) {
    return <>{min}</>;
  }

  return (
    <>
      {min}–{max}
    </>
  );
}

export function DigitalSatCalculator() {
  const [fields, setFields] =
    useState<SatFields>(
      INITIAL_VALUES,
    );

  const [result, setResult] =
    useState<DigitalSatEstimateResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function updateField(
    field: keyof SatFields,
    value: string,
  ) {
    setFields((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function reset() {
    setFields(INITIAL_VALUES);
    setResult(null);
    setErrors([]);
  }

  function calculate() {
    const calculation =
      safeCalculateDigitalSatEstimate({
        readingWritingModule1Correct:
          parseField(fields.rw1),

        readingWritingModule2Correct:
          parseField(fields.rw2),

        mathModule1Correct:
          parseField(fields.math1),

        mathModule2Correct:
          parseField(fields.math2),
      });

    if (!calculation.success) {
      setResult(null);

      setErrors(
        calculation.errors.map(
          (error) => error.message,
        ),
      );

      return;
    }

    setErrors([]);
    setResult(calculation.data);
  }

  return (
    <div className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-panel__header">
          <div>
            <span className="section-kicker">
              Digital SAT
            </span>

            <h2>
              Enter your correct answers
            </h2>

            <p>
              Enter the number of questions
              you answered correctly in each
              SAT module.
            </p>
          </div>

          <button
            type="button"
            className="calculator-reset"
            onClick={reset}
          >
            Reset
          </button>
        </div>

        {errors.length > 0 ? (
          <div
            className="calculator-errors"
            role="alert"
          >
            <strong>
              Check your answers
            </strong>

            <ul>
              {errors.map((error) => (
                <li key={error}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="sat-section-group">
          <div className="sat-section-heading">
            <div>
              <span className="section-kicker">
                Section 1
              </span>

              <h3>
                Reading and Writing
              </h3>
            </div>

            <span className="sat-score-scale">
              200–800
            </span>
          </div>

          <div className="sat-module-grid">
            <label className="calculator-label">
              <span>
                Module 1 correct
              </span>

              <div className="sat-input">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="27"
                  step="1"
                  value={fields.rw1}
                  onChange={(event) =>
                    updateField(
                      "rw1",
                      event.target.value,
                    )
                  }
                />

                <span>/ 27</span>
              </div>
            </label>

            <label className="calculator-label">
              <span>
                Module 2 correct
              </span>

              <div className="sat-input">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="27"
                  step="1"
                  value={fields.rw2}
                  onChange={(event) =>
                    updateField(
                      "rw2",
                      event.target.value,
                    )
                  }
                />

                <span>/ 27</span>
              </div>
            </label>
          </div>
        </div>

        <div className="sat-section-group">
          <div className="sat-section-heading">
            <div>
              <span className="section-kicker">
                Section 2
              </span>

              <h3>Math</h3>
            </div>

            <span className="sat-score-scale">
              200–800
            </span>
          </div>

          <div className="sat-module-grid">
            <label className="calculator-label">
              <span>
                Module 1 correct
              </span>

              <div className="sat-input">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="22"
                  step="1"
                  value={fields.math1}
                  onChange={(event) =>
                    updateField(
                      "math1",
                      event.target.value,
                    )
                  }
                />

                <span>/ 22</span>
              </div>
            </label>

            <label className="calculator-label">
              <span>
                Module 2 correct
              </span>

              <div className="sat-input">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="22"
                  step="1"
                  value={fields.math2}
                  onChange={(event) =>
                    updateField(
                      "math2",
                      event.target.value,
                    )
                  }
                />

                <span>/ 22</span>
              </div>
            </label>
          </div>
        </div>

        <div className="calculator-actions calculator-actions--end">
          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Estimate SAT score
          </button>
        </div>
      </div>

      <div
        className="calculator-result"
        aria-live="polite"
      >
        {result ? (
          <>
            <span className="section-kicker">
              Estimated SAT score
            </span>

            <div className="sat-total-result">
              <strong>
                <ScoreRange
                  min={
                    result
                      .estimatedTotalScore
                      .min
                  }
                  max={
                    result
                      .estimatedTotalScore
                      .max
                  }
                />
              </strong>

              <span>
                out of 1600
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>
                  Reading & Writing
                </span>

                <strong>
                  <ScoreRange
                    min={
                      result
                        .readingWriting
                        .estimatedScore
                        .min
                    }
                    max={
                      result
                        .readingWriting
                        .estimatedScore
                        .max
                    }
                  />
                </strong>

                <small>
                  {
                    result
                      .readingWriting
                      .correct
                  }
                  /54 correct
                </small>
              </div>

              <div>
                <span>Math</span>

                <strong>
                  <ScoreRange
                    min={
                      result.math
                        .estimatedScore
                        .min
                    }
                    max={
                      result.math
                        .estimatedScore
                        .max
                    }
                  />
                </strong>

                <small>
                  {result.math.correct}
                  /44 correct
                </small>
              </div>
            </div>

            <div className="sat-estimate-notice">
              <strong>
                Score estimate
              </strong>

              <p>
                {result.disclaimer}
              </p>
            </div>

            <div className="sat-dataset-note">
              <span>
                Estimation model
              </span>

              <strong>
                {result.dataset.version}
              </strong>
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <span className="section-kicker">
              Your result
            </span>

            <h3>
              SAT estimate will appear here
            </h3>

            <p>
              Enter your correct answers for
              all four modules and calculate
              your estimated score range.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}