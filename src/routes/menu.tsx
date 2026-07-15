import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Tag, type TagKind } from "@/components/Tag";
import { Daisy } from "@/components/Daisy";
import { useLanguage } from "@/routes/languagecontext";
import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCartStore } from '@/store/cartStore';
import { CartDrawer } from '@/components/CartDrawer';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — μαργαριτα" },
      { name: "description", content: "Pizzas, pasta, spritz, coffee & more. Browse the full μαργαριτα menu." },
    ],
  }),
  component: MenuPage,
});

// Ενημερωμένοι τύποι για να υποστηρίζουν το καλάθι και τις ελλείψεις
type MissingIngredient = { name: string; originalName: string; status: string };
type Item = { id: number; name: string; desc: string; price: string; tags?: TagKind[]; status: string; missingIngredients?: MissingIngredient[]; ingredients?: string[] };
type Section = { title: string; blurb?: string; items: Item[] };

function MenuPage() {
  const { isEl } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const addItem = useCartStore((state) => state.addItem);

  // States για το Modal του Πιάτου
  const [selectedDish, setSelectedDish] = useState<Item | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [itemNote, setItemNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['menuData'],
    queryFn: async () => {
      const [itemsRes, ingredientsRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', 3)
          .neq('status', 'HIDDEN')
          .order('id', { ascending: true }),
        supabase
          .from('ingredients')
          .select('*')
          .eq('restaurant_id', 3)
      ]);

      if (itemsRes.error) throw itemsRes.error;
      if (ingredientsRes.error) throw ingredientsRes.error;

      return {
        items: itemsRes.data,
        ingredients: ingredientsRes.data
      };
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('realtime-margarita-menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        queryClient.invalidateQueries({ queryKey: ['menuData'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ingredients' }, () => {
        queryClient.invalidateQueries({ queryKey: ['menuData'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const baseSections = useMemo(() => {
    if (!data) return [];

    const dbItems = data.items;
    const dbIngredients = data.ingredients;

    const ingredientMap = new Map<string, any>();
    dbIngredients.forEach(ing => {
      ingredientMap.set(ing.name, ing);
    });

    const sectionsMap = new Map<string, Section>();
    const orderedCategories: string[] = [];

    dbItems.forEach(item => {
      const groupId = item.category || "Άλλα";

      if (!sectionsMap.has(groupId)) {
        orderedCategories.push(groupId);
        
        let blurb = "";
        if (groupId === "Ορεκτικά") blurb = isEl ? "Μικρές μπουκιές για να ξεκινήσει ο έρωτας." : "Little things to begin the love affair.";
        if (groupId === "Πίτσες") blurb = isEl ? "Ψημένες σε ξυλόφουρνο. Ζύμη 48ωρης ωρίμανσης." : "Wood-fired. 48-hour cold-fermented dough.";
        if (groupId === "Spritz") blurb = isEl ? "Δροσιστικά, παιχνιδιάρικα, σερβίρονται μέχρι αργά." : "Fizzy, flirty, served until late.";

        sectionsMap.set(groupId, { 
          title: isEl ? groupId : (item.category_en || groupId), 
          blurb, 
          items: [] 
        });
      } else {
        if (!isEl && item.category_en) {
          sectionsMap.get(groupId)!.title = item.category_en;
        }
      }

      const itemName = isEl ? (item.name_el || item.name || "") : (item.name_en || item.name || "");
      const itemDesc = isEl ? (item.description_el || "") : (item.description_en || "");

      const tags: TagKind[] = [];
      if (item.is_chef_choice) tags.push("STAR");

      let missingFromThisDish: MissingIngredient[] = [];
      if (Array.isArray(item.ingredients)) {
        item.ingredients.forEach((ingName: string) => {
          const ing = ingredientMap.get(ingName);
          if (ing && (ing.status === 'UNAVAILABLE' || ing.status === 'UNAVAILABLE_TODAY')) {
            const translatedName = isEl ? ing.name : (ing.name_en || ing.name);
            missingFromThisDish.push({ name: translatedName, originalName: ingName, status: ing.status });
          }
        });
      }

      sectionsMap.get(groupId)!.items.push({
        id: item.id,
        name: itemName,
        desc: itemDesc,
        price: `€${Number(item.price).toFixed(2)}`,
        tags: tags.length > 0 ? tags : undefined,
        status: item.status,
        missingIngredients: missingFromThisDish,
        ingredients: item.ingredients || []
      });
    });

    return orderedCategories.map(cat => sectionsMap.get(cat)!);
  }, [data, isEl]);

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
      <section className="relative overflow-hidden border-b border-burgundy/10 pb-10">
        <Daisy className="absolute -top-10 -left-10 w-44 h-44 opacity-50 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-0 right-8 w-32 h-32 opacity-60 spin-slow" petalColor="var(--pink)" />
        
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

      <div className="sticky top-16 md:top-20 z-40 bg-[color:var(--cream)]/95 backdrop-blur-md border-b border-burgundy/15 py-4 shadow-sm">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
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
                  {sec.items.map((it) => {
                    const isUnavailable = it.status === "UNAVAILABLE_TODAY" || it.status === "UNAVAILABLE";
                    const isUnavailableToday = it.status === "UNAVAILABLE_TODAY";

                    const missingToday = it.missingIngredients?.filter(ing => ing.status === 'UNAVAILABLE_TODAY').map(i => i.name) || [];
                    const missingPerm = it.missingIngredients?.filter(ing => ing.status === 'UNAVAILABLE').map(i => i.name) || [];

                    return (
                      <li 
                        key={it.name} 
                        className={`py-5 flex gap-4 items-baseline transition-all rounded-xl px-2 -mx-2 ${
                          isUnavailable ? "opacity-50 grayscale-[30%] pointer-events-none" : "hover:bg-pink/10"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-display text-2xl text-burgundy ${isUnavailable ? "line-through" : ""}`}>
                              {it.name}
                            </h3>
                            {it.tags?.map((t) => <Tag key={t} kind={t} />)}
                          </div>
                          
                          <p className="text-burgundy/70 text-sm mt-1 leading-relaxed max-w-xl">{it.desc}</p>
                          
                          <div className="mt-1.5 space-y-1">
                            {missingToday.length > 0 && (
                              <p className="text-amber-600 text-sm font-semibold">
                                ⚠️ {isEl ? "Προσωρινά χωρίς:" : "Temporarily without:"} {missingToday.join(", ")}
                              </p>
                            )}
                            {missingPerm.length > 0 && (
                              <p className="text-red-500/90 text-sm font-semibold">
                                ⚠️ {isEl ? "Μη διαθέσιμο:" : "Unavailable:"} {missingPerm.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="border-b-2 border-dotted border-burgundy/30 flex-1 mb-2 hidden sm:block" />
                        
                        {isUnavailable ? (
                          <span className="shrink-0 text-xs sm:text-sm font-bold text-red-500 uppercase tracking-widest bg-red-100/50 border border-red-200 px-3 py-1.5 rounded-md">
                            {isUnavailableToday 
                              ? (isEl ? "Εξαντληθηκε" : "Sold Out") 
                              : (isEl ? "Μη Διαθεσιμο" : "Unavailable")}
                          </span>
                        ) : (
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="font-display text-2xl text-burgundy">{it.price}</span>
                            <button 
                              onClick={() => { 
                                setSelectedDish(it); 
                                // Προ-επιλέγουμε τα υλικά που λείπουν
                                setRemovedIngredients(it.missingIngredients?.map(m => m.originalName) || []); 
                                setItemNote(""); 
                              }}
                              className="bg-pink text-burgundy text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-burgundy/20 hover:bg-burgundy hover:text-cream transition-colors"
                            >
                              + {isEl ? 'Προσθηκη' : 'Add'}
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </FadeIn>
            </div>
          ))
        )}
      </section>

      {/* Modal Παραμετροποίησης Πιάτου */}
      {selectedDish && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDish(null)} />
          
          <div className="relative bg-cream w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <h2 className="font-display text-3xl text-burgundy mb-2">{selectedDish.name}</h2>
            <p className="text-burgundy/70 text-sm mb-6 pb-4 border-b border-burgundy/10">{selectedDish.desc}</p>
            
            <div className="overflow-y-auto flex-1 space-y-6 pb-6">
              
              {/* Αφαίρεση Υλικών */}
              {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                <div>
                  <h3 className="font-semibold text-burgundy uppercase tracking-widest text-xs mb-3">
                    {isEl ? "Αφαιρεση Υλικων (Προαιρετικο)" : "Remove Ingredients (Optional)"}
                  </h3>
                  <div className="space-y-2">
                    {selectedDish.ingredients.map(ing => {
                      const isMissing = selectedDish.missingIngredients?.some(m => m.originalName === ing);
                      const isRemoved = removedIngredients.includes(ing);

                      return (
                        <label key={ing} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isMissing ? 'opacity-70 cursor-not-allowed bg-burgundy/5' : 'cursor-pointer hover:bg-pink/20'}`}>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-burgundy"
                            checked={isRemoved}
                            disabled={isMissing}
                            onChange={(e) => {
                              if (isMissing) return; 
                              if (e.target.checked) setRemovedIngredients([...removedIngredients, ing]);
                              else setRemovedIngredients(removedIngredients.filter(i => i !== ing));
                            }}
                          />
                          <span className={`text-sm flex items-center gap-2 ${isRemoved ? 'line-through text-burgundy/50' : 'text-burgundy'}`}>
                            {isEl ? `Χωρίς ${ing}` : `No ${ing}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Σχόλια Πιάτου */}
              <div>
                <h3 className="font-semibold text-burgundy uppercase tracking-widest text-xs mb-3">
                  {isEl ? "Ειδικες Οδηγιες (Προαιρετικο)" : "Special Instructions (Optional)"}
                </h3>
                <textarea 
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full bg-white border border-burgundy/20 rounded-xl px-4 py-3 text-sm text-burgundy focus:outline-none focus:border-burgundy resize-none h-20"
                  placeholder={isEl ? "π.χ. Καλοψημένη, χωρίς πάγο κλπ." : "e.g. Well done, no ice..."}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-burgundy/10 flex gap-3 mt-auto">
              <button onClick={() => setSelectedDish(null)} className="px-6 py-3 rounded-xl font-bold text-burgundy bg-burgundy/5 hover:bg-burgundy/10 transition-colors">
                {isEl ? "Ακυρωση" : "Cancel"}
              </button>
              <button 
                onClick={() => {
                  addItem({
                    id: selectedDish.id,
                    name: selectedDish.name,
                    price: Number(selectedDish.price.replace('€', '')),
                    removedIngredients,
                    itemNote
                  });
                  setSelectedDish(null);
                }} 
                className="flex-1 bg-burgundy text-cream py-3 rounded-xl font-bold hover:bg-burgundy/90 transition-colors"
              >
                {isEl ? `Προσθήκη · ${selectedDish.price}` : `Add · ${selectedDish.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Κουμπί Ενεργής Παραγγελίας (Αν υπάρχει στη μνήμη) */}
      {typeof window !== 'undefined' && localStorage.getItem('margarita_active_order') && (
        <div className="fixed bottom-24 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none animate-bounce">
          <Link 
            to="/order/$orderId"
            params={{ orderId: localStorage.getItem('margarita_active_order') || '' }}
            className="pointer-events-auto flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg border border-emerald-500 hover:bg-emerald-700 transition-colors"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="font-bold text-sm">{isEl ? 'Προβολή Ενεργής Παραγγελίας' : 'View Active Order'}</span>
          </Link>
        </div>
      )}     
      <CartDrawer />
    </Layout>
  );
}

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