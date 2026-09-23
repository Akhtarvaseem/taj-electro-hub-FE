import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, cartCount, wishCount, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  const doLogout = () => { logout(); navigate("/"); setMobileOpen(false); };
  const isActive = (p) => location.pathname === p;

  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <Logo size={36} />
            <span>
              <div className="brand-name">TajElectroHub</div>
              <div className="brand-sub">Taj Electric &amp; Electronics</div>
            </span>
          </Link>

          <form className="search" onSubmit={search}>
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands and more"
              autoComplete="off"
            />
            <button type="submit">🔍</button>
          </form>

          <nav className="nav-links">
            {user ? (
              <div className="menu">
                <button type="button" className="btn-login" onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
                    : null}
                  {user.name.split(" ")[0]} ▾
                </button>
                {open && (
                  <div className="menu-dropdown" onMouseLeave={() => setOpen(false)}>
                    <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                    <Link to="/account" onClick={() => setOpen(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setOpen(false)}>My Orders</Link>
                    <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
                    {user.role === "ADMIN" && <Link to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>}
                    <button type="button" onClick={doLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-login">Login</Link>
            )}
            <Link to="/wishlist">♥ Wishlist{wishCount > 0 && <span className="badge">{wishCount}</span>}</Link>
            <Link to="/cart">🛒 Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
          </nav>

          <button type="button" className="hamburger" onClick={() => setMobileOpen(true)} aria-label="menu">☰</button>
        </div>
      </header>

      {mobileOpen && <div className="overlay open" onClick={() => setMobileOpen(false)} />}
      <aside className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="flex between center mb">
          <span className="flex center gap"><Logo size={28} /> <b>TajElectroHub</b></span>
          <button type="button" onClick={() => setMobileOpen(false)} style={{ border: 0, background: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {user ? (
          <>
            <div className="mb flex gap center" style={{ padding: "8px 10px", background: "#f5f7ff", borderRadius: 8 }}>
              <div className="avatar sm">
                {user.avatar ? <img src={user.avatar} alt="" /> : user.name?.[0]?.toUpperCase()}
              </div>
              <div><b>{user.name}</b><div className="muted">{user.email}</div></div>
            </div>
            <Link to="/about" onClick={() => setMobileOpen(false)}>ℹ️ About Us</Link>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>📊 Dashboard</Link>
            <Link to="/account" onClick={() => setMobileOpen(false)}>👤 My Profile</Link>
            <Link to="/orders" onClick={() => setMobileOpen(false)}>📦 My Orders</Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)}>♥ Wishlist ({wishCount})</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>🛒 Cart ({cartCount})</Link>
            {user.role === "ADMIN" && <Link to="/admin" onClick={() => setMobileOpen(false)}>⚙️ Admin Panel</Link>}
            <button type="button" onClick={doLogout} style={{ color: "#d32f2f" }}>⏻ Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)}>🔑 Login / Sign Up</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>ℹ️ About Us</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>🛍️ All Products</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>🛒 Cart ({cartCount})</Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)}>♥ Wishlist ({wishCount})</Link>
          </>
        )}
      </aside>

      <nav className="bottom-nav">
        <Link to="/" className={isActive("/") ? "active" : ""}><span className="bn-ico">🏠</span>Home</Link>
        <Link to="/products" className={isActive("/products") ? "active" : ""}><span className="bn-ico">🛍️</span>Shop</Link>
        <Link to="/wishlist" className={isActive("/wishlist") ? "active" : ""}><span className="bn-ico">♥</span>Wishlist</Link>
        <Link to="/cart" className={isActive("/cart") ? "active" : ""}><span className="bn-ico">🛒</span>Cart</Link>
        <Link to={user ? "/account" : "/login"} className={isActive("/account") || isActive("/login") ? "active" : ""}><span className="bn-ico">👤</span>Account</Link>
      </nav>
    </>
  );
}
