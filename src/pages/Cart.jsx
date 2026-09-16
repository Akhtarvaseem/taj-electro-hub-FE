import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { formatPrice, discountPct } from "../utils/format";

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, user, authLoaded } = useStore();
  const navigate = useNavigate();

  const itemsTotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const mrpTotal = cart.reduce((s, c) => s + c.product.mrp * c.quantity, 0);
  const deliveryFee = itemsTotal >= 500 || itemsTotal === 0 ? 0 : 40;
  const savings = mrpTotal - itemsTotal;
  const total = itemsTotal + deliveryFee;
  const hasStockIssue = cart.some((c) => c.product.stock <= 0 || c.quantity > c.product.stock);

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login to view cart</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;
  if (cart.length === 0)
    return <div className="container empty"><div className="big">🛒</div><h2>Your cart is empty</h2><Link to="/products" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Shop now</Link></div>;

  return (
    <div className="container grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
      <div>
        <div className="card">
          <h2 className="mb">My Cart ({cart.length})</h2>
          {cart.map((c) => {
            const off = discountPct(c.product.mrp, c.product.price);
            return (
              <div key={c.id} className="flex gap" style={{ borderTop: "1px solid #eee", padding: "14px 0" }}>
                <img src={c.product.images?.[0]} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${c.product.slug}`}>{c.product.title}</Link>
                  <div className="mt">
                    <b>{formatPrice(c.product.price)}</b>{" "}
                    {off > 0 && <><span className="mrp">{formatPrice(c.product.mrp)}</span> <span className="off">{off}% off</span></>}
                  </div>
                  <div className="flex center gap mt">
                    <button className="btn btn-blue" style={{ padding: "2px 10px" }} onClick={() => updateCartQty(c.id, c.quantity - 1)}>−</button>
                    <span>{c.quantity}</span>
                    <button
                      className="btn btn-blue"
                      style={{ padding: "2px 10px", ...(c.quantity >= c.product.stock ? { background: "#bdbdbd" } : {}) }}
                      disabled={c.quantity >= c.product.stock}
                      onClick={() => updateCartQty(c.id, c.quantity + 1)}
                    >+</button>
                    <button onClick={() => removeFromCart(c.id)} style={{ border: 0, background: "none", cursor: "pointer", fontWeight: 600 }}>REMOVE</button>
                  </div>
                  {/* Stock status per item */}
                  {c.product.stock <= 0 ? (
                    <p style={{ color: "#d32f2f", fontSize: 12, fontWeight: 600, marginTop: 4 }}>Out of stock</p>
                  ) : c.quantity >= c.product.stock ? (
                    <p style={{ color: "#e65100", fontSize: 12, marginTop: 4 }}>
                      Max available reached ({c.product.stock} in stock)
                    </p>
                  ) : c.product.stock <= 5 ? (
                    <p style={{ color: "#e65100", fontSize: 12, marginTop: 4 }}>Only {c.product.stock} left</p>
                  ) : (
                    <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>{c.product.stock} in stock</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex" style={{ justifyContent: "flex-end", marginTop: 12, flexDirection: "column", alignItems: "flex-end" }}>
          {hasStockIssue && (
            <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 6 }}>
              ⚠️ Some items exceed available stock. Please adjust quantities to continue.
            </p>
          )}
          <button
            className="btn btn-orange"
            style={{ padding: "12px 40px", ...(hasStockIssue ? { background: "#bdbdbd" } : {}) }}
            disabled={hasStockIssue}
            onClick={() => navigate("/checkout")}
          >PLACE ORDER</button>
        </div>
      </div>

      <div className="card" style={{ height: "fit-content" }}>
        <h3 className="mb">PRICE DETAILS</h3>
        <div className="flex between"><span>Price ({cart.length} items)</span><span>{formatPrice(mrpTotal)}</span></div>
        <div className="flex between"><span>Discount</span><span className="off">− {formatPrice(savings)}</span></div>
        <div className="flex between"><span>Delivery</span><span className="off">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
        <hr style={{ margin: "10px 0" }} />
        <div className="flex between"><b>Total</b><b>{formatPrice(total)}</b></div>
        {savings > 0 && <p className="off mt">You save {formatPrice(savings)} on this order</p>}
      </div>
    </div>
  );
}
