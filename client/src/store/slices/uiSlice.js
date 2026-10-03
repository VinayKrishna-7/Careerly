import { createSlice } from '@reduxjs/toolkit';
import { updateFavicon } from '../../utils/favicon.js';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateFavicon(saved);
      return saved;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      updateFavicon('dark');
      return 'dark';
    }
    updateFavicon('light');
  }
  return 'light';
};

const initialTheme = getInitialTheme();

const initialState = {
  theme: initialTheme, // 'light' | 'dark'
  toast: {
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
    isVisible: false
  },
  previewZoom: 100,
  isSidebarCollapsed: false,
  activeEditorTab: 'content' // 'content' | 'templates' | 'styling' | 'sections'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        updateFavicon(nextTheme);
      }
    },
    setTheme: (state, action) => {
      const newTheme = action.payload === 'dark' ? 'dark' : 'light';
      state.theme = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        updateFavicon(newTheme);
      }
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isVisible: true
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    setPreviewZoom: (state, action) => {
      state.previewZoom = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setActiveEditorTab: (state, action) => {
      state.activeEditorTab = action.payload;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  showToast,
  hideToast,
  setPreviewZoom,
  toggleSidebar,
  setActiveEditorTab
} = uiSlice.actions;

export default uiSlice.reducer;
