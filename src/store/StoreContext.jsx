import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthAPI, CartAPI, WishlistAPI } from "../api/services";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await AuthAPI.me();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try { setCart(await CartAPI.get()); } catch { setCart([]); }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try { setWishlist(await WishlistAPI.get()); } catch { setWishlist([]); }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("eh_token")) refreshUser();
    else setAuthLoaded(true);
  }, [refreshUser]);

  useEffect(() => {
    if (user) { refreshCart(); refreshWishlist(); }
    else { setCart([]); setWishlist([]); }
  }, [user, refreshCart, refreshWishlist]);

  const loginSuccess = (data) => {
    localStorage.setItem("eh_token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("eh_token");
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast("Logged out");
  };

  const addToCart = async (productId, qty = 1) => {
    if (!user) return toast("Please login to add items", "error");
    try {
      setCart(await CartAPI.add(productId, qty));
      toast("Added to cart");
    } catch (err) {
      toast(err.response?.data?.error || "Could not add to cart", "error");
    }
  };
  const updateCartQty = async (id, quantity) => {
    try {
      setCart(await CartAPI.update(id, quantity));
    } catch (err) {
      toast(err.response?.data?.error || "Could not update cart", "error");
    }
  };
  const removeFromCart = async (id) => { setCart(await CartAPI.remove(id)); toast("Removed from cart"); };

  const isWished = (productId) => wishlist.some((w) => w.product.id === productId);
  const toggleWishlist = async (productId) => {
    if (!user) return toast("Please login to use wishlist", "error");
    if (isWished(productId)) setWishlist(await WishlistAPI.remove(productId));
    else { setWishlist(await WishlistAPI.add(productId)); toast("Added to wishlist"); }
  };

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const wishCount = wishlist.length;

  return (
    <StoreContext.Provider value={{
      user, authLoaded, cart, wishlist, cartCount, wishCount,
      refreshUser, refreshCart, refreshWishlist, loginSuccess, logout,
      addToCart, updateCartQty, removeFromCart, toggleWishlist, isWished, toast,
    }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === "error" ? "toast-err" : ""}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}
