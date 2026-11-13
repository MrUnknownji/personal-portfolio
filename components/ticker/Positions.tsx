"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReviewLink } from "@/components/review/portfolio";

export type Position = {
  id: number;
  title: string;
  category: string;
  year?: number;
  short: string;
  problem?: string;
  fix?: string;
  stack: string[];
  facts: { value: string; label: string }[];
  image: string;
  links: ReviewLink[];
  featured: boolean;
};

function Detail({ p }: { p: Position }) {
  return (
    <>
      <div className="tk-pane-shot">
        <Image
          src={p.image}
          alt={`${p.title} screenshot`}
          fill
          sizes="(max-width: 900px) 92vw, 560px"
        />
      </div>
      <p className="tk-pane-short">{p.short}</p>
      {p.problem && (
        <dl className="tk-pane-case">
          <div>
            <dt>Problem</dt>
            <dd>{p.problem}</dd>
          </div>
          <div>
            <dt>Fix</dt>
            <dd>{p.fix}</dd>
          </div>
        </dl>
      )}
      {p.facts.length > 0 && (
        <dl className="tk-pane-facts">
          {p.facts.slice(0, 4).map((fact) => (
            <div key={fact.label}>
              <dd>{fact.value}</dd>
              <dt>{fact.label}</dt>
            </div>
          ))}
        </dl>
      )}
      <p className="tk-pane-stack">{p.stack.join(" / ")}</p>
      <p className="tk-links">
        {p.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link.label}
            <span aria-hidden="true">{link.external ? " ↗" : " →"}</span>
          </a>
        ))}
      </p>
    </>
  );
}

/**
 * The order book: one row per project. Pointing at a row (or focusing it) opens its quote in the
 * pane; on a phone the quote opens under the row instead. Arrow keys move through the rows.
 */
export default function Positions({ rows }: { rows: Position[] }) {
  const [sel, setSel] = useState(0);
  const p = rows[sel];

  const onKey = (event: React.KeyboardEvent, i: number) => {
    const next = event.key === "ArrowDown" ? i + 1 : event.key === "ArrowUp" ? i - 1 : null;
    if (next === null || next < 0 || next >= rows.length) return;
    event.preventDefault();
    setSel(next);
    document.getElementById(`tk-row-${rows[next].id}`)?.focus();
  };

  return (
    <div className="tk-book">
      <div className="tk-book-list">
        <div className="tk-book-head" aria-hidden="true">
          <span>Project</span>
          <span>Key fact</span>
          <span>Year</span>
        </div>
        <ol>
          {rows.map((row, i) => {
            const lead = row.facts[0];
            return (
              <li key={row.id} data-sel={i === sel || undefined} data-featured={row.featured}>
                <button
                  id={`tk-row-${row.id}`}
                  type="button"
                  className="tk-row"
                  aria-expanded={i === sel}
                  aria-controls="tk-pane"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className="tk-row-name">
                    {row.title}
                    <span className="tk-row-type">{row.category}</span>
                  </span>
                  <span className="tk-row-fact">
                    {lead ? (
                      <>
                        <b>{lead.value}</b> {lead.label}
                      </>
                    ) : (
                      <i>No counted facts yet</i>
                    )}
                  </span>
                  <span className="tk-row-yr">{row.year ?? "—"}</span>
                </button>
                {i === sel && (
                  <div className="tk-row-detail">
                    <Detail p={row} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <aside id="tk-pane" className="tk-pane" aria-live="polite" aria-label={`${p.title} quote`}>
        <header className="tk-pane-head">
          <h3>{p.title}</h3>
          <span>
            {p.category}
            {p.year ? ` · ${p.year}` : ""}
          </span>
        </header>
        <Detail key={p.id} p={p} />
      </aside>
    </div>
  );
}
