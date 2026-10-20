import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ServiceAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import { SERVICE_CATALOG, VISIT_FEE } from "../data/serviceCatalog";

const empty = {
  customerName: "",
  phone: "",
  altPhone: "",
  address: "",
  landmark: "",
  serviceCategory: "refrigerator",
  selectedProblems: [],
  notes: "",
};

export default function Service() {
  const { user, toast } = useStore();
  const [booking, setBooking] = useState({ ...empty, customerName: user?.name || "", phone: user?.phone || "" });
  const [mine, setMine] = useState([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);

  const svc = useMemo(
    () => SERVICE_CATALOG.find((s) => s.id === booking.serviceCategory) || SERVICE_CATALOG[0],
    [booking.serviceCategory]
  );

  useEffect(() => {
    if (user) ServiceAPI.mine().then(setMine).catch(() => {});
  }, [user]);

  const toggle = (prob) => {
    setBooking((p) => {
      const has = p.selectedProblems.includes(prob);
      return { ...p, selectedProblems: has ? p.selectedProblems.filter((x) => x !== prob) : [...p.selectedProblems, prob] };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await ServiceAPI.book({
        ...booking,
        serviceName: svc.name,
      });
      setDone(data.complaint);
      toast("Complaint registered");
      setBooking({ ...empty, customerName: user?.name || "", phone: user?.phone || "" });
      if (user) ServiceAPI.mine().then(setMine).catch(() => {});
    } catch (err) {
      toast(err.response?.data?.error || "Could not register complaint", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="about-hero">
        <p>TAJ Home Solutions</p>
        <h1 style={{ fontSize: 28, margin: "6px 0 8px" }}>Book a technician</h1>
        <p>Fridge, AC, geyser, fan, wiring — home visit ₹{VISIT_FEE} (fixed).</p>
      </div>

      {done && (
        <div className="card mb" style={{ border: "1px solid #c8e6c9", background: "#f1f8e9" }}>
          <b>Complaint registered: #{done.complaintNo}</b>
          <p className="muted">Status: {done.status}. Our team will assign a technician and contact you.</p>
        </div>
      )}

      <form className="card mb" onSubmit={submit}>
        <h3 className="mb">Customer details</h3>
        <div className="grid grid-2">
          <input className="input" placeholder="Your name *" required value={booking.customerName} onChange={(e) => setBooking({ ...booking, customerName: e.target.value })} />
          <input className="input" placeholder="10-digit mobile *" required maxLength={10} value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
        </div>
        <input className="input" placeholder="Full address *" required value={booking.address} onChange={(e) => setBooking({ ...booking, address: e.target.value })} />
        <input className="input" placeholder="Landmark (optional)" value={booking.landmark} onChange={(e) => setBooking({ ...booking, landmark: e.target.value })} />

        <h3 className="mb mt">Select appliance</h3>
        <div className="svc-grid">
          {SERVICE_CATALOG.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`svc-chip ${booking.serviceCategory === s.id ? "on" : ""}`}
              onClick={() => setBooking({ ...booking, serviceCategory: s.id, selectedProblems: [] })}
            >
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        <p className="muted mt mb">Tick the problem(s) for <b>{svc.name}</b></p>
        <div className="grid grid-2 mb">
          {svc.problems.map((p) => (
            <label key={p} className="flex gap center" style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, cursor: "pointer", background: booking.selectedProblems.includes(p) ? "#e8f0fe" : "#fff" }}>
              <input type="checkbox" checked={booking.selectedProblems.includes(p)} onChange={() => toggle(p)} />
              <span style={{ fontSize: 13 }}>{p}</span>
            </label>
          ))}
        </div>
        <textarea className="input" rows="2" placeholder="Extra note (model, error code…)" value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
        <button className="btn btn-orange" style={{ width: "100%" }} disabled={saving}>
          {saving ? "Submitting…" : `Register complaint · Visit ₹${VISIT_FEE}`}
        </button>
      </form>

      {user && (
        <div className="card">
          <h3 className="mb">My complaints</h3>
          {mine.length === 0 ? <p className="muted">No complaints yet.</p> : mine.map((c) => (
            <div key={c.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
              <b>#{c.complaintNo}</b> · {c.serviceName}
              <div className="muted">{c.status}{c.assignedTechName ? ` · Tech: ${c.assignedTechName}` : ""}</div>
              <div className="muted">{(c.selectedProblems || []).join(", ")}</div>
            </div>
          ))}
        </div>
      )}
      {!user && <p className="muted"><Link to="/login">Login</Link> to see your complaint history.</p>}
    </div>
  );
}
