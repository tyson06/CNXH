import { STORAGE_KEYS } from './config.js';

function read(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}

function write(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export const readAttempt = () => read(STORAGE_KEYS.active);
export const saveAttempt = (attempt) => write(STORAGE_KEYS.active, attempt);
export const clearAttempt = () => { try { sessionStorage.removeItem(STORAGE_KEYS.active); } catch { /* Storage can be unavailable in private contexts. */ } };
export const readResult = () => read(STORAGE_KEYS.result);
export const saveResult = (result) => write(STORAGE_KEYS.result, result);
export const clearResult = () => { try { sessionStorage.removeItem(STORAGE_KEYS.result); } catch { /* Storage can be unavailable in private contexts. */ } };
