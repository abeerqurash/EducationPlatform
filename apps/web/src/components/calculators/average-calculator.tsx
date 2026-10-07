"use client";

import {
  useState,
} from "react";

import {
  safeCalculateAverage,
  type AverageCalculationResult,
} from "@education/calculators";

type ValueRow = {
  id: number;
  value: string;
};

function initialValues():
  ValueRow[] {
  return [
    {
      id: 1,
      value: "10",
    },
    {
      id: 2,
      value: "20",
    },
    {
      id: 3,
      value: "30",
    },
  ];
}

export function AverageCalculator() {
  const [values, setValues] =
    useState<ValueRow[]>(
      initialValues,
    );

  const [nextId, setNextId] =
    useState(4);

  const [result, setResult] =
    useState<AverageCalculationResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function clear() {
    setResult(null);
    setErrors([]);
  }

  function updateValue(
    id: number,
    value: string,
  ) {
    clear();

    setValues((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              value,
            }
          : item,
      ),
    );
  }

  function addValue() {
    if (
      values.length >= 1000
    ) {
      setErrors([
        "A maximum of 1000 values can be calculated at once.",
      ]);

      return;
    }

    clear();

    setValues((current) => [
      ...current,
      {
        id: nextId,
        value: "",
      },
    ]);

    setNextId(
      (current) =>
        current + 1,
    );
  }

  function removeValue(
    id: number,
  ) {
    if (
      values.length <= 1
    ) {
      return;
    }

    clear();

    setValues((current) =>
      current.filter(
        (item) =>
          item.id !== id,
      ),
    );
  }

  function reset() {
    setValues(initialValues());
    setNextId(4);
    setResult(null);
    setErrors([]);
  }

  function calculate() {
    const parsed =
      values.map(
        (item) =>
          item.value.trim() ===
          ""
            ? Number.NaN
            : Number(
                item.value,
              ),
      );

    const calculation =
      safeCalculateAverage(
        parsed,
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

  return (
    <div className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-panel__header">
          <div>
            <span className="calculator-label">
              Number set
            </span>

            <h2>
              Enter your values
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

        <div className="average-value-list">
          {values.map(
            (
              item,
              index,
            ) => (
              <div
                key={item.id}
                className="average-value-row"
              >
                <label>
                  <span>
                    Value{" "}
                    {index + 1}
                  </span>

                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={
                      item.value
                    }
                    onChange={(
                      event,
                    ) =>
                      updateValue(
                        item.id,
                        event.target
                          .value,
                      )
                    }
                  />
                </label>

                <button
                  type="button"
                  className="course-row__remove"
                  aria-label={`Remove value ${
                    index + 1
                  }`}
                  disabled={
                    values.length <= 1
                  }
                  onClick={() =>
                    removeValue(
                      item.id,
                    )
                  }
                >
                  x
                </button>
              </div>
            ),
          )}
        </div>

        <div className="calculator-actions">
          <button
            type="button"
            className="calculator-add"
            onClick={addValue}
          >
            <span aria-hidden="true">
              +
            </span>

            Add value
          </button>

          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate average
          </button>
        </div>
      </div>

      <aside
        className="calculator-result"
        aria-live="polite"
      >
        <span className="calculator-label">
          Average
        </span>

        {result ? (
          <>
            <div className="gpa-result">
              <strong>
                {result.average.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits:
                      6,
                  },
                )}
              </strong>

              <span>
                Arithmetic mean
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>Sum</span>

                <strong>
                  {result.sum}
                </strong>
              </div>

              <div>
                <span>Count</span>

                <strong>
                  {result.count}
                </strong>
              </div>

              <div>
                <span>Minimum</span>

                <strong>
                  {result.minimum}
                </strong>
              </div>

              <div>
                <span>Maximum</span>

                <strong>
                  {result.maximum}
                </strong>
              </div>
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <div>
              <span>0</span>
            </div>

            <h3>
              Your average will appear
              here.
            </h3>

            <p>
              Add your numbers and
              calculate their arithmetic
              mean.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}