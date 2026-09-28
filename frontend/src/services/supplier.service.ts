import apiService from './api.service';
import { Supplier, PaginatedResponse, QueryFilters, ApiResponse } from '../types';

/**
 * Supplier Service
 * Gestiona todas las operaciones relacionadas con proveedores
 */
class SupplierService {
  private readonly BASE_URL = '/suppliers';

  /**
   * Obtener lista de proveedores con filtros y paginación
   */
  async getSuppliers(filters: QueryFilters = {}): Promise<PaginatedResponse<Supplier>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status !== undefined) params.append('status', filters.status.toString());

    const response = await apiService.get<PaginatedResponse<Supplier>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener un proveedor por ID
   */
  async getSupplierById(id: number): Promise<Supplier> {
    const response = await apiService.get<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener un proveedor por número de documento
   */
  async getSupplierByDocument(documentNumber: string): Promise<Supplier> {
    const response = await apiService.get<ApiResponse<Supplier>>(
      `${this.BASE_URL}/document/${documentNumber}`
    );
    return response.data!;
  }

  /**
   * Crear un nuevo proveedor
   */
  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    const response = await apiService.post<ApiResponse<Supplier>>(
      this.BASE_URL,
      supplierData
    );
    return response.data!;
  }

  /**
   * Actualizar un proveedor existente
   */
  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    const response = await apiService.put<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}`,
      supplierData
    );
    return response.data!;
  }

  /**
   * Eliminar un proveedor
   */
  async deleteSupplier(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Actualizar saldo de un proveedor
   */
  async updateBalance(
    id: number,
    amount: number,
    type: 'add' | 'subtract'
  ): Promise<Supplier> {
    const response = await apiService.patch<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}/balance`,
      { amount, type }
    );
    return response.data!;
  }

  /**
   * Actualizar límite de crédito de un proveedor
   */
  async updateCreditLimit(id: number, newLimit: number): Promise<Supplier> {
    const response = await apiService.patch<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}/credit-limit`,
      { creditLimit: newLimit }
    );
    return response.data!;
  }

  /**
   * Actualizar términos de pago de un proveedor
   */
  async updatePaymentTerms(id: number, paymentTerms: number): Promise<Supplier> {
    const response = await apiService.patch<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}/payment-terms`,
      { paymentTerms }
    );
    return response.data!;
  }

  /**
   * Obtener proveedores con deuda
   */
  async getSuppliersWithDebt(): Promise<Supplier[]> {
    const response = await apiService.get<ApiResponse<Supplier[]>>(
      `${this.BASE_URL}/with-debt`
    );
    return response.data!;
  }

  /**
   * Buscar proveedores por término
   */
  async searchSuppliers(term: string): Promise<Supplier[]> {
    const response = await apiService.get<ApiResponse<Supplier[]>>(
      `${this.BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data!;
  }

  /**
   * Obtener estadísticas de proveedores
   */
  async getSupplierStats(): Promise<{
    totalSuppliers: number;
    suppliersWithDebt: number;
    totalDebt: number;
    totalCreditLimit: number;
    availableCredit: number;
  }> {
    const response = await apiService.get<ApiResponse<{
      totalSuppliers: number;
      suppliersWithDebt: number;
      totalDebt: number;
      totalCreditLimit: number;
      availableCredit: number;
    }>>(
      `${this.BASE_URL}/stats`
    );
    return response.data!;
  }

  /**
   * Alternar estado activo/inactivo de un proveedor
   */
  async toggleSupplierStatus(id: number): Promise<Supplier> {
    const response = await apiService.patch<ApiResponse<Supplier>>(
      `${this.BASE_URL}/${id}/toggle-status`
    );
    return response.data!;
  }

  /**
   * Obtener top proveedores por volumen de compras
   */
  async getTopSuppliers(limit: number = 10): Promise<Supplier[]> {
    const response = await apiService.get<ApiResponse<Supplier[]>>(
      `${this.BASE_URL}/top?limit=${limit}`
    );
    return response.data!;
  }
}

export default new SupplierService();
