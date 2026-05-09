import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/endpoints";

export async function fetchCountries(userId) {
  const response = await api.get(API_ENDPOINTS.dashboard.countries(userId));
  return response.data;
}

export async function createCountry(userId, payload) {
  const response = await api.post(API_ENDPOINTS.dashboard.countries(userId), payload);
  return response.data;
}

export async function updateCountry(userId, countryId, payload) {
  const response = await api.put(API_ENDPOINTS.dashboard.countryById(userId, countryId), payload);
  return response.data;
}

export async function deleteCountry(userId, countryId) {
  const response = await api.delete(API_ENDPOINTS.dashboard.countryById(userId, countryId));
  return response.data;
}

export async function fetchCarts(userId, countryId) {
  const response = await api.get(API_ENDPOINTS.dashboard.carts(userId, countryId));
  return response.data;
}

export async function createCart(userId, countryId, payload) {
  const response = await api.post(API_ENDPOINTS.dashboard.carts(userId, countryId), payload);
  return response.data;
}

export async function fetchCartById(userId, countryId, cartId) {
  const response = await api.get(API_ENDPOINTS.dashboard.cartById(userId, countryId, cartId));
  return response.data;
}

export async function updateCart(userId, countryId, cartId, payload) {
  const response = await api.put(API_ENDPOINTS.dashboard.cartById(userId, countryId, cartId), payload);
  return response.data;
}

export async function deleteCart(userId, countryId, cartId) {
  const response = await api.delete(API_ENDPOINTS.dashboard.cartById(userId, countryId, cartId));
  return response.data;
}

export async function fetchActivities(userId, countryId) {
  const response = await api.get(API_ENDPOINTS.dashboard.activities(userId), {
    params: countryId ? { country_id: countryId } : undefined,
  });

  return response.data.map((activity) => ({
    id: `activity-${activity.id}`,
    method: activity.method,
    endpoint: activity.endpoint,
    requestPayload: activity.request_payload,
    responseBody: activity.response_body,
    status: activity.status,
    countryId: activity.country_id ? String(activity.country_id) : null,
    timestamp: activity.timestamp,
  }));
}

export async function clearActivities(userId, countryId) {
  const response = await api.delete(API_ENDPOINTS.dashboard.activities(userId), {
    params: countryId ? { country_id: countryId } : undefined,
  });
  return response.data;
}