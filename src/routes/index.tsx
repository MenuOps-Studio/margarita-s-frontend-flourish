import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Daisy } from "@/components/Daisy";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Tag } from "@/components/Tag";
import { useLanguage } from "@/routes/languagecontext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "μαργαριτα — Πίτσα, Πάστα & Spritz στις Σέρρες" },
      { name: "description", content: "Μηδέν δράμα, φουλ γεύση. Πίτσα στον ξυλόφουρνο, φρέσκα ζυμαρικά, spritz & καφές στις Σέρρες." },
      { property: "og:title", content: "μαργαριτα — Pizza, Pasta & Spritz" },
      { property: "og:description", content: "Zero drama, full flavor. A trendy pizza & spritz bar in Serres." },
    ],
  }),
  component: Home,
});

const getHighlights = (isEl: boolean) => [
  { name: "Margarita Classica", desc: isEl ? "San Marzano, fior di latte, βασιλικός, ελαιόλαδο." : "San Marzano, fior di latte, basil, olive oil.", price: "€9", tag: "STAR" as const, cat: isEl ? "Σπεσιαλιτέ Πίτσα" : "Signature Pizza" },
  { name: "Cacio e Pepe", desc: isEl ? "Tonnarelli, πεκορίνο, φρεσκοτριμμένο πιπέρι." : "Tonnarelli, pecorino, fresh cracked pepper.", price: "€11", tag: "V" as const, cat: isEl ? "Ζυμαρικά" : "Pasta" },
  { name: "Aperol Spritz", desc: isEl ? "Aperol, prosecco, σόδα, φέτα πορτοκάλι." : "Aperol, prosecco, soda, orange wheel.", price: "€6.50", tag: "STAR" as const, cat: "Spritz" },
  { name: "Affogato", desc: isEl ? "Espresso περιχυμένος σε παγωτό βανίλια." : "Espresso poured over vanilla gelato.", price: "€4.50", tag: "V" as const, cat: isEl ? "Καφές" : "Coffee" },
];

function Home() {
  const { isEl } = useLanguage();
  const highlights = getHighlights(isEl);

  const marqueeWords = isEl 
    ? ["Πίτσα", "Πάστα", "Spritz", "Καφές", "Μαργαρίτες", "Μηδέν δράμα", "Φουλ γεύση"]
    : ["Pizza", "Pasta", "Spritz", "Coffee", "Daisies", "Zero drama", "Full flavor"];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-pink/60" />
        <Daisy className="absolute -top-10 -left-10 w-56 h-56 opacity-50 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-10 right-6 w-40 h-40 opacity-60 spin-slow" petalColor="var(--pink)" />
        <Daisy className="hidden md:block absolute top-20 right-1/4 w-20 h-20 opacity-70" petalColor="#fff" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-burgundy/70 mb-6">
            <span className="w-8 h-px bg-burgundy/40" /> Άγρα · Σέρρες <span className="w-8 h-px bg-burgundy/40" />
          </span>
          <h1 className="font-display text-burgundy text-7xl sm:text-8xl md:text-[10rem] leading-[0.85] lowercase">
            μαργαριτα
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-lg md:text-xl text-burgundy/80">
            {isEl 
              ? "Πίτσα στον ξυλόφουρνο, φρέσκα ζυμαρικά, fizzy spritz & αυθεντικός καφές."
              : "Wood-fired pizza, twirly pasta, fizzy spritz & honest coffee."}
            <span className="block font-display text-2xl mt-2 italic">
              {isEl ? "Μηδέν δράμα. Φουλ γεύση." : "Zero drama. Full flavor."}
            </span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/menu" className="inline-flex items-center gap-2 bg-burgundy text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-burgundy/90 transition-all hover:scale-105">
              {isEl ? "Δες το Μενού" : "Explore the Menu"} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/reservations" className="inline-flex items-center gap-2 bg-pink text-burgundy px-7 py-3.5 rounded-full font-semibold hover:bg-pink/80 transition-all hover:scale-105 border border-burgundy/20">
              {isEl ? "Κλείσε Τραπέζι" : "Reserve a Table"}
            </Link>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative bg-burgundy text-cream py-4 overflow-hidden border-y border-burgundy">
          <div className="marquee-track whitespace-nowrap font-display text-2xl">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="inline-flex items-center">
                {marqueeWords.map((w) => (
                  <span key={w} className="inline-flex items-center px-6">
                    {w} <Daisy className="w-5 h-5 ml-6" petalColor="var(--pink)" centerColor="var(--cream)" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MINI MENU */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">
              {isEl ? "Μια γευση απο" : "A taste of"}
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-burgundy mt-2">
              {isEl ? "Οι σπεσιαλιτέ μας" : "Signature bites"}
            </h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-2 text-burgundy font-semibold hover:gap-3 transition-all">
            {isEl ? "Δες όλο το Μενού" : "View Full Menu"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((h) => (
            <article key={h.name} className="group relative bg-card rounded-3xl p-6 border border-burgundy/10 hover:border-burgundy/40 transition-all hover:-translate-y-1">
              <Daisy className="absolute -top-3 -right-3 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity spin-slow" petalColor="var(--pink)" />
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-burgundy/60">
                {h.cat}
              </div>
              <h3 className="font-display text-2xl text-burgundy mt-2">{h.name}</h3>
              <p className="text-sm text-burgundy/70 mt-2 leading-relaxed">{h.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <Tag kind={h.tag} />
                <span className="font-display text-2xl text-burgundy">{h.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT SNIPPET */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20">
        <div className="relative bg-pink rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
          <Daisy className="absolute -top-12 -right-12 w-56 h-56 opacity-40 spin-slow" petalColor="#fff" />
          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <h2 className="font-display text-5xl text-burgundy leading-none" dangerouslySetInnerHTML={{ __html: isEl ? "Έλα να πεις<br/>ένα ciao." : "Come<br/>say ciao." }} />
              <p className="mt-4 text-burgundy/80 italic font-display text-xl">
                {isEl ? "Είσαι το πεπερόνι στην πίτσα μου." : "You're the pepperoni to my pizza."}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-burgundy/60 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5"/> {isEl ? "Που" : "Where"}
              </h4>
              <p className="text-burgundy text-lg">Άγρα, Σέρρες 621 23</p>
              <p className="text-burgundy/80">{isEl ? "Τηλ" : "Phone"} · 2321 022440</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-burgundy/60 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5"/> {isEl ? "Ποτε" : "When"}
              </h4>
              <p className="text-burgundy text-lg">{isEl ? "Δευτέρα – Κυριακή" : "Monday – Sunday"}</p>
              <p className="text-burgundy/80">9:00 π.μ. – 1:00 π.μ.</p>
              <Link to="/reservations" className="inline-flex mt-3 items-center gap-2 bg-burgundy text-cream px-5 py-2.5 rounded-full text-sm font-semibold">
                {isEl ? "Κλείσε Τραπέζι" : "Book a Table"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}