import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import clientService from '../../services/client.service';
import { Client, PaginatedResponse } from '../../types';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalClients: number;
    totalPersons: number;
    totalCompanies: number;
    clientsWithDebt: number;
    totalDebt: number;
    totalCreditLimit: number;
    availableCredit: number;
  } | null;
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
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
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await clientService.getClients(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar clientes');
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: number, { rejectWithValue }) => {
    try {
      const client = await clientService.getClientById(id);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cliente');
    }
  }
);

export const fetchClientByDocument = createAsyncThunk(
  'clients/fetchClientByDocument',
  async (documentNumber: string, { rejectWithValue }) => {
    try {
      const client = await clientService.getClientByDocument(documentNumber);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cliente');
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData: any, { rejectWithValue }) => {
    try {
      const client = await clientService.createClient(clientData);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear cliente');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const client = await clientService.updateClient(id, data);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar cliente');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: number, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar cliente');
    }
  }
);

export const updateClientBalance = createAsyncThunk(
  'clients/updateClientBalance',
  async ({ id, amount, type }: { id: number; amount: number; type: 'add' | 'subtract' }, { rejectWithValue }) => {
    try {
      const client = await clientService.updateBalance(id, amount, type);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar balance');
    }
  }
);

export const updateClientCreditLimit = createAsyncThunk(
  'clients/updateClientCreditLimit',
  async ({ id, newLimit }: { id: number; newLimit: number }, { rejectWithValue }) => {
    try {
      const client = await clientService.updateCreditLimit(id, newLimit);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar límite de crédito');
    }
  }
);

export const fetchClientsWithDebt = createAsyncThunk(
  'clients/fetchClientsWithDebt',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getClientsWithDebt();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar clientes con deuda');
    }
  }
);

export const searchClients = createAsyncThunk(
  'clients/searchClients',
  async (term: string, { rejectWithValue }) => {
    try {
      const response = await clientService.searchClients(term);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al buscar clientes');
    }
  }
);

export const fetchClientStats = createAsyncThunk(
  'clients/fetchClientStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await clientService.getClientStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const toggleClientStatus = createAsyncThunk(
  'clients/toggleClientStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const client = await clientService.toggleClientStatus(id);
      return client;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado');
    }
  }
);

export const checkClientCredit = createAsyncThunk(
  'clients/checkClientCredit',
  async ({ id, amount }: { id: number; amount: number }, { rejectWithValue }) => {
    try {
      const canPurchase = await clientService.canPurchaseOnCredit(id, amount);
      return { id, canPurchase };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar crédito');
    }
  }
);

// Slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentClient: (state, action: PayloadAction<Client>) => {
      state.currentClient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<PaginatedResponse<Client>>) => {
        state.loading = false;
        state.clients = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch client by document
      .addCase(fetchClientByDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientByDocument.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientByDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.clients.unshift(action.payload);
        state.currentClient = action.payload;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.clients = state.clients.filter(c => c.id !== action.payload);
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update client balance
      .addCase(updateClientBalance.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      
      // Update client credit limit
      .addCase(updateClientCreditLimit.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      
      // Fetch clients with debt
      .addCase(fetchClientsWithDebt.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.clients = action.payload;
      })
      
      // Search clients
      .addCase(searchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.clients = action.payload;
      })
      
      // Fetch client stats
      .addCase(fetchClientStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Toggle client status
      .addCase(toggleClientStatus.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      });
  },
});

export const {
  clearCurrentClient,
  clearError,
  setCurrentClient,
} = clientSlice.actions;

export default clientSlice.reducer;
