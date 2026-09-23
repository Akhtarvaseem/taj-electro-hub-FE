import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductAPI, CategoryAPI } from "../api/services";
import ProductCard from "../components/ProductCard";
import CategoryIcon from "../components/CategoryIcon";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "popular";

  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { CategoryAPI.list().then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const p = {};
    if (q) p.q = q;
    if (category) p.category = category;
    if (sort) p.sort = sort;
    if (maxPrice) p.maxPrice = maxPrice;
    ProductAPI.list(p).then((r) => { setProducts(r); setLoading(false); }).catch(() => setLoading(false));
  }, [q, category, sort, maxPrice]);

  const setParam = (k, v) => {
    const np = new URLSearchParams(params);
    if (v) np.set(k, v); else np.delete(k);
    setParams(np);
  };

  return (
    <div className="container flex gap">
      <aside className="card" style={{ width: 220, height: "fit-content" }}>
        <h3 className="mb">Filters</h3>
        <p style={{ fontWeight: 600, marginBottom: 6 }}>Categories</p>
        <div style={{ cursor: "pointer" }} onClick={() => setParam("category", "")}>All</div>
        {cats.map((c) => (
          <div key={c.id} style={{ cursor: "pointer", padding: "3px 0", color: category === c.slug ? "#2874f0" : "#555" }}
            onClick={() => setParam("category", c.slug)}>
            <span className="flex center gap"><CategoryIcon icon={c.icon} size={20} /> {c.name}</span>
          </div>
        ))}
        <p style={{ fontWeight: 600, margin: "12px 0 6px" }}>Max Price</p>
        <input type="range" min="500" max="80000" step="500" value={maxPrice || 80000}
          onChange={(e) => setMaxPrice(e.target.value)} style={{ width: "100%" }} />
        <p className="muted">{maxPrice ? `Up to ₹${Number(maxPrice).toLocaleString("en-IN")}` : "Any price"}</p>
      </aside>

      <div style={{ flex: 1 }}>
        <div className="card flex between center mb">
          <h3>{q ? `Results for "${q}"` : "All Products"} <span className="muted">({products.length})</span></h3>
          <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="input" style={{ width: "auto", margin: 0 }}>
            <option value="popular">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {loading ? <div className="empty">Loading…</div> :
          products.length === 0 ? <div className="card empty">No products found.</div> :
          <div className="grid grid-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      </div>
    </div>
  );
}
