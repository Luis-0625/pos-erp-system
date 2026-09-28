import { Router } from 'express';
import saleController from '../controllers/sale.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/sales
 * @desc    Crear una nueva venta
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.post(
  '/',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.createSale
);

/**
 * @route   GET /api/v1/sales
 * @desc    Listar ventas con filtros y paginación
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.listSales
);

/**
 * @route   GET /api/v1/sales/stats
 * @desc    Obtener estadísticas de ventas
 * @access  Private (ADMIN, MANAGER)
 */
router.get(
  '/stats',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.getSaleStats
);

/**
 * @route   GET /api/v1/sales/pending-payment
 * @desc    Obtener ventas pendientes de pago
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/pending-payment',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.getSalesWithPendingPayment
);

/**
 * @route   GET /api/v1/sales/search
 * @desc    Buscar ventas
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/search',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.searchSales
);

/**
 * @route   GET /api/v1/sales/number/:saleNumber
 * @desc    Obtener una venta por número
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/number/:saleNumber',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.getSaleByNumber
);

/**
 * @route   GET /api/v1/sales/client/:clientId
 * @desc    Obtener ventas por cliente
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/client/:clientId',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.getSalesByClient
);

/**
 * @route   GET /api/v1/sales/:id
 * @desc    Obtener una venta por ID
 * @access  Private (ADMIN, SELLER, MANAGER)
 */
router.get(
  '/:id',
  authenticate,
  checkRole('ADMIN', 'SELLER', 'MANAGER'),
  saleController.getSale
);

/**
 * @route   PUT /api/v1/sales/:id
 * @desc    Actualizar una venta
 * @access  Private (ADMIN, MANAGER)
 */
router.put(
  '/:id',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.updateSale
);

/**
 * @route   POST /api/v1/sales/:id/cancel
 * @desc    Cancelar una venta
 * @access  Private (ADMIN, MANAGER)
 */
router.post(
  '/:id/cancel',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.cancelSale
);

/**
 * @route   POST /api/v1/sales/:id/refund
 * @desc    Reembolsar una venta
 * @access  Private (ADMIN, MANAGER)
 */
router.post(
  '/:id/refund',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.refundSale
);

/**
 * @route   PATCH /api/v1/sales/:id/payment-status
 * @desc    Actualizar estado de pago
 * @access  Private (ADMIN, MANAGER)
 */
router.patch(
  '/:id/payment-status',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.updatePaymentStatus
);

/**
 * @route   DELETE /api/v1/sales/:id
 * @desc    Eliminar una venta (solo borradores)
 * @access  Private (ADMIN, MANAGER)
 */
router.delete(
  '/:id',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  saleController.deleteSale
);

export default router;
