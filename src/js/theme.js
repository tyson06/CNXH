import { STORAGE_KEYS } from './config.js';

const buttonLabel = (theme) => theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';

function getSavedTheme() {
  try { return localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}

function applyTheme(theme, save = true) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', buttonLabel(theme));
    button.setAttribute('title', buttonLabel(theme));
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.textContent = theme === 'dark' ? '☀' : '☾';
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151b26' : '#f5f7fb');
  if (save) {
    try { localStorage.setItem(STORAGE_KEYS.theme, theme); } catch { /* Theme still works for this page. */ }
  }
}

applyTheme(getSavedTheme(), false);
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-theme-toggle]')) return;
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
