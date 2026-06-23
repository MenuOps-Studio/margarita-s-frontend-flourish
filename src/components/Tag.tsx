import { Leaf, Sprout, Star } from "lucide-react";
import { useLanguage } from "@/routes/languagecontext";

export type TagKind = "V" | "VG" | "STAR";

export function Tag({ kind }: { kind: TagKind }) {
  const { isEl } = useLanguage();

  const getTagInfo = (kind: TagKind, isEl: boolean) => {
    const map = {
      V: { label: isEl ? "Χορτοφαγικό" : "Vegetarian", short: "V", Icon: Leaf, bg: "bg-pink", fg: "text-burgundy" },
      VG: { label: isEl ? "Vegan" : "Vegan", short: "VG", Icon: Sprout, bg: "bg-burgundy", fg: "text-cream" },
      STAR: { label: isEl ? "Σπεσιαλιτέ" : "Signature", short: "★", Icon: Star, bg: "bg-cream border border-burgundy", fg: "text-burgundy" },
    };
    return map[kind];
  };

  const t = getTagInfo(kind, isEl);

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