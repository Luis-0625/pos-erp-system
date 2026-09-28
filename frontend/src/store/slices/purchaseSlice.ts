import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import purchaseService from '../../services/purchase.service';
import { Purchase, PaginatedResponse, PaymentStatus } from '../../types';

interface PurchaseState {
  purchases: Purchase[];
  currentPurchase: Purchase | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalPurchases: number;
    completedPurchases: number;
    cancelledPurchases: number;
    pendingPayments: number;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
  } | null;
}

const initialState: PurchaseState = {
  purchases: [],
  currentPurchase: null,
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
export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getPurchases(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compras');
    }
  }
);

export const fetchPurchaseById = createAsyncThunk(
  'purchases/fetchPurchaseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.getPurchaseById(id);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compra');
    }
  }
);

export const fetchPurchaseByNumber = createAsyncThunk(
  'purchases/fetchPurchaseByNumber',
  async (purchaseNumber: string, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.getPurchaseByNumber(purchaseNumber);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compra');
    }
  }
);

export const createPurchase = createAsyncThunk(
  'purchases/createPurchase',
  async (purchaseData: {
    supplierId: number;
    invoiceNumber?: string;
    items: Array<{ productId: number; quantity: number; unitPrice: number; discount?: number }>;
    paymentMethod: string;
    discount?: number;
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.createPurchase(purchaseData);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear compra');
    }
  }
);

export const updatePurchase = createAsyncThunk(
  'purchases/updatePurchase',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.updatePurchase(id, data);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar compra');
    }
  }
);

export const cancelPurchase = createAsyncThunk(
  'purchases/cancelPurchase',
  async ({ id, reason }: { id: number; reason?: string }, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.cancelPurchase(id, reason);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar compra');
    }
  }
);

export const refundPurchase = createAsyncThunk(
  'purchases/refundPurchase',
  async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.refundPurchase(id, reason);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al reembolsar compra');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'purchases/updatePaymentStatus',
  async ({ id, status }: { id: number; status: PaymentStatus }, { rejectWithValue }) => {
    try {
      const purchase = await purchaseService.updatePaymentStatus(id, status);
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar estado de pago');
    }
  }
);

export const fetchPurchaseStats = createAsyncThunk(
  'purchases/fetchPurchaseStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await purchaseService.getPurchaseStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchPurchasesWithPendingPayment = createAsyncThunk(
  'purchases/fetchPurchasesWithPendingPayment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getPurchasesWithPendingPayment();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compras pendientes');
    }
  }
);

export const fetchPurchasesBySupplier = createAsyncThunk(
  'purchases/fetchPurchasesBySupplier',
  async (supplierId: number, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getPurchasesBySupplier(supplierId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compras del proveedor');
    }
  }
);

export const searchPurchases = createAsyncThunk(
  'purchases/searchPurchases',
  async (term: string, { rejectWithValue }) => {
    try {
      const response = await purchaseService.searchPurchases(term);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al buscar compras');
    }
  }
);

export const deletePurchase = createAsyncThunk(
  'purchases/deletePurchase',
  async (id: number, { rejectWithValue }) => {
    try {
      await purchaseService.deletePurchase(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar compra');
    }
  }
);

// Slice
const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    clearCurrentPurchase: (state) => {
      state.currentPurchase = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPurchase: (state, action: PayloadAction<Purchase>) => {
      state.currentPurchase = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch purchases
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action: PayloadAction<PaginatedResponse<Purchase>>) => {
        state.loading = false;
        state.purchases = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch purchase by ID
      .addCase(fetchPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        state.currentPurchase = action.payload;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch purchase by number
      .addCase(fetchPurchaseByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseByNumber.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        state.currentPurchase = action.payload;
      })
      .addCase(fetchPurchaseByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create purchase
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchase.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        state.purchases.unshift(action.payload);
        state.currentPurchase = action.payload;
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update purchase
      .addCase(updatePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.currentPurchase?.id === action.payload.id) {
          state.currentPurchase = action.payload;
        }
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel purchase
      .addCase(cancelPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelPurchase.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.currentPurchase?.id === action.payload.id) {
          state.currentPurchase = action.payload;
        }
      })
      .addCase(cancelPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Refund purchase
      .addCase(refundPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPurchase.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.currentPurchase?.id === action.payload.id) {
          state.currentPurchase = action.payload;
        }
      })
      .addCase(refundPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.loading = false;
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.currentPurchase?.id === action.payload.id) {
          state.currentPurchase = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch purchase stats
      .addCase(fetchPurchaseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPurchaseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch purchases with pending payment
      .addCase(fetchPurchasesWithPendingPayment.fulfilled, (state, action: PayloadAction<Purchase[]>) => {
        state.purchases = action.payload;
      })
      
      // Fetch purchases by supplier
      .addCase(fetchPurchasesBySupplier.fulfilled, (state, action: PayloadAction<Purchase[]>) => {
        state.purchases = action.payload;
      })
      
      // Search purchases
      .addCase(searchPurchases.fulfilled, (state, action: PayloadAction<Purchase[]>) => {
        state.purchases = action.payload;
      })
      
      // Delete purchase
      .addCase(deletePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.purchases = state.purchases.filter(p => p.id !== action.payload);
        if (state.currentPurchase?.id === action.payload) {
          state.currentPurchase = null;
        }
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentPurchase,
  clearError,
  setCurrentPurchase,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
