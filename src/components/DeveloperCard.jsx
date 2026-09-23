export const DEVELOPER = {
  name: "Ravi Kumar",
  role: "Full-stack Developer",
  email: "developer@tajelectric.com",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  location: "India",
  photo:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  about:
    "Designed and built TajElectroHub as a complete online store for Taj Electric & Electronics — catalog, cart, COD checkout, orders and admin panel.",
};

export default function DeveloperCard() {
  const d = DEVELOPER;
  return (
    <div className="dev-card">
      <img className="dev-photo" src={d.photo} alt={d.name} />
      <div>
        <h3 style={{ marginBottom: 2 }}>{d.name}</h3>
        <p className="muted" style={{ marginBottom: 10 }}>{d.role}</p>
        <p className="muted" style={{ lineHeight: 1.7, marginBottom: 12 }}>{d.about}</p>
        <p>📧 <a href={`mailto:${d.email}`}>{d.email}</a></p>
        <p>📞 <a href={`tel:${d.phone.replace(/\s/g, "")}`}>{d.phone}</a></p>
        <p>💬 <a href={`https://wa.me/${d.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></p>
        <p>📍 {d.location}</p>
      </div>
    </div>
  );
}
