export const formatPrice = (n) =>
  "₹" + Math.round(n || 0).toLocaleString("en-IN");

export const discountPct = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
