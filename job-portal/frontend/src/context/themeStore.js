import { create } from 'zustand';

const useThemeStore = create((set) => ({
  dark: localStorage.getItem('theme') === 'dark',
  toggle: () =>
    set((state) => {
      const next = !state.dark;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { dark: next };
    }),
  init: () => {
    const dark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    return { dark };
  },
}));

export default useThemeStore;
