import {
  BookIcon,
  ChartIcon,
  CheckIcon,
  SparklesIcon,
} from "@/components/ui/icons";

const benefits = [
  {
    icon: ChartIcon,
    title: "Reliable calculations",
    description:
      "Tools designed around validated formulas, versioned data and clear methodology.",
  },
  {
    icon: BookIcon,
    title: "Useful explanations",
    description:
      "Understand the result instead of receiving a number with no context.",
  },
  {
    icon: SparklesIcon,
    title: "Smarter recommendations",
    description:
      "Turn results into useful next steps for study, tests and admissions.",
  },
];

export function PlatformValue() {
  return (
    <section className="section">
      <div className="site-container value-layout">
        <div className="value-copy">
          <span className="section-kicker">
            More than calculators
          </span>

          <h2>
            Results are useful only when you know what to do next.
          </h2>

          <p>
            Our tools are being designed to combine accurate
            calculations with explanations, context and actionable
            academic guidance.
          </p>

          <ul className="check-list">
            <li>
              <CheckIcon />
              Transparent methodology
            </li>
            <li>
              <CheckIcon />
              Reviewed data and formulas
            </li>
            <li>
              <CheckIcon />
              Helpful interpretation
            </li>
            <li>
              <CheckIcon />
              Privacy-conscious by design
            </li>
          </ul>
        </div>

        <div className="benefit-stack">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} className="benefit-card">
                <span className="benefit-card__number">
                  0{index + 1}
                </span>

                <span className="benefit-card__icon">
                  <Icon />
                </span>

                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}