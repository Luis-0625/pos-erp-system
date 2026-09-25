import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/products
 * @desc    Crear un nuevo producto
 * @access  Private
 */
router.post('/', authenticate, productController.createProduct);

/**
 * @route   GET /api/v1/products
 * @desc    Listar productos con filtros y paginación
 * @access  Private
 */
router.get('/', authenticate, productController.listProducts);

/**
 * @route   GET /api/v1/products/low-stock
 * @desc    Obtener productos con bajo stock
 * @access  Private
 */
router.get('/low-stock', authenticate, productController.getLowStockProducts);

/**
 * @route   GET /api/v1/products/top-selling
 * @desc    Obtener productos más vendidos
 * @access  Private
 */
router.get('/top-selling', authenticate, productController.getTopSellingProducts);

/**
 * @route   GET /api/v1/products/inventory-value
 * @desc    Obtener valor total del inventario
 * @access  Private
 */
router.get('/inventory-value', authenticate, productController.getInventoryValue);

/**
 * @route   GET /api/v1/products/search/:term
 * @desc    Buscar productos por término
 * @access  Private
 */
router.get('/search/:term', authenticate, productController.searchProducts);

/**
 * @route   GET /api/v1/products/code/:code
 * @desc    Obtener producto por código
 * @access  Private
 */
router.get('/code/:code', authenticate, productController.getProductByCode);

/**
 * @route   GET /api/v1/products/barcode/:barcode
 * @desc    Obtener producto por código de barras
 * @access  Private
 */
router.get('/barcode/:barcode', authenticate, productController.getProductByBarcode);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Obtener producto por ID
 * @access  Private
 */
router.get('/:id', authenticate, productController.getProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Actualizar producto
 * @access  Private
 */
router.put('/:id', authenticate, productController.updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Eliminar (desactivar) producto
 * @access  Private
 */
router.delete('/:id', authenticate, productController.deleteProduct);

/**
 * @route   PATCH /api/v1/products/:id/stock
 * @desc    Actualizar stock del producto
 * @access  Private
 */
router.patch('/:id/stock', authenticate, productController.updateStock);

export default router;
