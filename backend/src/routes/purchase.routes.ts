import { Router } from 'express';
import purchaseController from '../controllers/purchase.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   POST /api/v1/purchases
 * @desc    Crear nueva compra
 * @access  Private (Admin, Manager, Purchasing)
 */
router.post(
  '/',
  checkRole('ADMIN', 'MANAGER', 'PURCHASING'),
  purchaseController.createPurchase
);

/**
 * @route   GET /api/v1/purchases
 * @desc    Listar compras con filtros y paginación
 * @access  Private (All authenticated users)
 */
router.get('/', purchaseController.listPurchases);

/**
 * @route   GET /api/v1/purchases/stats/summary
 * @desc    Obtener estadísticas de compras
 * @access  Private (Admin, Manager, Purchasing)
 */
router.get(
  '/stats/summary',
  checkRole('ADMIN', 'MANAGER', 'PURCHASING'),
  purchaseController.getPurchaseStats
);

/**
 * @route   GET /api/v1/purchases/pending-payment
 * @desc    Obtener compras con pagos pendientes
 * @access  Private (Admin, Manager, Purchasing, Accountant)
 */
router.get(
  '/pending-payment',
  checkRole('ADMIN', 'MANAGER', 'PURCHASING', 'ACCOUNTANT'),
  purchaseController.getPurchasesWithPendingPayment
);

/**
 * @route   GET /api/v1/purchases/search
 * @desc    Buscar compras
 * @access  Private (All authenticated users)
 */
router.get('/search', purchaseController.searchPurchases);

/**
 * @route   GET /api/v1/purchases/supplier/:supplierId
 * @desc    Obtener compras por proveedor
 * @access  Private (All authenticated users)
 */
router.get('/supplier/:supplierId', purchaseController.getPurchasesBySupplier);

/**
 * @route   GET /api/v1/purchases/number/:purchaseNumber
 * @desc    Obtener compra por número
 * @access  Private (All authenticated users)
 */
router.get('/number/:purchaseNumber', purchaseController.getPurchaseByNumber);

/**
 * @route   GET /api/v1/purchases/:id
 * @desc    Obtener compra por ID
 * @access  Private (All authenticated users)
 */
router.get('/:id', purchaseController.getPurchase);

/**
 * @route   PUT /api/v1/purchases/:id
 * @desc    Actualizar compra
 * @access  Private (Admin, Manager, Purchasing)
 */
router.put(
  '/:id',
  checkRole('ADMIN', 'MANAGER', 'PURCHASING'),
  purchaseController.updatePurchase
);

/**
 * @route   POST /api/v1/purchases/:id/cancel
 * @desc    Cancelar compra
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/cancel',
  checkRole('ADMIN', 'MANAGER'),
  purchaseController.cancelPurchase
);

/**
 * @route   POST /api/v1/purchases/:id/refund
 * @desc    Reembolsar compra
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/refund',
  checkRole('ADMIN', 'MANAGER'),
  purchaseController.refundPurchase
);

/**
 * @route   PUT /api/v1/purchases/:id/payment-status
 * @desc    Actualizar estado de pago
 * @access  Private (Admin, Manager, Purchasing, Accountant)
 */
router.put(
  '/:id/payment-status',
  checkRole('ADMIN', 'MANAGER', 'PURCHASING', 'ACCOUNTANT'),
  purchaseController.updatePaymentStatus
);

/**
 * @route   DELETE /api/v1/purchases/:id
 * @desc    Eliminar compra (solo borradores)
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/:id',
  checkRole('ADMIN', 'MANAGER'),
  purchaseController.deletePurchase
);

export default router;
