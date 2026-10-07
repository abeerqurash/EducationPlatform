"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { SearchIcon } from "@/components/ui/icons";

export function ToolSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = query.trim();

    if (!normalized) {
      router.push("/tools");
      return;
    }

    router.push(`/tools?q=${encodeURIComponent(normalized)}`);
  }

  return (
    <form
      className="hero-search"
      role="search"
      onSubmit={handleSubmit}
    >
      <SearchIcon className="hero-search__icon" />

      <label className="sr-only" htmlFor="tool-search">
        Search calculators and study tools
      </label>

      <input
        id="tool-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search GPA, grades, SAT, percentages..."
        autoComplete="off"
      />

      <button type="submit">
        Search
      </button>
    </form>
  );
}