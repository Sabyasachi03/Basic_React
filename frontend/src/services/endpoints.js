export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },
  cart: {
    listByUser: (userId) => `/cart/${userId}`,
    createByUser: (userId) => `/cart/${userId}`,
    updateByUser: (userId, itemId) => `/cart/${userId}/${itemId}`,
    deleteByUser: (userId, itemId) => `/cart/${userId}/${itemId}`,
  },
  dashboard: {
    countries: (userId) => `/dashboard/${userId}/countries`,
    countryById: (userId, countryId) => `/dashboard/${userId}/countries/${countryId}`,
    carts: (userId, countryId) => `/dashboard/${userId}/countries/${countryId}/carts`,
    cartById: (userId, countryId, cartId) => `/dashboard/${userId}/countries/${countryId}/carts/${cartId}`,
    activities: (userId) => `/dashboard/${userId}/activities`,
  },
};