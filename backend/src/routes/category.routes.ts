import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/categories
 * @desc    Crear una nueva categoría
 * @access  Private
 */
router.post('/', authenticate, categoryController.createCategory);

/**
 * @route   GET /api/v1/categories
 * @desc    Listar categorías con filtros y paginación
 * @access  Private
 */
router.get('/', authenticate, categoryController.listCategories);

/**
 * @route   GET /api/v1/categories/root
 * @desc    Obtener categorías principales (sin padre)
 * @access  Private
 */
router.get('/root', authenticate, categoryController.getRootCategories);

/**
 * @route   GET /api/v1/categories/tree
 * @desc    Obtener árbol completo de categorías
 * @access  Private
 */
router.get('/tree', authenticate, categoryController.getCategoryTree);

/**
 * @route   PUT /api/v1/categories/reorder
 * @desc    Reordenar categorías
 * @access  Private
 */
router.put('/reorder', authenticate, categoryController.reorderCategories);

/**
 * @route   GET /api/v1/categories/search/:term
 * @desc    Buscar categorías por término
 * @access  Private
 */
router.get('/search/:term', authenticate, categoryController.searchCategories);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Obtener categoría por ID
 * @access  Private
 */
router.get('/:id', authenticate, categoryController.getCategory);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Actualizar categoría
 * @access  Private
 */
router.put('/:id', authenticate, categoryController.updateCategory);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Eliminar (desactivar) categoría
 * @access  Private
 */
router.delete('/:id', authenticate, categoryController.deleteCategory);

/**
 * @route   GET /api/v1/categories/:id/products
 * @desc    Obtener productos de una categoría
 * @access  Private
 */
router.get('/:id/products', authenticate, categoryController.getCategoryProducts);

/**
 * @route   GET /api/v1/categories/:id/product-count
 * @desc    Obtener conteo de productos de una categoría
 * @access  Private
 */
router.get('/:id/product-count', authenticate, categoryController.getCategoryProductCount);

export default router;
