import {
    describe,
    expect,
    it,
} from "vitest";

import {
    calculateWeightedAverage,
    safeCalculateWeightedAverage,
} from "./weighted-average";

describe(
    "Weighted average calculator",
    () => {
        it(
            "calculates a weighted average",
            () => {
                const result =
                    calculateWeightedAverage([
                        {
                            name: "Exam",
                            value: 90,
                            weight: 60,
                        },
                        {
                            name: "Coursework",
                            value: 80,
                            weight: 40,
                        },
                    ]);

                expect(
                    result.weightedAverage,
                ).toBe(86);

                expect(
                    result.totalWeight,
                ).toBe(100);
            },
        );

        it(
            "does not require weights to total 100",
            () => {
                const result =
                    calculateWeightedAverage([
                        {
                            name: "A",
                            value: 10,
                            weight: 2,
                        },
                        {
                            name: "B",
                            value: 20,
                            weight: 3,
                        },
                    ]);

                expect(
                    result.weightedAverage,
                ).toBe(16);

                expect(
                    result.totalWeight,
                ).toBe(5);
            },
        );

        it(
            "supports decimal weights",
            () => {
                const result =
                    calculateWeightedAverage([
                        {
                            name: "A",
                            value: 80,
                            weight: 1.5,
                        },
                        {
                            name: "B",
                            value: 100,
                            weight: 0.5,
                        },
                    ]);

                expect(
                    result.weightedAverage,
                ).toBe(85);
            },
        );

        it(
            "supports negative values",
            () => {
                const result =
                    calculateWeightedAverage([
                        {
                            name: "A",
                            value: -10,
                            weight: 1,
                        },
                        {
                            name: "B",
                            value: 10,
                            weight: 1,
                        },
                    ]);

                expect(
                    result.weightedAverage,
                ).toBe(0);
            },
        );

        it(
            "allows an individual zero weight",
            () => {
                const result =
                    calculateWeightedAverage([
                        {
                            name: "Ignored",
                            value: 100,
                            weight: 0,
                        },
                        {
                            name: "Used",
                            value: 50,
                            weight: 10,
                        },
                    ]);

                expect(
                    result.weightedAverage,
                ).toBe(50);
            },
        );

        it(
            "rejects all-zero weights",
            () => {
                expect(
                    safeCalculateWeightedAverage([
                        {
                            name: "A",
                            value: 10,
                            weight: 0,
                        },
                    ]).success,
                ).toBe(false);
            },
        );

        it(
            "rejects negative weights",
            () => {
                expect(
                    safeCalculateWeightedAverage([
                        {
                            name: "A",
                            value: 10,
                            weight: -1,
                        },
                    ]).success,
                ).toBe(false);
            },
        );

        it(
            "rejects an empty list",
            () => {
                expect(
                    safeCalculateWeightedAverage(
                        [],
                    ).success,
                ).toBe(false);
            },
        );
    },
);