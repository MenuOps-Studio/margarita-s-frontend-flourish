import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Daisy } from "@/components/Daisy";
import { MapPin, Phone, Clock, Instagram, Facebook, ArrowRight } from "lucide-react";
import { useLanguage } from "@/routes/languagecontext";

const IG = "https://www.instagram.com/margarita.srs?igsh=MXFmMjA3MjFicmE3eQ%3D%3D&utm_source=qr";
const FB = "https://www.facebook.com/profile.php?id=61590545034994&sk=about";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία / Contact — μαργαριτα" },
      { name: "description", content: "Visit μαργαριτα in Agra, Serres 621 23. Open daily 9:00 – 1:00. Phone 2321 022440." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { isEl } = useLanguage();

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-burgundy/60">
            {isEl ? "Πες ενα ciao" : "Say ciao"}
          </span>
          <h1 className="font-display text-7xl md:text-9xl text-burgundy mt-4 lowercase">
            {isEl ? "επικοινωνία" : "contact"}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <InfoBlock icon={<MapPin className="w-5 h-5" />} title={isEl ? "Τοποθεσία" : "Location"}>
              <p className="text-xl">Άγρα, Σέρρες 621 23</p>
              <p className="text-burgundy/70 text-sm mt-1">{isEl ? "Ελλάδα" : "Greece"}</p>
            </InfoBlock>

            <InfoBlock icon={<Phone className="w-5 h-5" />} title={isEl ? "Τηλέφωνο" : "Phone"}>
              <a href="tel:+302321022440" className="text-xl hover:underline underline-offset-4">2321 022440</a>
            </InfoBlock>

            <InfoBlock icon={<Clock className="w-5 h-5" />} title={isEl ? "Ωράριο Λειτουργίας" : "Opening Hours"}>
              <p className="text-xl">{isEl ? "Δευτέρα – Κυριακή" : "Monday – Sunday"}</p>
              <p className="text-burgundy/70">9:00 π.μ. – 1:00 π.μ.</p>
            </InfoBlock>

            <div className="bg-burgundy text-cream rounded-3xl p-8 relative overflow-hidden">
              <Daisy className="absolute -top-6 -right-6 w-32 h-32 opacity-30 spin-slow" petalColor="var(--pink)" centerColor="var(--cream)" />
              <h3 className="font-display text-3xl">
                {isEl ? "Ακολούθησε τη μαργαρίτα." : "Follow the daisy."}
              </h3>
              <p className="text-cream/80 mt-2 text-sm">
                {isEl 
                  ? "Behind-the-scenes, νέα πιάτα, late-night spritz." 
                  : "Behind-the-scenes, new drops, late-night spritz."}
              </p>
              <div className="flex gap-3 mt-5">
                <a href={IG} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cream text-burgundy px-5 py-2.5 rounded-full font-semibold hover:bg-pink transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
                <a href={FB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cream text-burgundy px-5 py-2.5 rounded-full font-semibold hover:bg-pink transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              </div>
            </div>

            <Link to="/reservations" className="inline-flex items-center gap-2 text-burgundy font-semibold hover:gap-3 transition-all">
              {isEl ? "Ή κλείσε τραπέζι →" : "Or book a table →"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-burgundy/15 min-h-[500px] bg-pink">
            <iframe
              title="Map to μαργαριτα"
              src="https://www.openstreetmap.org/export/embed.html?bbox=23.50%2C41.05%2C23.62%2C41.12&layer=mapnik&marker=41.0853%2C23.5527"
              className="w-full h-full absolute inset-0"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur rounded-2xl p-4 flex items-center gap-3 border border-burgundy/15">
              <Daisy className="w-10 h-10 shrink-0" petalColor="var(--pink)" />
              <div>
                <p className="font-display text-xl text-burgundy leading-none">μαργαριτα</p>
                <p className="text-xs text-burgundy/70 mt-1">Άγρα, Σέρρες 621 23</p>
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=41.0853&mlon=23.5527#map=14/41.0853/23.5527"
                target="_blank" rel="noreferrer"
                className="ml-auto bg-burgundy text-cream text-xs font-semibold px-3 py-2 rounded-full"
              >
                {isEl ? "Άνοιγμα" : "Open"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-burgundy/15 rounded-3xl p-7">
      <div className="flex items-center gap-3 text-burgundy/70">
        <span className="w-9 h-9 rounded-full bg-pink flex items-center justify-center text-burgundy">{icon}</span>
        <span className="text-xs uppercase tracking-widest font-semibold">{title}</span>
      </div>
      <div className="mt-3 text-burgundy">{children}</div>
    </div>
  );
}