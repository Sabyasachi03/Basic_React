const SECRET = "basic-react-master";

export function encryptId(id) {
  return btoa(`${SECRET}:${id}`);
}

export function decryptId(encryptedId) {
  try {
    const decoded = atob(encryptedId);
    const [secret, rawId] = decoded.split(":");
    if (secret !== SECRET) return null;
    const id = Number(rawId);
    return Number.isNaN(id) ? null : id;
  } catch {
    return null;
  }
}