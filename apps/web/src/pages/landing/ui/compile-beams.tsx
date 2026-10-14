import type { CSSProperties } from "react";
import { REACT_PATH, SVELTE_PATH } from "@/entities/framework";

// Vue logo from Simple Icons (CC0)
const VUE_PATH = "M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z";

const SOURCES = [
  { name: "Mitosis", role: "markup & logic", y: 100, path: "M130 100 C190 100 190 150 238 150" },
  { name: "StyleX", role: "styles & tokens", y: 200, path: "M130 200 C190 200 190 150 238 150" },
];

const TARGETS = [
  { name: "React", logo: REACT_PATH, className: "framework-logo-react", y: 60, path: "M322 150 C400 150 400 60 474 60" },
  { name: "Svelte", logo: SVELTE_PATH, className: "framework-logo-svelte", y: 150, path: "M322 150 L474 150" },
  { name: "Vue", logo: VUE_PATH, next: true, y: 240, path: "M322 150 C400 150 400 240 474 240" },
];

const TRAIL = [
  [0.3, 0.25],
  [0.18, 0.55],
  [0.08, 1],
] as const;

// sources first, then the framework outputs once the light has reached the package
const beamDelay = (index: number) => (index < SOURCES.length ? index * 0.3 : 1.1 + (index - SOURCES.length) * 0.15);

// Beams in the spirit of Magic UI's Animated Beam, as a loop rather than an entrance: light leaves the
// sources, goes through the package and comes out as each framework. Static lines under reduced motion.
export function CompileBeams() {
  return (
    <figure className="compile-beams">
      <svg
        role="img"
        aria-label="Mitosis (markup and logic) and StyleX (styles and tokens) compile into @omni/core, which ships React and Svelte components. Vue is next."
        viewBox="0 0 560 300"
      >
        {[...SOURCES, ...TARGETS].map((link) => (
          <path key={link.name} d={link.path} pathLength={1} className={`beam-track${"next" in link ? " beam-next" : ""}`} />
        ))}
        {[...SOURCES, ...TARGETS]
          .filter((link) => !("next" in link))
          .flatMap((link, index) =>
            // three stacked dashes sharing one head: a bright tip with a fading tail
            TRAIL.map(([length, opacity]) => (
              <path
                key={`${link.name}-${length}`}
                d={link.path}
                pathLength={1}
                className="beam-flow"
                style={
                  {
                    "--beam-length": length,
                    "--beam-delay": `${beamDelay(index)}s`,
                    opacity,
                  } as CSSProperties
                }
              />
            )),
          )}

        {SOURCES.map((source) => (
          <g key={source.name} className="beam-node">
            <rect x={0} y={source.y - 27} width={130} height={54} rx={12} />
            <text x={16} y={source.y - 3} className="beam-title">
              {source.name}
            </text>
            <text x={16} y={source.y + 15} className="beam-sub">
              {source.role}
            </text>
          </g>
        ))}

        <g className="beam-node beam-hub">
          <rect x={238} y={108} width={84} height={84} rx={18} />
          <rect x={272} y={140} width={22} height={22} rx={5} className="beam-mark-shadow" />
          <rect x={266} y={134} width={22} height={22} rx={5} className="beam-mark" />
          <text x={280} y={216} textAnchor="middle" className="beam-sub beam-code">
            @omni/core
          </text>
        </g>

        {TARGETS.map((target) => (
          <g key={target.name} className={`beam-node${target.next ? " beam-next" : ""}`}>
            <circle cx={500} cy={target.y} r={26} />
            <svg x={487} y={target.y - 13} width={26} height={26} viewBox="0 0 24 24" className={target.className}>
              <path d={target.logo} />
            </svg>
            <text x={500} y={target.y + 44} textAnchor="middle" className="beam-sub">
              {target.next ? `${target.name} · next` : target.name}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
