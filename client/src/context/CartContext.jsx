import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

// NPR to GBP rate
const NPR_TO_GBP = 0.0060;
const UK_VAT = 0.20;
const SHIPPING_FEE = 12.99;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalNPR = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.priceNPR) * item.quantity, 0
  );

  const subtotalGBP = subtotalNPR * NPR_TO_GBP;
  const vatGBP = subtotalGBP * UK_VAT;
  const totalGBP = subtotalGBP + vatGBP + SHIPPING_FEE;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotalNPR,
      subtotalGBP,
      vatGBP,
      totalGBP,
      shippingFeeGBP: SHIPPING_FEE,
      NPR_TO_GBP
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
