import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderAPI, AddressAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { formatPrice } from "../utils/format";

export default function Dashboard() {
  const { user, authLoaded, cartCount, wishCount } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addrCount, setAddrCount] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") { navigate("/admin"); return; }
      OrderAPI.list().then(setOrders).catch(() => {});
      AddressAPI.list().then((a) => setAddrCount(a.length)).catch(() => {});
    }
  }, [user]);

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const active = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

  return (
    <div className="container">
      <div className="hero" style={{ padding: 24 }}>
        <div><h2 style={{ fontSize: 24 }}>Welcome back, {user?.name?.split(" ")[0]} 👋</h2><p>Your TajElectroHub account overview</p></div>
      </div>

      <div className="grid grid-4 mb">
        <Link to="/orders" className="stat-card"><div>📦</div><div className="stat-val">{orders.length}</div><div className="stat-label">Total Orders</div></Link>
        <Link to="/orders" className="stat-card"><div>🚚</div><div className="stat-val">{active}</div><div className="stat-label">Active Orders</div></Link>
        <Link to="/wishlist" className="stat-card"><div>♥</div><div className="stat-val">{wishCount}</div><div className="stat-label">Wishlist</div></Link>
        <Link to="/orders" className="stat-card"><div>💰</div><div className="stat-val">{formatPrice(totalSpent)}</div><div className="stat-label">Total Spent</div></Link>
      </div>

      <div className="split">
        <div className="card">
          <h3 className="mb">Recent Orders</h3>
          {orders.length === 0 ? <p className="muted">No orders yet.</p> :
            orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex between center" style={{ border: "1px solid #eee", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                <div><b>Order #{o.id}</b><p className="muted">{o.items.length} item(s)</p></div>
                <div style={{ textAlign: "right" }}><b>{formatPrice(o.total)}</b><br /><span className="status-pill">{o.status}</span></div>
              </div>
            ))}
        </div>
        <div className="card" style={{ height: "fit-content" }}>
          <h3 className="mb">Quick Links</h3>
          <Link to="/orders" style={{ display: "block", padding: 6 }}>📦 My Orders</Link>
          <Link to="/cart" style={{ display: "block", padding: 6 }}>🛒 Cart ({cartCount})</Link>
          <Link to="/wishlist" style={{ display: "block", padding: 6 }}>♥ Wishlist ({wishCount})</Link>
          <Link to="/account" style={{ display: "block", padding: 6 }}>📍 Addresses ({addrCount})</Link>
          <Link to="/products" style={{ display: "block", padding: 6 }}>🛍️ Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
