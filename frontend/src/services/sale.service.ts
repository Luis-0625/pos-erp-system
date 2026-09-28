import apiService from './api.service';
import { Sale, SaleItem, PaginatedResponse, QueryFilters, ApiResponse, PaymentStatus } from '../types';

/**
 * Sale Service
 * Gestiona todas las operaciones relacionadas con ventas
 */
class SaleService {
  private readonly BASE_URL = '/sales';

  /**
   * Obtener lista de ventas con filtros y paginación
   */
  async getSales(filters: QueryFilters = {}): Promise<PaginatedResponse<Sale>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.clientId) params.append('clientId', filters.clientId.toString());
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

    const response = await apiService.get<PaginatedResponse<Sale>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener una venta por ID
   */
  async getSaleById(id: number): Promise<Sale> {
    const response = await apiService.get<ApiResponse<Sale>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener una venta por número de venta
   */
  async getSaleByNumber(saleNumber: string): Promise<Sale> {
    const response = await apiService.get<ApiResponse<Sale>>(
      `${this.BASE_URL}/number/${saleNumber}`
    );
    return response.data!;
  }

  /**
   * Crear una nueva venta
   */
  async createSale(saleData: {
    clientId?: number;
    items: Partial<SaleItem>[];
    paymentMethod: string;
    notes?: string;
    discount?: number;
  }): Promise<Sale> {
    const response = await apiService.post<ApiResponse<Sale>>(
      this.BASE_URL,
      saleData
    );
    return response.data!;
  }

  /**
   * Actualizar una venta existente
   */
  async updateSale(id: number, saleData: Partial<Sale>): Promise<Sale> {
    const response = await apiService.put<ApiResponse<Sale>>(
      `${this.BASE_URL}/${id}`,
      saleData
    );
    return response.data!;
  }

  /**
   * Cancelar una venta
   */
  async cancelSale(id: number, reason?: string): Promise<Sale> {
    const response = await apiService.patch<ApiResponse<Sale>>(
      `${this.BASE_URL}/${id}/cancel`,
      { reason }
    );
    return response.data!;
  }

  /**
   * Procesar devolución de una venta
   */
  async refundSale(id: number, reason: string): Promise<Sale> {
    const response = await apiService.post<ApiResponse<Sale>>(
      `${this.BASE_URL}/${id}/refund`,
      { reason }
    );
    return response.data!;
  }

  /**
   * Actualizar estado de pago de una venta
   */
  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Sale> {
    const response = await apiService.patch<ApiResponse<Sale>>(
      `${this.BASE_URL}/${id}/payment-status`,
      { paymentStatus: status }
    );
    return response.data!;
  }

  /**
   * Obtener estadísticas de ventas
   */
  async getSaleStats(startDate?: string, endDate?: string): Promise<{
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
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/stats?${params.toString()}`
    );
    return response.data!;
  }

  /**
   * Obtener ventas con pago pendiente
   */
  async getSalesWithPendingPayment(): Promise<Sale[]> {
    const response = await apiService.get<ApiResponse<Sale[]>>(
      `${this.BASE_URL}/pending-payment`
    );
    return response.data!;
  }

  /**
   * Obtener ventas por cliente
   */
  async getSalesByClient(clientId: number): Promise<Sale[]> {
    const response = await apiService.get<ApiResponse<Sale[]>>(
      `${this.BASE_URL}/client/${clientId}`
    );
    return response.data!;
  }

  /**
   * Buscar ventas por término
   */
  async searchSales(term: string): Promise<Sale[]> {
    const response = await apiService.get<ApiResponse<Sale[]>>(
      `${this.BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data!;
  }

  /**
   * Eliminar una venta (solo administradores)
   */
  async deleteSale(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new SaleService();
