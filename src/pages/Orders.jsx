import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { formatPrice } from "../utils/format";

const STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

export default function Orders() {
  const { user, authLoaded, toast, refreshCart } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    OrderAPI.list().then((o) => { setOrders(o); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => {
    if (user) load();
    else if (authLoaded) setLoading(false);
  }, [user, authLoaded]);

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await OrderAPI.cancel(id);
      toast("Order cancelled");
      load();
      refreshCart();
    } catch (err) {
      toast(err.response?.data?.error || "Could not cancel order", "error");
    }
  };

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login to view orders</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;

  return (
    <div className="container">
      <h1 className="mb">My Orders</h1>
      {loading ? <div className="empty">Loading…</div> :
        orders.length === 0 ? <div className="card empty"><div className="big">📦</div><p>No orders yet.</p></div> :
        orders.map((o) => {
          const cancelled = o.status === "Cancelled";
          const idx = STEPS.indexOf(o.status);
          const canCancel = !cancelled && o.status !== "Delivered" && o.status !== "Shipped";
          return (
            <div key={o.id} className="card mb">
              <div className="flex between center" style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                <div>
                  <b>Order #{o.id}</b>
                  <p className="muted">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b>{formatPrice(o.total)}</b><br />
                  <span className="status-pill" style={cancelled ? { background: "#ffebee", color: "#d32f2f" } : {}}>
                    {o.paymentMethod} · {o.paymentStatus}
                  </span>
                </div>
              </div>

              {cancelled ? (
                <div style={{ background: "#ffebee", color: "#d32f2f", padding: "10px 14px", borderRadius: 6, margin: "12px 0", fontWeight: 600 }}>
                  ❌ This order was cancelled.
                </div>
              ) : (
                <div className="flex mt mb">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex center" style={{ flex: 1 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", margin: "0 auto", background: i <= (idx < 0 ? 0 : idx) ? "#388e3c" : "#ddd", color: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>
                          {i <= (idx < 0 ? 0 : idx) ? "✓" : i + 1}
                        </div>
                        <div style={{ fontSize: 10 }}>{s}</div>
                      </div>
                      {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < (idx < 0 ? 0 : idx) ? "#388e3c" : "#ddd", margin: "0 4px" }} />}
                    </div>
                  ))}
                </div>
              )}

              {o.items.map((it) => (
                <div key={it.id} className="flex gap center" style={{ marginBottom: 6 }}>
                  <img src={it.image} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4 }} />
                  <div><div>{it.title}</div><span className="muted">Qty {it.quantity} · {formatPrice(it.price)}</span></div>
                </div>
              ))}

              <div className="flex between center mt">
                <p className="muted">Deliver to: {o.shipFullName} · {o.shipAddress}</p>
                {canCancel && (
                  <button
                    onClick={() => cancelOrder(o.id)}
                    style={{ border: "1px solid #d32f2f", background: "#fff", color: "#d32f2f", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
