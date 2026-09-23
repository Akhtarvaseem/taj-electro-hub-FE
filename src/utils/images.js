/** Public CDN photos (Unsplash / Wikimedia) — same style as Flipkart/Amazon catalogs. */
export const CDN = {
  wire: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  switch: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
  mcb: "https://images.unsplash.com/photo-1565608438255-ec4c79cde384?auto=format&fit=crop&w=800&q=80",
  board: "https://images.unsplash.com/photo-1513828583688-c52646dbbd49?auto=format&fit=crop&w=800&q=80",
  led: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80",
  fan: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80",
  extension: "https://images.unsplash.com/photo-1544723495-432537d12f6c?auto=format&fit=crop&w=800&q=80",
  geyser: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80",
  bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  chair: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
};

const FILE_MAP = {
  "/products/wire.jpg": CDN.wire,
  "/products/switch.jpg": CDN.switch,
  "/products/mcb.jpg": CDN.mcb,
  "/products/board.jpg": CDN.board,
  "/products/led.jpg": CDN.led,
  "/products/fan.jpg": CDN.fan,
  "/products/extension.jpg": CDN.extension,
  "/products/geyser.jpg": CDN.geyser,
  "/products/bed.jpg": CDN.bed,
  "/products/chair.jpg": CDN.chair,
};

function byTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("wire") || t.includes("cable")) return CDN.wire;
  if (t.includes("switch") || t.includes("socket") || t.includes("modular")) return CDN.switch;
  if (t.includes("mcb") || t.includes("breaker")) return CDN.mcb;
  if (t.includes("distribution") || t.includes(" db") || t.includes("board") && t.includes("way")) return CDN.board;
  if (t.includes("led") || t.includes("bulb") || t.includes("lamp")) return CDN.led;
  if (t.includes("fan")) return CDN.fan;
  if (t.includes("extension")) return CDN.extension;
  if (t.includes("geyser") || t.includes("heater") || t.includes("water")) return CDN.geyser;
  if (t.includes("bed")) return CDN.bed;
  if (t.includes("chair")) return CDN.chair;
  return CDN.led;
}

/** Turn any stored image path into a working https URL. */
export function resolveImage(src, title = "") {
  if (!src || typeof src !== "string") return byTitle(title);
  const s = src.trim();
  if (FILE_MAP[s]) return FILE_MAP[s];
  if (s.startsWith("/products/")) {
    const name = s.replace("/products/", "").replace(/\.\w+$/, "");
    return CDN[name] || byTitle(title);
  }
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return byTitle(title);
}
