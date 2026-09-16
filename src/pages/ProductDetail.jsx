import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductAPI, ReviewAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { formatPrice, discountPct } from "../utils/format";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWished, user, toast } = useStore();

  const [data, setData] = useState(null);
  const [img, setImg] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = () => ProductAPI.detail(slug).then((d) => setData(d)).catch(() => {});
  useEffect(() => { load(); setImg(0); }, [slug]);

  if (!data) return <div className="container empty">Loading…</div>;
  const { product, reviews, related } = data;
  const off = discountPct(product.mrp, product.price);
  const images = product.images?.length ? product.images : ["https://picsum.photos/seed/x/600"];

  const buyNow = async () => { await addToCart(product.id); navigate("/checkout"); };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast("Please login to review", "error");
    await ReviewAPI.create({ productId: product.id, rating, comment });
    setComment("");
    toast("Review submitted");
    load();
  };

  return (
    <div className="container">
      <div className="card grid grid-2">
        <div className="flex gap">
          <div>
            {images.map((im, i) => (
              <img key={i} src={im} onMouseEnter={() => setImg(i)}
                style={{ width: 54, height: 54, objectFit: "cover", marginBottom: 8, borderRadius: 4, border: img === i ? "2px solid #2874f0" : "2px solid #eee", cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <img src={images[img]} style={{ width: "100%", aspectRatio: 1, objectFit: "contain", background: "#fafafa", borderRadius: 8 }} />
            <div className="flex gap mt">
              <button className="btn btn-yellow" style={{ flex: 1, ...(product.stock <= 0 ? { background: "#bdbdbd" } : {}) }}
                disabled={product.stock <= 0} onClick={() => addToCart(product.id)}>
                {product.stock <= 0 ? "OUT OF STOCK" : "🛒 ADD TO CART"}
              </button>
              <button className="btn btn-orange" style={{ flex: 1, ...(product.stock <= 0 ? { background: "#bdbdbd" } : {}) }}
                disabled={product.stock <= 0} onClick={buyNow}>⚡ BUY NOW</button>
            </div>
          </div>
        </div>

        <div>
          <p className="muted">{product.brand}</p>
          <div className="flex between">
            <h1 style={{ fontSize: 20 }}>{product.title}</h1>
            <button className={`wish-btn ${isWished(product.id) ? "active" : ""}`} style={{ position: "static", fontSize: 24 }}
              onClick={() => toggleWishlist(product.id)}>♥</button>
          </div>
          <div className="mt">
            <span className="rating-badge">{Number(product.rating).toFixed(1)} ★</span>{" "}
            <span className="muted">{product.numReviews} ratings</span>
          </div>
          <div className="mt">
            <span style={{ fontSize: 28, fontWeight: 700 }}>{formatPrice(product.price)}</span>{" "}
            {off > 0 && <><span className="mrp">{formatPrice(product.mrp)}</span> <span className="off">{off}% off</span></>}
          </div>
          {product.stock <= 0 ? (
            <p style={{ color: "#d32f2f", marginTop: 6, fontWeight: 700 }}>❌ Out of stock</p>
          ) : product.stock <= 5 ? (
            <p style={{ color: "#e65100", marginTop: 6, fontWeight: 700 }}>
              ⚠️ Hurry! Only {product.stock} left in stock
            </p>
          ) : (
            <p style={{ color: "#388e3c", marginTop: 6, fontWeight: 600 }}>
              ✔ In stock — {product.stock} available
            </p>
          )}

          <div className="card mt" style={{ background: "#f7f7f7" }}>
            <p>💵 <b>Cash on Delivery</b> available</p>
            <p>🚚 Free delivery on orders above ₹500</p>
            <p>↩️ 7 days replacement policy</p>
          </div>

          <div className="mt">
            <h3>Description</h3>
            <p className="muted">{product.description}</p>
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt">
              <h3>Specifications</h3>
              <table style={{ width: "100%", fontSize: 14 }}>
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k}><td className="muted" style={{ padding: "4px 16px 4px 0" }}>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card mt">
        <h2 className="mb">Ratings &amp; Reviews</h2>
        <form onSubmit={submitReview} className="card mb" style={{ border: "1px solid #eee" }}>
          <p style={{ fontWeight: 600 }}>Write a review</p>
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} onClick={() => setRating(n)} style={{ cursor: "pointer", fontSize: 24, color: n <= rating ? "#ff9f00" : "#ddd" }}>★</span>
            ))}
          </div>
          <textarea className="input mt" rows="3" placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button className="btn btn-blue">Submit Review</button>
        </form>

        {reviews.length === 0 ? <p className="muted">No reviews yet.</p> :
          reviews.map((r) => (
            <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <span className="rating-badge">{r.rating} ★</span> <b>{r.userName}</b>
              {r.comment && <p className="muted">{r.comment}</p>}
            </div>
          ))}
      </div>

      {related.length > 0 && (
        <div className="card mt">
          <h2 className="mb">Similar Products</h2>
          <div className="grid grid-6">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      )}
    </div>
  );
}
