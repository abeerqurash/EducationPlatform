import Link from "next/link";

import {
    getCalculatorDefinition,
} from "@education/calculators";

import type {
    ToolPageDefinition,
} from "@/lib/tools/tool-pages";

import type {
    PublicCalculatorRecord,
} from "@education/database";
import { ToolFaqList } from "./tool-faq-list";

type ToolPageShellProps = {
    tool: ToolPageDefinition;

    database?:
    PublicCalculatorRecord | null;

    children: React.ReactNode;
};

export function ToolPageShell({
    tool,
    database = null,
    children,
}: ToolPageShellProps) {
    const calculator =
        getCalculatorDefinition(
            tool.calculatorKey,
        );
    const calculatorVersion =
        database?.calculatorVersion
            .version ??
        calculator.version;

    const formulaVersion =
        database?.formulaVersion
            ?.version ??
        calculator.formulaVersion;

    const effectiveFrom =
        database?.calculatorVersion
            .effectiveFrom
            ? database.calculatorVersion
                .effectiveFrom
                .toISOString()
                .slice(0, 10)
            : calculator.effectiveFrom;

    const verificationStatus =
        database?.calculatorVersion
            .verificationStatus ??
        "unverified";

    return (
        <main className="tool-page">
            <section className="tool-page-hero">
                <div className="site-container">
                    <nav
                        className="breadcrumb"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/">
                            Home
                        </Link>

                        <span aria-hidden="true">
                            /
                        </span>

                        <Link href="/tools">
                            Tools
                        </Link>

                        <span aria-hidden="true">
                            /
                        </span>

                        <Link
                            href={`/tools/${tool.category}`}
                        >
                            {tool.category
                                .replaceAll(
                                    "-",
                                    " ",
                                )
                                .replace(
                                    /\b\w/g,
                                    (character) =>
                                        character.toUpperCase(),
                                )}
                        </Link>

                        <span aria-hidden="true">
                            /
                        </span>

                        <span aria-current="page">
                            {tool.shortName}
                        </span>
                    </nav>

                    <div className="tool-page-hero__content">
                        <div>
                            <span className="eyebrow">
                                {tool.eyebrow}
                            </span>

                            <h1>
                                {tool.name}
                            </h1>

                            <p>
                                {tool.description}
                            </p>
                        </div>

                        <div className="tool-trust">
                            {tool.badges.map(
                                (badge) => (
                                    <span key={badge}>
                                        {badge}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="calculator-section">
                <div className="site-container">
                    {children}
                </div>
            </section>

            <section className="tool-content-section">
                <div className="site-container tool-content-grid">
                    <article className="tool-article">
                        <span className="section-kicker">
                            Methodology
                        </span>

                        <h2>
                            {
                                tool.methodology
                                    .title
                            }
                        </h2>

                        <p>
                            {
                                tool.methodology
                                    .introduction
                            }
                        </p>

                        {tool.methodology
                            .formula ? (
                            <div className="formula-card">
                                <span>
                                    Formula
                                </span>

                                <strong>
                                    {
                                        tool.methodology
                                            .formula
                                    }
                                </strong>
                            </div>
                        ) : null}

                        {tool.methodology.sections.map(
                            (section) => (
                                <section
                                    key={
                                        section.title
                                    }
                                    className="tool-methodology-section"
                                >
                                    <h2>
                                        {
                                            section.title
                                        }
                                    </h2>

                                    {section.paragraphs.map(
                                        (paragraph) => (
                                            <p
                                                key={
                                                    paragraph
                                                }
                                            >
                                                {paragraph}
                                            </p>
                                        ),
                                    )}
                                </section>
                            ),
                        )}

                        <section className="tool-faq-section">
                            <span className="section-kicker">
                                Frequently asked
                                questions
                            </span>

                            <h2>
                                {tool.shortName} FAQ
                            </h2>

                            <ToolFaqList faqs={tool.faqs} />
                        </section>
                    </article>

                    <aside className="tool-information-card">
                        <span className="section-kicker">
                            Calculator details
                        </span>

                        <dl>
                            {tool.details.map(
                                (detail) => (
                                    <div
                                        key={
                                            detail.label
                                        }
                                    >
                                        <dt>
                                            {
                                                detail.label
                                            }
                                        </dt>

                                        <dd>
                                            {
                                                detail.value
                                            }
                                        </dd>
                                    </div>
                                ),
                            )}

                            <div>
                                <dt>
                                    Calculator version
                                </dt>

                                <dd>
                                    {
                                        calculatorVersion
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt>
                                    Formula version
                                </dt>

                                <dd>
                                    {
                                        formulaVersion
                                    }
                                </dd>
                            </div>
                        </dl>

                        <div className="tool-version-note">
                            <span>
                                Effective
                            </span>

                            <strong>
                                {
                                    effectiveFrom
                                }
                            </strong>
                        </div>

                        <div className="tool-version-note">
                            <span>
                                Verification
                            </span>

                            <strong>
                                {verificationStatus
                                    .replaceAll("_", " ")
                                    .replace(
                                        /\b\w/g,
                                        (character) =>
                                            character.toUpperCase(),
                                    )}
                            </strong>
                        </div>

                        {database?.sources.length ? (
                            <div className="tool-sources">
                                <span className="section-kicker">
                                    Sources
                                </span>

                                <ul>
                                    {database.sources.map(
                                        (source) => (
                                            <li key={source.id}>
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {source.title}
                                                </a>

                                                {source.publisher ? (
                                                    <small>
                                                        {
                                                            source.publisher
                                                        }
                                                    </small>
                                                ) : null}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </section>
        </main>
    );
}