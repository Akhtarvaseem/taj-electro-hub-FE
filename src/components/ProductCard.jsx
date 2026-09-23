import { useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { formatPrice, discountPct } from "../utils/format";
import ProductImg from "./ProductImg";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, updateCartQty, toggleWishlist, isWished, cart } = useStore();
  const off = discountPct(product.mrp, product.price);
  const wished = isWished(product.id);
  const outOfStock = !product.stock || product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const cartItem = cart.find((c) => c.product.id === product.id);

  const openPreview = (e) => {
    e.preventDefault();
    if (product.slug) navigate(`/product/${encodeURIComponent(product.slug)}`);
  };

  return (
    <div className="product-card" onClick={openPreview} role="link" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") openPreview(e); }}>
      <button
        type="button"
        className={`wish-btn ${wished ? "active" : ""}`}
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
      >♥</button>

      <ProductImg src={product.images?.[0]} title={product.title} alt={product.title} />
      <p className="pc-brand">{product.brand}</p>
      <h3 className="pc-title">{product.title}</h3>
      <div>
        <span className="rating-badge">{Number(product.rating || 0).toFixed(1)} ★</span>{" "}
        <span className="muted">({product.numReviews || 0})</span>
      </div>
      <div className="mt">
        <span className="price">{formatPrice(product.price)}</span>{" "}
        {off > 0 && <><span className="mrp">{formatPrice(product.mrp)}</span> <span className="off">{off}% off</span></>}
      </div>
      {outOfStock ? (
        <div style={{ color: "#d32f2f", fontSize: 12, fontWeight: 600, marginTop: 4 }}>Out of stock</div>
      ) : lowStock ? (
        <div style={{ color: "#e65100", fontSize: 12, fontWeight: 600, marginTop: 4 }}>Only {product.stock} left!</div>
      ) : (
        <div style={{ color: "#2e7d32", fontSize: 12, marginTop: 4 }}>In stock ({product.stock})</div>
      )}

      {outOfStock ? (
        <button type="button" className="btn mt" disabled style={{ background: "#bdbdbd" }}>OUT OF STOCK</button>
      ) : cartItem ? (
        <div className="qty-box mt" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => updateCartQty(cartItem.id, cartItem.quantity - 1)}>−</button>
          <span>{cartItem.quantity}</span>
          <button
            type="button"
            disabled={cartItem.quantity >= product.stock}
            onClick={() => updateCartQty(cartItem.id, cartItem.quantity + 1)}
          >+</button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-yellow mt"
          onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
        >
          ADD TO CART
        </button>
      )}
    </div>
  );
}
