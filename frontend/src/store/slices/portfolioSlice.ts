import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import portfolioService from '../../services/portfolio.service';
import { AccountReceivable, AccountPayable, Payment, PaginatedResponse } from '../../types';

interface PortfolioState {
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
  payments: Payment[];
  currentAccountReceivable: AccountReceivable | null;
  currentAccountPayable: AccountPayable | null;
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    receivables: {
      total: number;
      paid: number;
      pending: number;
      overdue: number;
      count: number;
    };
    payables: {
      total: number;
      paid: number;
      pending: number;
      overdue: number;
      count: number;
    };
    netPosition: number;
  } | null;
  cashFlow: {
    inflows: Array<{ date: Date; amount: number }>;
    outflows: Array<{ date: Date; amount: number }>;
    totalInflows: number;
    totalOutflows: number;
  } | null;
}

const initialState: PortfolioState = {
  accountsReceivable: [],
  accountsPayable: [],
  payments: [],
  currentAccountReceivable: null,
  currentAccountPayable: null,
  currentPayment: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  stats: null,
  cashFlow: null,
};

// Async thunks - Accounts Receivable
export const fetchAccountsReceivable = createAsyncThunk(
  'portfolio/fetchAccountsReceivable',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getAccountsReceivable(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas por cobrar');
    }
  }
);

export const fetchAccountReceivableById = createAsyncThunk(
  'portfolio/fetchAccountReceivableById',
  async (id: number, { rejectWithValue }) => {
    try {
      const account = await portfolioService.getAccountReceivableById(id);
      return account;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuenta por cobrar');
    }
  }
);

export const fetchOverdueReceivables = createAsyncThunk(
  'portfolio/fetchOverdueReceivables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getOverdueReceivables();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas vencidas');
    }
  }
);

// Async thunks - Accounts Payable
export const fetchAccountsPayable = createAsyncThunk(
  'portfolio/fetchAccountsPayable',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getAccountsPayable(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas por pagar');
    }
  }
);

export const fetchAccountPayableById = createAsyncThunk(
  'portfolio/fetchAccountPayableById',
  async (id: number, { rejectWithValue }) => {
    try {
      const account = await portfolioService.getAccountPayableById(id);
      return account;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuenta por pagar');
    }
  }
);

export const fetchOverduePayables = createAsyncThunk(
  'portfolio/fetchOverduePayables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getOverduePayables();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cuentas vencidas');
    }
  }
);

// Async thunks - Payments
export const createPayment = createAsyncThunk(
  'portfolio/createPayment',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const payment = await portfolioService.createPayment(paymentData);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear pago');
    }
  }
);

export const fetchPayments = createAsyncThunk(
  'portfolio/fetchPayments',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getPayments(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'portfolio/fetchPaymentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const payment = await portfolioService.getPaymentById(id);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pago');
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'portfolio/cancelPayment',
  async (id: number, { rejectWithValue }) => {
    try {
      await portfolioService.cancelPayment(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar pago');
    }
  }
);

// Async thunks - Stats and Reports
export const fetchPortfolioStats = createAsyncThunk(
  'portfolio/fetchPortfolioStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await portfolioService.getPortfolioStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const fetchCashFlow = createAsyncThunk(
  'portfolio/fetchCashFlow',
  async (days: number = 30, { rejectWithValue }) => {
    try {
      const cashFlow = await portfolioService.getCashFlow(days);
      return cashFlow;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar flujo de caja');
    }
  }
);

// Slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearCurrentAccountReceivable: (state) => {
      state.currentAccountReceivable = null;
    },
    clearCurrentAccountPayable: (state) => {
      state.currentAccountPayable = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch accounts receivable
      .addCase(fetchAccountsReceivable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsReceivable.fulfilled, (state, action: PayloadAction<PaginatedResponse<AccountReceivable>>) => {
        state.loading = false;
        state.accountsReceivable = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchAccountsReceivable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch account receivable by ID
      .addCase(fetchAccountReceivableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountReceivableById.fulfilled, (state, action: PayloadAction<AccountReceivable>) => {
        state.loading = false;
        state.currentAccountReceivable = action.payload;
      })
      .addCase(fetchAccountReceivableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch overdue receivables
      .addCase(fetchOverdueReceivables.fulfilled, (state, action: PayloadAction<AccountReceivable[]>) => {
        state.loading = false;
        state.accountsReceivable = action.payload;
      })
      
      // Fetch accounts payable
      .addCase(fetchAccountsPayable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsPayable.fulfilled, (state, action: PayloadAction<PaginatedResponse<AccountPayable>>) => {
        state.loading = false;
        state.accountsPayable = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchAccountsPayable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch account payable by ID
      .addCase(fetchAccountPayableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountPayableById.fulfilled, (state, action: PayloadAction<AccountPayable>) => {
        state.loading = false;
        state.currentAccountPayable = action.payload;
      })
      .addCase(fetchAccountPayableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch overdue payables
      .addCase(fetchOverduePayables.fulfilled, (state, action: PayloadAction<AccountPayable[]>) => {
        state.loading = false;
        state.accountsPayable = action.payload;
      })
      
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.loading = false;
        state.payments.unshift(action.payload);
        state.currentPayment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Payment>>) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel payment
      .addCase(cancelPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.payments = state.payments.filter(p => p.id !== action.payload);
        if (state.currentPayment?.id === action.payload) {
          state.currentPayment = null;
        }
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch portfolio stats
      .addCase(fetchPortfolioStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Fetch cash flow
      .addCase(fetchCashFlow.fulfilled, (state, action) => {
        state.cashFlow = action.payload;
      });
  },
});

export const {
  clearCurrentAccountReceivable,
  clearCurrentAccountPayable,
  clearCurrentPayment,
  clearError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
