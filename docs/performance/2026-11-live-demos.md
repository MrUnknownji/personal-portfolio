# Live demo audits, November 2026

Lighthouse 13.4, simulated mobile throttling, three runs against each public demo on the
same machine and connection. The portfolio quotes a number only when it is consistent
across runs; the full results are below, including the weak ones.

| Demo | Performance (3 runs) | Accessibility | Best practices | SEO |
| --- | --- | ---: | ---: | ---: |
| BidStrike — bid-strike.vercel.app | 0.87 / 0.94 / 0.97 | 0.96 | 1.00 | 1.00 |
| OmniMart — omni-mart-orpin.vercel.app | 0.62 / 0.49 / 0.61 | 0.86 | 0.96 | 0.91 |
| YouTube Content OS — youtube-content-os-one.vercel.app | 0.67 / 0.65 / 0.64 | 1.00 | 1.00 | 0.83 |
| AuraEdit — image-modifier-jet.vercel.app | 0.39 / 0.72 / 0.41 | 0.96 | 1.00 | 1.00 |

Quoted on the site: BidStrike's median performance (0.94), Content OS accessibility
(1.00), and AuraEdit accessibility (0.96).

Not quoted: OmniMart and Content OS performance, and AuraEdit performance, which
varied too much between runs to state as a single number. Those demos are the next
candidates for the same load-path work described in
[2026-11-portfolio-refresh.md](2026-11-portfolio-refresh.md).

## FrameRelay Studio — framerelaystudio.com (9 November)

| Run | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| 1 | 0.28 | 1.00 | 1.00 | 1.00 |
| 2 | 0.34 | 1.00 | 1.00 | 1.00 |

A third run timed out. The performance figures are not meaningful here: headless Chrome
renders the WebGL2 scene in software (SwiftShader), so the measured blocking time
(27–38 s) and layout shift (0.77) describe a CPU drawing every frame, not a phone with
a GPU. They are recorded rather than hidden, and the site quotes none of them. The
next step is a field measurement (Chrome UX Report or a real mid-range Android device)
before changing anything, and checking whether the 0.77 layout shift also happens
with a GPU.
