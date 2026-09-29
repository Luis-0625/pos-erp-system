import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import categoryService from '../../services/category.service';
import { Category, QueryFilters, PaginatedResponse } from '../../types';

/**
 * Category State Interface
 */
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial State
 */
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

/**
 * Async Thunks
 */

// Obtener categorías con filtros
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (filters: QueryFilters = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar categorías');
    }
  }
);

// Obtener categorías activas
export const fetchActiveCategories = createAsyncThunk(
  'categories/fetchActiveCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoryService.getActiveCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar categorías activas');
    }
  }
);

// Obtener categoría por ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar categoría');
    }
  }
);

// Crear categoría
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: Partial<Category>, { rejectWithValue }) => {
    try {
      const category = await categoryService.createCategory(categoryData);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear categoría');
    }
  }
);

// Actualizar categoría
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (
    { id, data }: { id: number; data: Partial<Category> },
    { rejectWithValue }
  ) => {
    try {
      const category = await categoryService.updateCategory(id, data);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar categoría');
    }
  }
);

// Eliminar categoría
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar categoría');
    }
  }
);

// Alternar estado de categoría
export const toggleCategoryStatus = createAsyncThunk(
  'categories/toggleCategoryStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const category = await categoryService.toggleCategoryStatus(id);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cambiar estado de categoría');
    }
  }
);

/**
 * Category Slice
 */
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Category>>) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Active Categories
    builder
      .addCase(fetchActiveCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActiveCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchActiveCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Category By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryById.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.currentCategory = action.payload;
        }
      )
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.unshift(action.payload);
        }
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          if (state.currentCategory?.id === action.payload.id) {
            state.currentCategory = action.payload;
          }
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (cat) => cat.id !== action.payload
          );
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle Category Status
    builder
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        toggleCategoryStatus.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
