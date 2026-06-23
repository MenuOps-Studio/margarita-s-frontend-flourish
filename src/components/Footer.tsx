import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import { Daisy } from "./Daisy";
import { useLanguage } from "@/routes/languagecontext";

const IG = "https://www.instagram.com/margarita.srs?igsh=MXFmMjA3MjFicmE3eQ%3D%3D&utm_source=qr";
const FB = "https://www.facebook.com/profile.php?id=61590545034994&sk=about";

export function Footer() {
  const { isEl } = useLanguage();

  return (
    <footer className="bg-burgundy text-cream mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <div className="flex items-center gap-3">
              <Daisy className="w-10 h-10 spin-slow" petalColor="var(--pink)" centerColor="var(--cream)" />
              <span className="font-display text-3xl lowercase">μαργαριτα</span>
            </div>
            <p className="mt-4 text-cream/80 max-w-xs font-display text-xl italic">
              {isEl ? '"Είσαι το πεπερόνι στην πίτσα μου."' : '"You\'re the pepperoni to my pizza."'}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-display text-2xl mb-3">{isEl ? "Βρες μας" : "Find us"}</h4>
            <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Άγρα, Σέρρες 621 23</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> 2321 022440</p>
            <p className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 shrink-0" /> {isEl ? "Δευ–Κυρ" : "Mon–Sun"} · 9:00 – 1:00</p>
          </div>

          <div>
            <h4 className="font-display text-2xl mb-3">{isEl ? "Ακολούθησέ μας" : "Follow"}</h4>
            <div className="flex gap-3">
              <a href={IG} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-cream/40 hover:bg-cream hover:text-burgundy transition-colors flex items-center justify-center" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={FB} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-cream/40 hover:bg-cream hover:text-burgundy transition-colors flex items-center justify-center" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-cream/60 text-xs">© {new Date().getFullYear()} μαργαριτα · {isEl ? "Μηδέν δράμα. Φουλ γεύση." : "Zero drama. Full flavor."}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}