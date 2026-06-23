import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Daisy } from "@/components/Daisy";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations — μαργαριτα" },
      { name: "description", content: "Reserve a table at μαργαριτα in Serres. Open daily 9:00 – 1:00." },
      { property: "og:title", content: "Reservations — μαργαριτα" },
      { property: "og:description", content: "Book a table for pizza, pasta & spritz." },
    ],
  }),
  component: ReservationsPage,
});

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 12; h <= 23; h++) {
    for (const m of [0, 15, 30, 45]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  slots.push("00:00", "00:15", "00:30", "00:45");
  return slots;
})();

function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [guests, setGuests] = useState(2);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <Daisy className="absolute -top-16 -right-16 w-64 h-64 opacity-40 spin-slow" petalColor="var(--pink)" />
        <Daisy className="absolute bottom-10 -left-10 w-40 h-40 opacity-50" petalColor="var(--pink)" />

        <div className="relative mx-auto max-w-5xl px-5 md:px-8 py-16 md:py-24 grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">Book your seat</span>
            <h1 className="font-display text-6xl md:text-7xl text-burgundy mt-4 lowercase leading-[0.9]">
              save<br/>a table.
            </h1>
            <p className="mt-6 text-burgundy/80 max-w-sm">
              Tell us when & we'll save your seat — with a candle, a glass, and a smile.
            </p>
            <p className="mt-4 font-display text-2xl italic text-burgundy/70">Zero drama. Full flavor.</p>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-pink rounded-3xl p-10 text-center border border-burgundy/15">
                <CheckCircle2 className="w-14 h-14 text-burgundy mx-auto" />
                <h2 className="font-display text-4xl text-burgundy mt-4">Ti aspettiamo!</h2>
                <p className="text-burgundy/80 mt-3">
                  Your request was sent. We'll confirm by email soon. Until then — stay cute, stay hungry.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-burgundy underline underline-offset-4 text-sm">
                  Book another table
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-card rounded-3xl p-7 md:p-10 border border-burgundy/15 shadow-[0_30px_60px_-30px_rgba(116,0,25,0.25)]">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="First name">
                    <input required type="text" className={inputCls} placeholder="Sofia" />
                  </Field>
                  <Field label="Last name">
                    <input required type="text" className={inputCls} placeholder="Rossi" />
                  </Field>
                  <Field label="Email" className="sm:col-span-2">
                    <input required type="email" className={inputCls} placeholder="ciao@margarita.gr" />
                  </Field>
                  <Field label="Date">
                    <input required type="date" className={inputCls} />
                  </Field>
                  <Field label="Time">
                    <select required defaultValue="" className={inputCls}>
                      <option value="" disabled>Pick a time</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Guests" className="sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-11 h-11 rounded-full border border-burgundy/30 text-burgundy text-xl hover:bg-pink transition-colors">−</button>
                      <div className="flex-1 text-center font-display text-3xl text-burgundy">{guests}</div>
                      <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="w-11 h-11 rounded-full border border-burgundy/30 text-burgundy text-xl hover:bg-pink transition-colors">+</button>
                    </div>
                  </Field>
                </div>

                <button
                  type="submit"
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-burgundy text-cream py-4 rounded-full font-display text-2xl hover:bg-burgundy/90 transition-all hover:scale-[1.01]"
                >
                  <Daisy className="w-6 h-6" petalColor="var(--pink)" centerColor="var(--cream)" />
                  Reserve my table
                </button>
                <p className="text-xs text-burgundy/60 text-center mt-3">We'll confirm by email. Tables held for 15 minutes.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

const inputCls =
  "w-full bg-cream border border-burgundy/20 rounded-xl px-4 py-3 text-burgundy placeholder:text-burgundy/40 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[11px] uppercase tracking-widest text-burgundy/70 mb-2 font-semibold">{label}</span>
      {children}
    </label>
  );
}
