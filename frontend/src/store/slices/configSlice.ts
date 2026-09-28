import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import configService from '../../services/config.service';

interface Company {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  slogan?: string;
  legalRepresentative: string;
  economicActivity: string;
  taxRegime: string;
  isActive: boolean;
}

interface TaxRate {
  id: number;
  name: string;
  description?: string;
  rate: number;
  type: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  isDefault: boolean;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

interface CurrencySettings {
  code: string;
  symbol: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  footerText?: string;
  showLogo: boolean;
  showTaxBreakdown: boolean;
}

interface ConfigState {
  company: Company | null;
  taxRates: TaxRate[];
  currentTaxRate: TaxRate | null;
  currencySettings: CurrencySettings | null;
  invoiceSettings: InvoiceSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  company: null,
  taxRates: [],
  currentTaxRate: null,
  currencySettings: null,
  invoiceSettings: null,
  loading: false,
  error: null,
};

// Async thunks - Company
export const fetchActiveCompany = createAsyncThunk(
  'config/fetchActiveCompany',
  async (_, { rejectWithValue }) => {
    try {
      const company = await configService.getActiveCompany();
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empresa activa');
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'config/fetchCompanyById',
  async (id: number, { rejectWithValue }) => {
    try {
      const company = await configService.getCompanyById(id);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar empresa');
    }
  }
);

export const createCompany = createAsyncThunk(
  'config/createCompany',
  async (companyData: any, { rejectWithValue }) => {
    try {
      const company = await configService.createCompany(companyData);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear empresa');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'config/updateCompany',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const company = await configService.updateCompany(id, data);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar empresa');
    }
  }
);

export const updateCompanyLogo = createAsyncThunk(
  'config/updateCompanyLogo',
  async ({ id, file }: { id: number; file: File }, { rejectWithValue }) => {
    try {
      const company = await configService.updateCompanyLogo(id, file);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar logo');
    }
  }
);

// Async thunks - Tax Rates
export const fetchTaxRates = createAsyncThunk(
  'config/fetchTaxRates',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const taxRates = await configService.getTaxRates(filters);
      return taxRates;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tasas de impuesto');
    }
  }
);

export const fetchTaxRateById = createAsyncThunk(
  'config/fetchTaxRateById',
  async (id: number, { rejectWithValue }) => {
    try {
      const taxRate = await configService.getTaxRateById(id);
      return taxRate;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar tasa de impuesto');
    }
  }
);

export const createTaxRate = createAsyncThunk(
  'config/createTaxRate',
  async (taxRateData: any, { rejectWithValue }) => {
    try {
      const taxRate = await configService.createTaxRate(taxRateData);
      return taxRate;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear tasa de impuesto');
    }
  }
);

export const updateTaxRate = createAsyncThunk(
  'config/updateTaxRate',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const taxRate = await configService.updateTaxRate(id, data);
      return taxRate;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar tasa de impuesto');
    }
  }
);

export const deleteTaxRate = createAsyncThunk(
  'config/deleteTaxRate',
  async (id: number, { rejectWithValue }) => {
    try {
      await configService.deleteTaxRate(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar tasa de impuesto');
    }
  }
);

export const setDefaultTaxRate = createAsyncThunk(
  'config/setDefaultTaxRate',
  async (id: number, { rejectWithValue }) => {
    try {
      const taxRate = await configService.setDefaultTaxRate(id);
      return taxRate;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al establecer tasa por defecto');
    }
  }
);

// Async thunks - Settings
export const fetchCurrencySettings = createAsyncThunk(
  'config/fetchCurrencySettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await configService.getCurrencySettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar configuración de moneda');
    }
  }
);

export const updateCurrencySettings = createAsyncThunk(
  'config/updateCurrencySettings',
  async (settings: CurrencySettings, { rejectWithValue }) => {
    try {
      const updated = await configService.updateCurrencySettings(settings);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar configuración de moneda');
    }
  }
);

export const fetchInvoiceSettings = createAsyncThunk(
  'config/fetchInvoiceSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await configService.getInvoiceSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar configuración de facturación');
    }
  }
);

export const updateInvoiceSettings = createAsyncThunk(
  'config/updateInvoiceSettings',
  async (settings: InvoiceSettings, { rejectWithValue }) => {
    try {
      const updated = await configService.updateInvoiceSettings(settings);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar configuración de facturación');
    }
  }
);

export const fetchAllSettings = createAsyncThunk(
  'config/fetchAllSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await configService.getAllSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar configuraciones');
    }
  }
);

// Slice
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTaxRate: (state, action: PayloadAction<TaxRate>) => {
      state.currentTaxRate = action.payload;
    },
    clearCurrentTaxRate: (state) => {
      state.currentTaxRate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active company
      .addCase(fetchActiveCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchActiveCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch company by ID
      .addCase(fetchCompanyById.fulfilled, (state, action: PayloadAction<Company>) => {
        state.company = action.payload;
      })
      
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update company logo
      .addCase(updateCompanyLogo.fulfilled, (state, action: PayloadAction<Company>) => {
        state.company = action.payload;
      })
      
      // Fetch tax rates
      .addCase(fetchTaxRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxRates.fulfilled, (state, action: PayloadAction<TaxRate[]>) => {
        state.loading = false;
        state.taxRates = action.payload;
      })
      .addCase(fetchTaxRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tax rate by ID
      .addCase(fetchTaxRateById.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        state.currentTaxRate = action.payload;
      })
      
      // Create tax rate
      .addCase(createTaxRate.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        state.taxRates.push(action.payload);
        state.currentTaxRate = action.payload;
      })
      
      // Update tax rate
      .addCase(updateTaxRate.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        const index = state.taxRates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.taxRates[index] = action.payload;
        }
        if (state.currentTaxRate?.id === action.payload.id) {
          state.currentTaxRate = action.payload;
        }
      })
      
      // Delete tax rate
      .addCase(deleteTaxRate.fulfilled, (state, action: PayloadAction<number>) => {
        state.taxRates = state.taxRates.filter(t => t.id !== action.payload);
        if (state.currentTaxRate?.id === action.payload) {
          state.currentTaxRate = null;
        }
      })
      
      // Set default tax rate
      .addCase(setDefaultTaxRate.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        // Clear previous default
        state.taxRates = state.taxRates.map(t => ({ ...t, isDefault: false }));
        // Set new default
        const index = state.taxRates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.taxRates[index] = action.payload;
        }
      })
      
      // Fetch currency settings
      .addCase(fetchCurrencySettings.fulfilled, (state, action: PayloadAction<CurrencySettings>) => {
        state.currencySettings = action.payload;
      })
      
      // Update currency settings
      .addCase(updateCurrencySettings.fulfilled, (state, action: PayloadAction<CurrencySettings>) => {
        state.currencySettings = action.payload;
      })
      
      // Fetch invoice settings
      .addCase(fetchInvoiceSettings.fulfilled, (state, action: PayloadAction<InvoiceSettings>) => {
        state.invoiceSettings = action.payload;
      })
      
      // Update invoice settings
      .addCase(updateInvoiceSettings.fulfilled, (state, action: PayloadAction<InvoiceSettings>) => {
        state.invoiceSettings = action.payload;
      })
      
      // Fetch all settings
      .addCase(fetchAllSettings.fulfilled, (state, action) => {
        state.company = action.payload.company;
        state.taxRates = action.payload.taxRates;
        state.currencySettings = action.payload.currencySettings;
        state.invoiceSettings = action.payload.invoiceSettings;
      });
  },
});

export const {
  clearError,
  setCurrentTaxRate,
  clearCurrentTaxRate,
} = configSlice.actions;

export default configSlice.reducer;
