"use client";

import { useState } from "react";
import { ThemedDatePicker } from "@/components/shared/themed-date-range";

/** A calendar field that submits the same YYYY-MM-DD value as the old native date input. */
export function ThemedFormDate({ name, label, defaultValue = "" }: { name: string; label: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="min-w-0">
      <input type="hidden" name={name} value={value} />
      <ThemedDatePicker label={label} value={value} onChange={setValue} />
    </div>
  );
}
