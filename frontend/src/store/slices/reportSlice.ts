import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import reportService from '../../services/report.service';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ReportState {
  salesReport: any | null;
  salesByProduct: any | null;
  salesByClient: any | null;
  purchasesReport: any | null;
  purchasesBySupplier: any | null;
  inventoryReport: any | null;
  profitAndLossReport: any | null;
  cashFlowReport: any | null;
  accountsReceivableReport: any | null;
  accountsPayableReport: any | null;
  dashboardReport: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  salesReport: null,
  salesByProduct: null,
  salesByClient: null,
  purchasesReport: null,
  purchasesBySupplier: null,
  inventoryReport: null,
  profitAndLossReport: null,
  cashFlowReport: null,
  accountsReceivableReport: null,
  accountsPayableReport: null,
  dashboardReport: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSalesReport = createAsyncThunk(
  'reports/fetchSalesReport',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getSalesReport(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de ventas');
    }
  }
);

export const fetchSalesByProduct = createAsyncThunk(
  'reports/fetchSalesByProduct',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getSalesByProduct(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas por producto');
    }
  }
);

export const fetchSalesByClient = createAsyncThunk(
  'reports/fetchSalesByClient',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getSalesByClient(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas por cliente');
    }
  }
);

export const fetchPurchasesReport = createAsyncThunk(
  'reports/fetchPurchasesReport',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getPurchasesReport(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de compras');
    }
  }
);

export const fetchPurchasesBySupplier = createAsyncThunk(
  'reports/fetchPurchasesBySupplier',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getPurchasesBySupplier(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar compras por proveedor');
    }
  }
);

export const fetchInventoryReport = createAsyncThunk(
  'reports/fetchInventoryReport',
  async (_, { rejectWithValue }) => {
    try {
      const report = await reportService.getInventoryReport();
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de inventario');
    }
  }
);

export const fetchProfitAndLossReport = createAsyncThunk(
  'reports/fetchProfitAndLossReport',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getProfitAndLossReport(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de pérdidas y ganancias');
    }
  }
);

export const fetchCashFlowReport = createAsyncThunk(
  'reports/fetchCashFlowReport',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getCashFlowReport(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de flujo de caja');
    }
  }
);

export const fetchAccountsReceivableReport = createAsyncThunk(
  'reports/fetchAccountsReceivableReport',
  async (_, { rejectWithValue }) => {
    try {
      const report = await reportService.getAccountsReceivableReport();
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de cuentas por cobrar');
    }
  }
);

export const fetchAccountsPayableReport = createAsyncThunk(
  'reports/fetchAccountsPayableReport',
  async (_, { rejectWithValue }) => {
    try {
      const report = await reportService.getAccountsPayableReport();
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte de cuentas por pagar');
    }
  }
);

export const fetchDashboardReport = createAsyncThunk(
  'reports/fetchDashboardReport',
  async (dateRange: DateRange, { rejectWithValue }) => {
    try {
      const report = await reportService.getDashboardReport(dateRange);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reporte del dashboard');
    }
  }
);

// Slice
const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReports: (state) => {
      state.salesReport = null;
      state.salesByProduct = null;
      state.salesByClient = null;
      state.purchasesReport = null;
      state.purchasesBySupplier = null;
      state.inventoryReport = null;
      state.profitAndLossReport = null;
      state.cashFlowReport = null;
      state.accountsReceivableReport = null;
      state.accountsPayableReport = null;
      state.dashboardReport = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sales report
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sales by product
      .addCase(fetchSalesByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByProduct = action.payload;
      })
      .addCase(fetchSalesByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sales by client
      .addCase(fetchSalesByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesByClient.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByClient = action.payload;
      })
      .addCase(fetchSalesByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Purchases report
      .addCase(fetchPurchasesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchasesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.purchasesReport = action.payload;
      })
      .addCase(fetchPurchasesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Purchases by supplier
      .addCase(fetchPurchasesBySupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchasesBySupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.purchasesBySupplier = action.payload;
      })
      .addCase(fetchPurchasesBySupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Inventory report
      .addCase(fetchInventoryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Profit and loss report
      .addCase(fetchProfitAndLossReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitAndLossReport.fulfilled, (state, action) => {
        state.loading = false;
        state.profitAndLossReport = action.payload;
      })
      .addCase(fetchProfitAndLossReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cash flow report
      .addCase(fetchCashFlowReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashFlowReport.fulfilled, (state, action) => {
        state.loading = false;
        state.cashFlowReport = action.payload;
      })
      .addCase(fetchCashFlowReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Accounts receivable report
      .addCase(fetchAccountsReceivableReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsReceivableReport.fulfilled, (state, action) => {
        state.loading = false;
        state.accountsReceivableReport = action.payload;
      })
      .addCase(fetchAccountsReceivableReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Accounts payable report
      .addCase(fetchAccountsPayableReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsPayableReport.fulfilled, (state, action) => {
        state.loading = false;
        state.accountsPayableReport = action.payload;
      })
      .addCase(fetchAccountsPayableReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Dashboard report
      .addCase(fetchDashboardReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardReport = action.payload;
      })
      .addCase(fetchDashboardReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearReports,
  clearError,
} = reportSlice.actions;

export default reportSlice.reducer;
