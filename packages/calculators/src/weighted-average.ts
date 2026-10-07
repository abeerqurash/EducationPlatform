import { roundDecimal } from "./precision";

export type WeightedAverageItemInput = {
    name: string;
    value: number;
    weight: number;
};

export type WeightedAverageCalculationResult = {
    weightedAverage: number;
    weightedSum: number;
    totalWeight: number;
    itemCount: number;
};

export type WeightedAverageValidationError = {
    itemIndex?: number;

    field:
        | "items"
        | "value"
        | "weight";

    message: string;
};

export type WeightedAverageValidationResult =
    | {
        success: true;

        data:
            WeightedAverageCalculationResult;

        errors: [];
    }
    | {
        success: false;

        data: null;

        errors:
            WeightedAverageValidationError[];
    };

export const MAX_WEIGHTED_ITEMS =
    500;

const MAX_ABSOLUTE_VALUE =
    1_000_000_000_000;

const MAX_WEIGHT =
    1_000_000;

export function validateWeightedAverageInputs(
    items:
        WeightedAverageItemInput[],
): WeightedAverageValidationError[] {
    const errors:
        WeightedAverageValidationError[] =
        [];

    if (items.length === 0) {
        errors.push({
            field: "items",

            message:
                "Add at least one value and weight.",
        });

        return errors;
    }

    if (
        items.length >
        MAX_WEIGHTED_ITEMS
    ) {
        errors.push({
            field: "items",

            message:
                `A maximum of ${MAX_WEIGHTED_ITEMS} items can be calculated at once.`,
        });
    }

    let totalWeight = 0;

    items.forEach(
        (item, itemIndex) => {
            if (
                !Number.isFinite(
                    item.value,
                )
            ) {
                errors.push({
                    itemIndex,
                    field: "value",

                    message:
                        `Item ${itemIndex + 1}: value must be a finite number.`,
                });
            } else if (
                Math.abs(
                    item.value,
                ) >
                MAX_ABSOLUTE_VALUE
            ) {
                errors.push({
                    itemIndex,
                    field: "value",

                    message:
                        `Item ${itemIndex + 1}: value is outside the supported range.`,
                });
            }

            if (
                !Number.isFinite(
                    item.weight,
                ) ||
                item.weight < 0 ||
                item.weight >
                    MAX_WEIGHT
            ) {
                errors.push({
                    itemIndex,
                    field: "weight",

                    message:
                        `Item ${itemIndex + 1}: weight must be between 0 and ${MAX_WEIGHT}.`,
                });
            } else {
                totalWeight +=
                    item.weight;
            }
        },
    );

    if (
        Number.isFinite(
            totalWeight,
        ) &&
        totalWeight <= 0
    ) {
        errors.push({
            field: "weight",

            message:
                "The total weight must be greater than zero.",
        });
    }

    return errors;
}

export function calculateWeightedAverage(
    items:
        WeightedAverageItemInput[],
): WeightedAverageCalculationResult {
    const errors =
        validateWeightedAverageInputs(
            items,
        );

    if (errors.length > 0) {
        throw new Error(
            errors
                .map(
                    (error) =>
                        error.message,
                )
                .join(" "),
        );
    }

    let weightedSum = 0;
    let totalWeight = 0;

    for (const item of items) {
        weightedSum +=
            item.value *
            item.weight;

        totalWeight +=
            item.weight;
    }

    if (
        !Number.isFinite(
            weightedSum,
        ) ||
        !Number.isFinite(
            totalWeight,
        )
    ) {
        throw new Error(
            "The weighted calculation is outside the supported numeric range.",
        );
    }

    const weightedAverage =
        weightedSum /
        totalWeight;

    return {
        weightedAverage:
            roundDecimal(
                weightedAverage,
                6,
            ),

        weightedSum:
            roundDecimal(
                weightedSum,
                6,
            ),

        totalWeight:
            roundDecimal(
                totalWeight,
                6,
            ),

        itemCount:
            items.length,
    };
}

export function safeCalculateWeightedAverage(
    items:
        WeightedAverageItemInput[],
): WeightedAverageValidationResult {
    const errors =
        validateWeightedAverageInputs(
            items,
        );

    if (errors.length > 0) {
        return {
            success: false,
            data: null,
            errors,
        };
    }

    return {
        success: true,

        data:
            calculateWeightedAverage(
                items,
            ),

        errors: [],
    };
}