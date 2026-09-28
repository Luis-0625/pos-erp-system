import apiService from './api.service';
import { Client, PaginatedResponse, QueryFilters, ApiResponse } from '../types';

/**
 * Client Service
 * Gestiona todas las operaciones relacionadas con clientes
 */
class ClientService {
  private readonly BASE_URL = '/clients';

  /**
   * Obtener lista de clientes con filtros y paginación
   */
  async getClients(filters: QueryFilters = {}): Promise<PaginatedResponse<Client>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status !== undefined) params.append('status', filters.status.toString());
    if (filters.clientType) params.append('clientType', filters.clientType);

    const response = await apiService.get<PaginatedResponse<Client>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response;
  }

  /**
   * Obtener un cliente por ID
   */
  async getClientById(id: number): Promise<Client> {
    const response = await apiService.get<ApiResponse<Client>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data!;
  }

  /**
   * Obtener un cliente por número de documento
   */
  async getClientByDocument(documentNumber: string): Promise<Client> {
    const response = await apiService.get<ApiResponse<Client>>(
      `${this.BASE_URL}/document/${documentNumber}`
    );
    return response.data!;
  }

  /**
   * Crear un nuevo cliente
   */
  async createClient(clientData: Partial<Client>): Promise<Client> {
    const response = await apiService.post<ApiResponse<Client>>(
      this.BASE_URL,
      clientData
    );
    return response.data!;
  }

  /**
   * Actualizar un cliente existente
   */
  async updateClient(id: number, clientData: Partial<Client>): Promise<Client> {
    const response = await apiService.put<ApiResponse<Client>>(
      `${this.BASE_URL}/${id}`,
      clientData
    );
    return response.data!;
  }

  /**
   * Eliminar un cliente
   */
  async deleteClient(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Actualizar saldo de un cliente
   */
  async updateBalance(
    id: number,
    amount: number,
    type: 'add' | 'subtract'
  ): Promise<Client> {
    const response = await apiService.patch<ApiResponse<Client>>(
      `${this.BASE_URL}/${id}/balance`,
      { amount, type }
    );
    return response.data!;
  }

  /**
   * Actualizar límite de crédito de un cliente
   */
  async updateCreditLimit(id: number, newLimit: number): Promise<Client> {
    const response = await apiService.patch<ApiResponse<Client>>(
      `${this.BASE_URL}/${id}/credit-limit`,
      { creditLimit: newLimit }
    );
    return response.data!;
  }

  /**
   * Obtener clientes con deuda
   */
  async getClientsWithDebt(): Promise<Client[]> {
    const response = await apiService.get<ApiResponse<Client[]>>(
      `${this.BASE_URL}/with-debt`
    );
    return response.data!;
  }

  /**
   * Buscar clientes por término
   */
  async searchClients(term: string): Promise<Client[]> {
    const response = await apiService.get<ApiResponse<Client[]>>(
      `${this.BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data!;
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getClientStats(): Promise<{
    totalClients: number;
    totalPersons: number;
    totalCompanies: number;
    clientsWithDebt: number;
    totalDebt: number;
    totalCreditLimit: number;
    availableCredit: number;
  }> {
    const response = await apiService.get<ApiResponse<{
      totalClients: number;
      totalPersons: number;
      totalCompanies: number;
      clientsWithDebt: number;
      totalDebt: number;
      totalCreditLimit: number;
      availableCredit: number;
    }>>(
      `${this.BASE_URL}/stats`
    );
    return response.data!;
  }

  /**
   * Alternar estado activo/inactivo de un cliente
   */
  async toggleClientStatus(id: number): Promise<Client> {
    const response = await apiService.patch<ApiResponse<Client>>(
      `${this.BASE_URL}/${id}/toggle-status`
    );
    return response.data!;
  }

  /**
   * Verificar si un cliente puede comprar a crédito
   */
  async canPurchaseOnCredit(id: number, amount: number): Promise<boolean> {
    const response = await apiService.get<ApiResponse<{ canPurchase: boolean }>>(
      `${this.BASE_URL}/${id}/can-purchase?amount=${amount}`
    );
    return response.data!.canPurchase;
  }
}

export default new ClientService();
