import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import resumeReducer from './slices/resumeSlice.js';
import coverLetterReducer from './slices/coverLetterSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    coverLetter: coverLetterReducer,
    ui: uiReducer
  }
});

export default store;
