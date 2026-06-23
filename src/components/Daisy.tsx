import type { SVGProps } from "react";

export function Daisy({
  className,
  petalColor = "currentColor",
  centerColor,
  ...props
}: SVGProps<SVGSVGElement> & { petalColor?: string; centerColor?: string }) {
  const center = centerColor ?? "var(--burgundy)";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...props}>
      <g fill={petalColor}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="22"
            rx="9"
            ry="18"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill={center} />
    </svg>
  );
}
