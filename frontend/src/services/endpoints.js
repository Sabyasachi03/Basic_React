export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },
  masters: {
    countries: "/masters/countries",
    countryById: (countryId) => `/masters/countries/${countryId}`,
    states: "/masters/states",
    stateById: (stateId) => `/masters/states/${stateId}`,
    districts: "/masters/districts",
    districtById: (districtId) => `/masters/districts/${districtId}`,
    cities: "/masters/cities",
    cityById: (cityId) => `/masters/cities/${cityId}`,
  },
};