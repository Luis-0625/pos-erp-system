import { Router } from 'express';
import portfolioController from '../controllers/portfolio.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== CUENTAS POR COBRAR ====================

/**
 * @route   POST /api/v1/portfolio/receivables
 * @desc    Crear nueva cuenta por cobrar
 * @access  Private (Admin, Manager, Accountant)
 */
router.post(
  '/receivables',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.createAccountReceivable
);

/**
 * @route   GET /api/v1/portfolio/receivables
 * @desc    Listar cuentas por cobrar con filtros
 * @access  Private (Admin, Manager, Accountant, Sales)
 */
router.get(
  '/receivables',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT', 'SALES'),
  portfolioController.listAccountsReceivable
);

/**
 * @route   GET /api/v1/portfolio/receivables/overdue
 * @desc    Obtener cuentas vencidas por cobrar
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/receivables/overdue',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.getOverdueReceivables
);

/**
 * @route   GET /api/v1/portfolio/receivables/:id
 * @desc    Obtener cuenta por cobrar por ID
 * @access  Private (Admin, Manager, Accountant, Sales)
 */
router.get(
  '/receivables/:id',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT', 'SALES'),
  portfolioController.getAccountReceivable
);

/**
 * @route   PUT /api/v1/portfolio/receivables/:id
 * @desc    Actualizar cuenta por cobrar
 * @access  Private (Admin, Manager, Accountant)
 */
router.put(
  '/receivables/:id',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.updateAccountReceivable
);

// ==================== CUENTAS POR PAGAR ====================

/**
 * @route   POST /api/v1/portfolio/payables
 * @desc    Crear nueva cuenta por pagar
 * @access  Private (Admin, Manager, Accountant)
 */
router.post(
  '/payables',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.createAccountPayable
);

/**
 * @route   GET /api/v1/portfolio/payables
 * @desc    Listar cuentas por pagar con filtros
 * @access  Private (Admin, Manager, Accountant, Purchasing)
 */
router.get(
  '/payables',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT', 'PURCHASING'),
  portfolioController.listAccountsPayable
);

/**
 * @route   GET /api/v1/portfolio/payables/overdue
 * @desc    Obtener cuentas vencidas por pagar
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/payables/overdue',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.getOverduePayables
);

/**
 * @route   GET /api/v1/portfolio/payables/:id
 * @desc    Obtener cuenta por pagar por ID
 * @access  Private (Admin, Manager, Accountant, Purchasing)
 */
router.get(
  '/payables/:id',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT', 'PURCHASING'),
  portfolioController.getAccountPayable
);

/**
 * @route   PUT /api/v1/portfolio/payables/:id
 * @desc    Actualizar cuenta por pagar
 * @access  Private (Admin, Manager, Accountant)
 */
router.put(
  '/payables/:id',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.updateAccountPayable
);

// ==================== PAGOS ====================

/**
 * @route   POST /api/v1/portfolio/payments
 * @desc    Registrar un nuevo pago
 * @access  Private (Admin, Manager, Accountant)
 */
router.post(
  '/payments',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.createPayment
);

/**
 * @route   GET /api/v1/portfolio/payments
 * @desc    Listar pagos con filtros
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/payments',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.listPayments
);

/**
 * @route   GET /api/v1/portfolio/payments/:id
 * @desc    Obtener pago por ID
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/payments/:id',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.getPayment
);

/**
 * @route   DELETE /api/v1/portfolio/payments/:id
 * @desc    Anular un pago
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/payments/:id',
  checkRole('ADMIN', 'MANAGER'),
  portfolioController.cancelPayment
);

// ==================== ESTADÍSTICAS Y REPORTES ====================

/**
 * @route   GET /api/v1/portfolio/stats
 * @desc    Obtener estadísticas de cartera
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/stats',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.getPortfolioStats
);

/**
 * @route   GET /api/v1/portfolio/cash-flow
 * @desc    Obtener flujo de caja proyectado
 * @access  Private (Admin, Manager, Accountant)
 */
router.get(
  '/cash-flow',
  checkRole('ADMIN', 'MANAGER', 'ACCOUNTANT'),
  portfolioController.getCashFlow
);

/**
 * @route   POST /api/v1/portfolio/write-off
 * @desc    Dar de baja una cuenta (write off)
 * @access  Private (Admin, Manager)
 */
router.post(
  '/write-off',
  checkRole('ADMIN', 'MANAGER'),
  portfolioController.writeOffAccount
);

export default router;
