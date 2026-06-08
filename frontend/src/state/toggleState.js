const STORAGE_KEY = 'galpon-toggle-state';
const FIRST_VISIT_KEY = 'galpon-first-visit';

export function getToggleState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveToggleState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getGalponState(galponName) {
  const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
  if (isFirstVisit) {
    return false;
  }
  return getToggleState()[galponName] ?? false;
}

export function setGalponState(galponName, expanded) {
  const state = getToggleState();
  state[galponName] = expanded;
  saveToggleState(state);
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}

export function resetAllToggles() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FIRST_VISIT_KEY);
}