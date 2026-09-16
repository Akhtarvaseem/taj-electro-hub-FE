import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";

export default function Navbar() {
  const { user, cartCount, wishCount, logout } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-logo">⚡</span>
          <span>
            <div className="brand-name">ElectroHub</div>
            <div className="brand-sub">Taj Electric &amp; Electronics</div>
          </span>
        </Link>

        <form className="search" onSubmit={search}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
          />
          <button type="submit">🔍</button>
        </form>

        <nav className="nav-links">
          {user ? (
            <div className="menu">
              <button className="btn-login" onClick={() => setOpen((o) => !o)}>
                {user.name.split(" ")[0]} ▾
              </button>
              {open && (
                <div className="menu-dropdown" onMouseLeave={() => setOpen(false)}>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link to="/account" onClick={() => setOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
                  {user.role === "ADMIN" && (
                    <Link to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>
                  )}
                  <button onClick={() => { setOpen(false); logout(); navigate("/"); }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}

          <Link to="/wishlist">♥ Wishlist{wishCount > 0 && <span className="badge">{wishCount}</span>}</Link>
          <Link to="/cart">🛒 Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
        </nav>
      </div>
    </header>
  );
}
