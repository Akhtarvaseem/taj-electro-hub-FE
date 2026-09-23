import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider({ maxOff = 0 }) {
  const off = maxOff > 0 ? maxOff : null;
  const SLIDES = [
    {
      kicker: off ? `⚡ Up to ${off}% off on wiring & switches` : "⚡ Fresh deals on electricals",
      title: "TajElectroHub Mega Sale",
      cta: "Shop Wiring",
      href: "/products?category=wiring",
      emoji: "🔌",
      from: "#0a4d8c",
      to: "#1a73e8",
    },
    {
      kicker: off ? `🏷️ Save up to ${off}% on appliances` : "🏷️ Appliance offers live now",
      title: "Fans, Geysers & More",
      cta: "Shop Appliances",
      href: "/products?category=appliances",
      emoji: "🌀",
      from: "#1a73e8",
      to: "#ff6d00",
    },
    {
      kicker: "💵 Pay only when it arrives",
      title: "Cash on Delivery",
      cta: "Shop Now",
      href: "/products",
      emoji: "🚚",
      from: "#ffb300",
      to: "#ff6d00",
    },
  ];

  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [SLIDES.length]);

  const s = SLIDES[i];

  return (
    <div className="hero-slider">
      <div
        key={s.title + s.kicker}
        className="hero-slide"
        style={{ background: `linear-gradient(120deg, ${s.from}, ${s.to})` }}
      >
        <span className="hero-bubble" style={{ width: 80, height: 80, top: 16, left: "18%" }} />
        <span className="hero-bubble" style={{ width: 46, height: 46, bottom: 20, left: "48%", animationDelay: "1s" }} />
        <span className="hero-bubble" style={{ width: 100, height: 100, top: -24, right: "18%", animationDelay: ".5s" }} />
        <div className="hero-content animate-in">
          <p className="hero-sub">{s.kicker}</p>
          <h2>{s.title}</h2>
          <Link to={s.href} className="hero-cta">{s.cta} →</Link>
        </div>
        <div className="emoji">{s.emoji}</div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`hero-dot ${idx === i ? "on" : ""}`}
            onClick={() => setI(idx)}
            aria-label={`slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
