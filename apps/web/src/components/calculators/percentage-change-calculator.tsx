"use client";

import {
    useState,
} from "react";

import {
    safeCalculatePercentageChange,
    type PercentageChangeResult,
} from "@education/calculators";

export function PercentageChangeCalculator() {
    const [
        originalValue,
        setOriginalValue,
    ] = useState("100");

    const [
        newValue,
        setNewValue,
    ] = useState("125");

    const [result, setResult] =
        useState<PercentageChangeResult | null>(
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
        setOriginalValue("100");
        setNewValue("125");
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
            safeCalculatePercentageChange({
                originalValue:
                    parse(
                        originalValue,
                    ),

                newValue:
                    parse(
                        newValue,
                    ),
            });

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
                            Percentage change
                        </span>

                        <h2>
                            Compare two values
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

                <div className="final-grade-fields percentage-fields">
                    <label>
                        <span>
                            Original value
                        </span>

                        <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={
                                originalValue
                            }
                            onChange={(
                                event,
                            ) =>
                                update(
                                    setOriginalValue,
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />
                    </label>

                    <label>
                        <span>
                            New value
                        </span>

                        <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={
                                newValue
                            }
                            onChange={(
                                event,
                            ) =>
                                update(
                                    setNewValue,
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />
                    </label>
                </div>

                <div className="calculator-actions calculator-actions--end">
                    <button
                        type="button"
                        className="button button--primary button--large"
                        onClick={
                            calculate
                        }
                    >
                        Calculate change
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
                                {Math.abs(
                                    result.percentageChange,
                                ).toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits:
                                            6,
                                    },
                                )}
                                %
                            </strong>

                            <span>
                                {result.direction ===
                                "increase"
                                    ? "Increase"
                                    : result.direction ===
                                        "decrease"
                                      ? "Decrease"
                                      : "No change"}
                            </span>
                        </div>

                        <div className="result-stat-grid">
                            <div>
                                <span>
                                    Original
                                </span>

                                <strong>
                                    {
                                        result.originalValue
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    New
                                </span>

                                <strong>
                                    {
                                        result.newValue
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Difference
                                </span>

                                <strong>
                                    {
                                        result.absoluteChange
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="result-message">
                            <strong>
                                Percentage change
                            </strong>

                            <p>
                                The value{" "}
                                {result.direction ===
                                "increase"
                                    ? "increased"
                                    : result.direction ===
                                        "decrease"
                                      ? "decreased"
                                      : "did not change"}{" "}
                                by{" "}
                                {Math.abs(
                                    result.percentageChange,
                                ).toLocaleString(
                                    undefined,
                                    {
                                        maximumFractionDigits:
                                            6,
                                    },
                                )}
                                %.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="calculator-result__empty">
                        <div>
                            <span>
                                0%
                            </span>
                        </div>

                        <h3>
                            Your change will appear here.
                        </h3>

                        <p>
                            Enter the original and new values.
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}