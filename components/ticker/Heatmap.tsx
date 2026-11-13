"use client";

import { useState } from "react";
import Crosshair from "./Crosshair";

type Col = { id: number; sym: string; title: string };

/** Technologies against projects. A filled cell means the project's stack lists that technology. */
export default function Heatmap({
  rows,
  cols,
  used,
}: {
  rows: { tech: string; count: number }[];
  cols: Col[];
  used: boolean[][];
}) {
  const [hot, setHot] = useState<{ r: number; c: number } | null>(null);

  return (
    <Crosshair
      className="tk-heat"
      label="Stack exposure: technologies against projects"
      onLeave={() => setHot(null)}
      read={({ target }) => {
        const cell = target.closest<HTMLElement>("[data-r]");
        if (!cell) {
          if (hot) setHot(null);
          return null;
        }
        const r = Number(cell.dataset.r);
        const c = Number(cell.dataset.c);
        if (!hot || hot.r !== r || hot.c !== c) setHot({ r, c });
        return `${rows[r].tech} × ${cols[c].title} · ${used[r][c] ? "in stack" : "not used"}`;
      }}
    >
      <table className="tk-heat-table" data-hot={hot ? "true" : undefined}>
        <caption className="tk-sr">
          Which technologies each project uses. Rows are technologies, columns are projects.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="tk-heat-corner">
              Technology
            </th>
            {cols.map((col, c) => (
              <th key={col.id} scope="col" data-on={hot?.c === c || undefined} title={col.title}>
                <span className="tk-heat-name">{col.title}</span>
                <span className="tk-heat-sym" aria-hidden="true">
                  {col.sym}
                </span>
              </th>
            ))}
            <th scope="col" className="tk-heat-count">
              Uses
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={row.tech} data-on={hot?.r === r || undefined}>
              <th scope="row">{row.tech}</th>
              {cols.map((col, c) => (
                <td
                  key={col.id}
                  data-r={r}
                  data-c={c}
                  data-used={used[r][c] || undefined}
                  data-cross={hot && (hot.r === r || hot.c === c) ? "true" : undefined}
                >
                  <span className="tk-sr">{used[r][c] ? `${col.title} uses it` : "No"}</span>
                </td>
              ))}
              <td className="tk-heat-count">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Crosshair>
  );
}
