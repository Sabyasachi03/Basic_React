import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/endpoints";

export const countryApi = {
  list: async () => (await api.get(API_ENDPOINTS.masters.countries)).data,
  create: async (payload) => (await api.post(API_ENDPOINTS.masters.countries, payload)).data,
  update: async (id, payload) => (await api.put(API_ENDPOINTS.masters.countryById(id), payload)).data,
  remove: async (id) => (await api.delete(API_ENDPOINTS.masters.countryById(id))).data,
};

export const stateApi = {
  list: async (countryId = null) =>
    (
      await api.get(API_ENDPOINTS.masters.states, {
        params: countryId ? { country_id: countryId } : undefined,
      })
    ).data,
  getById: async (id) => (await api.get(API_ENDPOINTS.masters.stateById(id))).data,
  create: async (payload) => (await api.post(API_ENDPOINTS.masters.states, payload)).data,
  update: async (id, payload) => (await api.put(API_ENDPOINTS.masters.stateById(id), payload)).data,
  remove: async (id) => (await api.delete(API_ENDPOINTS.masters.stateById(id))).data,
};

export const districtApi = {
  list: async (params = {}) => (await api.get(API_ENDPOINTS.masters.districts, { params })).data,
  getById: async (id) => (await api.get(API_ENDPOINTS.masters.districtById(id))).data,
  create: async (payload) => (await api.post(API_ENDPOINTS.masters.districts, payload)).data,
  update: async (id, payload) => (await api.put(API_ENDPOINTS.masters.districtById(id), payload)).data,
  remove: async (id) => (await api.delete(API_ENDPOINTS.masters.districtById(id))).data,
};

export const cityApi = {
  list: async (params = {}) => (await api.get(API_ENDPOINTS.masters.cities, { params })).data,
  getById: async (id) => (await api.get(API_ENDPOINTS.masters.cityById(id))).data,
  create: async (payload) => (await api.post(API_ENDPOINTS.masters.cities, payload)).data,
  update: async (id, payload) => (await api.put(API_ENDPOINTS.masters.cityById(id), payload)).data,
  remove: async (id) => (await api.delete(API_ENDPOINTS.masters.cityById(id))).data,
};