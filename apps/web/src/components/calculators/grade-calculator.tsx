"use client";

import {
  useState,
} from "react";

import {
  safeCalculateGrade,
  type GradeCalculationResult,
  type GradeItemInput,
} from "@education/calculators";

type GradeRow = {
  id: number;
  name: string;
  earnedPoints: string;
  possiblePoints: string;
};

function initialRows():
  GradeRow[] {
  return [
    {
      id: 1,
      name: "",
      earnedPoints: "45",
      possiblePoints: "50",
    },
    {
      id: 2,
      name: "",
      earnedPoints: "80",
      possiblePoints: "100",
    },
    {
      id: 3,
      name: "",
      earnedPoints: "40",
      possiblePoints: "50",
    },
  ];
}

export function GradeCalculator() {
  const [items, setItems] =
    useState<GradeRow[]>(
      initialRows,
    );

  const [nextId, setNextId] =
    useState(4);

  const [result, setResult] =
    useState<GradeCalculationResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function clearResult() {
    setResult(null);
    setErrors([]);
  }

  function updateItem(
    id: number,
    field:
      | "name"
      | "earnedPoints"
      | "possiblePoints",
    value: string,
  ) {
    clearResult();

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    if (items.length >= 200) {
      setErrors([
        "A maximum of 200 graded items can be calculated at once.",
      ]);

      return;
    }

    clearResult();

    setItems((current) => [
      ...current,
      {
        id: nextId,
        name: "",
        earnedPoints: "",
        possiblePoints: "100",
      },
    ]);

    setNextId(
      (current) =>
        current + 1,
    );
  }

  function removeItem(
    id: number,
  ) {
    if (items.length <= 1) {
      return;
    }

    clearResult();

    setItems((current) =>
      current.filter(
        (item) =>
          item.id !== id,
      ),
    );
  }

  function resetCalculator() {
    setItems(initialRows());
    setNextId(4);
    setResult(null);
    setErrors([]);
  }

  function calculate() {
    const input:
      GradeItemInput[] =
      items.map(
        (item) => ({
          name:
            item.name.trim() ||
            "Graded item",

          earnedPoints:
            item.earnedPoints.trim() ===
            ""
              ? Number.NaN
              : Number(
                  item.earnedPoints,
                ),

          possiblePoints:
            item.possiblePoints.trim() ===
            ""
              ? Number.NaN
              : Number(
                  item.possiblePoints,
                ),
        }),
      );

    const calculation =
      safeCalculateGrade(input);

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
              Your graded items
            </span>

            <h2>
              Enter your points
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

        <div className="course-table grade-table">
          <div className="course-table__head">
            <span>
              Item
            </span>

            <span>
              Earned
            </span>

            <span>
              Possible
            </span>

            <span
              aria-hidden="true"
            />
          </div>

          <div className="course-table__body">
            {items.map(
              (
                item,
                index,
              ) => (
                <div
                  key={item.id}
                  className="course-row"
                >
                  <input
                    type="text"
                    value={
                      item.name
                    }
                    placeholder={`Item ${
                      index + 1
                    }`}
                    aria-label={`Item ${
                      index + 1
                    } name`}
                    maxLength={80}
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        "name",
                        event.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="number"
                    value={
                      item.earnedPoints
                    }
                    aria-label={`Item ${
                      index + 1
                    } earned points`}
                    min="0"
                    max="1000000"
                    step="0.01"
                    inputMode="decimal"
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        "earnedPoints",
                        event.target
                          .value,
                      )
                    }
                  />

                  <input
                    type="number"
                    value={
                      item.possiblePoints
                    }
                    aria-label={`Item ${
                      index + 1
                    } possible points`}
                    min="0.01"
                    max="1000000"
                    step="0.01"
                    inputMode="decimal"
                    onChange={(
                      event,
                    ) =>
                      updateItem(
                        item.id,
                        "possiblePoints",
                        event.target
                          .value,
                      )
                    }
                  />

                  <button
                    type="button"
                    className="course-row__remove"
                    aria-label={`Remove item ${
                      index + 1
                    }`}
                    disabled={
                      items.length <= 1
                    }
                    onClick={() =>
                      removeItem(
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
        </div>

        <div className="calculator-actions">
          <button
            type="button"
            className="calculator-add"
            onClick={addItem}
          >
            <span aria-hidden="true">
              +
            </span>

            Add item
          </button>

          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate grade
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
                {result.percentage.toFixed(
                  2,
                )}
                %
              </strong>

              <span>
                Grade:{" "}
                {result.letterGrade}
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>
                  Earned
                </span>

                <strong>
                  {
                    result.totalEarnedPoints
                  }
                </strong>
              </div>

              <div>
                <span>
                  Possible
                </span>

                <strong>
                  {
                    result.totalPossiblePoints
                  }
                </strong>
              </div>

              <div>
                <span>
                  Items
                </span>

                <strong>
                  {
                    result.itemCount
                  }
                </strong>
              </div>
            </div>

            <div className="result-message">
              <strong>
                Your calculated grade
              </strong>

              <p>
                The percentage uses
                total earned points
                divided by total
                possible points. The
                displayed letter grade
                uses a default
                90/80/70/60 scale and
                may differ from your
                institution.
              </p>
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
              Your grade will appear
              here.
            </h3>

            <p>
              Add your earned and
              possible points, then
              calculate your grade.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}