import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Tag, type TagKind } from "@/components/Tag";
import { Daisy } from "@/components/Daisy";
import { useLanguage } from "@/routes/languagecontext";
import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"; // <-- This imports your new connection!

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — μαργαριτα" },
      { name: "description", content: "Pizzas, pasta, spritz, coffee & more. Browse the full μαργαριτα menu." },
    ],
  }),
  component: MenuPage,
});

type Item = { name: string; desc: string; price: string; tags?: TagKind[] };
type Section = { title: string; blurb?: string; items: Item[] };

function MenuPage() {
  const { isEl } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. FETCH DATA FROM SUPABASE
  const { data: dbItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', 3)
        .eq('status', 'AVAILABLE')
        .order('id', { ascending: true }); // Keeps items in the order you added them

      if (error) throw error;
      return data;
    }
  });

  // 2. ORGANIZE DATA INTO CATEGORIES AUTOMATICALLY
  const baseSections = useMemo(() => {
    if (!dbItems) return [];

    const sectionsMap = new Map<string, Section>();
    const orderedCategories: string[] = [];

    dbItems.forEach(item => {
      // Pick language dynamically based on context
      const catTitle = isEl 
        ? (item.category || "") 
        : (item.category_en || item.category || "");
      
      const itemName = isEl 
        ? (item.name_el || item.name || "") 
        : (item.name_en || item.name || "");
      
      const itemDesc = isEl 
        ? (item.description_el || "") 
        : (item.description_en || "");

      // If category doesn't exist yet, create it
      if (!sectionsMap.has(catTitle)) {
        orderedCategories.push(catTitle);
        
        // Add the cute subtitles based on the category name
        let blurb = "";
        if (catTitle === "Starters" || catTitle === "Ορεκτικά") blurb = isEl ? "Μικρές μπουκιές για να ξεκινήσει ο έρωτας." : "Little things to begin the love affair.";
        if (catTitle === "Pizzas" || catTitle === "Πίτσες") blurb = isEl ? "Ψημένες σε ξυλόφουρνο. Ζύμη 48ωρης ωρίμανσης." : "Wood-fired. 48-hour cold-fermented dough.";
        if (catTitle === "Spritz") blurb = isEl ? "Δροσιστικά, παιχνιδιάρικα, σερβίρονται μέχρι αργά." : "Fizzy, flirty, served until late.";

        sectionsMap.set(catTitle, { title: catTitle, blurb, items: [] });
      }

      // Hook up tags
      const tags: TagKind[] = [];
      if (item.is_chef_choice) tags.push("STAR");
      // Note: You can add logic for 'V' or 'VG' here if you add those to your database later!

      // Push item into its category
      sectionsMap.get(catTitle)!.items.push({
        name: itemName,
        desc: itemDesc,
        price: `€${Number(item.price).toFixed(2)}`,
        tags: tags.length > 0 ? tags : undefined
      });
    });

    return orderedCategories.map(cat => sectionsMap.get(cat)!);
  }, [dbItems, isEl]);

  // 3. FILTER BY SEARCH AND CATEGORY PILLS
  const filteredSections = baseSections
    .map((sec) => {
      const filteredItems = sec.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...sec, items: filteredItems };
    })
    .filter((sec, index) => {
      if (sec.items.length === 0) return false;
      if (activeIndex !== -1 && index !== activeIndex) return false;
      return true;
    });

  return (
    <Layout>
      {/* MENU HEADER */}
      <section className="relative overflow-hidden border-b border-burgundy/10 pb-10">
        <Daisy className="absolute -top-10 -left-10 w-44 h-44 opacity-50 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-0 right-8 w-32 h-32 opacity-60" petalColor="var(--pink)" />
        
        <FadeIn>
          <div className="mx-auto max-w-5xl px-5 md:px-8 pt-20 md:pt-28 text-center relative">
            <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">
              {isEl ? "Φαε · Πιες · Επαναλαβε" : "Eat · Drink · Repeat"}
            </span>
            <h1 className="font-display text-7xl md:text-9xl text-burgundy mt-4 lowercase">
              {isEl ? "το μενού" : "the menu"}
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-burgundy/80">
              {isEl 
                ? "Διαλεγμένα στο χέρι, φτιαγμένα με μεράκι. Οι τιμές είναι σε ευρώ. Σε τραπέζια 6 ή περισσότερων ατόμων προστίθεται χρέωση σέρβις 5%."
                : "Hand-picked, hand-tossed, hand-poured. Prices in euros. A 5% service charge is added to tables of 6 or more."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center mb-8">
              <Tag kind="V" /><span className="text-xs text-burgundy/60">{isEl ? "Χορτοφαγικό" : "Vegetarian"}</span>
              <Tag kind="VG" /><span className="text-xs text-burgundy/60">Vegan</span>
              <Tag kind="STAR" /><span className="text-xs text-burgundy/60">{isEl ? "Σπεσιαλιτέ" : "Signature"}</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FILTER NAVBAR (Search & Pills) */}
      <div className="sticky top-16 md:top-20 z-40 bg-[color:var(--cream)]/95 backdrop-blur-md border-b border-burgundy/15 py-4 shadow-sm">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => setActiveIndex(-1)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeIndex === -1 
                    ? "bg-burgundy text-cream shadow-md" 
                    : "bg-cream text-burgundy border border-burgundy/20 hover:bg-pink hover:border-burgundy/40"
                }`}
              >
                {isEl ? "Όλα" : "All"}
              </button>
              
              {baseSections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeIndex === idx 
                      ? "bg-burgundy text-cream shadow-md" 
                      : "bg-cream text-burgundy border border-burgundy/20 hover:bg-pink hover:border-burgundy/40"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/50" />
              <input
                type="text"
                placeholder={isEl ? "Αναζήτηση..." : "Search menu..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream border border-burgundy/20 rounded-full pl-11 pr-4 py-2 text-sm text-burgundy placeholder:text-burgundy/50 focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/30 transition-all shadow-inner"
              />
            </div>

          </div>
        </div>
      </div>

      {/* MENU ITEMS OR LOADING STATE */}
      <section className="mx-auto max-w-5xl px-5 md:px-8 py-12 md:py-16 space-y-20 min-h-[50vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-burgundy/60">
             <Daisy className="w-12 h-12 spin-slow mb-4" petalColor="var(--pink)" centerColor="var(--burgundy)" />
             <p className="font-display text-xl">{isEl ? "Φόρτωση μενού..." : "Loading menu..."}</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-20">
            <Daisy className="w-16 h-16 opacity-30 mx-auto mb-4" petalColor="var(--pink)" centerColor="var(--burgundy)" />
            <p className="text-xl text-burgundy/70 font-display">
              {isEl ? "Δεν βρέθηκε κανένα πιάτο." : "No items found."}
            </p>
          </div>
        ) : (
          filteredSections.map((sec, secIdx) => (
            <div key={sec.title}>
              <FadeIn delay={secIdx * 100}>
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
                    <li key={it.name} className="py-5 flex gap-4 items-baseline hover:bg-pink/10 transition-colors rounded-xl px-2 -mx-2">
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
              </FadeIn>
            </div>
          ))
        )}
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