"use client";

import { useState } from "react";

import { Select } from "@/components/ui/select";

type ToolsFilterProps = {
  query: string;
  category: string;
  access: string;

  categories: Array<{
    name: string;
    slug: string;
    toolCount: number;
  }>;
};

export function ToolsFilter({
  query,
  category,
  access,
  categories,
}: ToolsFilterProps) {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(category);

  const [
    selectedAccess,
    setSelectedAccess,
  ] = useState(access);

  return (
    <form
      action="/tools"
      method="get"
      className="tools-filter"
      role="search"
    >
      <div className="tools-filter__search">
        <label htmlFor="tools-query">
          Search tools
        </label>

        <input
          id="tools-query"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search GPA, SAT, grades..."
          maxLength={100}
        />
      </div>

      <Select
        name="category"
        label="Category"
        value={selectedCategory}
        onChange={
          setSelectedCategory
        }
        options={[
          {
            value: "",
            label: "All categories",
          },
          ...categories.map(
            (item) => ({
              value: item.slug,
              label: `${item.name} (${item.toolCount})`,
            }),
          ),
        ]}
      />

      <Select
        name="access"
        label="Access"
        value={selectedAccess}
        onChange={
          setSelectedAccess
        }
        options={[
          {
            value: "",
            label:
              "Free & premium",
          },
          {
            value: "free",
            label: "Free",
          },
          {
            value: "premium",
            label: "Premium",
          },
        ]}
      />

      <button
        type="submit"
        className="button button--primary tools-filter__button"
      >
        Find tools
      </button>
    </form>
  );
}