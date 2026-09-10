import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeApi } from '../../services/resumeApi.js';
import { authApi } from '../../services/authApi.js';

export const fetchResumes = createAsyncThunk('resume/fetchResumes', async (params, { rejectWithValue }) => {
  try {
    const data = await resumeApi.getAll(params);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchResumeById = createAsyncThunk('resume/fetchResumeById', async (id, { rejectWithValue }) => {
  try {
    const data = await resumeApi.getById(id);
    return data.data.resume;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createNewResume = createAsyncThunk('resume/createNewResume', async (resumeData, { rejectWithValue }) => {
  try {
    const data = await resumeApi.create(resumeData);
    return data.data.resume;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveResume = createAsyncThunk('resume/saveResume', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await resumeApi.update(id, data);
    return res.data.resume;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteResume = createAsyncThunk('resume/deleteResume', async (id, { rejectWithValue }) => {
  try {
    await resumeApi.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const duplicateResume = createAsyncThunk('resume/duplicateResume', async (id, { rejectWithValue }) => {
  try {
    const data = await resumeApi.duplicate(id);
    return data.data.resume;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const renameResume = createAsyncThunk('resume/renameResume', async ({ id, title }, { rejectWithValue }) => {
  try {
    const data = await resumeApi.rename(id, title);
    return data.data.resume;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchDashboardStats = createAsyncThunk('resume/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.getDashboardStats();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  resumesList: [],
  pagination: { total: 0, page: 1, limit: 50, totalPages: 1 },
  activeResume: null,
  stats: { totalResumes: 0, templateDistribution: {}, lastUpdated: null },
  isLoadingList: false,
  isLoadingActive: false,
  isSaving: false,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: null,
  isDirty: false,
  activeSection: 'personalInfo',
  error: null
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    updateActiveResumeField: (state, action) => {
      const { path, value } = action.payload;
      if (!state.activeResume) return;

      // Deep path setter (e.g. 'personalInfo.fullName' or 'settings.primaryColor' or 'summary')
      const keys = path.split('.');
      let current = state.activeResume;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      state.isDirty = true;
      state.saveStatus = 'idle';
    },
    setActiveResumeTemplate: (state, action) => {
      if (state.activeResume) {
        state.activeResume.template = action.payload;
        state.isDirty = true;
      }
    },
    setActiveResumeSettings: (state, action) => {
      if (state.activeResume) {
        state.activeResume.settings = { ...state.activeResume.settings, ...action.payload };
        state.isDirty = true;
      }
    },
    setSectionOrder: (state, action) => {
      if (state.activeResume) {
        state.activeResume.sectionOrder = action.payload;
        state.isDirty = true;
      }
    },
    toggleSectionVisibility: (state, action) => {
      const section = action.payload;
      if (state.activeResume) {
        if (!state.activeResume.sectionVisibility) {
          state.activeResume.sectionVisibility = {};
        }
        state.activeResume.sectionVisibility[section] = !state.activeResume.sectionVisibility[section];
        state.isDirty = true;
      }
    },
    // Array entry managers
    addArrayItem: (state, action) => {
      const { section, item } = action.payload;
      if (state.activeResume && Array.isArray(state.activeResume[section])) {
        state.activeResume[section].push(item);
        state.isDirty = true;
      }
    },
    removeArrayItem: (state, action) => {
      const { section, index } = action.payload;
      if (state.activeResume && Array.isArray(state.activeResume[section])) {
        state.activeResume[section].splice(index, 1);
        state.isDirty = true;
      }
    },
    updateArrayItem: (state, action) => {
      const { section, index, item } = action.payload;
      if (state.activeResume && Array.isArray(state.activeResume[section])) {
        state.activeResume[section][index] = { ...state.activeResume[section][index], ...item };
        state.isDirty = true;
      }
    },
    reorderArrayItem: (state, action) => {
      const { section, fromIndex, toIndex } = action.payload;
      if (state.activeResume && Array.isArray(state.activeResume[section])) {
        const items = [...state.activeResume[section]];
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);
        state.activeResume[section] = items;
        state.isDirty = true;
      }
    },
    clearActiveResume: (state) => {
      state.activeResume = null;
      state.isDirty = false;
      state.saveStatus = 'idle';
      state.lastSaved = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchResumes
      .addCase(fetchResumes.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.resumesList = action.payload.resumes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoadingList = false;
        state.error = action.payload;
      })

      // fetchResumeById
      .addCase(fetchResumeById.pending, (state) => {
        state.isLoadingActive = true;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoadingActive = false;
        state.activeResume = action.payload;
        state.isDirty = false;
        state.saveStatus = 'saved';
        state.lastSaved = action.payload.updatedAt;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.isLoadingActive = false;
        state.error = action.payload;
      })

      // createNewResume
      .addCase(createNewResume.fulfilled, (state, action) => {
        state.resumesList.unshift(action.payload);
        state.activeResume = action.payload;
      })

      // saveResume
      .addCase(saveResume.pending, (state) => {
        state.isSaving = true;
        state.saveStatus = 'saving';
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isDirty = false;
        state.saveStatus = 'saved';
        state.lastSaved = new Date().toISOString();
        state.activeResume = action.payload;

        // update list entry if present
        const index = state.resumesList.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.resumesList[index] = action.payload;
        }
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.isSaving = false;
        state.saveStatus = 'error';
        state.error = action.payload;
      })

      // deleteResume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumesList = state.resumesList.filter((r) => r._id !== action.payload);
        if (state.activeResume?._id === action.payload) {
          state.activeResume = null;
        }
      })

      // duplicateResume
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.resumesList.unshift(action.payload);
      })

      // renameResume
      .addCase(renameResume.fulfilled, (state, action) => {
        if (state.activeResume?._id === action.payload._id) {
          state.activeResume.title = action.payload.title;
        }
        const index = state.resumesList.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.resumesList[index].title = action.payload.title;
        }
      })

      // fetchDashboardStats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const {
  setActiveSection,
  updateActiveResumeField,
  setActiveResumeTemplate,
  setActiveResumeSettings,
  setSectionOrder,
  toggleSectionVisibility,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  reorderArrayItem,
  clearActiveResume
} = resumeSlice.actions;

export default resumeSlice.reducer;
