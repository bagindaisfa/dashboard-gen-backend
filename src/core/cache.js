const cache = new Map();

export const setCache = (key, value, ttl = 60000) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
};

export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};
