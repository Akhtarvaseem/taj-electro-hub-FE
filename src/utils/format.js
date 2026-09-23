export const formatPrice = (n) =>
  "₹" + Math.round(n || 0).toLocaleString("en-IN");

export const discountPct = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const maxDiscount = (products = []) => {
  let max = 0;
  for (const p of products) {
    const d = discountPct(p.mrp, p.price);
    if (d > max) max = d;
  }
  return max;
};

/** Normalize any pincode value to a 6-digit Indian PIN (or ""). */
export const normalizePin = (value) => {
  const s = String(value ?? "").trim();
  if (!s || s === "undefined" || s === "null") return "";
  const digits = s.replace(/\D/g, "");
  const m = digits.match(/[1-9][0-9]{5}/);
  return m ? m[0] : "";
};
