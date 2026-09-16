import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="container empty">
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#388e3c", color: "#fff", display: "grid", placeItems: "center", fontSize: 40, margin: "0 auto" }}>✓</div>
      <h1 className="mt">Order Placed Successfully!</h1>
      <p className="muted">Your order is confirmed. Pay with <b>Cash on Delivery</b> when it arrives.</p>
      <div className="flex gap center mt" style={{ justifyContent: "center" }}>
        <Link to="/orders" className="btn btn-blue">View My Orders</Link>
        <Link to="/products" className="btn" style={{ background: "#eee", color: "#212121" }}>Continue Shopping</Link>
      </div>
    </div>
  );
}
