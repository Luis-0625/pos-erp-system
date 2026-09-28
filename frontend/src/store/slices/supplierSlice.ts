import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import supplierService from '../../services/supplier.service';
import { Supplier, PaginatedResponse } from '../../types';

interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalSuppliers: number;
    suppliersWithDebt: number;
    totalDebt: number;
    totalCreditLimit: number;
    availableCredit: number;
  } | null;
}

const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  stats: null,
};

// Async thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSuppliers(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedores');
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchSupplierById',
  async (id: number, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.getSupplierById(id);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedor');
    }
  }
);

export const fetchSupplierByDocument = createAsyncThunk(
  'suppliers/fetchSupplierByDocument',
  async (documentNumber: string, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.getSupplierByDocument(documentNumber);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedor');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData: any, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.createSupplier(supplierData);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear proveedor');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.updateSupplier(id, data);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar proveedor');
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id: number, { rejectWithValue }) => {
    try {
      await supplierService.deleteSupplier(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar proveedor');
    }
  }
);

export const updateSupplierBalance = createAsyncThunk(
  'suppliers/updateSupplierBalance',
  async ({ id, amount, type }: { id: number; amount: number; type: 'add' | 'subtract' }, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.updateBalance(id, amount, type);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar balance');
    }
  }
);

export const updateSupplierCreditLimit = createAsyncThunk(
  'suppliers/updateSupplierCreditLimit',
  async ({ id, newLimit }: { id: number; newLimit: number }, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.updateCreditLimit(id, newLimit);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar límite de crédito');
    }
  }
);

export const updateSupplierPaymentTerms = createAsyncThunk(
  'suppliers/updateSupplierPaymentTerms',
  async ({ id, paymentTermDays }: { id: number; paymentTermDays: number }, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.updatePaymentTerms(id, paymentTermDays);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar términos de pago');
    }
  }
);

export const fetchSuppliersWithDebt = createAsyncThunk(
  'suppliers/fetchSuppliersWithDebt',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSuppliersWithDebt();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedores con deuda');
    }
  }
);

export const searchSuppliers = createAsyncThunk(
  'suppliers/searchSuppliers',
  async (term: string, { rejectWithValue }) => {
    try {
      const response = await supplierService.searchSuppliers(term);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al buscar proveedores');
    }
  }
);

export const fetchSupplierStats = createAsyncThunk(
  'suppliers/fetchSupplierStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await supplierService.getSupplierStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const toggleSupplierStatus = createAsyncThunk(
  'suppliers/toggleSupplierStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.toggleSupplierStatus(id);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado');
    }
  }
);

export const fetchTopSuppliers = createAsyncThunk(
  'suppliers/fetchTopSuppliers',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await supplierService.getTopSuppliers(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar top proveedores');
    }
  }
);

// Slice
const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSupplier: (state, action: PayloadAction<Supplier>) => {
      state.currentSupplier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<PaginatedResponse<Supplier>>) => {
        state.loading = false;
        state.suppliers = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch supplier by ID
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch supplier by document
      .addCase(fetchSupplierByDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierByDocument.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierByDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.loading = false;
        state.suppliers.unshift(action.payload);
        state.currentSupplier = action.payload;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.loading = false;
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
        if (state.currentSupplier?.id === action.payload) {
          state.currentSupplier = null;
        }
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update supplier balance
      .addCase(updateSupplierBalance.fulfilled, (state, action: PayloadAction<Supplier>) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      
      // Update supplier credit limit
      .addCase(updateSupplierCreditLimit.fulfilled, (state, action: PayloadAction<Supplier>) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      
      // Update supplier payment terms
      .addCase(updateSupplierPaymentTerms.fulfilled, (state, action: PayloadAction<Supplier>) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      
      // Fetch suppliers with debt
      .addCase(fetchSuppliersWithDebt.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.suppliers = action.payload;
      })
      
      // Search suppliers
      .addCase(searchSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.suppliers = action.payload;
      })
      
      // Fetch supplier stats
      .addCase(fetchSupplierStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Toggle supplier status
      .addCase(toggleSupplierStatus.fulfilled, (state, action: PayloadAction<Supplier>) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      
      // Fetch top suppliers
      .addCase(fetchTopSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.suppliers = action.payload;
      });
  },
});

export const {
  clearCurrentSupplier,
  clearError,
  setCurrentSupplier,
} = supplierSlice.actions;

export default supplierSlice.reducer;
