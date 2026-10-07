"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  SaveResultButton,
} from "./save-result-button";

type CalculatorSaveBridgeProps = {
  children: ReactNode;
  toolSlug: string;
  toolName: string;
};

type CapturedResult = {
  inputSnapshot: Record<string, unknown>;
  resultSnapshot: Record<string, unknown>;
  summary: string;
  fingerprint: string;
};

function normalizeText(value: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function fieldKey(
  element: HTMLInputElement | HTMLSelectElement,
  index: number,
) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("name") ||
    element.closest("label")?.querySelector("span")?.textContent ||
    `field_${index + 1}`
  ).trim();
}

function captureCalculator(
  root: HTMLElement,
  toolName: string,
): CapturedResult | null {
  const resultRegion =
    root.querySelector<HTMLElement>(
      ".calculator-result",
    );

  if (
    !resultRegion ||
    resultRegion.querySelector(
      ".calculator-result__empty",
    )
  ) {
    return null;
  }

  const resultText =
    normalizeText(resultRegion.textContent);

  if (!resultText) {
    return null;
  }

  const inputs = Array.from(
    root.querySelectorAll<
      HTMLInputElement | HTMLSelectElement
    >("input, select"),
  );

  const inputSnapshot =
    Object.fromEntries(
      inputs.map((element, index) => [
        fieldKey(element, index),
        element.value,
      ]),
    );

  const primaryResult =
    normalizeText(
      resultRegion.querySelector(
        ".gpa-result strong, .sat-total-result strong",
      )?.textContent ?? null,
    );

  const summary =
    primaryResult
      ? `${primaryResult} — ${toolName}`
      : resultText.slice(0, 280);

  return {
    inputSnapshot,
    resultSnapshot: {
      displayText: resultText.slice(0, 10_000),
    },
    summary: summary.slice(0, 300),
    fingerprint: JSON.stringify({
      inputSnapshot,
      resultText,
    }),
  };
}

export function CalculatorSaveBridge({
  children,
  toolSlug,
  toolName,
}: CalculatorSaveBridgeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [captured, setCaptured] =
    useState<CapturedResult | null>(null);

  const refresh = useCallback(() => {
    if (!rootRef.current) {
      return;
    }

    const next =
      captureCalculator(
        rootRef.current,
        toolName,
      );

    setCaptured((current) => {
      if (
        current?.fingerprint ===
        next?.fingerprint
      ) {
        return current;
      }

      return next;
    });
  }, [toolName]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const observer =
      new MutationObserver(refresh);

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    root.addEventListener(
      "input",
      refresh,
    );
    root.addEventListener(
      "change",
      refresh,
    );

    refresh();

    return () => {
      observer.disconnect();
      root.removeEventListener(
        "input",
        refresh,
      );
      root.removeEventListener(
        "change",
        refresh,
      );
    };
  }, [refresh]);

  return (
    <div ref={rootRef}>
      {children}

      {captured ? (
        <div className="mt-5 flex justify-end">
          <SaveResultButton
            key={captured.fingerprint}
            toolSlug={toolSlug}
            toolName={toolName}
            summary={captured.summary}
            inputSnapshot={
              captured.inputSnapshot
            }
            resultSnapshot={
              captured.resultSnapshot
            }
          />
        </div>
      ) : null}
    </div>
  );
}
