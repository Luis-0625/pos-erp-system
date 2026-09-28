import apiService from './api.service';
import { ApiResponse, DashboardStats, ChartData } from '../types';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface SalesReportData {
  totalSales: number;
  totalAmount: number;
  averageTicket: number;
  sales: any[];
  dailySales: ChartData[];
}

interface PurchasesReportData {
  totalPurchases: number;
  totalAmount: number;
  averagePurchase: number;
  purchases: any[];
  dailyPurchases: ChartData[];
}

interface InventoryReportData {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: any[];
  outOfStockProducts: any[];
  byCategory: any[];
}

interface ProfitLossReportData {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

/**
 * Report Service
 * Gestiona todas las operaciones relacionadas con reportes y análisis
 */
class ReportService {
  private readonly BASE_URL = '/reports';

  /**
   * Obtener reporte de ventas
   */
  async getSalesReport(dateRange: DateRange): Promise<SalesReportData> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<SalesReportData>>(
      `${this.BASE_URL}/sales?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de ventas por producto
   */
  async getSalesByProduct(dateRange: DateRange): Promise<{
    products: Array<{
      productId: number;
      productName: string;
      quantitySold: number;
      totalRevenue: number;
    }>;
  }> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/sales/by-product?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de ventas por cliente
   */
  async getSalesByClient(dateRange: DateRange): Promise<{
    clients: Array<{
      clientId: number;
      clientName: string;
      totalPurchases: number;
      totalAmount: number;
    }>;
  }> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/sales/by-client?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de compras
   */
  async getPurchasesReport(dateRange: DateRange): Promise<PurchasesReportData> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<PurchasesReportData>>(
      `${this.BASE_URL}/purchases?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de compras por proveedor
   */
  async getPurchasesBySupplier(dateRange: DateRange): Promise<{
    suppliers: Array<{
      supplierId: number;
      supplierName: string;
      totalPurchases: number;
      totalAmount: number;
    }>;
  }> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/purchases/by-supplier?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de inventario
   */
  async getInventoryReport(): Promise<InventoryReportData> {
    const response = await apiService.get<ApiResponse<InventoryReportData>>(
      `${this.BASE_URL}/inventory`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de ganancias y pérdidas
   */
  async getProfitAndLossReport(dateRange: DateRange): Promise<ProfitLossReportData> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<ProfitLossReportData>>(
      `${this.BASE_URL}/profit-loss?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de flujo de caja
   */
  async getCashFlowReport(dateRange: DateRange): Promise<{
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    inflowByMethod: any;
    outflowByMethod: any;
    dailyCashFlow: ChartData[];
  }> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/cash-flow?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de cuentas por cobrar
   */
  async getAccountsReceivableReport(): Promise<{
    totalReceivable: number;
    overdueAmount: number;
    currentAmount: number;
    ageAnalysis: any;
    accounts: any[];
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/accounts-receivable`
    );
    return response.data.data;
  }

  /**
   * Obtener reporte de cuentas por pagar
   */
  async getAccountsPayableReport(): Promise<{
    totalPayable: number;
    overdueAmount: number;
    currentAmount: number;
    ageAnalysis: any;
    accounts: any[];
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/accounts-payable`
    );
    return response.data.data;
  }

  /**
   * Obtener datos del dashboard
   */
  async getDashboardReport(dateRange: DateRange): Promise<DashboardStats> {
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

    const response = await apiService.get<ApiResponse<DashboardStats>>(
      `${this.BASE_URL}/dashboard?${params.toString()}`
    );
    return response.data.data;
  }
}

export default new ReportService();
