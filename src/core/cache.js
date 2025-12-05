// Simple in-memory cache
const store = new Map();

export const cache = {
  get(key) {
    const item = store.get(key);
    if (!item) return null;

    const { expiresAt, value } = item;
    if (expiresAt && expiresAt < Date.now()) {
      store.delete(key);
      return null;
    }

    return value;
  },

  set(key, value, ttlMs = 60_000) {
    store.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null,
    });
  },

  delete(key) {
    store.delete(key);
  },

  clear() {
    store.clear();
  },
};
