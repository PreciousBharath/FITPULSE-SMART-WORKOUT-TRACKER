// Namespaced localStorage helpers (safe in private mode)
import { APP } from './config.js';

const ns = (k) => `${APP.key}:${k}`;

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(ns(key));
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(ns(key), JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(ns(key));
  } catch {
    /* ignore */
  }
}

export const uid = (p = '') => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
