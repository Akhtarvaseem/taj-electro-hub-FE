import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { formatPrice, discountPct } from "../utils/format";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWished } = useStore();
  const off = discountPct(product.mrp, product.price);
  const wished = isWished(product.id);
  const outOfStock = !product.stock || product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-card">
      <button
        className={`wish-btn ${wished ? "active" : ""}`}
        onClick={() => toggleWishlist(product.id)}
      >♥</button>

      <Link to={`/product/${product.slug}`}>
        <img src={product.images?.[0] || "https://picsum.photos/seed/x/400"} alt={product.title} />
        <div className="pc-brand">{product.brand}</div>
        <div className="pc-title">{product.title}</div>
        <div>
          <span className="rating-badge">{Number(product.rating).toFixed(1)} ★</span>{" "}
          <span className="muted">({product.numReviews})</span>
        </div>
        <div className="mt">
          <span className="price">{formatPrice(product.price)}</span>{" "}
          {off > 0 && <><span className="mrp">{formatPrice(product.mrp)}</span> <span className="off">{off}% off</span></>}
        </div>
        {/* Stock indicator */}
        {outOfStock ? (
          <div style={{ color: "#d32f2f", fontSize: 12, fontWeight: 600, marginTop: 4 }}>Out of stock</div>
        ) : lowStock ? (
          <div style={{ color: "#e65100", fontSize: 12, fontWeight: 600, marginTop: 4 }}>
            Only {product.stock} left!
          </div>
        ) : (
          <div style={{ color: "#388e3c", fontSize: 12, marginTop: 4 }}>In stock ({product.stock})</div>
        )}
      </Link>

      <button
        className="btn btn-yellow mt"
        onClick={() => addToCart(product.id)}
        disabled={outOfStock}
        style={outOfStock ? { background: "#bdbdbd" } : {}}
      >
        {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
      </button>
    </div>
  );
}
