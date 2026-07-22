import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore'; 
import { ShoppingBag, X, Plus, Minus, Loader2, Utensils, ShoppingBag as BagIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/routes/languagecontext'; 

export function CartDrawer() {
  const { isEl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States για τον διαχωρισμό παραγγελίας
  const [urlTable, setUrlTable] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('TAKEAWAY');
  
  const [lastName, setLastName] = useState('');
  const [comments, setComments] = useState('');

  const { items, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore(); 
  const totalItems = getTotalItems(); 
  const totalPrice = getTotalPrice(); 

  // Έλεγχος URL κατά τη φόρτωση για αυτόματο "κλείδωμα"
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('table');
    if (table) {
      setUrlTable(table);
      setOrderType('DINE_IN'); // Κλειδώνει σε Σαλόνι
    } else {
      setUrlTable(null);
      setOrderType('TAKEAWAY'); // Κλειδώνει σε Πακέτο
    }
  }, []);

  if (totalItems === 0) return null;

  async function handleSubmitOrder() {
    // Validations 
    if (orderType === 'TAKEAWAY' && !lastName.trim()) {
      alert(isEl ? 'Παρακαλώ εισάγετε ένα όνομα για την παραλαβή.' : 'Please enter a name for pickup.');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      restaurant_id: 3, 
      order_type: orderType, 
      table_number: urlTable, 
      items: items, 
      total_amount: totalPrice,
      customer_last_name: lastName || null, 
      notes: comments,
      payment_status: 'UNPAID', 
      prep_status: 'WAITING' // Αλλάξαμε το PENDING σε WAITING
    };

    // 1. Καταγραφή της παραγγελίας στη Supabase
    const { data, error } = await supabase.from('orders').insert(orderData).select().single();

    if (error) {
      setIsSubmitting(false);
      alert(isEl ? 'Κάτι πήγε στραβά με την παραγγελία.' : 'Something went wrong.');
      console.error(error);
      return;
    }

    // 2. Δημιουργία πληρωμής μέσω Stripe (Κλήση στο Netlify Function)
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          orderId: data.id // Στέλνουμε το ID της παραγγελίας που μόλις δημιουργήθηκε
        }),
      });

      const session = await response.json();

      if (session.url) {
        // Επιτυχής δημιουργία link πληρωμής
        clearCart(); 
        setIsOpen(false);
        localStorage.setItem('margarita_active_order', data.id);
        
        // Ανακατεύθυνση του πελάτη στη σελίδα της Stripe
        window.location.href = session.url;
      } else {
        throw new Error('Δεν επιστράφηκε URL πληρωμής');
      }
    } catch (err) {
      console.error("Σφάλμα σύνδεσης με Stripe:", err);
      alert(isEl ? 'Αποτυχία σύνδεσης με το σύστημα πληρωμών.' : 'Payment system connection failed.');
      setIsSubmitting(false);
    }
  }

  return (
    <>
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-cream h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-6 border-b border-burgundy/10">
              <h2 className="font-display text-3xl text-burgundy flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> {isEl ? 'Παραγγελία' : 'Your Order'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-burgundy/60 hover:text-burgundy">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Λίστα Προϊόντων */}
              {items.map(item => (
                <div key={item.cartItemId} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-burgundy">{item.name}</h4>
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
                
                {/* Δυναμική Ενημέρωση Πελάτη */}
                {orderType === 'DINE_IN' ? (
                  // Εμφάνιση Κλειδωμένου Τραπεζιού
                  <div className="bg-burgundy/5 p-4 rounded-xl border border-burgundy/20 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-burgundy text-lg">{isEl ? 'Σαλόνι' : 'Dine In'}</h3>
                      <p className="text-sm text-burgundy/80">
                        {isEl ? 'Η παραγγελία θα σερβιριστεί στο Τραπέζι' : 'Order will be served at Table'} <span className="font-bold text-burgundy text-base ml-1">{urlTable}</span>
                      </p>
                    </div>
                    <Utensils className="w-8 h-8 text-burgundy" />
                  </div>
                ) : (
                  // Εμφάνιση Κλειδωμένου Takeaway
                  <div className="space-y-4">
                    <div className="bg-burgundy/5 p-4 rounded-xl border border-burgundy/20 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-burgundy text-lg">{isEl ? 'Πακέτο' : 'Takeaway'}</h3>
                        <p className="text-sm text-burgundy/80">
                          {isEl ? 'Παραλαβή από το κατάστημα' : 'Pickup from store'}
                        </p>
                      </div>
                      <BagIcon className="w-8 h-8 text-burgundy" />
                    </div>

                    <div className="animate-in fade-in">
                      <label className="text-xs text-burgundy/70 font-semibold mb-1 block">{isEl ? 'Όνομα Παραλαβής *' : 'Pickup Name *'}</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white border border-burgundy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy" 
                        placeholder={isEl ? 'π.χ. Νίκος' : 'e.g. Nick'}
                      />
                    </div>
                  </div>
                )}

                {/* Σχόλια (Πάντα ορατά) */}
                <div className="pt-2">
                  <label className="text-xs text-burgundy/70 font-semibold mb-1 block">{isEl ? 'Σχόλια Παραγγελίας (Προαιρετικό)' : 'Order Notes (Optional)'}</label>
                  <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-white border border-burgundy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy resize-none h-16" 
                    placeholder={isEl ? 'π.χ. Επιπλέον χαρτοπετσέτες' : 'e.g. Extra napkins'}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-burgundy/5 border-t border-burgundy/10">
              <div className="flex justify-between items-center mb-4 text-burgundy">
                <span className="font-semibold">{isEl ? 'Σύνολο' : 'Total'}</span>
                <span className="font-display text-2xl">€{totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-burgundy text-cream py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-burgundy/90 transition-colors disabled:opacity-70 shadow-lg"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEl ? 'Αποστολή Παραγγελίας' : 'Send Order')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}