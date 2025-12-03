class SimpleCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs = 60000) {
    const expires = Date.now() + ttlMs;
    this.store.set(key, { value, expires });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  del(key) {
    this.store.delete(key);
  }
}

export const cache = new SimpleCache();
