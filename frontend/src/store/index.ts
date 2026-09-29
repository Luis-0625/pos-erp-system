import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import saleReducer from './slices/saleSlice';
import purchaseReducer from './slices/purchaseSlice';
import clientReducer from './slices/clientSlice';
import supplierReducer from './slices/supplierSlice';
import portfolioReducer from './slices/portfolioSlice';
import reportReducer from './slices/reportSlice';
import configReducer from './slices/configSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    products: productReducer,
    categories: categoryReducer,
    sales: saleReducer,
    purchases: purchaseReducer,
    clients: clientReducer,
    suppliers: supplierReducer,
    portfolio: portfolioReducer,
    reports: reportReducer,
    config: configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas de acción en la verificación de serialización
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
