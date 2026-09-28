/**
 * Redux Slices - Barrel Export
 * Exporta todos los Redux slices y sus acciones
 */

// Auth Slice
export { default as authReducer, login, logout, setUser } from './authSlice';

// Product Slice
export {
  default as productReducer,
  fetchProducts,
  fetchProductById,
  fetchProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchLowStockProducts,
  updateProductStock,
  searchProducts,
  fetchProductStats,
  toggleProductStatus,
  clearCurrentProduct as clearCurrentProductAction,
  clearError as clearProductError,
  setCurrentProduct,
} from './productSlice';

// Sale Slice
export {
  default as saleReducer,
  fetchSales,
  fetchSaleById,
  fetchSaleByNumber,
  createSale,
  updateSale,
  cancelSale,
  refundSale,
  updatePaymentStatus as updateSalePaymentStatus,
  fetchSalesWithPendingPayment,
  fetchSalesByClient,
  searchSales,
  fetchSaleStats,
  deleteSale,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemDiscount,
  clearCart,
  setSelectedClient,
  setPaymentMethod,
  setCartDiscount,
  calculateCartTotals,
} from './saleSlice';

// Purchase Slice
export {
  default as purchaseReducer,
  fetchPurchases,
  fetchPurchaseById,
  fetchPurchaseByNumber,
  createPurchase,
  updatePurchase,
  cancelPurchase,
  refundPurchase,
  updatePaymentStatus as updatePurchasePaymentStatus,
  fetchPurchasesWithPendingPayment,
  fetchPurchasesBySupplier,
  searchPurchases,
  fetchPurchaseStats,
  deletePurchase,
} from './purchaseSlice';

// Client Slice
export {
  default as clientReducer,
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientBalance,
  updateClientCreditLimit,
  fetchClientsWithDebt,
  searchClients,
  fetchClientStats,
  toggleClientStatus,
  checkClientCredit,
} from './clientSlice';

// Supplier Slice
export {
  default as supplierReducer,
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  updateSupplierBalance,
  updateSupplierCreditLimit,
  updateSupplierPaymentTerms,
  fetchSuppliersWithDebt,
  searchSuppliers,
  fetchSupplierStats,
  toggleSupplierStatus,
  fetchTopSuppliers,
} from './supplierSlice';

// Portfolio Slice
export {
  default as portfolioReducer,
  fetchAccountsReceivable,
  fetchAccountsPayable,
  fetchOverdueReceivables,
  fetchOverduePayables,
  createPayment,
  fetchPayments,
  cancelPayment,
  fetchPortfolioStats,
  fetchCashFlow,
} from './portfolioSlice';

// Report Slice
export {
  default as reportReducer,
  fetchSalesReport,
  fetchSalesByProduct as fetchSalesByProductReport,
  fetchSalesByClient as fetchSalesByClientReport,
  fetchPurchasesReport,
  fetchPurchasesBySupplier as fetchPurchasesBySupplierReport,
  fetchInventoryReport,
  fetchProfitAndLossReport,
  fetchCashFlowReport,
  fetchAccountsReceivableReport,
  fetchAccountsPayableReport,
  fetchDashboardReport,
  clearReports,
  clearError as clearReportError,
} from './reportSlice';

// Config Slice
export {
  default as configReducer,
  fetchActiveCompany,
  fetchCompanyById,
  createCompany,
  updateCompany,
  updateCompanyLogo,
  fetchTaxRates,
  fetchTaxRateById,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
  setDefaultTaxRate,
  fetchCurrencySettings,
  updateCurrencySettings,
  fetchInvoiceSettings,
  updateInvoiceSettings,
  fetchAllSettings,
  setCurrentTaxRate,
  clearCurrentTaxRate,
  clearError as clearConfigError,
} from './configSlice';
