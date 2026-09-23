import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductAPI, CategoryAPI } from "../api/services";
import ProductCard from "../components/ProductCard";
import CategoryIcon from "../components/CategoryIcon";
import HeroSlider from "../components/HeroSlider";
import DiscountSlider from "../components/DiscountSlider";
import Ticker from "../components/Ticker";
import { maxDiscount } from "../utils/format";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [all, setAll] = useState([]);

  useEffect(() => {
    CategoryAPI.list().then(setCats).catch(() => {});
    ProductAPI.list({ featured: "true" }).then(setFeatured).catch(() => {});
    ProductAPI.list({ sort: "newest" }).then((p) => setLatest(p.slice(0, 12))).catch(() => {});
    ProductAPI.list({}).then(setAll).catch(() => {});
  }, []);

  const off = maxDiscount(all.length ? all : featured.concat(latest));

  return (
    <div>
      <Ticker maxOff={off} />
      <div className="container">
        <div className="cat-strip">
          {cats.map((c) => (
            <Link to={`/products?category=${c.slug}`} className="cat-item" key={c.id}>
              <div className="cat-icon"><CategoryIcon icon={c.icon} size={32} /></div>
              <div style={{ fontSize: 12 }}>{c.name}</div>
            </Link>
          ))}
        </div>

        <HeroSlider maxOff={off} />

        <DiscountSlider products={all.length ? all : featured} />

        {featured.length > 0 && (
          <Section title="🔥 Deals of the Day" items={featured} />
        )}
        {latest.length > 0 && (
          <Section title="✨ Newly Added" items={latest} />
        )}

        <div className="grid grid-2 mt">
          <div className="promo-tile" style={{ background: "linear-gradient(90deg,#0b2c4a,#1a7a9c)" }}>
            <p>TajElectroHub Assurance</p>
            <h3>Genuine Electronics ⚡</h3>
          </div>
          <div className="promo-tile" style={{ background: "linear-gradient(90deg,#ff9f00,#ffb733)" }}>
            <p>Cash on Delivery</p>
            <h3>Pay when it arrives 💵</h3>
          </div>
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
