import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, X, Plus, Minus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/routes/languagecontext';

export function CartDrawer() {
  const { isEl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Φόρμα Checkout
  const [lastName, setLastName] = useState('');
  const [comments, setComments] = useState('');

  const { items, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  async function handleSubmitOrder() {
    setIsSubmitting(true);
    
    // Ανάγνωση τραπεζιού από το URL (π.χ. ?table=5)
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table') || 'Άγνωστο';

    const orderData = {
      restaurant_id: 3, // Το ID της Μαργαρίτας από τη βάση σας
      table_number: tableNumber,
      items: items, // Το Supabase θα το μετατρέψει αυτόματα σε JSONB
      total_amount: totalPrice,
      // Σώζουμε το επίθετο και τα σχόλια μέσα στο JSONB των items ή μπορείς να φτιάξεις ξεχωριστές στήλες στο μέλλον. 
      // Για τώρα τα ενσωματώνουμε σε ένα "dummy" item ή σαν σημείωση.
      customer_last_name: lastName, // ΠΡΟΑΙΡΕΤΙΚΟ: Θα πρέπει να προσθέσεις αυτή τη στήλη (text) στον πίνακα orders, αλλιώς βγάλτο.
      notes: comments // ΠΡΟΑΙΡΕΤΙΚΟ: Ομοίως, πρόσθεσε στήλη 'notes' (text) στον πίνακα orders.
    };

    const { data, error } = await supabase.from('orders').insert(orderData).select().single();

    setIsSubmitting(false);

    if (error) {
      alert(isEl ? 'Κάτι πήγε στραβά με την παραγγελία.' : 'Something went wrong.');
      console.error(error);
      return;
    }

   clearCart();
    setIsOpen(false);
    
    // Αποθήκευση της παραγγελίας στη μνήμη του κινητού (για να μην τη χάσει αν κλείσει το site)
    localStorage.setItem('margarita_active_order', data.id);

    // Μεταφορά στο νέο URL παρακολούθησης
    window.location.href = `/order/${data.id}`;
    
    // Παίρνουμε το νούμερο που μόλις έφτιαξε αυτόματα η βάση
    const orderNum = data.daily_order_number || data.id;

    // Εδώ ιδανικά κάνουμε redirect στη σελίδα Live Tracking (Φάση 4)
    // π.χ. window.location.href = `/order/${data.id}`;
    alert(isEl ? `Η παραγγελία #${orderNum} εστάλη επιτυχώς!` : `Order #${orderNum} sent successfully!`);
  }

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <button 
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto flex items-center justify-between w-full max-w-sm bg-burgundy text-cream px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="bg-cream/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </div>
            <span className="font-semibold">{isEl ? 'Δες την παραγγελία' : 'View order'}</span>
          </div>
          <span className="font-display text-xl">€{totalPrice.toFixed(2)}</span>
        </button>
      </div>

      {/* Cart Drawer (Overlay & Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-cream h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-burgundy/10">
              <h2 className="font-display text-3xl text-burgundy flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> {isEl ? 'Παραγγελία' : 'Your Order'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-burgundy/60 hover:text-burgundy">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map(item => (
                <div key={item.cartItemId} className="flex justify-between items-start gap-4"> {/* ΑΛΛΑΓΗ key σε cartItemId */}
                  <div className="flex-1">
                    <h4 className="font-bold text-burgundy">{item.name}</h4>
                    
                    {/* ΕΜΦΑΝΙΣΗ ΑΦΑΙΡΕΜΕΝΩΝ ΥΛΙΚΩΝ ΚΑΙ ΣΧΟΛΙΩΝ */}
                    {(item.removedIngredients.length > 0 || item.itemNote) && (
                      <div className="mt-1 mb-2 space-y-0.5">
                        {item.removedIngredients.length > 0 && (
                          <p className="text-xs text-red-500 font-semibold">
                            - {isEl ? 'Χωρίς' : 'No'}: {item.removedIngredients.join(', ')}
                          </p>
                        )}
                        {item.itemNote && (
                          <p className="text-xs text-burgundy/60 italic border-l-2 border-burgundy/20 pl-2">
                            "{item.itemNote}"
                          </p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-burgundy/60 text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-burgundy/5 rounded-full px-2 py-1 border border-burgundy/10 mt-1">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-1 text-burgundy hover:bg-burgundy/10 rounded-full">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-4 text-center font-semibold text-burgundy">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-1 text-burgundy hover:bg-burgundy/10 rounded-full">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-burgundy/10 pt-6 space-y-4">
                <h3 className="font-semibold text-burgundy text-sm uppercase tracking-widest">{isEl ? 'Στοιχεία (Προαιρετικά)' : 'Details (Optional)'}</h3>
                
                <div>
                  <label className="text-xs text-burgundy/70 font-semibold mb-1 block">{isEl ? 'Επίθετο' : 'Last Name'}</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-burgundy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy" 
                    placeholder={isEl ? 'π.χ. Παπαδόπουλος' : 'e.g. Smith'}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-burgundy/70 font-semibold mb-1 block">{isEl ? 'Σχόλια / Σημειώσεις' : 'Notes / Comments'}</label>
                  <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-white border border-burgundy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy resize-none h-20" 
                    placeholder={isEl ? 'π.χ. Η πίτσα χωρίς μανιτάρια' : 'e.g. No mushrooms on the pizza'}
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-burgundy/5 border-t border-burgundy/10">
              <div className="flex justify-between items-center mb-4 text-burgundy">
                <span className="font-semibold">{isEl ? 'Σύνολο' : 'Total'}</span>
                <span className="font-display text-2xl">€{totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-burgundy text-cream py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-burgundy/90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEl ? 'Αποστολή Παραγγελίας' : 'Send Order')}
              </button>
              <p className="text-center text-xs text-burgundy/60 mt-3">
                {isEl ? 'Πληρωμή στο ταμείο ή στον σερβιτόρο.' : 'Pay at the counter or to the waiter.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}