import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddressAPI, AuthAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { fileToAvatarDataUrl } from "../utils/image";

const emptyAddr = { fullName: "", phone: "", pincode: "", line1: "", line2: "", city: "", state: "", addressType: "Home" };

export default function Account() {
  const { user, authLoaded, logout, cartCount, wishCount, toast, refreshUser } = useStore();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddr);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => AddressAPI.list().then(setAddresses).catch(() => {});
  useEffect(() => { if (user) load(); }, [user]);

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await AddressAPI.update(editingId, form); toast("Address updated"); }
      else { await AddressAPI.create(form); toast("Address added"); }
      setForm(emptyAddr); setEditingId(null); setShowForm(false); load();
    } catch (err) { toast(err.response?.data?.error || "Failed to save address", "error"); }
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setForm({
      fullName: a.fullName, phone: a.phone, pincode: a.pincode,
      line1: a.line1, line2: a.line2 || "", city: a.city, state: a.state,
      addressType: a.addressType || "Home",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await AddressAPI.remove(id);
    setAddresses((a) => a.filter((x) => x.id !== id));
    toast("Address removed");
  };

  const cancel = () => { setEditingId(null); setForm(emptyAddr); setShowForm(false); };

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      await AuthAPI.updateProfile({ avatar: dataUrl });
      await refreshUser();
      toast("Profile picture updated");
    } catch (err) {
      toast(err.response?.data?.error || err.message || "Could not update photo", "error");
    }
  };

  return (
    <div className="container split-eq">
      <div className="card" style={{ height: "fit-content" }}>
        <div className="flex gap center">
          <label className="avatar" style={{ cursor: "pointer" }} title="Change photo">
            {user?.avatar ? <img src={user.avatar} alt="" /> : user?.name?.[0]?.toUpperCase()}
            <input type="file" accept="image/*" hidden onChange={onAvatar} />
          </label>
          <div>
            <b>{user?.name}</b>
            <p className="muted">{user?.email}</p>
            <p className="muted" style={{ fontSize: 11 }}>Tap photo to change</p>
          </div>
        </div>
        <div className="mt">
          <Link to="/dashboard" style={{ display: "block", padding: 8 }}>📊 Dashboard</Link>
          <Link to="/orders" style={{ display: "block", padding: 8 }}>📦 My Orders</Link>
          <Link to="/wishlist" style={{ display: "block", padding: 8 }}>♥ Wishlist ({wishCount})</Link>
          <Link to="/cart" style={{ display: "block", padding: 8 }}>🛒 Cart ({cartCount})</Link>
          {user?.role === "ADMIN" && <Link to="/admin" style={{ display: "block", padding: 8 }}>⚙️ Admin Panel</Link>}
          <button onClick={() => { logout(); navigate("/"); }} style={{ border: 0, background: "none", color: "#d32f2f", padding: 8, cursor: "pointer" }}>⏻ Logout</button>
        </div>
      </div>

      <div className="card">
        <div className="flex between center mb">
          <h3>Saved Addresses ({addresses.length})</h3>
          {!showForm && (
            <button className="btn btn-blue" style={{ padding: "6px 16px" }} onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyAddr); }}>
              + Add Address
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={submit} style={{ border: "1px solid #eee", borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <h4 className="mb">{editingId ? "Edit Address" : "New Address"}</h4>
            <div className="grid grid-2 gap">
              <input className="input" placeholder="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input className="input" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" placeholder="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              <input className="input" placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <input className="input" placeholder="Address (House No, Street)" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <input className="input" placeholder="Area / Landmark (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            <div className="grid grid-2 gap">
              <input className="input" placeholder="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <select className="input" value={form.addressType} onChange={(e) => setForm({ ...form, addressType: e.target.value })}>
                <option>Home</option><option>Work</option>
              </select>
            </div>
            <div className="flex gap">
              <button className="btn btn-blue" style={{ flex: 1 }}>{editingId ? "Update" : "Save"} Address</button>
              <button type="button" onClick={cancel} className="btn" style={{ flex: 1, background: "#9e9e9e" }}>Cancel</button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showForm ? <p className="muted">No addresses saved yet.</p> :
          addresses.map((a) => (
            <div key={a.id} className="flex between" style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, marginBottom: 8 }}>
              <div><b>{a.fullName}</b> <span className="status-pill">{a.addressType}</span>
                <p className="muted">{a.line1}, {a.line2 && a.line2 + ", "}{a.city}, {a.state} - {a.pincode}</p>
                <p className="muted">📞 {a.phone}</p></div>
              <div className="flex gap" style={{ height: "fit-content" }}>
                <button onClick={() => startEdit(a)} style={{ border: 0, background: "#e3f2fd", color: "#1565c0", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                <button onClick={() => del(a.id)} style={{ border: 0, background: "#ffebee", color: "#d32f2f", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
