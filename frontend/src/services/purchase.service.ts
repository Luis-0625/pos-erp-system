import apiService from './api.service';
import { Purchase, PurchaseItem, PaginatedResponse, QueryFilters, ApiResponse, PaymentStatus } from '../types';

/**
 * Purchase Service
 * Gestiona todas las operaciones relacionadas con compras
 */
class PurchaseService {
  private readonly BASE_URL = '/purchases';

  /**
   * Obtener lista de compras con filtros y paginación
   */
  async getPurchases(filters: QueryFilters = {}): Promise<PaginatedResponse<Purchase>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.supplierId) params.append('supplierId', filters.supplierId.toString());
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

    const response = await apiService.get<PaginatedResponse<Purchase>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener una compra por ID
   */
  async getPurchaseById(id: number): Promise<Purchase> {
    const response = await apiService.get<ApiResponse<Purchase>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener una compra por número de compra
   */
  async getPurchaseByNumber(purchaseNumber: string): Promise<Purchase> {
    const response = await apiService.get<ApiResponse<Purchase>>(
      `${this.BASE_URL}/number/${purchaseNumber}`
    );
    return response.data!;
  }

  /**
   * Crear una nueva compra
   */
  async createPurchase(purchaseData: {
    supplierId: number;
    items: Partial<PurchaseItem>[];
    paymentMethod: string;
    notes?: string;
    discount?: number;
    invoiceNumber?: string;
  }): Promise<Purchase> {
    const response = await apiService.post<ApiResponse<Purchase>>(
      this.BASE_URL,
      purchaseData
    );
    return response.data!;
  }

  /**
   * Actualizar una compra existente
   */
  async updatePurchase(id: number, purchaseData: Partial<Purchase>): Promise<Purchase> {
    const response = await apiService.put<ApiResponse<Purchase>>(
      `${this.BASE_URL}/${id}`,
      purchaseData
    );
    return response.data!;
  }

  /**
   * Cancelar una compra
   */
  async cancelPurchase(id: number, reason?: string): Promise<Purchase> {
    const response = await apiService.patch<ApiResponse<Purchase>>(
      `${this.BASE_URL}/${id}/cancel`,
      { reason }
    );
    return response.data!;
  }

  /**
   * Procesar devolución de una compra
   */
  async refundPurchase(id: number, reason: string): Promise<Purchase> {
    const response = await apiService.post<ApiResponse<Purchase>>(
      `${this.BASE_URL}/${id}/refund`,
      { reason }
    );
    return response.data!;
  }

  /**
   * Actualizar estado de pago de una compra
   */
  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Purchase> {
    const response = await apiService.patch<ApiResponse<Purchase>>(
      `${this.BASE_URL}/${id}/payment-status`,
      { paymentStatus: status }
    );
    return response.data!;
  }

  /**
   * Obtener estadísticas de compras
   */
  async getPurchaseStats(startDate?: string, endDate?: string): Promise<{
    totalPurchases: number;
    completedPurchases: number;
    cancelledPurchases: number;
    pendingPayments: number;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiService.get<ApiResponse<{
      totalPurchases: number;
      completedPurchases: number;
      cancelledPurchases: number;
      pendingPayments: number;
      totalAmount: number;
      pendingAmount: number;
      paidAmount: number;
    }>>(
      `${this.BASE_URL}/stats?${params.toString()}`
    );
    return response.data!;
  }

  /**
   * Obtener compras con pago pendiente
   */
  async getPurchasesWithPendingPayment(): Promise<Purchase[]> {
    const response = await apiService.get<ApiResponse<Purchase[]>>(
      `${this.BASE_URL}/pending-payment`
    );
    return response.data!;
  }

  /**
   * Obtener compras por proveedor
   */
  async getPurchasesBySupplier(supplierId: number): Promise<Purchase[]> {
    const response = await apiService.get<ApiResponse<Purchase[]>>(
      `${this.BASE_URL}/supplier/${supplierId}`
    );
    return response.data!;
  }

  /**
   * Buscar compras por término
   */
  async searchPurchases(term: string): Promise<Purchase[]> {
    const response = await apiService.get<ApiResponse<Purchase[]>>(
      `${this.BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data!;
  }

  /**
   * Eliminar una compra (solo administradores)
   */
  async deletePurchase(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new PurchaseService();
