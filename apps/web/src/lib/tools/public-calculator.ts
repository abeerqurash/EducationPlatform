import {
    getPublicCalculatorWithReadiness,
    type CalculatorPublicationReadiness,
    type PublicCalculatorRecord,
} from "@education/database";

import {
    getToolPage,
} from "./tool-pages";

export type PublicToolRuntime = {
    presentation:
    NonNullable<
        ReturnType<
            typeof getToolPage
        >
    >;

    database:
    PublicCalculatorRecord | null;

    readiness:
    CalculatorPublicationReadiness | null;

    source:
    | "database"
    | "fallback";
};

export async function getPublicToolRuntime(
    category: string,
    slug: string,
): Promise<
    PublicToolRuntime | null
> {
    const presentation =
        getToolPage(
            category,
            slug,
        );

    if (!presentation) {
        return null;
    }

    try {
        const result =
            await getPublicCalculatorWithReadiness(
                category,
                slug,
            );

        return {
            presentation,

            database:
                result?.calculator ??
                null,

            readiness:
                result?.readiness ??
                null,

            source: result
                ? "database"
                : "fallback",
        };
    } catch (error) {
        if (
            process.env.NODE_ENV ===
            "development"
        ) {
            console.error(
                "Public calculator database lookup failed:",
                error,
            );
        }

        return {
            presentation,
            database: null,
            readiness: null,
            source: "fallback",
        };
    }
}