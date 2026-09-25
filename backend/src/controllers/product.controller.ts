import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import productService from '../services/product.service';

/**
 * Controlador para gestionar productos
 */
class ProductController {
  /**
   * @route   POST /api/v1/products
   * @desc    Crear un nuevo producto
   * @access  Private
   */
  async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        code,
        name,
        description,
        categoryId,
        barcode,
        price,
        cost,
        taxRate,
        stock,
        minStock,
        maxStock,
        unit,
        imageUrl,
      } = req.body;

      // Validaciones
      if (!code || !name || !categoryId || price === undefined || cost === undefined) {
        res.status(400).json({
          success: false,
          message: 'Campos requeridos: code, name, categoryId, price, cost',
        });
        return;
      }

      const product = await productService.createProduct({
        code,
        name,
        description,
        categoryId,
        barcode,
        price,
        cost,
        taxRate,
        stock,
        minStock,
        maxStock,
        unit,
        imageUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'La categoría especificada no existe',
        });
      } else if (error.message === 'CATEGORY_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'La categoría especificada está inactiva',
        });
      } else if (error.message === 'CODE_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El código del producto ya existe',
        });
      } else if (error.message === 'BARCODE_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El código de barras ya existe',
        });
      } else if (error.message === 'PRICE_LESS_THAN_COST') {
        res.status(400).json({
          success: false,
          message: 'El precio no puede ser menor que el costo',
        });
      } else {
        console.error('Error al crear producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al crear el producto',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/products/:id
   * @desc    Obtener producto por ID
   * @access  Private
   */
  async getProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(parseInt(id));

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener el producto',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/products/code/:code
   * @desc    Obtener producto por código
   * @access  Private
   */
  async getProductByCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const product = await productService.getProductByCode(code);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener el producto',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/products/barcode/:barcode
   * @desc    Obtener producto por código de barras
   * @access  Private
   */
  async getProductByBarcode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { barcode } = req.params;
      const product = await productService.getProductByBarcode(barcode);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener el producto',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/products
   * @desc    Listar productos con filtros y paginación
   * @access  Private
   */
  async listProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        categoryId,
        isActive,
        minPrice,
        maxPrice,
        inStock,
        needsRestock,
      } = req.query;

      const result = await productService.listProducts({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        inStock: inStock === 'true' ? true : undefined,
        needsRestock: needsRestock === 'true' ? true : undefined,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error al listar productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar productos',
      });
    }
  }

  /**
   * @route   PUT /api/v1/products/:id
   * @desc    Actualizar producto
   * @access  Private
   */
  async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await productService.updateProduct(parseInt(id), updates);

      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else if (error.message === 'CATEGORY_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'La categoría especificada no existe',
        });
      } else if (error.message === 'CATEGORY_INACTIVE') {
        res.status(400).json({
          success: false,
          message: 'La categoría especificada está inactiva',
        });
      } else if (error.message === 'CODE_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El código del producto ya existe',
        });
      } else if (error.message === 'BARCODE_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El código de barras ya existe',
        });
      } else if (error.message === 'PRICE_LESS_THAN_COST') {
        res.status(400).json({
          success: false,
          message: 'El precio no puede ser menor que el costo',
        });
      } else {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al actualizar el producto',
        });
      }
    }
  }

  /**
   * @route   DELETE /api/v1/products/:id
   * @desc    Eliminar (desactivar) producto
   * @access  Private
   */
  async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(parseInt(id));

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
          success: false,
          message: 'Error al eliminar el producto',
        });
      }
    }
  }

  /**
   * @route   PATCH /api/v1/products/:id/stock
   * @desc    Actualizar stock del producto
   * @access  Private
   */
  async updateStock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity, type } = req.body;

      if (!quantity || !type || (type !== 'add' && type !== 'subtract')) {
        res.status(400).json({
          success: false,
          message: 'Campos requeridos: quantity (number), type (add | subtract)',
        });
        return;
      }

      const product = await productService.updateStock(parseInt(id), quantity, type);

      res.status(200).json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: product,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      } else if (error.message === 'INSUFFICIENT_STOCK') {
        res.status(400).json({
          success: false,
          message: 'Stock insuficiente',
        });
      } else {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
          success: false,
          message: 'Error al actualizar el stock',
        });
      }
    }
  }

  /**
   * @route   GET /api/v1/products/low-stock
   * @desc    Obtener productos con bajo stock
   * @access  Private
   */
  async getLowStockProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const products = await productService.getLowStockProducts();

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al obtener productos con bajo stock:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos con bajo stock',
      });
    }
  }

  /**
   * @route   GET /api/v1/products/top-selling
   * @desc    Obtener productos más vendidos
   * @access  Private
   */
  async getTopSellingProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const products = await productService.getTopSellingProducts(
        limit ? parseInt(limit as string) : 10
      );

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al obtener productos más vendidos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos más vendidos',
      });
    }
  }

  /**
   * @route   GET /api/v1/products/inventory-value
   * @desc    Obtener valor total del inventario
   * @access  Private
   */
  async getInventoryValue(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const value = await productService.getInventoryValue();

      res.status(200).json({
        success: true,
        data: value,
      });
    } catch (error: any) {
      console.error('Error al obtener valor del inventario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener valor del inventario',
      });
    }
  }

  /**
   * @route   GET /api/v1/products/search/:term
   * @desc    Buscar productos por término
   * @access  Private
   */
  async searchProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { term } = req.params;
      const products = await productService.searchProducts(term);

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar productos',
      });
    }
  }
}

export default new ProductController();
