import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatPrice, discountPct } from "../utils/format";
import ProductImg from "./ProductImg";

/** Auto-scrolling row of discounted products. */
export default function DiscountSlider({ products }) {
  const track = useRef(null);
  const items = (products || []).filter((p) => discountPct(p.mrp, p.price) >= 5);

  useEffect(() => {
    const el = track.current;
    if (!el || items.length < 3) return;
    let dir = 1;
    const tick = () => {
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) dir = -1;
      if (el.scrollLeft <= 2) dir = 1;
      el.scrollBy({ left: dir * 1.2, behavior: "auto" });
    };
    const id = setInterval(tick, 30);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="card mb discount-wrap">
      <div className="section-head">
        <h2 style={{ fontSize: 18 }}>💥 Sliding Discount Deals</h2>
        <Link to="/products?sort=price_asc" className="btn btn-blue" style={{ padding: "6px 16px", fontSize: 12 }}>VIEW ALL</Link>
      </div>
      <div className="discount-track" ref={track}>
        {items.concat(items).map((p, idx) => {
          const off = discountPct(p.mrp, p.price);
          return (
            <Link to={`/product/${p.slug}`} className="deal-card" key={p.id + "-" + idx}>
              <span className="deal-badge">{off}% OFF</span>
              <ProductImg src={p.images?.[0]} title={p.title} alt={p.title} />
              <p className="pc-title" style={{ minHeight: 36 }}>{p.title}</p>
              <div>
                <span className="price">{formatPrice(p.price)}</span>{" "}
                <span className="mrp">{formatPrice(p.mrp)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
