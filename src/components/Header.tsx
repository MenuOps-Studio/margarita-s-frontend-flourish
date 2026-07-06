import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/routes/languagecontext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { isEl, toggleLanguage } = useLanguage();
  
  // 1. Δημιουργούμε το ref για το header
  const headerRef = useRef<HTMLElement>(null);

  const links = [
    { to: "/", label: isEl ? "Αρχική" : "Home" },
    { to: "/menu", label: isEl ? "Μενού" : "Menu" },
    { to: "/reservations", label: isEl ? "Κρατήσεις" : "Reservations" },
    { to: "/contact", label: isEl ? "Επικοινωνία" : "Contact" },
  ] as const;

  // 2. Προσθέτουμε το useEffect που "ακούει" τα κλικ
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Αν το κλικ έγινε ΕΚΤΟΣ του header, κλείσε το μενού
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    // Ενεργοποιούμε τον listener μόνο όταν το μενού είναι ανοιχτό
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Καθαρισμός όταν κλείνει το component ή το μενού
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    // 3. Προσθέτουμε το ref στο <header>
    <header ref={headerRef} className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--cream)]/85 border-b border-burgundy/15">
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          
          {/* PASTE YOUR IMAGE LINK HERE */}
          <img 
            src="/margarita.png" 
            alt="Μαργαρίτα Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform group-hover:scale-105" 
          />
          {/* --------------------------- */}

          <span className="font-display text-2xl md:text-3xl text-burgundy lowercase tracking-tight">
            μαργαριτα
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-burgundy/80 hover:text-burgundy text-sm font-medium tracking-wide transition-colors relative"
              activeProps={{ className: "text-burgundy" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="text-burgundy/80 hover:text-burgundy font-display tracking-wider text-xl transition-colors"
            aria-label="Toggle language"
          >
            {isEl ? "EN" : "EL"}
          </button>
          <Link
            to="/reservations"
            className="hidden sm:inline-flex items-center gap-2 bg-burgundy text-cream px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-burgundy/90 transition-all hover:scale-105"
          >
            {isEl ? "Κλείσε Τραπέζι" : "Book a Table"}
          </Link>
          <button
            className="md:hidden text-burgundy"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-burgundy/15 bg-cream">
          <nav className="flex flex-col px-5 py-4 gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-burgundy text-lg font-medium py-1"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/reservations"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center bg-burgundy text-cream px-5 py-3 rounded-full font-semibold"
            >
              {isEl ? "Κλείσε Τραπέζι" : "Book a Table"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}