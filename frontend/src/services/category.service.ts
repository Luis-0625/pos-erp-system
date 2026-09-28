import apiService from './api.service';
import { Category, PaginatedResponse, QueryFilters, ApiResponse } from '../types';

/**
 * Category Service
 * Gestiona todas las operaciones relacionadas con categorías de productos
 */
class CategoryService {
  private readonly BASE_URL = '/categories';

  /**
   * Obtener lista de categorías con filtros y paginación
   */
  async getCategories(filters: QueryFilters = {}): Promise<PaginatedResponse<Category>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status !== undefined) params.append('status', filters.status.toString());

    const response = await apiService.get<PaginatedResponse<Category>>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtener todas las categorías activas (sin paginación)
   */
  async getActiveCategories(): Promise<Category[]> {
    const response = await apiService.get<ApiResponse<Category[]>>(
      `${this.BASE_URL}/active`
    );
    return response.data.data;
  }

  /**
   * Obtener una categoría por ID
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await apiService.get<ApiResponse<Category>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  /**
   * Crear una nueva categoría
   */
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await apiService.post<ApiResponse<Category>>(
      this.BASE_URL,
      categoryData
    );
    return response.data.data;
  }

  /**
   * Actualizar una categoría existente
   */
  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    const response = await apiService.put<ApiResponse<Category>>(
      `${this.BASE_URL}/${id}`,
      categoryData
    );
    return response.data.data;
  }

  /**
   * Eliminar una categoría
   */
  async deleteCategory(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Alternar estado activo/inactivo de una categoría
   */
  async toggleCategoryStatus(id: number): Promise<Category> {
    const response = await apiService.patch<ApiResponse<Category>>(
      `${this.BASE_URL}/${id}/toggle-status`
    );
    return response.data.data;
  }
}

export default new CategoryService();
