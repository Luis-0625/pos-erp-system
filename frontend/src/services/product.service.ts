import apiService from './api.service';
import { Product, PaginatedResponse, QueryFilters, ApiResponse } from '../types';

/**
 * Product Service
 * Gestiona todas las operaciones relacionadas con productos
 */
class ProductService {
  private readonly BASE_URL = '/products';

  /**
   * Obtener lista de productos con filtros y paginación
   */
  async getProducts(filters: QueryFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status !== undefined) params.append('status', filters.status.toString());
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());

    const response = await apiService.get<PaginatedResponse<Product>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtener un producto por ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await apiService.get<ApiResponse<Product>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  /**
   * Obtener un producto por código de barras
   */
  async getProductByBarcode(barcode: string): Promise<Product> {
    const response = await apiService.get<ApiResponse<Product>>(
      `${this.BASE_URL}/barcode/${barcode}`
    );
    return response.data.data;
  }

  /**
   * Crear un nuevo producto
   */
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await apiService.post<ApiResponse<Product>>(
      this.BASE_URL,
      productData
    );
    return response.data.data;
  }

  /**
   * Actualizar un producto existente
   */
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiService.put<ApiResponse<Product>>(
      `${this.BASE_URL}/${id}`,
      productData
    );
    return response.data.data;
  }

  /**
   * Eliminar un producto
   */
  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Obtener productos con stock bajo
   */
  async getLowStockProducts(): Promise<Product[]> {
    const response = await apiService.get<ApiResponse<Product[]>>(
      `${this.BASE_URL}/low-stock`
    );
    return response.data.data;
  }

  /**
   * Obtener productos sin stock
   */
  async getOutOfStockProducts(): Promise<Product[]> {
    const response = await apiService.get<ApiResponse<Product[]>>(
      `${this.BASE_URL}/out-of-stock`
    );
    return response.data.data;
  }

  /**
   * Actualizar stock de un producto
   */
  async updateStock(
    id: number,
    quantity: number,
    type: 'add' | 'subtract'
  ): Promise<Product> {
    const response = await apiService.patch<ApiResponse<Product>>(
      `${this.BASE_URL}/${id}/stock`,
      { quantity, type }
    );
    return response.data.data;
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(term: string): Promise<Product[]> {
    const response = await apiService.get<ApiResponse<Product[]>>(
      `${this.BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data.data;
  }

  /**
   * Obtener estadísticas de productos
   */
  async getProductStats(): Promise<{
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/stats`
    );
    return response.data.data;
  }

  /**
   * Alternar estado activo/inactivo de un producto
   */
  async toggleProductStatus(id: number): Promise<Product> {
    const response = await apiService.patch<ApiResponse<Product>>(
      `${this.BASE_URL}/${id}/toggle-status`
    );
    return response.data.data;
  }
}

export default new ProductService();
