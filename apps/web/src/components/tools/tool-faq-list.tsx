"use client";

import { useState } from "react";

type ToolFaq = {
  question: string;
  answer: string;
};

type ToolFaqListProps = {
  faqs: ToolFaq[];
};

export function ToolFaqList({
  faqs,
}: ToolFaqListProps) {
  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  function toggleFaq(index: number) {
    setOpenIndex((current) =>
      current === index ? null : index,
    );
  }

  return (
    <div className="tool-faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        const triggerId =
          `tool-faq-trigger-${index}`;

        const contentId =
          `tool-faq-content-${index}`;

        return (
          <div
            className={
              isOpen
                ? "tool-faq tool-faq--open"
                : "tool-faq"
            }
            key={faq.question}
          >
            <button
              type="button"
              id={triggerId}
              className="tool-faq__trigger"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleFaq(index)}
            >
              <span className="tool-faq__question">
                {faq.question}
              </span>

              <span
                className="tool-faq__plus"
                aria-hidden="true"
              >
                <span />
                <span />
              </span>
            </button>

            <div
              id={contentId}
              className="tool-faq__answer"
              role="region"
              aria-labelledby={triggerId}
            >
              <div className="tool-faq__answer-inner">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}