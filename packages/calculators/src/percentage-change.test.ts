import {
    describe,
    expect,
    it,
} from "vitest";

import {
    calculatePercentageChange,
    safeCalculatePercentageChange,
} from "./percentage-change";

describe(
    "Percentage change calculator",
    () => {
        it(
            "calculates an increase",
            () => {
                const result =
                    calculatePercentageChange({
                        originalValue: 100,
                        newValue: 125,
                    });

                expect(
                    result.percentageChange,
                ).toBe(25);

                expect(
                    result.absoluteChange,
                ).toBe(25);

                expect(
                    result.direction,
                ).toBe("increase");
            },
        );

        it(
            "calculates a decrease",
            () => {
                const result =
                    calculatePercentageChange({
                        originalValue: 200,
                        newValue: 150,
                    });

                expect(
                    result.percentageChange,
                ).toBe(-25);

                expect(
                    result.direction,
                ).toBe("decrease");
            },
        );

        it(
            "detects no change",
            () => {
                const result =
                    calculatePercentageChange({
                        originalValue: 50,
                        newValue: 50,
                    });

                expect(
                    result.percentageChange,
                ).toBe(0);

                expect(
                    result.direction,
                ).toBe("no-change");
            },
        );

        it(
            "supports decimal values",
            () => {
                const result =
                    calculatePercentageChange({
                        originalValue: 80,
                        newValue: 100,
                    });

                expect(
                    result.percentageChange,
                ).toBe(25);
            },
        );

        it(
            "handles a negative baseline using its magnitude",
            () => {
                const result =
                    calculatePercentageChange({
                        originalValue: -100,
                        newValue: -50,
                    });

                expect(
                    result.percentageChange,
                ).toBe(50);

                expect(
                    result.direction,
                ).toBe("increase");
            },
        );

        it(
            "rejects a zero baseline",
            () => {
                expect(
                    safeCalculatePercentageChange({
                        originalValue: 0,
                        newValue: 50,
                    }).success,
                ).toBe(false);
            },
        );

        it(
            "rejects NaN",
            () => {
                expect(
                    safeCalculatePercentageChange({
                        originalValue:
                            Number.NaN,

                        newValue: 50,
                    }).success,
                ).toBe(false);
            },
        );

        it(
            "rejects infinity",
            () => {
                expect(
                    safeCalculatePercentageChange({
                        originalValue: 100,

                        newValue:
                            Number.POSITIVE_INFINITY,
                    }).success,
                ).toBe(false);
            },
        );
    },
);