"use client";

import { useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

const roles = [
  { name: "Full-stack developer", detail: "Interface ↔ API ↔ Data", href: "#work", preview: "full" },
  { name: "Creative coder", detail: "Motion with a purpose ↗", href: "#lab", preview: "creative" },
  { name: "System thinker", detail: "Real-time architecture ↗", href: "/my-projects/9", preview: "systems" },
  { name: "Occasional video maker", detail: "Frames / rhythm / story ▣", href: "#lab", preview: "video" },
] as const;

export default function ProfileRoles() {
  const [active, setActive] = useState<{ preview: (typeof roles)[number]["preview"]; x: number; y: number } | null>(null);

  const move = (event: PointerEvent<HTMLAnchorElement>, preview: (typeof roles)[number]["preview"]) => {
    if (event.pointerType === "touch") return;
    setActive({ preview, x: Math.max(10, Math.min(window.innerWidth - 278, event.clientX + 22)), y: Math.max(10, Math.min(window.innerHeight - 208, event.clientY + 18)) });
  };

  return <div className="offset-profile-roles" aria-label="What I bring to a project" onPointerLeave={() => setActive(null)}>
    {roles.map((role) => <Link href={role.href} key={role.name} onPointerEnter={(event) => move(event, role.preview)} onPointerMove={(event) => move(event, role.preview)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(null)}><strong>{role.name}</strong><em>{role.detail}</em></Link>)}
    {active && createPortal(<div className="offset-role-preview" style={{ left: active.x, top: active.y }} data-visible="true" aria-hidden="true">
      {active.preview === "full" && <div className="offset-role-preview-screen"><div>APP / INTERFACE <b>● ● ●</b></div><Image src="/images/mirror-admin-preview.avif" alt="" fill sizes="260px" /></div>}
      {active.preview === "creative" && <div className="offset-role-preview-editor"><div>motion.tsx <b>×</b></div><code><span>01</span> const motion = <i>&quot;purpose&quot;</i>;<br /><span>02</span> timeline.add(<i>&quot;reveal&quot;</i>);<br /><span>03</span> shape.follow(cursor);<br /><span>04</span> return <i>experience</i>;</code></div>}
      {active.preview === "systems" && <div className="offset-role-preview-system"><div>SIGNAL / FLOW</div><p>CLIENT <span>→</span> API <span>→</span> DATA</p><small>Events / state / response</small></div>}
      {active.preview === "video" && <div className="offset-role-preview-video"><div>FRAME / 0342</div><strong>STORY IN<br />MOTION.</strong><p><i /><i /><i /><i /><i /></p><small>00:12 — 00:24 / EDIT</small></div>}
      <span className="offset-role-preview-caption">{active.preview === "full" ? "PRODUCT INTERFACE" : active.preview === "creative" ? "CODE AS MATERIAL" : active.preview === "systems" ? "SYSTEMS IN MOTION" : "FRAMES / RHYTHM / STORY"}</span>
    </div>, document.body)}
  </div>;
}
