import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Daisy } from "@/components/Daisy";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Tag } from "@/components/Tag";
import { useLanguage } from "@/routes/languagecontext";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

  // Locked to English regardless of language state
  const marqueeWords = ["Pizza", "Pasta", "Spritz", "Coffee", "Daisies", "Zero drama", "Full flavor"];

  const reviews = [
    {
      quote: isEl ? "Χαλαρά η καλύτερη ζύμη στις Σέρρες." : "Easily the best crust in Serres.",
      author: isEl ? "Μαρία Τ." : "Maria T."
    },
    {
      quote: isEl ? "Η αναλογία Aperol Spritz και πίτσας εδώ είναι απλά τέλεια." : "The Aperol Spritz to pizza ratio here is perfection.",
      author: isEl ? "Νίκος Π." : "Nikos P."
    },
    {
      quote: isEl ? "Τέλεια ατμόσφαιρα, ωραία μουσική και το Cacio e Pepe δεν υπάρχει." : "Cool vibe, great music, and the Cacio e Pepe is out of this world.",
      author: isEl ? "Έλενα Κ." : "Elena K."
    }
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-pink/60" />
        <Daisy className="absolute -top-10 -left-10 w-56 h-56 opacity-50 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-10 right-6 w-40 h-40 opacity-60 spin-slow" petalColor="var(--pink)" />
        <Daisy className="hidden md:block absolute top-20 right-1/4 w-20 h-20 opacity-70" petalColor="#fff" />

        <FadeIn>
          <div className="relative mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-32 text-center">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-burgundy/70 mb-6">
              <span className="w-8 h-px bg-burgundy/40" /> Άγρα · Σέρρες <span className="w-8 h-px bg-burgundy/40" />
            </span>
            <h1 className="font-display text-burgundy text-7xl sm:text-8xl md:text-[10rem] leading-[0.85] lowercase mb-10 md:mb-12">
              μαργαριτα
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-burgundy/80">
              {isEl 
                ? "Πίτσα στον ξυλόφουρνο, φρέσκα ζυμαρικά, fizzy spritz & αυθεντικός καφές."
                : "Wood-fired pizza, twirly pasta, fizzy spritz & honest coffee."}
              {/* Tagline locked to English */}
              <span className="block font-display text-2xl mt-4 italic">
                Zero drama. Full flavor.
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
        </FadeIn>

        {/* Marquee - always English */}
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

      {/* PHILOSOPHY BLOCK */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative rounded-[2.5rem] overflow-hidden h-[400px] md:h-[550px] shadow-[0_30px_60px_-30px_rgba(116,0,25,0.3)] group">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80" 
                alt="Making artisan dough" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">
                {isEl ? "Η φιλοσοφια μας" : "Our philosophy"}
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-burgundy mt-4 leading-[1.1]">
                {isEl ? "Από τα χέρια μας," : "Hand-picked,"}<br/>
                {isEl ? "στο πιάτο σου." : "hand-tossed."}
              </h2>
              <p className="mt-6 text-lg text-burgundy/80 leading-relaxed">
                {isEl
                  ? "Δεν κάνουμε γρήγορο φαγητό. Κάνουμε καλό φαγητό. Ζύμη 48ωρης ωρίμανσης, ντομάτες San Marzano και καφές φτιαγμένος με μεράκι. Μηδέν δράμα, μόνο αληθινά υλικά."
                  : "We don't do fast food. We do good food. 48-hour fermented dough, San Marzano tomatoes, and coffee poured with care. Zero drama, just honest ingredients."}
              </p>
              <div className="mt-8 flex gap-4">
                 <Daisy className="w-10 h-10 spin-slow" petalColor="var(--pink)" centerColor="var(--burgundy)" />
                 <Daisy className="w-10 h-10 spin-slow opacity-50" petalColor="var(--pink)" centerColor="var(--burgundy)" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* MINI MENU */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20 md:pb-28">
        <FadeIn>
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
            {highlights.map((h, i) => (
              <FadeIn key={h.name} delay={i * 100}>
                <article className="h-full group relative bg-card rounded-3xl p-6 border border-burgundy/10 hover:border-burgundy/40 transition-all hover:-translate-y-1">
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
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* REVIEWS / WORD ON THE STREET */}
      <section className="bg-pink/30 border-y border-burgundy/10 py-20 md:py-28 mb-20 md:mb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">
                {isEl ? "Τι λενε για εμας" : "Word on the street"}
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-burgundy mt-4 lowercase">
                {isEl ? "η αγάπη σας" : "local love"}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {reviews.map((review, idx) => (
                <FadeIn key={idx} delay={idx * 150}>
                  <div className="h-full bg-cream rounded-3xl p-8 border border-burgundy/15 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex gap-1.5 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Daisy key={i} className="w-5 h-5" petalColor="var(--pink)" centerColor="var(--burgundy)" />
                        ))}
                      </div>
                      <p className="text-xl text-burgundy font-display italic leading-relaxed">
                        "{review.quote}"
                      </p>
                    </div>
                    <p className="mt-8 text-sm font-semibold text-burgundy/60 uppercase tracking-widest">
                      — {review.author}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT SNIPPET */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-20">
        <FadeIn>
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
        </FadeIn>
      </section>
    </Layout>
  );
}

// Custom Scroll Animation Component
function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}