import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  // 1. Εξασφαλίζουμε ότι το αίτημα είναι POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // 2. Επαληθεύουμε κρυπτογραφικά ότι το μήνυμα έρχεται ΟΝΤΩΣ από τη Stripe
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Σφάλμα ασφαλείας Webhook:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // 3. Ελέγχουμε αν πρόκειται για ΕΠΙΤΥΧΗΜΕΝΗ πληρωμή
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    // Τραβάμε το ID της παραγγελίας που είχαμε "κρύψει" στα metadata
    const orderId = session.metadata.order_id;

    console.log(`Επιτυχής πληρωμή για την παραγγελία: ${orderId}`);

    try {
      // 4. Ενημερώνουμε απευθείας τη Supabase!
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ payment_status: 'PAID' }) // Αλλάζει σε ΠΛΗΡΩΜΕΝΗ!
      });

      if (!response.ok) {
        console.error('Αποτυχία ενημέρωσης της Supabase:', await response.text());
      }
    } catch (error) {
      console.error('Σφάλμα επικοινωνίας με τη Supabase:', error);
    }
  }

  // 5. Απαντάμε στη Stripe "Όλα καλά, το λάβαμε!"
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};