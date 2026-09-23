import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddressAPI, OrderAPI, DeliveryAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { formatPrice, normalizePin } from "../utils/format";
import PincodeCheck from "../components/PincodeCheck";

const empty = { fullName: "", phone: "", pincode: "", line1: "", line2: "", city: "", state: "", addressType: "Home" };
const DISABLED = ["UPI (GPay / PhonePe)", "Credit / Debit Card", "Net Banking", "Wallet"];

export default function Checkout() {
  const { cart, user, authLoaded, refreshCart, toast } = useStore();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [placing, setPlacing] = useState(false);

  const itemsTotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const deliveryFee = itemsTotal >= 500 || itemsTotal === 0 ? 0 : 40;
  const total = itemsTotal + deliveryFee;

  const loadAddr = () => AddressAPI.list().then((a) => {
    setAddresses(a);
    if (a.length) { setSelected(a[0].id); setShowForm(false); } else setShowForm(true);
  });
  useEffect(() => { if (user) loadAddr(); }, [user]);

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login to checkout</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;
  if (authLoaded && user && cart.length === 0)
    return <div className="container empty"><h2>Your cart is empty</h2><Link to="/products" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Shop now</Link></div>;

  const saveAddress = async (e) => {
    e.preventDefault();
    const pin = normalizePin(form.pincode);
    if (!pin) return toast("Enter a valid 6-digit pincode", "error");
    const a = await AddressAPI.create({ ...form, pincode: pin });
    setForm(empty);
    await loadAddr();
    setSelected(a.id);
    toast("Address saved");
  };

  const placeOrder = async () => {
    const addr = addresses.find((a) => a.id === selected);
    if (!addr) return toast("Please select an address", "error");
    const pin = normalizePin(addr.pincode || addr.pinCode || addr.address);
    if (!pin) return toast("Selected address is missing a valid 6-digit pincode", "error");
    setPlacing(true);
    try {
      try {
        const check = await DeliveryAPI.check(pin);
        if (check && check.available === false) {
          toast(check.error || "Delivery is not available to this pincode", "error");
          setPlacing(false);
          return;
        }
      } catch {
        /* backend check optional — PIN already validated locally */
      }
      const data = await OrderAPI.place({
        fullName: addr.fullName, phone: addr.phone, pincode: pin,
        address: `${addr.line1}, ${addr.line2 ? addr.line2 + ", " : ""}${addr.city}, ${addr.state} - ${pin}`,
      }, "COD");
      await refreshCart();
      navigate(`/order-success?id=${data.order.id}`);
    } catch (err) {
      toast(err.response?.data?.error || "Failed to place order", "error");
    } finally { setPlacing(false); }
  };

  return (
    <div className="container split">
      <div>
        <div className="card mb">
          <h3 className="mb">1. Delivery Address</h3>
          <PincodeCheck compact />
          <div className="mb" />
          {addresses.map((a) => (
            <label key={a.id} className="flex gap" style={{ border: selected === a.id ? "1px solid #2874f0" : "1px solid #eee", borderRadius: 6, padding: 12, marginBottom: 8, cursor: "pointer" }}>
              <input type="radio" checked={selected === a.id} onChange={() => setSelected(a.id)} />
              <div>
                <b>{a.fullName}</b> <span className="status-pill">{a.addressType}</span> {a.phone}
                <p className="muted">{a.line1}, {a.line2 && a.line2 + ", "}{a.city}, {a.state} - {a.pincode}</p>
              </div>
            </label>
          ))}
          <button onClick={() => setShowForm((s) => !s)} style={{ border: 0, background: "none", color: "#2874f0", fontWeight: 600, cursor: "pointer" }}>
            {showForm ? "− Cancel" : "+ Add a new address"}
          </button>
          {showForm && (
            <form onSubmit={saveAddress} className="mt" autoComplete="on">
              <input className="input" name="fullName" autoComplete="name" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input className="input" name="phone" autoComplete="tel" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" name="postal-code" autoComplete="postal-code" inputMode="numeric" maxLength={6} placeholder="Pincode (6 digits)" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
              <input className="input" name="city" autoComplete="address-level2" placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input className="input" name="line1" autoComplete="address-line1" placeholder="House / Street" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
              <input className="input" name="line2" autoComplete="address-line2" placeholder="Landmark (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
              <input className="input" name="state" autoComplete="address-level1" placeholder="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <button type="submit" className="btn btn-blue">Save Address</button>
            </form>
          )}
        </div>

        <div className="card">
          <h3 className="mb">2. Payment Method</h3>
          <label className="flex gap center" style={{ border: "1px solid #2874f0", borderRadius: 6, padding: 12, marginBottom: 8 }}>
            <input type="radio" checked readOnly />
            <span><b>💵 Cash on Delivery</b></span>
            <span className="status-pill" style={{ marginLeft: "auto", background: "#e8f5e9", color: "#388e3c" }}>Available</span>
          </label>
          {DISABLED.map((m) => (
            <label key={m} className="flex gap center" style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, marginBottom: 8, opacity: .55 }}>
              <input type="radio" disabled />
              <span className="muted">{m}</span>
              <span className="status-pill" style={{ marginLeft: "auto", background: "#eee", color: "#888" }}>Coming soon</span>
            </label>
          ))}
          <p className="muted">Online payments are temporarily disabled. Only Cash on Delivery is accepted.</p>
        </div>
      </div>

      <div className="card" style={{ height: "fit-content" }}>
        <h3 className="mb">ORDER SUMMARY</h3>
        {cart.map((c) => (
          <div key={c.id} className="flex between muted" style={{ marginBottom: 4 }}>
            <span>{c.product.title} × {c.quantity}</span><span>{formatPrice(c.product.price * c.quantity)}</span>
          </div>
        ))}
        <hr style={{ margin: "10px 0" }} />
        <div className="flex between"><span>Delivery</span><span className="off">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
        <div className="flex between mt"><b>Total</b><b>{formatPrice(total)}</b></div>
        <button className="btn btn-orange mt" style={{ width: "100%" }} disabled={placing || !selected} onClick={placeOrder}>
          {placing ? "Placing…" : "PLACE ORDER (COD)"}
        </button>
      </div>
    </div>
  );
}
