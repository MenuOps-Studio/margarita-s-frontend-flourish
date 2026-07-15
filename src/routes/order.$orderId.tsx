import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { Check, ChefHat, Clock, PartyPopper, ShoppingBag, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/routes/languagecontext";

export const Route = createFileRoute("/order/$orderId")({
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { orderId } = Route.useParams();
  const { isEl } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasAlerted = useRef(false);

  useEffect(() => {
    fetchOrder();

    // Ακούμε ΖΩΝΤΑΝΑ τις αλλαγές από το Admin Panel (Κουζίνα)
    const channel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
        const updatedOrder = payload.new;
        setOrder(updatedOrder);
        
        // Ήχος και Δόνηση όταν γίνει "ΕΤΟΙΜΗ"
        if (updatedOrder.prep_status === 'READY' && !hasAlerted.current) {
          playReadyAlert();
          hasAlerted.current = true;
        }

        // Καθαρισμός μνήμης αν Ολοκληρωθεί ή Ακυρωθεί
        if (updatedOrder.prep_status === 'COMPLETED' || updatedOrder.prep_status === 'CANCELLED') {
          localStorage.removeItem('margarita_active_order');
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  async function fetchOrder() {
    const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (data) {
      setOrder(data);
      if (data.prep_status === 'COMPLETED' || data.prep_status === 'CANCELLED') {
        localStorage.removeItem('margarita_active_order');
      }
    }
    setIsLoading(false);
  }

  // Συνάρτηση Ήχου και Δόνησης
  function playReadyAlert() {
    if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]); // Δόνηση
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playChime = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(1, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.5);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.5);
      };
      playChime(523.25, 0); // C5
      playChime(659.25, 0.2); // E5
      playChime(783.99, 0.4); // G5
    } catch (e) { console.error("Audio not supported"); }
  }

  if (isLoading) return <Layout><div className="min-h-[60vh] flex items-center justify-center font-display text-xl text-burgundy">{isEl ? "Φόρτωση..." : "Loading..."}</div></Layout>;
  
  if (!order) return <Layout><div className="min-h-[60vh] flex items-center justify-center font-display text-xl text-burgundy">{isEl ? "Η παραγγελία δεν βρέθηκε." : "Order not found."}</div></Layout>;

  // Υπολογισμός Προόδου
  const status = order.prep_status;
  let progress = 5;
  if (status === 'WAITING') progress = 15;
  if (status === 'PREPARING') progress = 50;
  if (status === 'READY') progress = 100;
  if (status === 'COMPLETED') progress = 100;

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-5 md:px-8 py-12 md:py-20 min-h-[70vh] flex flex-col">
        
        <Link to="/menu" className="inline-flex items-center gap-2 text-burgundy/60 hover:text-burgundy transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> {isEl ? "Επιστροφή στο Μενού" : "Back to Menu"}
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-burgundy/10 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl text-burgundy mb-2">
              {isEl ? "Παραγγελία" : "Order"} #{order.daily_order_number || order.id}
            </h1>
            <p className="text-burgundy/60 font-medium">
              {order.table_number !== 'Άγνωστο' && order.table_number !== 'Πακέτο' 
                ? (isEl ? `Τραπέζι ${order.table_number}` : `Table ${order.table_number}`)
                : (isEl ? 'Πακέτο / Takeaway' : 'Takeaway')}
            </p>
          </div>

          {/* Ακυρωμένη Παραγγελία */}
          {status === 'CANCELLED' ? (
             <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100">
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❌</div>
               <h2 className="font-bold text-red-700 text-xl mb-2">{isEl ? "Η παραγγελία ακυρώθηκε" : "Order Cancelled"}</h2>
               <p className="text-red-600/70 text-sm px-4">{isEl ? "Υπήρξε κάποιο πρόβλημα. Παρακαλούμε απευθυνθείτε στο προσωπικό." : "There was an issue. Please contact the staff."}</p>
             </div>
          ) : status === 'COMPLETED' ? (
             <div className="text-center py-10 bg-emerald-50 rounded-2xl border border-emerald-100">
               <PartyPopper className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
               <h2 className="font-bold text-emerald-700 text-xl mb-2">{isEl ? "Ολοκληρώθηκε!" : "Completed!"}</h2>
               <p className="text-emerald-600/70 text-sm">{isEl ? "Ελπίζουμε να το απολαύσατε." : "We hope you enjoyed it."}</p>
             </div>
          ) : (
            <>
              {/* Μπάρα Προόδου */}
              <div className="relative h-2 bg-burgundy/10 rounded-full mb-12">
                <div 
                  className="absolute top-0 left-0 h-full bg-burgundy rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>

              {/* Βήματα Προόδου */}
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-burgundy/10 before:to-transparent">
                
                {/* Βήμα 1: Αναμονή */}
                <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-500 ${status === 'WAITING' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 shadow-sm z-10 ${status === 'WAITING' || progress > 15 ? 'bg-burgundy border-white text-cream' : 'bg-white border-burgundy/20 text-burgundy/40'}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl bg-white border border-burgundy/10 shadow-sm">
                    <h3 className="font-bold text-burgundy">{isEl ? "Λήψη Παραγγελίας" : "Order Received"}</h3>
                    <p className="text-xs text-burgundy/60 mt-1">{isEl ? "Η παραγγελία σας στάλθηκε στο ταμείο." : "Your order has been sent."}</p>
                  </div>
                </div>

                {/* Βήμα 2: Κουζίνα */}
                <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-500 ${status === 'PREPARING' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 shadow-sm z-10 ${progress >= 50 ? 'bg-burgundy border-white text-cream' : 'bg-white border-burgundy/20 text-burgundy/40'}`}>
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl bg-white border border-burgundy/10 shadow-sm">
                    <h3 className="font-bold text-burgundy">{isEl ? "Ετοιμάζεται" : "Preparing"}</h3>
                    <p className="text-xs text-burgundy/60 mt-1">{isEl ? "Ο σεφ ετοιμάζει τα πιάτα σας." : "The chef is preparing your food."}</p>
                  </div>
                </div>

                {/* Βήμα 3: Έτοιμη */}
                <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-500 ${status === 'READY' ? 'opacity-100 animate-pulse' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 shadow-sm z-10 ${status === 'READY' ? 'bg-emerald-500 border-white text-white shadow-emerald-200' : 'bg-white border-burgundy/20 text-burgundy/40'}`}>
                    <Check className="w-6 h-6" />
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl border shadow-sm ${status === 'READY' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-burgundy/10'}`}>
                    <h3 className={`font-bold ${status === 'READY' ? 'text-emerald-700' : 'text-burgundy'}`}>{isEl ? "Είναι Έτοιμη!" : "It's Ready!"}</h3>
                    <p className={`text-xs mt-1 ${status === 'READY' ? 'text-emerald-600' : 'text-burgundy/60'}`}>{isEl ? "Η παραγγελία σας σας περιμένει!" : "Your order is ready!"}</p>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Σύνοψη Παραγγελίας */}
          <div className="mt-12 pt-6 border-t border-burgundy/10">
             <div className="flex items-center gap-2 text-burgundy mb-4">
               <ShoppingBag className="w-5 h-5" />
               <h4 className="font-bold">{isEl ? "Η παραγγελία σας" : "Your Order"}</h4>
             </div>
             <div className="space-y-2 mb-4">
               {order.items && (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: any, idx: number) => (
                 <div key={idx} className="flex justify-between text-sm text-burgundy/80">
                   <span>{item.quantity}x {item.name}</span>
                 </div>
               ))}
             </div>
             <div className="flex justify-between items-center bg-burgundy/5 p-4 rounded-xl font-bold text-burgundy">
               <span>{isEl ? "Σύνολο:" : "Total:"}</span>
               <span>€{order.total_amount.toFixed(2)}</span>
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}