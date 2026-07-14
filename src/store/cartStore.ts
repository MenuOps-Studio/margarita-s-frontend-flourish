import { create } from 'zustand'

export type CartItem = {
  cartItemId: string; // Μοναδικό ID για τη συγκεκριμένη γραμμή του καλαθιού
  id: number;
  name: string;
  price: number;
  quantity: number;
  removedIngredients: string[];
  itemNote: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    // Ψάχνουμε αν υπάρχει ΗΔΗ στο καλάθι ακριβώς το ίδιο πιάτο με τις ΙΔΙΕΣ ακριβώς αλλαγές
    const existingItem = state.items.find(item => 
      item.id === newItem.id && 
      JSON.stringify(item.removedIngredients) === JSON.stringify(newItem.removedIngredients) &&
      item.itemNote === newItem.itemNote
    );

    if (existingItem) {
      return {
        items: state.items.map(item => 
          item.cartItemId === existingItem.cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      };
    }
    
    // Αν είναι νέα παραλλαγή, φτιάχνουμε νέο μοναδικό ID για τη γραμμή
    const cartItemId = Math.random().toString(36).substring(2, 9);
    return { items: [...state.items, { ...newItem, quantity: 1, cartItemId }] };
  }),
  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter(item => item.cartItemId !== cartItemId)
  })),
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: quantity > 0 
      ? state.items.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item)
      : state.items.filter(item => item.cartItemId !== cartItemId)
  })),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0)
}));