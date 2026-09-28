import apiService from './api.service';
import { AccountReceivable, AccountPayable, Payment, PaginatedResponse, QueryFilters, ApiResponse } from '../types';

/**
 * Portfolio Service
 * Gestiona todas las operaciones relacionadas con cartera (cuentas por cobrar y pagar)
 */
class PortfolioService {
  private readonly BASE_URL = '/portfolio';

  /**
   * Obtener cuentas por cobrar con filtros y paginación
   */
  async getAccountsReceivable(filters: QueryFilters = {}): Promise<PaginatedResponse<AccountReceivable>> {
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

    const response = await apiService.get<PaginatedResponse<AccountReceivable>>(
      `${this.BASE_URL}/receivable?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener cuentas por pagar con filtros y paginación
   */
  async getAccountsPayable(filters: QueryFilters = {}): Promise<PaginatedResponse<AccountPayable>> {
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

    const response = await apiService.get<PaginatedResponse<AccountPayable>>(
      `${this.BASE_URL}/payable?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener una cuenta por cobrar por ID
   */
  async getAccountReceivableById(id: number): Promise<AccountReceivable> {
    const response = await apiService.get<ApiResponse<AccountReceivable>>(
      `${this.BASE_URL}/receivable/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener una cuenta por pagar por ID
   */
  async getAccountPayableById(id: number): Promise<AccountPayable> {
    const response = await apiService.get<ApiResponse<AccountPayable>>(
      `${this.BASE_URL}/payable/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener cuentas por cobrar vencidas
   */
  async getOverdueReceivables(): Promise<AccountReceivable[]> {
    const response = await apiService.get<ApiResponse<AccountReceivable[]>>(
      `${this.BASE_URL}/receivable/overdue`
    );
    return response.data!;
  }

  /**
   * Obtener cuentas por pagar vencidas
   */
  async getOverduePayables(): Promise<AccountPayable[]> {
    const response = await apiService.get<ApiResponse<AccountPayable[]>>(
      `${this.BASE_URL}/payable/overdue`
    );
    return response.data!;
  }

  /**
   * Registrar un pago
   */
  async createPayment(paymentData: {
    accountReceivableId?: number;
    accountPayableId?: number;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }): Promise<Payment> {
    const response = await apiService.post<ApiResponse<Payment>>(
      `${this.BASE_URL}/payments`,
      paymentData
    );
    return response.data!;
  }

  /**
   * Obtener lista de pagos con filtros
   */
  async getPayments(filters: QueryFilters = {}): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

    const response = await apiService.get<PaginatedResponse<Payment>>(
      `${this.BASE_URL}/payments?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener un pago por ID
   */
  async getPaymentById(id: number): Promise<Payment> {
    const response = await apiService.get<ApiResponse<Payment>>(
      `${this.BASE_URL}/payments/${id}`
    );
    return response.data!;
  }

  /**
   * Cancelar un pago
   */
  async cancelPayment(id: number): Promise<void> {
    await apiService.patch(`${this.BASE_URL}/payments/${id}/cancel`);
  }

  /**
   * Obtener estadísticas de cartera
   */
  async getPortfolioStats(): Promise<{
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
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/stats`
    );
    return response.data!;
  }

  /**
   * Obtener flujo de caja
   */
  async getCashFlow(days: number = 30): Promise<{
    inflows: Array<{ date: Date; amount: number }>;
    outflows: Array<{ date: Date; amount: number }>;
    totalInflows: number;
    totalOutflows: number;
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/cash-flow?days=${days}`
    );
    return response.data!;
  }
}

export default new PortfolioService();
