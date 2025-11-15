const KEY = 'fe_onboarded';
export const isOnboarded = () => localStorage.getItem(KEY) === '1';
export const setOnboarded = () => localStorage.setItem(KEY, '1');
export const clearOnboarded = () => localStorage.removeItem(KEY); // útil en QA
