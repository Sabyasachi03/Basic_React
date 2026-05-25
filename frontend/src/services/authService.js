import api from "./api";
import { API_ENDPOINTS } from "./endpoints";

export async function loginUser(payload) {
  const response = await api.post(API_ENDPOINTS.auth.login, payload);
  return response.data;
}

export async function signupUser(payload) {
  const response = await api.post(API_ENDPOINTS.auth.signup, payload);
  return response.data;
}

export function storeUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser() {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  localStorage.removeItem("user");
}