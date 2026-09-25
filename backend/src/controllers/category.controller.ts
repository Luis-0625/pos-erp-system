import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import categoryService from '../services/category.service';

/**
 * Controlador para gestionar categorías
 */
class CategoryController {
  /**
   * @route   POST /api/v1/categories
   * @desc    Crear una nueva categoría
   * @access  Private
   */
  async createCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, description, parentId, order } = req.body;

      // Validaciones
      if (!name) {
        res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es requerido',
        });
        return;
      }

      const category = await categoryService.createCategory({
        name,
        description,
        parentId,
        order,
      });

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: category,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NAME_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El nombre de la categoría ya existe',
        });
      } else if (error.message === 'PARENT_CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'La categoría padre no existe',
        });
      } else if (error.message === 'PARENT_CATEGORY_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'La categoría padre está inactiva',
        });
      } else {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
          success: false,
          message: 'Error al crear la categoría',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/categories/:id
   * @desc    Obtener categoría por ID
   * @access  Private
   */
  async getCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(parseInt(id));

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      } else {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener la categoría',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/categories
   * @desc    Listar categorías con filtros y paginación
   * @access  Private
   */
  async listCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        isActive,
        parentId,
      } = req.query;

      const result = await categoryService.listCategories({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        parentId: parentId ? parseInt(parentId as string) : undefined,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error al listar categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar categorías',
      });
    }
  }

  /**
   * @route   GET /api/v1/categories/root
   * @desc    Obtener categorías principales (sin padre)
   * @access  Private
   */
  async getRootCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getRootCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Error al obtener categorías principales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener categorías principales',
      });
    }
  }

  /**
   * @route   GET /api/v1/categories/tree
   * @desc    Obtener árbol completo de categorías
   * @access  Private
   */
  async getCategoryTree(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tree = await categoryService.getCategoryTree();

      res.status(200).json({
        success: true,
        data: tree,
      });
    } catch (error: any) {
      console.error('Error al obtener árbol de categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener árbol de categorías',
      });
    }
  }

  /**
   * @route   PUT /api/v1/categories/:id
   * @desc    Actualizar categoría
   * @access  Private
   */
  async updateCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const category = await categoryService.updateCategory(parseInt(id), updates);

      res.status(200).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: category,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      } else if (error.message === 'CATEGORY_NAME_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El nombre de la categoría ya existe',
        });
      } else if (error.message === 'CATEGORY_CANNOT_BE_OWN_PARENT') {
        res.status(400).json({
          success: false,
          message: 'Una categoría no puede ser su propio padre',
        });
      } else if (error.message === 'PARENT_CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'La categoría padre no existe',
        });
      } else if (error.message === 'PARENT_CATEGORY_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'La categoría padre está inactiva',
        });
      } else if (error.message === 'CIRCULAR_REFERENCE_DETECTED') {
        res.status(400).json({
          success: false,
          message: 'Referencia circular detectada: la categoría padre no puede ser un descendiente',
        });
      } else {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
          success: false,
          message: 'Error al actualizar la categoría',
        });
      }
    }
  }

  /**
   * @route   DELETE /api/v1/categories/:id
   * @desc    Eliminar (desactivar) categoría
   * @access  Private
   */
  async deleteCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await categoryService.deleteCategory(parseInt(id));

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      } else if (error.message === 'CATEGORY_HAS_ACTIVE_PRODUCTS') {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar la categoría porque tiene productos activos',
        });
      } else if (error.message === 'CATEGORY_HAS_ACTIVE_CHILDREN') {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar la categoría porque tiene subcategorías activas',
        });
      } else {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
          success: false,
          message: 'Error al eliminar la categoría',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/categories/:id/products
   * @desc    Obtener productos de una categoría
   * @access  Private
   */
  async getCategoryProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { includeChildren } = req.query;

      const products = await categoryService.getCategoryProducts(
        parseInt(id),
        includeChildren === 'true'
      );

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      } else {
        console.error('Error al obtener productos de categoría:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener productos de la categoría',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/categories/:id/product-count
   * @desc    Obtener conteo de productos de una categoría
   * @access  Private
   */
  async getCategoryProductCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const count = await categoryService.getCategoryProductCount(parseInt(id));

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      console.error('Error al obtener conteo de productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conteo de productos',
      });
    }
  }

  /**
   * @route   PUT /api/v1/categories/reorder
   * @desc    Reordenar categorías
   * @access  Private
   */
  async reorderCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { updates } = req.body;

      if (!updates || !Array.isArray(updates)) {
        res.status(400).json({
          success: false,
          message: 'Se requiere un array de actualizaciones con formato: [{ id, order }]',
        });
        return;
      }

      const result = await categoryService.reorderCategories(updates);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error al reordenar categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al reordenar categorías',
      });
    }
  }

  /**
   * @route   GET /api/v1/categories/search/:term
   * @desc    Buscar categorías por término
   * @access  Private
   */
  async searchCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { term } = req.params;
      const categories = await categoryService.searchCategories(term);

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Error al buscar categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar categorías',
      });
    }
  }
}

export default new CategoryController();
