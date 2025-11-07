import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext'; // 1. Import useAuth
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false); // Optional: for cart operations
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.cart) {
      // User is logged in. Load their cart from the user object.
      // The backend (in auth.js) already formatted the cart for us,
      // but we need to re-map it to be safe.
      const dbCart = user.cart.map(item => ({
        ...(item.product._doc || item.product), // Spread the product object
        quantity: item.quantity
      }));

      setCart(dbCart);
      localStorage.setItem('cart', JSON.stringify(dbCart));
    
    } else if (!isAuthenticated) {
      // User is logged out. Clear the local cart.
      setCart([]);
      localStorage.removeItem('cart');
    }
  }, [user, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      // LOGGED IN: Call API
      try {
        setLoading(true);
        // Find existing item to update quantity correctly
        const existingItem = cart.find(item => item._id === product._id);
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        // Use the POST route to add OR update
        const res = await api.post('/api/cart', {
          productId: product._id,
          quantity: newQuantity
        });
        
        setCart(res.data); // Set cart from API response
        localStorage.setItem('cart', JSON.stringify(res.data));
        toast.success('Cart updated!');

      } catch (err) {
        toast.error('Failed to update cart');
      } finally {
        setLoading(false);
      }
    } else {
      // GUEST: Use local state (original logic)
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item._id === product._id);
        
        if (existingItem) {
          toast.info('Updated quantity in cart');
          return prevCart.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          toast.success('Added to cart!');
          return [...prevCart, { ...product, quantity }];
        }
      });
      // Note: The useEffect for [cart] will save this to localStorage
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      // LOGGED IN: Call API
      try {
        setLoading(true);
        const res = await api.delete(`/api/cart/${productId}`);
        setCart(res.data); // Set cart from API response
        localStorage.setItem('cart', JSON.stringify(res.data));
        toast.info('Removed from cart');
      } catch (err) {
        toast.error('Failed to remove item');
      } finally {
        setLoading(false);
      }
    } else {
      // GUEST: Use local state (original logic)
      setCart(prevCart => prevCart.filter(item => item._id !== productId));
      toast.info('Removed from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productId); // Use your existing logic
    }

    if (isAuthenticated) {
      // LOGGED IN: Call API
      try {
        setLoading(true);
        // Use the POST route to update
        const res = await api.post('/api/cart', { productId, quantity });
        setCart(res.data); // Set cart from API response
        localStorage.setItem('cart', JSON.stringify(res.data));
      } catch (err) {
        toast.error('Failed to update quantity');
      } finally {
        setLoading(false);
      }
    } else {
      // GUEST: Use local state (original logic)
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      // LOGGED IN: Call API
      try {
        setLoading(true);
        await api.put('/api/cart/clear');
        setCart([]);
        localStorage.removeItem('cart');
      } catch (err) {
        toast.error('Failed to clear cart');
      } finally {
        setLoading(false);
      }
    } else {
      // GUEST: Use local state (original logic)
      setCart([]);
      localStorage.removeItem('cart');
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};