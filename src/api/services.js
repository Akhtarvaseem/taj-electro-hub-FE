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
  place: (addressData, paymentMethod = "COD") =>
    api.post("/orders", { addressData, paymentMethod }).then((r) => r.data),
  cancel: (id) => api.patch(`/orders/${id}/cancel`).then((r) => r.data),
};

export const ReviewAPI = {
  create: (data) => api.post("/reviews", data).then((r) => r.data),
};

export const AdminAPI = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
  updateOrder: (id, status) =>
    api.patch("/admin/orders", { id, status }).then((r) => r.data),
};
