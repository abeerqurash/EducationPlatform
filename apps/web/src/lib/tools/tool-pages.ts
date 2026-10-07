import type {
    CalculatorKey,
} from "@education/calculators";

export type ToolFAQ = {
    question: string;
    answer: string;
};

export type ToolMethodologySection = {
    title: string;
    paragraphs: string[];
};

export type ToolPageDefinition = {
    slug: string;
    category: string;

    calculatorKey:
    CalculatorKey;

    name: string;
    shortName: string;

    eyebrow: string;

    description: string;
    metaDescription: string;

    badges: string[];

    methodology: {
        title: string;
        introduction: string;
        formula?: string;
        sections:
        ToolMethodologySection[];
    };

    details: Array<{
        label: string;
        value: string;
    }>;

    faqs: ToolFAQ[];
};

const toolPages: Record<
    string,
    ToolPageDefinition
> = {
    "gpa/gpa-calculator": {
        slug: "gpa-calculator",
        category: "gpa",

        calculatorKey: "gpa",

        name: "GPA Calculator",
        shortName: "GPA Calculator",

        eyebrow:
            "Free GPA calculator",

        description:
            "Calculate your credit-weighted GPA from course grades and credit hours. Add your courses and get an instant result on a 4.0 scale.",

        metaDescription:
            "Calculate your GPA using course credit hours and grade points with our free 4.0 GPA calculator.",

        badges: [
            "Free to use",
            "No sign-up required",
            "4.0 scale",
        ],

        methodology: {
            title:
                "How to calculate your GPA",

            introduction:
                "This calculator uses a credit-weighted GPA calculation. Each course contributes according to both its grade points and its credit value.",

            formula:
                "GPA = Total quality points ÷ Total credits",

            sections: [
                {
                    title:
                        "How quality points are calculated",

                    paragraphs: [
                        "For each course, its grade-point value is multiplied by its credit value. The result is the number of quality points contributed by that course.",
                        "The quality points from all included courses are then added together.",
                    ],
                },
                {
                    title:
                        "Why course credits matter",

                    paragraphs: [
                        "Courses carrying more credits contribute more heavily to the final GPA than courses carrying fewer credits.",
                        "For example, a four-credit course affects the calculation more than a one-credit course when their grade-point values differ.",
                    ],
                },
                {
                    title:
                        "About the 4.0 scale",

                    paragraphs: [
                        "This version calculates a credit-weighted GPA using grade-point values from 0.0 through 4.0.",
                        "Schools and universities may use different grading scales, rounding policies or special rules. Always compare the result with the policy used by your institution.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Scale",
                value: "0.00–4.00",
            },
            {
                label: "Method",
                value: "Credit weighted",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value: "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "What GPA scale does this calculator use?",

                answer:
                    "This version uses grade-point values from 0.0 through 4.0 and calculates a credit-weighted GPA.",
            },
            {
                question:
                    "Does a course with more credits affect my GPA more?",

                answer:
                    "Yes. Because the calculation uses course credits, a higher-credit course contributes more quality points and therefore has a larger effect on the result.",
            },
            {
                question:
                    "Is this the same as a weighted honors or AP GPA?",

                answer:
                    "No. Credit weighting and honors or AP weighting are different concepts. This version supports grade-point values up to 4.0 and does not automatically add extra points for honors, AP or similar courses.",
            },
            {
                question:
                    "Can my school's GPA differ from this result?",

                answer:
                    "Yes. Institutions can use different grade-point mappings, course exclusions, repeated-course rules, rounding policies and weighted scales.",
            },
        ],
    }, "grades/grade-calculator": {
        slug: "grade-calculator",
        category: "grades",

        calculatorKey: "grade",

        name: "Grade Calculator",
        shortName:
            "Grade Calculator",

        eyebrow:
            "Free grade calculator",

        description:
            "Calculate your overall percentage from earned and possible points across assignments, quizzes, exams and other graded work.",

        metaDescription:
            "Calculate your grade percentage from earned and possible points with our free grade calculator.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Point based",
        ],

        methodology: {
            title:
                "How the grade calculator works",

            introduction:
                "This calculator uses a total-points method. It adds all earned points, adds all possible points, then calculates the percentage earned.",

            formula:
                "Grade percentage = Total earned points / Total possible points x 100",

            sections: [
                {
                    title:
                        "Why total points matter",

                    paragraphs: [
                        "Each graded item contributes according to the number of possible points assigned to it.",
                        "A 100-point exam therefore contributes more to the result than a 10-point assignment when a course uses a total-points grading system.",
                    ],
                },
                {
                    title:
                        "About the letter grade",

                    paragraphs: [
                        "The displayed A, B, C, D or F is an interpretation using a default 90, 80, 70 and 60 percent threshold scale.",
                        "Your school or course may use different grade boundaries, plus or minus grades, curves, weighting rules or other policies.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Scale",
                value: "0-100%",
            },
            {
                label: "Method",
                value:
                    "Total points",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "How is my grade percentage calculated?",

                answer:
                    "The calculator divides your total earned points by your total possible points and multiplies the result by 100.",
            },
            {
                question:
                    "Does this calculator average assignment percentages?",

                answer:
                    "No. This version uses total points. That means higher-point items have a larger effect on the result.",
            },
            {
                question:
                    "Does the letter grade match every school?",

                answer:
                    "No. The displayed letter grade uses a default threshold scale for interpretation. Institutions and individual courses may use different grade boundaries.",
            },
        ],
    },

    "grades/final-grade-calculator": {
        slug:
            "final-grade-calculator",

        category: "grades",

        calculatorKey:
            "finalGrade",

        name:
            "Final Grade Calculator",

        shortName:
            "Final Grade Calculator",

        eyebrow:
            "Free final grade calculator",

        description:
            "Find the score you need on your remaining final exam or assessment to reach a desired overall course grade.",

        metaDescription:
            "Calculate the grade you need on your final exam or remaining assessment to reach your target course grade.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Instant target",
        ],

        methodology: {
            title:
                "How to calculate the final grade you need",

            introduction:
                "The calculator determines how much your completed coursework already contributes to the overall course grade, then finds the score required from the remaining course weight.",

            formula:
                "Required final grade = (Target grade - Current grade x completed weight) / remaining weight",

            sections: [
                {
                    title:
                        "Completed and remaining weight",

                    paragraphs: [
                        "If 70% of a course has already been completed, the remaining assessment represents 30% of the overall course grade.",
                        "Your current grade is applied only to the completed portion when calculating its existing contribution.",
                    ],
                },
                {
                    title:
                        "Targets above 100%",

                    paragraphs: [
                        "A required result above 100% means the requested target cannot normally be reached from the remaining assessment alone when the maximum available score is 100%.",
                        "Extra credit, curves or institution-specific grading policies can change what is possible, so the calculator reports the mathematical requirement rather than silently limiting it to 100%.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Scale",
                value: "0-100%",
            },
            {
                label: "Method",
                value:
                    "Weighted target",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "What does course weight completed mean?",

                answer:
                    "It is the percentage of your total course grade represented by work that has already been completed and included in your current grade.",
            },
            {
                question:
                    "What if the required final grade is above 100%?",

                answer:
                    "That means the target is mathematically above the normal maximum available from the remaining assessment. Extra credit or a different grading policy may change the situation.",
            },
            {
                question:
                    "What if I have already secured my target grade?",

                answer:
                    "The mathematical requirement can become zero or negative when your completed coursework already contributes enough points to reach the requested target. The interface reports this as a 0% minimum requirement.",
            },
        ],
    }, "math/percentage-calculator": {
        slug:
            "percentage-calculator",

        category: "math",

        calculatorKey:
            "percentage",

        name:
            "Percentage Calculator",

        shortName:
            "Percentage Calculator",

        eyebrow:
            "Free percentage calculator",

        description:
            "Find what percentage one number is of another with a fast, free percentage calculator.",

        metaDescription:
            "Calculate what percentage one number is of another with our free online percentage calculator.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Instant result",
        ],

        methodology: {
            title:
                "How to calculate a percentage",

            introduction:
                "To find what percentage one number is of another, divide the part by the whole and multiply the result by 100.",

            formula:
                "Percentage = Part / Whole x 100",

            sections: [
                {
                    title:
                        "Part and whole",

                    paragraphs: [
                        "The part is the amount being compared. The whole is the reference amount that represents the complete quantity.",
                        "For example, if 25 students out of 200 meet a condition, 25 is the part and 200 is the whole.",
                    ],
                },
                {
                    title:
                        "Percentages above 100",

                    paragraphs: [
                        "A percentage can legitimately be greater than 100 when the part is larger than the whole.",
                        "For example, 150 is 150% of 100.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Method",
                value:
                    "Part / whole",
            },
            {
                label: "Output",
                value:
                    "Percentage",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "How do I find what percent X is of Y?",

                answer:
                    "Divide X by Y and multiply the result by 100.",
            },
            {
                question:
                    "Can a percentage be greater than 100?",

                answer:
                    "Yes. A percentage is greater than 100 when the part is larger than the whole.",
            },
            {
                question:
                    "Why can't the whole be zero?",

                answer:
                    "The calculation requires division by the whole, and division by zero is undefined.",
            },
        ],
    }, "math/average-calculator": {
        slug:
            "average-calculator",

        category: "math",

        calculatorKey:
            "average",

        name:
            "Average Calculator",

        shortName:
            "Average Calculator",

        eyebrow:
            "Free average calculator",

        description:
            "Calculate the arithmetic mean, sum, count, minimum and maximum for a set of numbers.",

        metaDescription:
            "Find the average of multiple numbers and see their sum, count, minimum and maximum.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Up to 1,000 values",
        ],

        methodology: {
            title:
                "How to calculate an average",

            introduction:
                "This calculator finds the arithmetic mean by adding all entered values and dividing their sum by the number of values.",

            formula:
                "Average = Sum of values / Number of values",

            sections: [
                {
                    title:
                        "Arithmetic mean",

                    paragraphs: [
                        "The arithmetic mean is the common form of average used for a set of equally weighted numerical values.",
                        "Every entered value contributes equally to the final average.",
                    ],
                },
                {
                    title:
                        "When a weighted average is different",

                    paragraphs: [
                        "A simple arithmetic mean should not be used when individual values have different weights.",
                        "Weighted grades, credit-weighted GPA and similar calculations require their own weighted formulas.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Method",
                value:
                    "Arithmetic mean",
            },
            {
                label: "Limit",
                value:
                    "1,000 values",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "How is the average calculated?",

                answer:
                    "All values are added together and the resulting sum is divided by the number of values.",
            },
            {
                question:
                    "Can I use negative numbers?",

                answer:
                    "Yes. Negative, zero and positive finite numbers are supported.",
            },
            {
                question:
                    "Is this a weighted average calculator?",

                answer:
                    "No. Every value in this calculator has equal weight.",
            },
        ],
    }, "math/percentage-change-calculator": {
        slug:
            "percentage-change-calculator",

        category: "math",

        calculatorKey:
            "percentageChange",

        name:
            "Percentage Change Calculator",

        shortName:
            "Percentage Change Calculator",

        eyebrow:
            "Free percentage change calculator",

        description:
            "Calculate the percentage increase or decrease between an original value and a new value.",

        metaDescription:
            "Calculate percentage increase or decrease between two values with our free percentage change calculator.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Increase or decrease",
        ],

        methodology: {
            title:
                "How to calculate percentage change",

            introduction:
                "Percentage change measures how much a value has increased or decreased relative to the magnitude of its original value.",

            formula:
                "Percentage change = (New value - Original value) / |Original value| x 100",

            sections: [
                {
                    title:
                        "Percentage increase and decrease",

                    paragraphs: [
                        "When the new value is greater than the original value, the result is an increase. When the new value is lower, the result is a decrease.",
                        "The calculator also reports the absolute numerical difference between the two values.",
                    ],
                },
                {
                    title:
                        "Why the original value cannot be zero",

                    paragraphs: [
                        "Ordinary percentage change uses the original value as its denominator.",
                        "When the original value is zero, there is no finite percentage baseline, so this calculator reports the input as undefined instead of displaying a misleading percentage.",
                    ],
                },
            ],
        },


        details: [
            {
                label: "Method",
                value:
                    "Relative change",
            },
            {
                label: "Output",
                value:
                    "Increase / decrease",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "How do I calculate percentage increase?",

                answer:
                    "Subtract the original value from the new value, divide the difference by the magnitude of the original value, and multiply by 100.",
            },
            {
                question:
                    "How do I calculate percentage decrease?",

                answer:
                    "The same percentage-change formula is used. A lower new value produces a negative change, which the calculator identifies as a decrease.",
            },
            {
                question:
                    "Can I calculate percentage change from zero?",

                answer:
                    "Not with the ordinary percentage-change formula because the original value is the denominator and division by zero is undefined.",
            },
        ],
    }, "math/weighted-average-calculator": {
        slug:
            "weighted-average-calculator",

        category: "math",

        calculatorKey:
            "weightedAverage",

        name:
            "Weighted Average Calculator",

        shortName:
            "Weighted Average Calculator",

        eyebrow:
            "Free weighted average calculator",

        description:
            "Calculate a weighted average when individual values contribute with different weights.",

        metaDescription:
            "Calculate a weighted average from multiple values and weights with our free weighted average calculator.",

        badges: [
            "Free to use",
            "No sign-up required",
            "Flexible weights",
        ],

        methodology: {
            title:
                "How to calculate a weighted average",

            introduction:
                "A weighted average gives each value a different level of influence. Each value is multiplied by its weight before the weighted products are combined.",

            formula:
                "Weighted average = Sum(value x weight) / Sum(weights)",

            sections: [
                {
                    title:
                        "How weights affect the result",

                    paragraphs: [
                        "Values with larger weights contribute more strongly to the final weighted average.",
                        "An item with zero weight has no effect on the result.",
                    ],
                },
                {
                    title:
                        "Weights do not need to total 100",

                    paragraphs: [
                        "The formula normalizes the weights by dividing by their total, so weights such as 20, 30 and 50 work just as ratios such as 2, 3 and 5 do.",
                        "For course grading, you should still use the exact weighting system specified by your institution.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Method",
                value:
                    "Weighted mean",
            },
            {
                label: "Limit",
                value:
                    "500 items",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value:
                    "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "What is a weighted average?",

                answer:
                    "A weighted average is an average in which some values contribute more than others according to their assigned weights.",
            },
            {
                question:
                    "Do my weights need to add up to 100?",

                answer:
                    "No. The mathematical formula works with any non-negative weights whose total is greater than zero.",
            },
            {
                question:
                    "What happens when a weight is zero?",

                answer:
                    "That value contributes nothing to the weighted result, although it remains part of the entered item list.",
            },
        ],
    }, "test-prep/digital-sat-score-calculator": {
        slug:
            "digital-sat-score-calculator",

        category:
            "test-prep",

        calculatorKey:
            "digitalSat",

        name:
            "Digital SAT Score Calculator",

        shortName:
            "Digital SAT Score Calculator",

        eyebrow:
            "Free SAT Tool",

        description:
            "Estimate your Digital SAT Reading and Writing, Math, and total score ranges from your module-level correct answers.",

        metaDescription:
            "Estimate your Digital SAT score range using your Reading and Writing and Math module results. Includes section estimates, total score range, methodology, and scoring limitations.",

        badges: [
            "Free",
            "No account required",
            "Transparent estimate",
        ],

        methodology: {
            title:
                "How the Digital SAT score estimator works",

            introduction:
                "The Digital SAT uses adaptive testing and item-level scoring characteristics, so correct-answer totals alone cannot reproduce an official College Board score. This calculator therefore reports an estimated range rather than claiming an exact official score.",

            sections: [
                {
                    title:
                        "Reading and Writing",

                    paragraphs: [
                        "The Reading and Writing section contains two modules. The calculator combines the correct-answer counts entered for both modules and maps that total through the selected estimation dataset.",
                    ],
                },

                {
                    title:
                        "Math",

                    paragraphs: [
                        "The Math section is handled separately using the correct-answer totals from its two modules. Its estimated section range remains within the SAT 200–800 section scale.",
                    ],
                },

                {
                    title:
                        "Why the result is a range",

                    paragraphs: [
                        "Official Digital SAT scoring cannot be reconstructed from four correct-answer totals alone. Adaptive routing, the specific questions administered, and question characteristics affect official scoring. A range communicates that uncertainty instead of presenting an estimated conversion as an official score.",
                    ],
                },
            ],
        },

        details: [
            {
                label: "Test",
                value: "Digital SAT",
            },
            {
                label: "Total scale",
                value: "400–1600",
            },
            {
                label: "Section scale",
                value: "200–800",
            },
            {
                label: "Result",
                value: "Estimated range",
            },
            {
                label: "Cost",
                value: "Free",
            },
            {
                label: "Account",
                value: "Not required",
            },
        ],

        faqs: [
            {
                question:
                    "Is this my official SAT score?",

                answer:
                    "No. The calculator provides an estimated score range. Official Digital SAT scoring depends on adaptive routing, the questions administered, and item-level scoring characteristics.",
            },

            {
                question:
                    "Why does the calculator show a score range?",

                answer:
                    "A correct-answer total alone is not sufficient to reconstruct an exact official Digital SAT score. Showing a range avoids presenting an estimate as an official conversion.",
            },

            {
                question:
                    "How many questions are in each SAT module?",

                answer:
                    "The calculator accepts up to 27 correct answers in each Reading and Writing module and up to 22 in each Math module.",
            },

            {
                question:
                    "What is the SAT score range?",

                answer:
                    "Reading and Writing and Math are each reported on a 200–800 scale, producing a total SAT score on the 400–1600 scale.",
            },
        ],
    },
} satisfies Record<
    string,
    ToolPageDefinition
>;

export function getToolPage(
    category: string,
    slug: string,
) {
    return (
        toolPages[
        `${category}/${slug}`
        ] ?? null
    );
}

export function getToolPageKeys() {
    return Object.keys(
        toolPages,
    );
}