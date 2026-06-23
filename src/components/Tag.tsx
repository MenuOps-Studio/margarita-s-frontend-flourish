import { Leaf, Sprout, Star } from "lucide-react";

export type TagKind = "V" | "VG" | "STAR";

const map = {
  V: { label: "Vegetarian", short: "V", Icon: Leaf, bg: "bg-pink", fg: "text-burgundy" },
  VG: { label: "Vegan", short: "VG", Icon: Sprout, bg: "bg-burgundy", fg: "text-cream" },
  STAR: { label: "Signature", short: "★", Icon: Star, bg: "bg-cream border border-burgundy", fg: "text-burgundy" },
} as const;

export function Tag({ kind }: { kind: TagKind }) {
  const t = map[kind];
  return (
    <span
      title={t.label}
      className={`inline-flex items-center gap-1 ${t.bg} ${t.fg} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}
    >
      <t.Icon className="w-3 h-3" />
      {t.short}
    </span>
  );
}
