import api from "./client";

// ===== Thin API wrappers. Components only call these — no logic here. =====

export const AuthAPI = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  updateProfile: (data) => api.put("/auth/profile", data).then((r) => r.data),
};

export const DeliveryAPI = {
  check: (pincode) => api.get("/delivery/check", { params: { pincode } }).then((r) => r.data),
};

export const ProductAPI = {
  list: (params) => api.get("/products", { params }).then((r) => r.data.products),
  detail: (slug) => api.get(`/products/${encodeURIComponent(slug)}`).then((r) => r.data),
  create: (data) => api.post("/products", data).then((r) => r.data),
  update: (slug, data) => api.put(`/products/${slug}`, data).then((r) => r.data),
  remove: (slug) => api.delete(`/products/${slug}`).then((r) => r.data),
  discount: (slug, percent) =>
    api.post(`/products/${slug}/discount`, { percent }).then((r) => r.data),
  discountCategory: (categoryId, percent) =>
    api.post(`/products/category/${categoryId}/discount`, { percent }).then((r) => r.data),
};

export const CategoryAPI = {
  list: () => api.get("/categories").then((r) => r.data.categories),
  create: (data) => api.post("/categories", data).then((r) => r.data.category),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data.category),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export const CartAPI = {
  get: () => api.get("/cart").then((r) => r.data.items),
  add: (productId, quantity = 1) =>
    api.post("/cart", { productId, quantity }).then((r) => r.data.items),
  update: (id, quantity) =>
    api.patch("/cart", { id, quantity }).then((r) => r.data.items),
  remove: (id) =>
    api.delete("/cart", { data: { id } }).then((r) => r.data.items),
};

export const WishlistAPI = {
  get: () => api.get("/wishlist").then((r) => r.data.items),
  add: (productId) => api.post("/wishlist", { productId }).then((r) => r.data.items),
  remove: (productId) =>
    api.delete("/wishlist", { data: { productId } }).then((r) => r.data.items),
};

export const AddressAPI = {
  list: () => api.get("/addresses").then((r) => r.data.addresses),
  create: (data) => api.post("/addresses", data).then((r) => r.data.address),
  update: (id, data) => api.put(`/addresses/${id}`, data).then((r) => r.data.address),
  remove: (id) => api.delete("/addresses", { data: { id } }).then((r) => r.data),
};

export const OrderAPI = {
  list: () => api.get("/orders").then((r) => r.data.orders),
  place: (addressData, paymentMethod = "COD", couponCode) =>
    api.post("/orders", { addressData, paymentMethod, couponCode }).then((r) => r.data),
  cancel: (id) => api.patch(`/orders/${id}/cancel`).then((r) => r.data),
};

export const ReviewAPI = {
  create: (data) => api.post("/reviews", data).then((r) => r.data),
};

export const BrandAPI = {
  list: () => api.get("/brands").then((r) => r.data.brands || []),
};

export const BannerAPI = {
  list: () => api.get("/banners").then((r) => r.data.banners || []),
};

export const CouponAPI = {
  validate: (code, amount) =>
    api.get("/coupons/validate", { params: { code, amount } }).then((r) => r.data),
};

export const ServiceAPI = {
  book: (data) => api.post("/complaints", data).then((r) => r.data),
  mine: () => api.get("/complaints/mine").then((r) => r.data.complaints || []),
};

export const AdminAPI = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
  updateOrder: (id, status) =>
    api.patch("/admin/orders", { id, status }).then((r) => r.data),
  brands: () => api.get("/admin/brands").then((r) => r.data.brands || []),
  createBrand: (d) => api.post("/admin/brands", d).then((r) => r.data),
  updateBrand: (id, d) => api.put(`/admin/brands/${id}`, d).then((r) => r.data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`).then((r) => r.data),
  coupons: () => api.get("/admin/coupons").then((r) => r.data.coupons || []),
  createCoupon: (d) => api.post("/admin/coupons", d).then((r) => r.data),
  updateCoupon: (id, d) => api.put(`/admin/coupons/${id}`, d).then((r) => r.data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`).then((r) => r.data),
  banners: () => api.get("/admin/banners").then((r) => r.data.banners || []),
  createBanner: (d) => api.post("/admin/banners", d).then((r) => r.data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`).then((r) => r.data),
  customers: () => api.get("/admin/customers").then((r) => r.data.customers || []),
  reviews: () => api.get("/admin/reviews").then((r) => r.data.reviews || []),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`).then((r) => r.data),
  setStock: (productId, stock) =>
    api.patch("/admin/inventory", { productId, stock }).then((r) => r.data),
  reports: () => api.get("/admin/reports").then((r) => r.data),
  complaints: () => api.get("/admin/complaints").then((r) => r.data.complaints || []),
  updateComplaint: (id, data) => api.patch(`/admin/complaints/${id}`, data).then((r) => r.data),
  technicians: () => api.get("/admin/technicians").then((r) => r.data.technicians || []),
  addTechnician: (d) => api.post("/admin/technicians", d).then((r) => r.data),
  deleteTechnician: (id) => api.delete(`/admin/technicians/${id}`).then((r) => r.data),
};
