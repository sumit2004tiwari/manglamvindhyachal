// API client utility for frontend → backend communication
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("panda_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...options, headers });
  const data = await res.json().catch(() => ({ message: `Server returned ${res.status}. Please try again.` }));

  if (!res.ok) {
    throw new ApiError(Array.isArray(data.message) ? data.message.join(' ') : data.message || 'Request failed.', res.status);
  }
  return data as T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export const api = {
  getMe: () => request<{ id: string; phone: string; name?: string; role: 'USER' | 'VENDOR' | 'ADMIN'; hasKyc: boolean }>('/auth/me'),
  // Auth
  requestOtp: (phone: string) =>
    request<{ message: string; otp: string }>("/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, otp: string, role?: string) =>
    request<{ accessToken: string; user: Record<string, unknown> }>(
      "/auth/otp/verify",
      {
        method: "POST",
        body: JSON.stringify({ phone, otp, role }),
      }
    ),

  // Vendors
  searchVendors: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<unknown[]>(`/vendors${qs}`);
  },

  getVendor: (id: string) => request<unknown>(`/vendors/${id}`),

  getMyVendorProfile: () => request<unknown>("/vendors/me/profile"),

  submitKyc: (data: Record<string, unknown>) =>
    request("/vendors/kyc", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAvailability: (vendorId: string, date?: string) => {
    const qs = date ? `?date=${date}` : "";
    return request<unknown[]>(`/vendors/${vendorId}/availability${qs}`);
  },

  setAvailability: (vendorId: string, slots: unknown[]) =>
    request(`/vendors/${vendorId}/availability`, {
      method: "POST",
      body: JSON.stringify({ slots }),
    }),

  // Listings
  createListing: (data: Record<string, unknown>) =>
    request("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getListing: (id: string) => request<unknown>(`/listings/${id}`),

  updateListing: (id: string, data: Record<string, unknown>) =>
    request(`/listings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Bookings
  createBooking: (data: Record<string, unknown>) =>
    request<{ id: string }>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getBooking: (id: string) => request<unknown>(`/bookings/${id}`),

  updateBookingStatus: (id: string, status: string) =>
    request(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancelBooking: (id: string) =>
    request(`/bookings/${id}/cancel`, { method: "POST" }),

  getMyBookings: (userId: string) =>
    request<unknown[]>(`/users/${userId}/bookings`),
  getPandaBookings: (userId: string) => request<unknown[]>(`/users/${userId}/bookings?as=panda`),

  // Payments
  createPaymentOrder: (bookingId: string) =>
    request("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    }),

  // Reviews
  createReview: (data: { bookingId: string; rating: number; comment?: string }) =>
    request("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Admin
  getPendingVendors: () => request<unknown[]>("/admin/vendors/pending"),

  verifyVendor: (id: string, status: string, comment?: string) =>
    request(`/admin/vendors/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ status, comment }),
    }),

  getAnalytics: () => request<unknown>("/admin/analytics/overview"),

  // Pandas
  createPanda: (data: Record<string, unknown>) =>
    request("/pandas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPandas: (options?: RequestInit) => request<unknown[]>("/pandas", options),
  updatePanda: (data: Record<string, unknown>) => request('/pandas/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getPanda: (id: string) => request<unknown>(`/pandas/${id}`),
};
