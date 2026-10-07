import { roundDecimal } from "./precision";

export type PercentageChangeDirection =
    | "increase"
    | "decrease"
    | "no-change";

export type PercentageChangeInput = {
    originalValue: number;
    newValue: number;
};

export type PercentageChangeResult = {
    originalValue: number;
    newValue: number;
    absoluteChange: number;
    percentageChange: number;
    direction: PercentageChangeDirection;
};

export type PercentageChangeValidationError = {
    field:
        | "originalValue"
        | "newValue";

    message: string;
};

export type PercentageChangeValidationResult =
    | {
        success: true;
        data: PercentageChangeResult;
        errors: [];
    }
    | {
        success: false;
        data: null;
        errors:
            PercentageChangeValidationError[];
    };

const MAX_ABSOLUTE_VALUE =
    1_000_000_000_000;

export function validatePercentageChangeInput(
    input: PercentageChangeInput,
): PercentageChangeValidationError[] {
    const errors:
        PercentageChangeValidationError[] =
        [];

    if (
        !Number.isFinite(
            input.originalValue,
        )
    ) {
        errors.push({
            field:
                "originalValue",

            message:
                "Original value must be a finite number.",
        });
    } else if (
        input.originalValue === 0
    ) {
        errors.push({
            field:
                "originalValue",

            message:
                "Original value cannot be zero when calculating percentage change.",
        });
    } else if (
        Math.abs(
            input.originalValue,
        ) >
        MAX_ABSOLUTE_VALUE
    ) {
        errors.push({
            field:
                "originalValue",

            message:
                `Original value cannot exceed ${MAX_ABSOLUTE_VALUE} in absolute value.`,
        });
    }

    if (
        !Number.isFinite(
            input.newValue,
        )
    ) {
        errors.push({
            field:
                "newValue",

            message:
                "New value must be a finite number.",
        });
    } else if (
        Math.abs(
            input.newValue,
        ) >
        MAX_ABSOLUTE_VALUE
    ) {
        errors.push({
            field:
                "newValue",

            message:
                `New value cannot exceed ${MAX_ABSOLUTE_VALUE} in absolute value.`,
        });
    }

    return errors;
}

export function calculatePercentageChange(
    input: PercentageChangeInput,
): PercentageChangeResult {
    const errors =
        validatePercentageChangeInput(
            input,
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

    const absoluteChange =
        input.newValue -
        input.originalValue;

    /*
     * Math.abs(originalValue) keeps the
     * magnitude interpretation intuitive
     * when the baseline itself is negative.
     */
    const percentageChange =
        (absoluteChange /
            Math.abs(
                input.originalValue,
            )) *
        100;

    if (
        !Number.isFinite(
            percentageChange,
        )
    ) {
        throw new Error(
            "The percentage change is outside the supported numeric range.",
        );
    }

    let direction:
        PercentageChangeDirection =
        "no-change";

    if (absoluteChange > 0) {
        direction = "increase";
    } else if (
        absoluteChange < 0
    ) {
        direction = "decrease";
    }

    return {
        originalValue:
            input.originalValue,

        newValue:
            input.newValue,

        absoluteChange:
            roundDecimal(
                absoluteChange,
                6,
            ),

        percentageChange:
            roundDecimal(
                percentageChange,
                6,
            ),

        direction,
    };
}

export function safeCalculatePercentageChange(
    input: PercentageChangeInput,
): PercentageChangeValidationResult {
    const errors =
        validatePercentageChangeInput(
            input,
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
            calculatePercentageChange(
                input,
            ),

        errors: [],
    };
}