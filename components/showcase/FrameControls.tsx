import type { ShowcaseFrame } from "@/types/Project";

export default function FrameControls({
  label,
  frames,
  frame,
  onSelect,
}: {
  label: string;
  frames: ShowcaseFrame[];
  frame: number;
  onSelect: (position: number) => void;
}) {
  return (
    <div className="showcase-media-controls" role="group" aria-label={label}>
      {frames.map((item, position) => (
        <button
          key={item.label}
          type="button"
          aria-pressed={frame === position}
          onClick={() => onSelect(position)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
