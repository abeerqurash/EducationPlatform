import Link from "next/link";

import {
  ArrowRightIcon,
  BookIcon,
} from "@/components/ui/icons";

const exams = [
  "SAT",
  "ACT",
  "IELTS",
  "TOEFL",
  "GRE",
  "GMAT",
];

export function TestPrep() {
  return (
    <section className="section">
      <div className="site-container test-prep">
        <div className="test-prep__content">
          <span className="section-kicker section-kicker--light">
            Test preparation
          </span>

          <h2>
            Turn your target score into a clear plan.
          </h2>

          <p>
            Explore score calculators, exam resources, practice
            support and planning tools designed around major
            international tests.
          </p>

          <Link
            href="/test-prep"
            className="button button--light button--large"
          >
            Explore test prep
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="exam-grid">
          {exams.map((exam, index) => (
            <div key={exam} className="exam-card">
              <BookIcon />

              <div>
                <strong>{exam}</strong>
                <span>
                  {index < 2
                    ? "College admissions"
                    : index < 4
                      ? "English proficiency"
                      : "Graduate admissions"}
                </span>
              </div>

              <ArrowRightIcon />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}