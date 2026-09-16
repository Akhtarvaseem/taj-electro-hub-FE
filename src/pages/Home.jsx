import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductAPI, CategoryAPI } from "../api/services";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    CategoryAPI.list().then(setCats).catch(() => {});
    ProductAPI.list({ featured: "true" }).then(setFeatured).catch(() => {});
    ProductAPI.list({ sort: "newest" }).then((p) => setLatest(p.slice(0, 12))).catch(() => {});
  }, []);

  return (
    <div className="container">
      <div className="cat-strip">
        {cats.map((c) => (
          <Link to={`/products?category=${c.slug}`} className="cat-item" key={c.id}>
            <div className="cat-icon">{c.icon}</div>
            <div style={{ fontSize: 12 }}>{c.name}</div>
          </Link>
        ))}
      </div>

      <div className="hero">
        <div>
          <p>Up to 80% off on Electronics</p>
          <h2>ElectroHub Sale ⚡</h2>
          <Link to="/products" className="btn" style={{ background: "#fff", color: "#212121", display: "inline-block", marginTop: 12 }}>
            Shop Now →
          </Link>
        </div>
        <div className="emoji">🛍️</div>
      </div>

      {featured.length > 0 && (
        <Section title="🔥 Deals of the Day" items={featured} />
      )}
      {latest.length > 0 && (
        <Section title="✨ Newly Added" items={latest} />
      )}

      <div className="grid grid-2 mt">
        <div className="hero" style={{ background: "linear-gradient(90deg,#2874f0,#4a90ff)", padding: 24, margin: 0 }}>
          <div><p>ElectroHub Assurance</p><h2 style={{ fontSize: 22 }}>Genuine Electronics ⚡</h2></div>
        </div>
        <div className="hero" style={{ background: "linear-gradient(90deg,#ff9f00,#ffb733)", padding: 24, margin: 0 }}>
          <div><p>Cash on Delivery</p><h2 style={{ fontSize: 22 }}>Pay when it arrives 💵</h2></div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section className="card mb">
      <div className="section-head">
        <h2 style={{ fontSize: 18 }}>{title}</h2>
        <Link to="/products" className="btn btn-blue" style={{ padding: "6px 16px", fontSize: 12 }}>VIEW ALL</Link>
      </div>
      <div className="grid grid-6">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
