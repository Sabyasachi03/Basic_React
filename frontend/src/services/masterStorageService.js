const COUNTRY_KEY = "country_master_list";
const STATE_KEY = "state_master_list";

function read(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCountries() {
  return read(COUNTRY_KEY);
}

export function addCountry(payload) {
  const countries = getCountries();
  const item = {
    id: Date.now(),
    name: payload.name.trim(),
    code: payload.code.trim(),
    pmName: payload.pmName.trim(),
  };
  const next = [...countries, item];
  write(COUNTRY_KEY, next);
  return item;
}

export function updateCountry(id, payload) {
  const countries = getCountries();
  const next = countries.map((c) =>
    c.id === id
      ? {
          ...c,
          name: payload.name.trim(),
          code: payload.code.trim(),
          pmName: payload.pmName.trim(),
        }
      : c
  );
  write(COUNTRY_KEY, next);
}

export function deleteCountry(id) {
  const countries = getCountries();
  const next = countries.filter((c) => c.id !== id);
  write(COUNTRY_KEY, next);
}

export function getStates() {
  return read(STATE_KEY);
}

export function getStateById(id) {
  return getStates().find((s) => s.id === id) || null;
}

export function addState(payload) {
  const states = getStates();
  const item = {
    id: Date.now(),
    name: payload.name.trim(),
    code: payload.code.trim(),
    cmName: payload.cmName.trim(),
    country: payload.country.trim(),
  };
  const next = [...states, item];
  write(STATE_KEY, next);
  return item;
}

export function updateState(id, payload) {
  const states = getStates();
  const next = states.map((s) =>
    s.id === id
      ? {
          ...s,
          name: payload.name.trim(),
          code: payload.code.trim(),
          cmName: payload.cmName.trim(),
          country: payload.country.trim(),
        }
      : s
  );
  write(STATE_KEY, next);
}

export function deleteState(id) {
  const states = getStates();
  const next = states.filter((s) => s.id !== id);
  write(STATE_KEY, next);
}
