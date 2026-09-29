import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import saleService from '../../services/sale.service';
import { Sale, SaleItem, SalePayment, PaginatedResponse, PaymentStatus } from '../../types';

interface CartItem extends Omit<SaleItem, 'saleId'> {
  productName: string;
  productBarcode: string;
  currentStock: number;
}

interface SaleState {
  sales: Sale[];
  currentSale: Sale | null;
  cart: CartItem[];
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  selectedClient: number | null;
  payments: SalePayment[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalSales: number;
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
    totalCredit: number;
    averageTicket: number;
    salesByPaymentMethod: Record<string, number>;
    salesByStatus: Record<string, number>;
    topSellingProducts: Array<{
      productId: number;
      productName: string;
      totalQuantity: number;
      totalRevenue: number;
    }>;
  } | null;
}

const initialState: SaleState = {
  sales: [],
  currentSale: null,
  cart: [],
  cartTotal: 0,
  cartSubtotal: 0,
  cartTax: 0,
  cartDiscount: 0,
  selectedClient: null,
  payments: [],
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
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await saleService.getSales(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas');
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  'sales/fetchSaleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const sale = await saleService.getSaleById(id);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar venta');
    }
  }
);

export const fetchSaleByNumber = createAsyncThunk(
  'sales/fetchSaleByNumber',
  async (saleNumber: string, { rejectWithValue }) => {
    try {
      const sale = await saleService.getSaleByNumber(saleNumber);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar venta');
    }
  }
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData: {
    clientId?: number;
    items: Array<{ productId: number; quantity: number; unitPrice: number; discount?: number }>;
    payments: SalePayment[];
    paymentStatus?: PaymentStatus;
    discount?: number;
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const sale = await saleService.createSale(saleData);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear venta');
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const sale = await saleService.updateSale(id, data);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar venta');
    }
  }
);

export const cancelSale = createAsyncThunk(
  'sales/cancelSale',
  async ({ id, reason }: { id: number; reason?: string }, { rejectWithValue }) => {
    try {
      const sale = await saleService.cancelSale(id, reason);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar venta');
    }
  }
);

export const refundSale = createAsyncThunk(
  'sales/refundSale',
  async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      const sale = await saleService.refundSale(id, reason);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al reembolsar venta');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'sales/updatePaymentStatus',
  async ({ id, status }: { id: number; status: PaymentStatus }, { rejectWithValue }) => {
    try {
      const sale = await saleService.updatePaymentStatus(id, status);
      return sale;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar estado de pago');
    }
  }
);

export const fetchSaleStats = createAsyncThunk(
  'sales/fetchSaleStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await saleService.getSaleStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchSalesWithPendingPayment = createAsyncThunk(
  'sales/fetchSalesWithPendingPayment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await saleService.getSalesWithPendingPayment();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas pendientes');
    }
  }
);

export const fetchSalesByClient = createAsyncThunk(
  'sales/fetchSalesByClient',
  async (clientId: number, { rejectWithValue }) => {
    try {
      const response = await saleService.getSalesByClient(clientId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas del cliente');
    }
  }
);

export const searchSales = createAsyncThunk(
  'sales/searchSales',
  async (term: string, { rejectWithValue }) => {
    try {
      const response = await saleService.searchSales(term);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al buscar ventas');
    }
  }
);

export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id: number, { rejectWithValue }) => {
    try {
      await saleService.deleteSale(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar venta');
    }
  }
);

// Slice
const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    // Cart management
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
        existingItem.total = existingItem.subtotal - (existingItem.discount || 0);
      } else {
        state.cart.push(action.payload);
      }
      
      saleSlice.caseReducers.calculateCartTotals(state);
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
      saleSlice.caseReducers.calculateCartTotals(state);
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.cart.find(item => item.productId === action.payload.productId);
      
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = item.quantity * item.unitPrice;
        item.total = item.subtotal - (item.discount || 0);
        saleSlice.caseReducers.calculateCartTotals(state);
      }
    },
    
    updateCartItemDiscount: (state, action: PayloadAction<{ productId: number; discount: number }>) => {
      const item = state.cart.find(item => item.productId === action.payload.productId);
      
      if (item) {
        item.discount = action.payload.discount;
        item.total = item.subtotal - item.discount;
        saleSlice.caseReducers.calculateCartTotals(state);
      }
    },
    
    clearCart: (state) => {
      state.cart = [];
      state.cartTotal = 0;
      state.cartSubtotal = 0;
      state.cartTax = 0;
      state.cartDiscount = 0;
      state.selectedClient = null;
      state.payments = [];
    },
    
    setSelectedClient: (state, action: PayloadAction<number | null>) => {
      state.selectedClient = action.payload;
    },
    
    addPayment: (state, action: PayloadAction<SalePayment>) => {
      state.payments.push(action.payload);
    },
    
    removePayment: (state, action: PayloadAction<number>) => {
      state.payments.splice(action.payload, 1);
    },
    
    updatePayment: (state, action: PayloadAction<{ index: number; payment: SalePayment }>) => {
      state.payments[action.payload.index] = action.payload.payment;
    },
    
    clearPayments: (state) => {
      state.payments = [];
    },
    
    setCartDiscount: (state, action: PayloadAction<number>) => {
      state.cartDiscount = action.payload;
      saleSlice.caseReducers.calculateCartTotals(state);
    },
    
    calculateCartTotals: (state) => {
      state.cartSubtotal = state.cart.reduce((total, item) => total + item.subtotal, 0);
      const itemDiscounts = state.cart.reduce((total, item) => total + (item.discount || 0), 0);
      const subtotalAfterItemDiscounts = state.cartSubtotal - itemDiscounts;
      const subtotalAfterCartDiscount = subtotalAfterItemDiscounts - state.cartDiscount;
      state.cartTax = subtotalAfterCartDiscount * 0.19; // 19% IVA
      state.cartTotal = subtotalAfterCartDiscount + state.cartTax;
    },
    
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setCurrentSale: (state, action: PayloadAction<Sale>) => {
      state.currentSale = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action: PayloadAction<PaginatedResponse<Sale>>) => {
        state.loading = false;
        state.sales = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sale by ID
      .addCase(fetchSaleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sale by number
      .addCase(fetchSaleByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleByNumber.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create sale
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        state.sales.unshift(action.payload);
        state.currentSale = action.payload;
        // Clear cart after successful sale
        saleSlice.caseReducers.clearCart(state);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.currentSale?.id === action.payload.id) {
          state.currentSale = action.payload;
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel sale
      .addCase(cancelSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.currentSale?.id === action.payload.id) {
          state.currentSale = action.payload;
        }
      })
      .addCase(cancelSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Refund sale
      .addCase(refundSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.currentSale?.id === action.payload.id) {
          state.currentSale = action.payload;
        }
      })
      .addCase(refundSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.currentSale?.id === action.payload.id) {
          state.currentSale = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sale stats
      .addCase(fetchSaleStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSaleStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sales with pending payment
      .addCase(fetchSalesWithPendingPayment.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.sales = action.payload;
      })
      
      // Fetch sales by client
      .addCase(fetchSalesByClient.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.sales = action.payload;
      })
      
      // Search sales
      .addCase(searchSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.sales = action.payload;
      })
      
      // Delete sale
      .addCase(deleteSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSale.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.sales = state.sales.filter(s => s.id !== action.payload);
        if (state.currentSale?.id === action.payload) {
          state.currentSale = null;
        }
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemDiscount,
  clearCart,
  setSelectedClient,
  addPayment,
  removePayment,
  updatePayment,
  clearPayments,
  setCartDiscount,
  calculateCartTotals,
  clearCurrentSale,
  clearError,
  setCurrentSale,
} = saleSlice.actions;

export default saleSlice.reducer;
