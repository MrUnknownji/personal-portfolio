import { ViewTransition } from "react";

export default function Loading() {
  return (
    <ViewTransition exit="loading-exit" default="none">
      <div className="print-loading" role="status" aria-live="polite" aria-label="Loading page">
        <div className="print-loading-panel print-loading-panel-paper" aria-hidden="true" />
        <div className="print-loading-panel print-loading-panel-orange" aria-hidden="true" />
        <div className="print-loading-content">
          <span className="print-loading-overline">Full-stack developer · Creative coder · Punjab, India</span>
          <strong>SANDEEP<br />KUMAR<span>.</span></strong>
          <div className="print-loading-side"><span>PORTFOLIO / 2026</span><span>MAKING THE NEXT VIEW</span><i aria-hidden="true" /></div>
          <div className="print-loading-foot"><span>DESIGN / DEVELOPMENT / DELIVERY</span><span>LOADING ↗</span></div>
        </div>
      </div>
    </ViewTransition>
  );
}
