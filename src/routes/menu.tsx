import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Tag, type TagKind } from "@/components/Tag";
import { Daisy } from "@/components/Daisy";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — μαργαριτα" },
      { name: "description", content: "Pizzas, pasta, spritz, coffee & more. Browse the full μαργαριτα menu." },
      { property: "og:title", content: "Menu — μαργαριτα" },
      { property: "og:description", content: "Wood-fired pizza, fresh pasta, spritz and coffee." },
    ],
  }),
  component: MenuPage,
});

type Item = { name: string; desc: string; price: string; tags?: TagKind[] };
type Section = { title: string; blurb?: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    title: "Starters",
    blurb: "Little things to begin the love affair.",
    items: [
      { name: "Focaccia della Casa", desc: "Rosemary, sea salt, extra virgin olive oil.", price: "€5", tags: ["V"] },
      { name: "Burrata & Peach", desc: "Creamy burrata, grilled peach, basil, pink pepper.", price: "€9.50", tags: ["V", "STAR"] },
      { name: "Olive Marinate", desc: "Castelvetrano olives, orange zest, chili.", price: "€4", tags: ["VG"] },
      { name: "Polpette al Sugo", desc: "Beef & pork meatballs slow-cooked in tomato.", price: "€7.50" },
    ],
  },
  {
    title: "Salads",
    items: [
      { name: "Insalata Margarita", desc: "Heirloom tomato, mozzarella di bufala, basil, balsamic.", price: "€8.50", tags: ["V", "STAR"] },
      { name: "Verde Forte", desc: "Mixed leaves, fennel, apple, walnut, lemon dressing.", price: "€7", tags: ["VG"] },
      { name: "Cesare", desc: "Romaine, anchovy dressing, parmesan, sourdough croutons.", price: "€8" },
    ],
  },
  {
    title: "Pizzas",
    blurb: "Wood-fired. 48-hour cold-fermented dough.",
    items: [
      { name: "Margarita Classica", desc: "San Marzano, fior di latte, basil, olive oil.", price: "€9", tags: ["V", "STAR"] },
      { name: "Diavola", desc: "Tomato, mozzarella, spicy salami, chili honey.", price: "€11" },
      { name: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, fontina, parmesan.", price: "€12", tags: ["V"] },
      { name: "Funghi", desc: "Mushroom trio, taleggio, thyme, truffle oil.", price: "€12.50", tags: ["V"] },
      { name: "Vegana del Sole", desc: "Tomato, grilled zucchini, peppers, olives, vegan mozzarella.", price: "€11", tags: ["VG"] },
      { name: "Prosciutto e Rucola", desc: "Mozzarella, prosciutto crudo, rocket, parmesan.", price: "€13" },
    ],
  },
  {
    title: "Pasta",
    items: [
      { name: "Cacio e Pepe", desc: "Tonnarelli, pecorino romano, cracked black pepper.", price: "€11", tags: ["V", "STAR"] },
      { name: "Rigatoni all'Arrabbiata", desc: "Tomato, garlic, chili, parsley.", price: "€10", tags: ["VG"] },
      { name: "Tagliatelle al Ragù", desc: "Slow-cooked beef & pork ragù, parmesan.", price: "€13" },
      { name: "Gnocchi al Pesto", desc: "Potato gnocchi, basil pesto, green beans, pine nuts.", price: "€12", tags: ["V"] },
    ],
  },
  {
    title: "Spritz",
    blurb: "Fizzy, flirty, served until late.",
    items: [
      { name: "Aperol Spritz", desc: "Aperol, prosecco, soda, orange.", price: "€6.50", tags: ["STAR"] },
      { name: "Campari Spritz", desc: "Campari, prosecco, soda, grapefruit.", price: "€7" },
      { name: "Hugo", desc: "Elderflower, prosecco, mint, lime.", price: "€7" },
      { name: "Limoncello Spritz", desc: "Limoncello, prosecco, soda, lemon thyme.", price: "€7.50" },
      { name: "St-Germain Spritz", desc: "Elderflower liqueur, prosecco, cucumber.", price: "€8" },
    ],
  },
  {
    title: "Coffee",
    items: [
      { name: "Espresso", desc: "House blend, double shot.", price: "€2", tags: ["V"] },
      { name: "Cappuccino", desc: "Espresso, steamed milk, velvet foam.", price: "€3", tags: ["V"] },
      { name: "Freddo Espresso", desc: "Iced shaken espresso, the Greek way.", price: "€3", tags: ["V"] },
      { name: "Affogato", desc: "Espresso poured over vanilla gelato.", price: "€4.50", tags: ["V", "STAR"] },
      { name: "Oat Latte", desc: "Double espresso, steamed oat milk.", price: "€3.50", tags: ["VG"] },
    ],
  },
];

function MenuPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-burgundy/10">
        <Daisy className="absolute -top-10 -left-10 w-44 h-44 opacity-50 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-0 right-8 w-32 h-32 opacity-60" petalColor="var(--pink)" />
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-20 md:py-28 text-center relative">
          <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">Eat · Drink · Repeat</span>
          <h1 className="font-display text-7xl md:text-9xl text-burgundy mt-4 lowercase">the menu</h1>
          <p className="mt-6 max-w-xl mx-auto text-burgundy/80">
            Hand-picked, hand-tossed, hand-poured. Prices in euros. A 5% service charge is added to tables of 6 or more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Tag kind="V" /><span className="text-xs text-burgundy/60">Vegetarian</span>
            <Tag kind="VG" /><span className="text-xs text-burgundy/60">Vegan</span>
            <Tag kind="STAR" /><span className="text-xs text-burgundy/60">Signature</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 py-16 md:py-24 space-y-20">
        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <div className="flex items-end gap-4 mb-8">
              <Daisy className="w-8 h-8 shrink-0" petalColor="var(--pink)" />
              <div>
                <h2 className="font-display text-5xl md:text-6xl text-burgundy lowercase leading-none">{sec.title}</h2>
                {sec.blurb && <p className="text-burgundy/60 italic mt-2">{sec.blurb}</p>}
              </div>
              <div className="flex-1 h-px bg-burgundy/20 mb-3" />
            </div>

            <ul className="divide-y divide-burgundy/10">
              {sec.items.map((it) => (
                <li key={it.name} className="py-5 flex gap-4 items-baseline">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl text-burgundy">{it.name}</h3>
                      {it.tags?.map((t) => <Tag key={t} kind={t} />)}
                    </div>
                    <p className="text-burgundy/70 text-sm mt-1 leading-relaxed max-w-xl">{it.desc}</p>
                  </div>
                  <div className="border-b-2 border-dotted border-burgundy/30 flex-1 mb-2 hidden sm:block" />
                  <span className="font-display text-2xl text-burgundy shrink-0">{it.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Layout>
  );
}
