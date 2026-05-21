import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/endpoints";

export async function fetchMasterCountries() {
  const response = await api.get(API_ENDPOINTS.masters.countries);
  return response.data;
}

export async function createMasterCountry(payload) {
  const response = await api.post(API_ENDPOINTS.masters.countries, payload);
  return response.data;
}

export async function updateMasterCountry(countryId, payload) {
  const response = await api.put(API_ENDPOINTS.masters.countryById(countryId), payload);
  return response.data;
}

export async function deleteMasterCountry(countryId) {
  const response = await api.delete(API_ENDPOINTS.masters.countryById(countryId));
  return response.data;
}

export async function fetchMasterStates(countryId = null) {
  const response = await api.get(API_ENDPOINTS.masters.states, {
    params: countryId ? { country_id: countryId } : undefined,
  });
  return response.data;
}

export async function fetchMasterStateById(stateId) {
  const response = await api.get(API_ENDPOINTS.masters.stateById(stateId));
  return response.data;
}

export async function createMasterState(payload) {
  const response = await api.post(API_ENDPOINTS.masters.states, payload);
  return response.data;
}

export async function updateMasterState(stateId, payload) {
  const response = await api.put(API_ENDPOINTS.masters.stateById(stateId), payload);
  return response.data;
}

export async function deleteMasterState(stateId) {
  const response = await api.delete(API_ENDPOINTS.masters.stateById(stateId));
  return response.data;
}

export async function fetchMasterDistricts() {
  const response = await api.get(API_ENDPOINTS.masters.districts);
  return response.data;
}

export async function fetchMasterDistrictById(districtId) {
  const response = await api.get(API_ENDPOINTS.masters.districtById(districtId));
  return response.data;
}

export async function createMasterDistrict(payload) {
  const response = await api.post(API_ENDPOINTS.masters.districts, payload);
  return response.data;
}

export async function updateMasterDistrict(districtId, payload) {
  const response = await api.put(API_ENDPOINTS.masters.districtById(districtId), payload);
  return response.data;
}

export async function deleteMasterDistrict(districtId) {
  const response = await api.delete(API_ENDPOINTS.masters.districtById(districtId));
  return response.data;
}