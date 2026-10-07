"use client";

import {
    useState,
} from "react";

import {
    safeCalculateWeightedAverage,
    type WeightedAverageCalculationResult,
    type WeightedAverageItemInput,
} from "@education/calculators";

type WeightedRow = {
    id: number;
    name: string;
    value: string;
    weight: string;
};

function initialRows():
    WeightedRow[] {
    return [
        {
            id: 1,
            name: "",
            value: "90",
            weight: "60",
        },
        {
            id: 2,
            name: "",
            value: "80",
            weight: "40",
        },
    ];
}

export function WeightedAverageCalculator() {
    const [items, setItems] =
        useState<WeightedRow[]>(
            initialRows,
        );

    const [nextId, setNextId] =
        useState(3);

    const [result, setResult] =
        useState<WeightedAverageCalculationResult | null>(
            null,
        );

    const [errors, setErrors] =
        useState<string[]>([]);

    function clear() {
        setResult(null);
        setErrors([]);
    }

    function updateItem(
        id: number,
        field:
            | "name"
            | "value"
            | "weight",
        value: string,
    ) {
        clear();

        setItems((current) =>
            current.map(
                (item) =>
                    item.id === id
                        ? {
                              ...item,
                              [field]:
                                  value,
                          }
                        : item,
            ),
        );
    }

    function addItem() {
        if (
            items.length >= 500
        ) {
            setErrors([
                "A maximum of 500 items can be calculated at once.",
            ]);

            return;
        }

        clear();

        setItems(
            (current) => [
                ...current,
                {
                    id: nextId,
                    name: "",
                    value: "",
                    weight: "",
                },
            ],
        );

        setNextId(
            (current) =>
                current + 1,
        );
    }

    function removeItem(
        id: number,
    ) {
        if (
            items.length <= 1
        ) {
            return;
        }

        clear();

        setItems((current) =>
            current.filter(
                (item) =>
                    item.id !== id,
            ),
        );
    }

    function reset() {
        setItems(initialRows());
        setNextId(3);
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
        const input:
            WeightedAverageItemInput[] =
            items.map(
                (item) => ({
                    name:
                        item.name.trim() ||
                        "Item",

                    value:
                        parse(
                            item.value,
                        ),

                    weight:
                        parse(
                            item.weight,
                        ),
                }),
            );

        const calculation =
            safeCalculateWeightedAverage(
                input,
            );

        if (
            !calculation.success
        ) {
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
                            Weighted values
                        </span>

                        <h2>
                            Enter values and weights
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
                                (
                                    error,
                                ) => (
                                    <li
                                        key={
                                            error
                                        }
                                    >
                                        {
                                            error
                                        }
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                ) : null}

                <div className="course-table weighted-average-table">
                    <div className="course-table__head">
                        <span>
                            Item
                        </span>

                        <span>
                            Value
                        </span>

                        <span>
                            Weight
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
                                    key={
                                        item.id
                                    }
                                    className="course-row"
                                >
                                    <input
                                        type="text"
                                        value={
                                            item.name
                                        }
                                        placeholder={`Item ${
                                            index +
                                            1
                                        }`}
                                        aria-label={`Item ${
                                            index +
                                            1
                                        } name`}
                                        maxLength={
                                            80
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                "name",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        inputMode="decimal"
                                        value={
                                            item.value
                                        }
                                        aria-label={`Item ${
                                            index +
                                            1
                                        } value`}
                                        onChange={(
                                            event,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                "value",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        max="1000000"
                                        step="any"
                                        inputMode="decimal"
                                        value={
                                            item.weight
                                        }
                                        aria-label={`Item ${
                                            index +
                                            1
                                        } weight`}
                                        onChange={(
                                            event,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                "weight",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="course-row__remove"
                                        aria-label={`Remove item ${
                                            index +
                                            1
                                        }`}
                                        disabled={
                                            items.length <=
                                            1
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
                        onClick={
                            addItem
                        }
                    >
                        <span
                            aria-hidden="true"
                        >
                            +
                        </span>

                        Add item
                    </button>

                    <button
                        type="button"
                        className="button button--primary button--large"
                        onClick={
                            calculate
                        }
                    >
                        Calculate weighted average
                    </button>
                </div>
            </div>

            <aside
                className="calculator-result"
                aria-live="polite"
            >
                <span className="calculator-label">
                    Weighted average
                </span>

                {result ? (
                    <>
                        <div className="gpa-result">
                            <strong>
                                {result.weightedAverage.toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits:
                                            6,
                                    },
                                )}
                            </strong>

                            <span>
                                Weighted mean
                            </span>
                        </div>

                        <div className="result-stat-grid">
                            <div>
                                <span>
                                    Total weight
                                </span>

                                <strong>
                                    {
                                        result.totalWeight
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Weighted sum
                                </span>

                                <strong>
                                    {
                                        result.weightedSum
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
                    </>
                ) : (
                    <div className="calculator-result__empty">
                        <div>
                            <span>
                                0
                            </span>
                        </div>

                        <h3>
                            Your weighted average will appear here.
                        </h3>

                        <p>
                            Add values and their weights, then calculate.
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}