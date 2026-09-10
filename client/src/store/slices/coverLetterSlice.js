import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coverLetterApi } from '../../services/coverLetterApi.js';

export const fetchCoverLetters = createAsyncThunk(
  'coverLetter/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await coverLetterApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cover letters');
    }
  }
);

export const fetchCoverLetterById = createAsyncThunk(
  'coverLetter/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coverLetterApi.getById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cover letter');
    }
  }
);

export const createNewCoverLetter = createAsyncThunk(
  'coverLetter/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await coverLetterApi.create(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create cover letter');
    }
  }
);

export const saveCoverLetter = createAsyncThunk(
  'coverLetter/save',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await coverLetterApi.update(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save cover letter');
    }
  }
);

export const deleteCoverLetter = createAsyncThunk(
  'coverLetter/delete',
  async (id, { rejectWithValue }) => {
    try {
      await coverLetterApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete cover letter');
    }
  }
);

const initialState = {
  coverLettersList: [],
  activeLetter: null,
  isLoadingList: false,
  isLoadingActive: false,
  isSaving: false,
  isDirty: false,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: null,
  error: null
};

const coverLetterSlice = createSlice({
  name: 'coverLetter',
  initialState,
  reducers: {
    updateActiveLetterField: (state, action) => {
      if (!state.activeLetter) return;
      const { path, value } = action.payload;
      const keys = path.split('.');

      let current = state.activeLetter;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      state.isDirty = true;
      state.saveStatus = 'idle';
    },
    updateBodyParagraph: (state, action) => {
      if (!state.activeLetter) return;
      const { index, text } = action.payload;
      if (!Array.isArray(state.activeLetter.bodyParagraphs)) {
        state.activeLetter.bodyParagraphs = [];
      }
      state.activeLetter.bodyParagraphs[index] = text;
      state.isDirty = true;
    },
    addBodyParagraph: (state) => {
      if (!state.activeLetter) return;
      if (!Array.isArray(state.activeLetter.bodyParagraphs)) {
        state.activeLetter.bodyParagraphs = [];
      }
      state.activeLetter.bodyParagraphs.push('New paragraph detailing your relevant background and fit.');
      state.isDirty = true;
    },
    removeBodyParagraph: (state, action) => {
      if (!state.activeLetter || !Array.isArray(state.activeLetter.bodyParagraphs)) return;
      state.activeLetter.bodyParagraphs.splice(action.payload, 1);
      state.isDirty = true;
    },
    setLetterTemplate: (state, action) => {
      if (!state.activeLetter) return;
      state.activeLetter.template = action.payload;
      state.isDirty = true;
    },
    setLetterSettings: (state, action) => {
      if (!state.activeLetter) return;
      state.activeLetter.settings = {
        ...(state.activeLetter.settings || {}),
        ...action.payload
      };
      state.isDirty = true;
    },
    clearActiveLetter: (state) => {
      state.activeLetter = null;
      state.isDirty = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchCoverLetters.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(fetchCoverLetters.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.coverLettersList = action.payload;
      })
      .addCase(fetchCoverLetters.rejected, (state, action) => {
        state.isLoadingList = false;
        state.error = action.payload;
      });

    // Fetch single
    builder
      .addCase(fetchCoverLetterById.pending, (state) => {
        state.isLoadingActive = true;
      })
      .addCase(fetchCoverLetterById.fulfilled, (state, action) => {
        state.isLoadingActive = false;
        state.activeLetter = action.payload;
        state.isDirty = false;
      })
      .addCase(fetchCoverLetterById.rejected, (state, action) => {
        state.isLoadingActive = false;
        state.error = action.payload;
      });

    // Create
    builder.addCase(createNewCoverLetter.fulfilled, (state, action) => {
      state.coverLettersList.unshift(action.payload);
      state.activeLetter = action.payload;
      state.isDirty = false;
    });

    // Save
    builder
      .addCase(saveCoverLetter.pending, (state) => {
        state.isSaving = true;
        state.saveStatus = 'saving';
      })
      .addCase(saveCoverLetter.fulfilled, (state, action) => {
        state.isSaving = false;
        state.saveStatus = 'saved';
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();
        state.activeLetter = action.payload;

        const idx = state.coverLettersList.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) {
          state.coverLettersList[idx] = action.payload;
        }
      })
      .addCase(saveCoverLetter.rejected, (state, action) => {
        state.isSaving = false;
        state.saveStatus = 'error';
        state.error = action.payload;
      });

    // Delete
    builder.addCase(deleteCoverLetter.fulfilled, (state, action) => {
      state.coverLettersList = state.coverLettersList.filter((c) => c._id !== action.payload);
      if (state.activeLetter?._id === action.payload) {
        state.activeLetter = null;
      }
    });
  }
});

export const {
  updateActiveLetterField,
  updateBodyParagraph,
  addBodyParagraph,
  removeBodyParagraph,
  setLetterTemplate,
  setLetterSettings,
  clearActiveLetter
} = coverLetterSlice.actions;

export default coverLetterSlice.reducer;
