import { Op } from 'sequelize';
import Category from '../models/Category.model';
import Product from '../models/Product.model';
import { QueryFilters } from '../types';

/**
 * Servicio para gestionar categorías
 */
class CategoryService {
  /**
   * Crear una nueva categoría
   */
  async createCategory(data: {
    name: string;
    description?: string;
    parentId?: number;
    order?: number;
  }) {
    // Verificar que el nombre no existe
    const existingName = await Category.findOne({ where: { name: data.name } });
    if (existingName) {
      throw new Error('CATEGORY_NAME_EXISTS');
    }

    // Verificar que la categoría padre existe (si se proporciona)
    if (data.parentId) {
      const parentCategory = await Category.findByPk(data.parentId);
      if (!parentCategory) {
        throw new Error('PARENT_CATEGORY_NOT_FOUND');
      }
      if (!parentCategory.isActive) {
        throw new Error('PARENT_CATEGORY_INACTIVE');
      }
    }

    const category = await Category.create(data);
    return await this.getCategoryById(category.id);
  }

  /**
   * Obtener categoría por ID con información relacionada
   */
  async getCategoryById(id: number) {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name', 'description', 'order', 'isActive'],
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    return category;
  }

  /**
   * Listar categorías con filtros y paginación
   */
  async listCategories(filters: QueryFilters) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'order',
      sortOrder = 'ASC',
      isActive,
      parentId,
    } = filters;

    const offset = (page - 1) * limit;

    // Construir condiciones WHERE
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    // Ejecutar consulta
    const { count, rows } = await Category.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
        },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name'],
          where: { isActive: true },
          required: false,
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
   * Obtener todas las categorías principales (sin padre)
   */
  async getRootCategories() {
    const categories = await Category.findAll({
      where: {
        parentId: null,
        isActive: true,
      },
      include: [
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name', 'description', 'order'],
          where: { isActive: true },
          required: false,
        },
      ],
      order: [['order', 'ASC']],
    });

    return categories;
  }

  /**
   * Obtener árbol completo de categorías
   */
  async getCategoryTree() {
    const rootCategories = await Category.findAll({
      where: {
        parentId: null,
        isActive: true,
      },
      order: [['order', 'ASC']],
    });

    const buildTree = async (category: Category): Promise<any> => {
      const children = await Category.findAll({
        where: {
          parentId: category.id,
          isActive: true,
        },
        order: [['order', 'ASC']],
      });

      const childrenWithSubcategories = await Promise.all(
        children.map((child) => buildTree(child))
      );

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        order: category.order,
        children: childrenWithSubcategories,
      };
    };

    const tree = await Promise.all(rootCategories.map((cat) => buildTree(cat)));
    return tree;
  }

  /**
   * Actualizar categoría
   */
  async updateCategory(id: number, data: Partial<{
    name: string;
    description: string;
    parentId: number;
    order: number;
    isActive: boolean;
  }>) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    // Verificar nombre único si se actualiza
    if (data.name && data.name !== category.name) {
      const existingName = await Category.findOne({ where: { name: data.name } });
      if (existingName) {
        throw new Error('CATEGORY_NAME_EXISTS');
      }
    }

    // Verificar categoría padre si se actualiza
    if (data.parentId !== undefined) {
      // No puede ser su propio padre
      if (data.parentId === id) {
        throw new Error('CATEGORY_CANNOT_BE_OWN_PARENT');
      }

      if (data.parentId !== null) {
        const parentCategory = await Category.findByPk(data.parentId);
        if (!parentCategory) {
          throw new Error('PARENT_CATEGORY_NOT_FOUND');
        }
        if (!parentCategory.isActive) {
          throw new Error('PARENT_CATEGORY_INACTIVE');
        }

        // Verificar que no se cree un ciclo (el padre no puede ser hijo de esta categoría)
        const isDescendant = await this.isDescendantOf(data.parentId, id);
        if (isDescendant) {
          throw new Error('CIRCULAR_REFERENCE_DETECTED');
        }
      }
    }

    await category.update(data);
    return await this.getCategoryById(id);
  }

  /**
   * Eliminar categoría (soft delete)
   */
  async deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    // Verificar que no tenga productos activos
    const productsCount = await Product.count({
      where: {
        categoryId: id,
        isActive: true,
      },
    });

    if (productsCount > 0) {
      throw new Error('CATEGORY_HAS_ACTIVE_PRODUCTS');
    }

    // Verificar que no tenga subcategorías activas
    const childrenCount = await Category.count({
      where: {
        parentId: id,
        isActive: true,
      },
    });

    if (childrenCount > 0) {
      throw new Error('CATEGORY_HAS_ACTIVE_CHILDREN');
    }

    await category.update({ isActive: false });
    return { message: 'Categoría desactivada exitosamente' };
  }

  /**
   * Obtener productos de una categoría
   */
  async getCategoryProducts(categoryId: number, includeChildren: boolean = false) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    const categoryIds = [categoryId];

    if (includeChildren) {
      const descendants = await this.getDescendantIds(categoryId);
      categoryIds.push(...descendants);
    }

    const products = await Product.findAll({
      where: {
        categoryId: { [Op.in]: categoryIds },
        isActive: true,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return products;
  }

  /**
   * Obtener conteo de productos por categoría
   */
  async getCategoryProductCount(categoryId: number) {
    const count = await Product.count({
      where: {
        categoryId,
        isActive: true,
      },
    });

    return count;
  }

  /**
   * Reordenar categorías
   */
  async reorderCategories(updates: Array<{ id: number; order: number }>) {
    const promises = updates.map(({ id, order }) =>
      Category.update({ order }, { where: { id } })
    );

    await Promise.all(promises);
    return { message: 'Categorías reordenadas exitosamente' };
  }

  /**
   * Buscar categorías por término
   */
  async searchCategories(term: string) {
    const categories = await Category.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${term}%` } },
          { description: { [Op.iLike]: `%${term}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
        },
      ],
      limit: 20,
      order: [['name', 'ASC']],
    });

    return categories;
  }

  /**
   * Verificar si una categoría es descendiente de otra (para evitar ciclos)
   */
  private async isDescendantOf(categoryId: number, ancestorId: number): Promise<boolean> {
    const category = await Category.findByPk(categoryId);
    if (!category || !category.parentId) {
      return false;
    }

    if (category.parentId === ancestorId) {
      return true;
    }

    return await this.isDescendantOf(category.parentId, ancestorId);
  }

  /**
   * Obtener IDs de todos los descendientes de una categoría
   */
  private async getDescendantIds(categoryId: number): Promise<number[]> {
    const children = await Category.findAll({
      where: {
        parentId: categoryId,
        isActive: true,
      },
      attributes: ['id'],
    });

    const childIds = children.map((c) => c.id);
    const descendantIds: number[] = [...childIds];

    for (const childId of childIds) {
      const descendants = await this.getDescendantIds(childId);
      descendantIds.push(...descendants);
    }

    return descendantIds;
  }
}

export default new CategoryService();
