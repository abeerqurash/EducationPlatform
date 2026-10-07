"use client";

import {
  useState,
} from "react";

import {
  safeCalculateGPA,
  type GPACalculationResult,
  type GPACourseInput,
} from "@education/calculators";

import { Select } from "@/components/ui/select";

type CourseRow = {
  id: number;
  name: string;
  credits: string;
  gradePoints: string;
};

const gradeOptions = [
  { label: "A / 4.0", value: "4" },
  { label: "A− / 3.7", value: "3.7" },
  { label: "B+ / 3.3", value: "3.3" },
  { label: "B / 3.0", value: "3" },
  { label: "B− / 2.7", value: "2.7" },
  { label: "C+ / 2.3", value: "2.3" },
  { label: "C / 2.0", value: "2" },
  { label: "C− / 1.7", value: "1.7" },
  { label: "D+ / 1.3", value: "1.3" },
  { label: "D / 1.0", value: "1" },
  { label: "F / 0.0", value: "0" },
];

function createInitialCourses():
  CourseRow[] {
  return [
    {
      id: 1,
      name: "",
      credits: "3",
      gradePoints: "4",
    },
    {
      id: 2,
      name: "",
      credits: "3",
      gradePoints: "3.7",
    },
    {
      id: 3,
      name: "",
      credits: "3",
      gradePoints: "3.3",
    },
  ];
}

export function GPACalculator() {
  const [courses, setCourses] =
    useState<CourseRow[]>(
      createInitialCourses,
    );

  const [nextCourseId, setNextCourseId] =
    useState(4);

  const [result, setResult] =
    useState<GPACalculationResult | null>(
      null,
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function clearCalculatedState() {
    setResult(null);
    setErrors([]);
  }

  function updateCourse(
    id: number,
    field:
      | "name"
      | "credits"
      | "gradePoints",
    value: string,
  ) {
    clearCalculatedState();

    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? {
              ...course,
              [field]: value,
            }
          : course,
      ),
    );
  }

  function addCourse() {
    if (
      courses.length >= 100
    ) {
      setErrors([
        "A maximum of 100 courses can be calculated at once.",
      ]);

      return;
    }

    clearCalculatedState();

    setCourses((current) => [
      ...current,
      {
        id: nextCourseId,
        name: "",
        credits: "3",
        gradePoints: "4",
      },
    ]);

    setNextCourseId(
      (current) =>
        current + 1,
    );
  }

  function removeCourse(
    id: number,
  ) {
    if (
      courses.length <= 1
    ) {
      return;
    }

    clearCalculatedState();

    setCourses((current) =>
      current.filter(
        (course) =>
          course.id !== id,
      ),
    );
  }

  function resetCalculator() {
    setCourses(
      createInitialCourses(),
    );

    setNextCourseId(4);
    setResult(null);
    setErrors([]);
  }

  function calculate() {
    const inputs:
      GPACourseInput[] =
      courses.map(
        (course) => ({
          name:
            course.name.trim() ||
            "Course",
          credits:
            course.credits.trim() ===
            ""
              ? Number.NaN
              : Number(
                  course.credits,
                ),
          gradePoints:
            course.gradePoints.trim() ===
            ""
              ? Number.NaN
              : Number(
                  course.gradePoints,
                ),
        }),
      );

    const calculation =
      safeCalculateGPA(inputs);

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
              Your courses
            </span>

            <h2>
              Enter your grades
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

        <div className="course-table">
          <div className="course-table__head">
            <span>Course</span>
            <span>Credits</span>
            <span>Grade</span>
            <span aria-hidden="true" />
          </div>

          <div className="course-table__body">
            {courses.map(
              (
                course,
                index,
              ) => (
                <div
                  key={course.id}
                  className="course-row"
                >
                  <input
                    type="text"
                    value={
                      course.name
                    }
                    placeholder={`Course ${
                      index + 1
                    }`}
                    aria-label={`Course ${
                      index + 1
                    } name`}
                    maxLength={80}
                    onChange={(
                      event,
                    ) =>
                      updateCourse(
                        course.id,
                        "name",
                        event
                          .target
                          .value,
                      )
                    }
                  />

                  <input
                    type="number"
                    value={
                      course.credits
                    }
                    aria-label={`Course ${
                      index + 1
                    } credits`}
                    min="0.25"
                    max="100"
                    step="0.25"
                    inputMode="decimal"
                    onChange={(
                      event,
                    ) =>
                      updateCourse(
                        course.id,
                        "credits",
                        event
                          .target
                          .value,
                      )
                    }
                  />

                  <Select
                    name={`grade-${course.id}`}
                    label={`Course ${
                      index + 1
                    } grade`}
                    hideLabel
                    value={
                      course.gradePoints
                    }
                    options={
                      gradeOptions
                    }
                    className="course-grade-select"
                    onChange={(
                      value,
                    ) =>
                      updateCourse(
                        course.id,
                        "gradePoints",
                        value,
                      )
                    }
                  />

                  <button
                    type="button"
                    className="course-row__remove"
                    aria-label={`Remove course ${
                      index + 1
                    }`}
                    disabled={
                      courses.length <=
                      1
                    }
                    onClick={() =>
                      removeCourse(
                        course.id,
                      )
                    }
                  >
                    ×
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
            onClick={addCourse}
          >
            <span aria-hidden="true">
              +
            </span>

            Add course
          </button>

          <button
            type="button"
            className="button button--primary button--large"
            onClick={calculate}
          >
            Calculate GPA
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
                {result.gpa.toFixed(
                  2,
                )}
              </strong>

              <span>
                GPA / 4.00
              </span>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>
                  Total credits
                </span>

                <strong>
                  {
                    result.totalCredits
                  }
                </strong>
              </div>

              <div>
                <span>
                  Quality points
                </span>

                <strong>
                  {
                    result.totalQualityPoints
                  }
                </strong>
              </div>

              <div>
                <span>
                  Courses
                </span>

                <strong>
                  {
                    result.courseCount
                  }
                </strong>
              </div>
            </div>

            <div className="result-message">
              <strong>
                Your calculated GPA
              </strong>

              <p>
                This calculation
                uses course credit
                hours and grade
                points on the
                selected 4.0 scale.
              </p>
            </div>
          </>
        ) : (
          <div className="calculator-result__empty">
            <div>
              <span>0.00</span>
            </div>

            <h3>
              Your GPA will appear
              here.
            </h3>

            <p>
              Add your courses,
              credits and grades,
              then calculate your
              GPA.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}