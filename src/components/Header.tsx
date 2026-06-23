import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Daisy } from "./Daisy";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Reservations" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--cream)]/85 border-b border-burgundy/15">
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <Daisy className="w-7 h-7 group-hover:spin-slow" petalColor="var(--pink)" />
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

        <div className="flex items-center gap-3">
          <Link
            to="/reservations"
            className="hidden sm:inline-flex items-center gap-2 bg-burgundy text-cream px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-burgundy/90 transition-all hover:scale-105"
          >
            Book a Table
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
              Book a Table
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
