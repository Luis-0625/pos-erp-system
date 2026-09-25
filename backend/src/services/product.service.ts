import { Op } from 'sequelize';
import Product from '../models/Product.model';
import Category from '../models/Category.model';
import { QueryFilters } from '../types';

/**
 * Servicio para gestionar productos
 */
class ProductService {
  /**
   * Crear un nuevo producto
   */
  async createProduct(data: {
    code: string;
    name: string;
    description?: string;
    categoryId: number;
    barcode?: string;
    price: number;
    cost: number;
    taxRate?: number;
    stock?: number;
    minStock?: number;
    maxStock?: number;
    unit?: string;
    imageUrl?: string;
  }) {
    // Verificar que la categoría existe y está activa
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    if (!category.isActive) {
      throw new Error('CATEGORY_INACTIVE');
    }

    // Verificar que el código no existe
    const existingCode = await Product.findOne({ where: { code: data.code } });
    if (existingCode) {
      throw new Error('CODE_ALREADY_EXISTS');
    }

    // Verificar que el código de barras no existe (si se proporciona)
    if (data.barcode) {
      const existingBarcode = await Product.findOne({ where: { barcode: data.barcode } });
      if (existingBarcode) {
        throw new Error('BARCODE_ALREADY_EXISTS');
      }
    }

    // Validar que el precio sea mayor que el costo
    if (data.price < data.cost) {
      throw new Error('PRICE_LESS_THAN_COST');
    }

    const product = await Product.create(data);
    return await this.getProductById(product.id);
  }

  /**
   * Obtener producto por ID con información de categoría
   */
  async getProductById(id: number) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    return product;
  }

  /**
   * Obtener producto por código
   */
  async getProductByCode(code: string) {
    const product = await Product.findOne({
      where: { code },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    return product;
  }

  /**
   * Obtener producto por código de barras
   */
  async getProductByBarcode(barcode: string) {
    const product = await Product.findOne({
      where: { barcode },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    return product;
  }

  /**
   * Listar productos con filtros y paginación
   */
  async listProducts(filters: QueryFilters) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      categoryId,
      isActive,
      minPrice,
      maxPrice,
      inStock,
      needsRestock,
    } = filters;

    const offset = (page - 1) * limit;

    // Construir condiciones WHERE
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { barcode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, [Op.gte]: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, [Op.lte]: maxPrice };
    }

    if (inStock !== undefined && inStock) {
      where.stock = { [Op.gt]: 0 };
    }

    if (needsRestock !== undefined && needsRestock) {
      where[Op.and] = [
        { stock: { [Op.lte]: Product.sequelize!.col('min_stock') } },
      ];
    }

    // Ejecutar consulta
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualizar producto
   */
  async updateProduct(id: number, data: Partial<{
    code: string;
    name: string;
    description: string;
    categoryId: number;
    barcode: string;
    price: number;
    cost: number;
    taxRate: number;
    stock: number;
    minStock: number;
    maxStock: number;
    unit: string;
    imageUrl: string;
    isActive: boolean;
  }>) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    // Verificar categoría si se actualiza
    if (data.categoryId !== undefined) {
      const category = await Category.findByPk(data.categoryId);
      if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
      }
      if (!category.isActive) {
        throw new Error('CATEGORY_INACTIVE');
      }
    }

    // Verificar código único si se actualiza
    if (data.code && data.code !== product.code) {
      const existingCode = await Product.findOne({ where: { code: data.code } });
      if (existingCode) {
        throw new Error('CODE_ALREADY_EXISTS');
      }
    }

    // Verificar código de barras único si se actualiza
    if (data.barcode && data.barcode !== product.barcode) {
      const existingBarcode = await Product.findOne({ where: { barcode: data.barcode } });
      if (existingBarcode) {
        throw new Error('BARCODE_ALREADY_EXISTS');
      }
    }

    // Validar precio vs costo
    const newPrice = data.price !== undefined ? data.price : product.price;
    const newCost = data.cost !== undefined ? data.cost : product.cost;
    if (newPrice < newCost) {
      throw new Error('PRICE_LESS_THAN_COST');
    }

    await product.update(data);
    return await this.getProductById(id);
  }

  /**
   * Eliminar producto (soft delete)
   */
  async deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    await product.update({ isActive: false });
    return { message: 'Producto desactivado exitosamente' };
  }

  /**
   * Actualizar stock de un producto
   */
  async updateStock(id: number, quantity: number, type: 'add' | 'subtract') {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const newStock = type === 'add' ? product.stock + quantity : product.stock - quantity;

    if (newStock < 0) {
      throw new Error('INSUFFICIENT_STOCK');
    }

    await product.update({ stock: newStock });
    return await this.getProductById(id);
  }

  /**
   * Obtener productos con bajo stock
   */
  async getLowStockProducts() {
    const products = await Product.findAll({
      where: {
        isActive: true,
        [Op.and]: [
          { stock: { [Op.lte]: Product.sequelize!.col('min_stock') } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['stock', 'ASC']],
    });

    return products;
  }

  /**
   * Obtener productos más vendidos (placeholder - requiere modelo de ventas)
   */
  async getTopSellingProducts(limit: number = 10) {
    // TODO: Implementar cuando exista el modelo de ventas
    const products = await Product.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });

    return products;
  }

  /**
   * Obtener valor total del inventario
   */
  async getInventoryValue() {
    const products = await Product.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'stock', 'cost', 'price'],
    });

    const totalCostValue = products.reduce((sum, product) => {
      return sum + (product.stock * parseFloat(product.cost.toString()));
    }, 0);

    const totalSaleValue = products.reduce((sum, product) => {
      return sum + (product.stock * parseFloat(product.price.toString()));
    }, 0);

    const potentialProfit = totalSaleValue - totalCostValue;

    return {
      totalProducts: products.length,
      totalItems: products.reduce((sum, p) => sum + p.stock, 0),
      totalCostValue: parseFloat(totalCostValue.toFixed(2)),
      totalSaleValue: parseFloat(totalSaleValue.toFixed(2)),
      potentialProfit: parseFloat(potentialProfit.toFixed(2)),
    };
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(term: string) {
    const products = await Product.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { code: { [Op.iLike]: `%${term}%` } },
          { name: { [Op.iLike]: `%${term}%` } },
          { barcode: { [Op.iLike]: `%${term}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit: 20,
      order: [['name', 'ASC']],
    });

    return products;
  }
}

export default new ProductService();
