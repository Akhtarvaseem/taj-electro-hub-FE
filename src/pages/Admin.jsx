import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminAPI, ProductAPI, CategoryAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { formatPrice } from "../utils/format";
import CategoryIcon from "../components/CategoryIcon";
import ProductImg from "../components/ProductImg";

const emptyForm = { title: "", brand: "", categoryId: "", price: "", mrp: "", stock: "", description: "", images: "", featured: false };
const STATUS = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function Admin() {
  const { user, authLoaded, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState(null); // null = create mode

  // category form
  const [catForm, setCatForm] = useState({ name: "", icon: "" });
  const [editingCatId, setEditingCatId] = useState(null);

  // discount
  const [catDiscount, setCatDiscount] = useState({ categoryId: "", percent: "" });

  const loadStats = () => AdminAPI.stats().then(setData).catch(() => {});
  const loadProducts = () => {
    ProductAPI.list({}).then(setProducts).catch(() => {});
    CategoryAPI.list().then(setCats).catch(() => {});
  };

  useEffect(() => { if (user?.role === "ADMIN") { loadStats(); loadProducts(); } }, [user]);

  if (authLoaded && (!user || user.role !== "ADMIN"))
    return <div className="container empty"><h2>Admin access required</h2><p className="muted">Please log in with an admin account to continue.</p><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;

  // ---------- Product create / update ----------
  const submitProduct = async (e) => {
    e.preventDefault();
    const images = form.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, images: images.length ? images : [`https://picsum.photos/seed/${Date.now()}/500`] };
    try {
      if (editingSlug) {
        await ProductAPI.update(editingSlug, payload);
        toast("Product updated");
      } else {
        await ProductAPI.create(payload);
        toast("Product added");
      }
      setForm(emptyForm); setEditingSlug(null); loadProducts(); loadStats();
    } catch (err) { toast(err.response?.data?.error || "Failed to save product", "error"); }
  };

  const startEdit = (p) => {
    setEditingSlug(p.slug);
    setForm({
      title: p.title, brand: p.brand || "", categoryId: p.categoryId || "",
      price: p.price, mrp: p.mrp, stock: p.stock, description: p.description || "",
      images: (p.images || []).join("\n"), featured: p.featured,
    });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingSlug(null); setForm(emptyForm); };

  const removeProduct = async (slug) => {
    if (!window.confirm("Delete this product?")) return;
    await ProductAPI.remove(slug);
    setProducts((p) => p.filter((x) => x.slug !== slug));
    toast("Product deleted"); loadStats();
  };

  const applyProductDiscount = async (slug) => {
    const pct = window.prompt("Enter discount % (0-90) for this product:");
    if (pct === null) return;
    try {
      await ProductAPI.discount(slug, Number(pct));
      toast(`${pct}% discount applied`); loadProducts();
    } catch (err) { toast(err.response?.data?.error || "Failed", "error"); }
  };

  const applyCategoryDiscount = async (e) => {
    e.preventDefault();
    if (!catDiscount.categoryId) return toast("Select a category", "error");
    try {
      const res = await ProductAPI.discountCategory(catDiscount.categoryId, Number(catDiscount.percent));
      toast(`Discount applied to ${res.updated} product(s)`);
      setCatDiscount({ categoryId: "", percent: "" });
      loadProducts();
    } catch (err) { toast(err.response?.data?.error || "Failed", "error"); }
  };

  // ---------- Category CRUD ----------
  const submitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) { await CategoryAPI.update(editingCatId, catForm); toast("Category updated"); }
      else { await CategoryAPI.create(catForm); toast("Category added"); }
      setCatForm({ name: "", icon: "" }); setEditingCatId(null);
      CategoryAPI.list().then(setCats);
    } catch (err) { toast(err.response?.data?.error || "Failed", "error"); }
  };

  const startEditCat = (c) => { setEditingCatId(c.id); setCatForm({ name: c.name, icon: c.icon || "" }); };
  const removeCat = async (id) => {
    if (!window.confirm("Delete this category? Products in it will become uncategorized.")) return;
    await CategoryAPI.remove(id); toast("Category deleted");
    CategoryAPI.list().then(setCats); loadProducts();
  };

  const updateStatus = async (id, status) => {
    await AdminAPI.updateOrder(id, status);
    setData((d) => ({ ...d, recentOrders: d.recentOrders.map((o) => o.id === id ? { ...o, status } : o) }));
    toast("Order updated");
  };

  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStock || [];

  return (
    <div className="container">
      <div className="promo-tile" style={{ background: "linear-gradient(90deg,#0b2c4a,#125d8a)", marginBottom: 16 }}>
        <div><h2 style={{ fontSize: 22 }}>⚙️ Admin Dashboard</h2><p>TajElectroHub · Taj Electric &amp; Electronics</p></div>
      </div>

      <div className="tabs">
        {["overview", "orders", "products", "categories", "discounts"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <>
          <div className="grid grid-4 mb">
            <div className="stat-card"><div>📦</div><div className="stat-val">{stats?.products ?? "—"}</div><div className="stat-label">Products</div></div>
            <div className="stat-card"><div>🧾</div><div className="stat-val">{stats?.orders ?? "—"}</div><div className="stat-label">Orders</div></div>
            <div className="stat-card"><div>👥</div><div className="stat-val">{stats?.users ?? "—"}</div><div className="stat-label">Customers</div></div>
            <div className="stat-card"><div>💰</div><div className="stat-val">{stats ? formatPrice(stats.revenue) : "—"}</div><div className="stat-label">Revenue</div></div>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3 className="mb">Latest Orders</h3>
              {recentOrders.length === 0 ? <p className="muted">No orders yet.</p> :
                recentOrders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex between" style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
                    <span>#{o.id} · {o.shipFullName}</span><b>{formatPrice(o.total)}</b>
                  </div>
                ))}
            </div>
            <div className="card">
              <h3 className="mb">⚠️ Low Stock</h3>
              {lowStock.length === 0 ? <p className="muted">All well stocked.</p> :
                lowStock.map((p) => (
                  <div key={p.id} className="flex between" style={{ padding: "4px 0" }}>
                    <span>{p.title}</span><b style={{ color: "#d32f2f" }}>{p.stock} left</b>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="card">
          <h3 className="mb">Manage Orders ({recentOrders.length})</h3>
          {recentOrders.map((o) => (
            <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, marginBottom: 8 }}>
              <div className="flex between">
                <div><b>Order #{o.id}</b><p className="muted">{o.shipFullName} · {o.shipPhone}</p><p className="muted">{o.shipAddress}</p></div>
                <div style={{ textAlign: "right" }}><b>{formatPrice(o.total)}</b><p className="muted">{o.paymentMethod} · {o.paymentStatus}</p></div>
              </div>
              <div className="flex gap center mt">
                <span className="muted">Status:</span>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="input" style={{ width: "auto", margin: 0 }}>
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <div className="split-eq">
          <form className="card" onSubmit={submitProduct} style={{ height: "fit-content" }}>
            <h3 className="mb">{editingSlug ? "✏️ Edit Product" : "➕ Add Product"}</h3>
            <input className="input" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input" type="number" placeholder="Selling Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" type="number" placeholder="MRP (original price)" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <input className="input" type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <textarea className="input" placeholder="Description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="muted" style={{ fontSize: 12 }}>Image URLs — one per line OR comma-separated (multiple pictures)</label>
            <textarea className="input" rows="4" placeholder={"https://.../img1.jpg\nhttps://.../img2.jpg\nhttps://.../img3.jpg"} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
            <label className="flex gap center mb"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured (Deal of the day)</label>
            <button className="btn btn-blue" style={{ width: "100%" }}>{editingSlug ? "Update Product" : "Add Product"}</button>
            {editingSlug && <button type="button" onClick={cancelEdit} className="btn mt" style={{ width: "100%", background: "#9e9e9e" }}>Cancel Edit</button>}
          </form>

          <div className="card">
            <h3 className="mb">All Products ({products.length})</h3>
            <div style={{ maxHeight: 650, overflowY: "auto" }}>
              {products.map((p) => (
                <div key={p.id} className="flex gap center" style={{ border: "1px solid #eee", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                  <ProductImg src={p.images?.[0]} title={p.title} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div>{p.title}</div>
                    <span className="muted">
                      {formatPrice(p.price)} {p.mrp > p.price && <s style={{ color: "#bbb" }}>{formatPrice(p.mrp)}</s>} ·{" "}
                      <b style={{ color: p.stock <= 0 ? "#d32f2f" : p.stock <= 5 ? "#e65100" : "#388e3c" }}>Stock {p.stock}</b>
                      {p.featured && " · ⭐"}
                    </span>
                  </div>
                  <button onClick={() => startEdit(p)} style={btnMini("#e3f2fd", "#1565c0")}>Edit</button>
                  <button onClick={() => applyProductDiscount(p.slug)} style={btnMini("#fff3e0", "#e65100")}>% Off</button>
                  <button onClick={() => removeProduct(p.slug)} style={btnMini("#ffebee", "#d32f2f")}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES CRUD */}
      {tab === "categories" && (
        <div className="split-eq">
          <form className="card" onSubmit={submitCategory} style={{ height: "fit-content" }}>
            <h3 className="mb">{editingCatId ? "✏️ Edit Category" : "➕ Add Category"}</h3>
            <input className="input" placeholder="Category name" required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
            <input className="input" placeholder="Emoji (📱) OR image URL (https://…)" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />
            <p className="muted" style={{ fontSize: 12, marginTop: -6, marginBottom: 8 }}>Paste an emoji, or a full image link like https://…/icon.png</p>
            {catForm.icon && (
              <div className="flex center gap mb" style={{ padding: 8, background: "#f7f7f7", borderRadius: 8 }}>
                Preview: <CategoryIcon icon={catForm.icon} size={36} />
              </div>
            )}
            <button className="btn btn-blue" style={{ width: "100%" }}>{editingCatId ? "Update" : "Add"} Category</button>
            {editingCatId && <button type="button" onClick={() => { setEditingCatId(null); setCatForm({ name: "", icon: "" }); }} className="btn mt" style={{ width: "100%", background: "#9e9e9e" }}>Cancel</button>}
          </form>
          <div className="card">
            <h3 className="mb">All Categories ({cats.length})</h3>
            {cats.map((c) => (
              <div key={c.id} className="flex gap center" style={{ border: "1px solid #eee", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                <CategoryIcon icon={c.icon} size={32} />
                <div style={{ flex: 1 }}><b>{c.name}</b><span className="muted"> /{c.slug}</span></div>
                <button onClick={() => startEditCat(c)} style={btnMini("#e3f2fd", "#1565c0")}>Edit</button>
                <button onClick={() => removeCat(c.id)} style={btnMini("#ffebee", "#d32f2f")}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISCOUNTS */}
      {tab === "discounts" && (
        <div className="grid grid-2">
          <form className="card" onSubmit={applyCategoryDiscount}>
            <h3 className="mb">🏷️ Discount an entire Category</h3>
            <p className="muted mb">Sets each product's price to MRP minus the % you enter.</p>
            <select className="input" value={catDiscount.categoryId} onChange={(e) => setCatDiscount({ ...catDiscount, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input" type="number" min="0" max="90" placeholder="Discount % (e.g. 50)" required value={catDiscount.percent} onChange={(e) => setCatDiscount({ ...catDiscount, percent: e.target.value })} />
            <button className="btn btn-orange" style={{ width: "100%" }}>Apply Category Discount</button>
          </form>
          <div className="card">
            <h3 className="mb">Single Product Discount</h3>
            <p className="muted">Go to the <b>Products</b> tab and click the <b>% Off</b> button on any product to set a discount (e.g. 50%) for just that product.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function btnMini(bg, color) {
  return { border: 0, background: bg, color, padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 };
}
