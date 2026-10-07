"use client";

import { useId, useState } from "react";

const questions = [
  {
    question: "Are the education tools free?",
    answer:
      "Core tools will be available free of charge. Advanced reports, personalization and premium study features may be offered separately.",
  },
  {
    question: "Do I need an account to use a calculator?",
    answer:
      "No. Our public free calculators are designed to work without requiring an account. An account will unlock saved results and additional features.",
  },
  {
    question: "How are calculations verified?",
    answer:
      "Our calculator architecture supports versioned formulas, datasets, source references and review states so calculations can be tested and maintained over time.",
  },
  {
    question: "Will you support international exams?",
    answer:
      "Yes. The platform architecture is designed for multiple education systems and major international exams, with more being added over time.",
  },
];

type FAQItemProps = {
  question: string;
  answer: string;
};

function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div
      className={`faq-item ${
        open ? "faq-item--open" : ""
      }`}
    >
      <button
        type="button"
        className="faq-item__trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() =>
          setOpen((current) => !current)
        }
      >
        <span>{question}</span>

        <span
          className="faq-item__plus"
          aria-hidden="true"
        >
          <span />
          <span />
        </span>
      </button>

      <div
        id={id}
        className="faq-item__content"
        aria-hidden={!open}
      >
        <div className="faq-item__overflow">
          <div className="faq-item__content-inner">
            <p>{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="section section--soft">
      <div className="site-container faq-layout">
        <div className="section-heading">
          <span className="section-kicker">
            Frequently asked questions
          </span>

          <h2>
            A few things you might want to know.
          </h2>
        </div>

        <div className="faq-list">
          {questions.map((item) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}