import { Router } from 'express';
import reportController from '../controllers/report.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const router = Router();

// ============= REPORTES DE VENTAS =============

/**
 * GET /api/v1/reports/sales
 * Reporte de ventas por período
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER, SELLER
 */
router.get(
  '/sales',
  authenticate,
  checkRole('ADMIN', 'MANAGER', 'SELLER'),
  reportController.getSalesReport
);

/**
 * GET /api/v1/reports/sales/by-product
 * Reporte de ventas por producto
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/sales/by-product',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getSalesByProduct
);

/**
 * GET /api/v1/reports/sales/by-client
 * Reporte de ventas por cliente
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER, SELLER
 */
router.get(
  '/sales/by-client',
  authenticate,
  checkRole('ADMIN', 'MANAGER', 'SELLER'),
  reportController.getSalesByClient
);

// ============= REPORTES DE COMPRAS =============

/**
 * GET /api/v1/reports/purchases
 * Reporte de compras por período
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/purchases',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getPurchasesReport
);

/**
 * GET /api/v1/reports/purchases/by-supplier
 * Reporte de compras por proveedor
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/purchases/by-supplier',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getPurchasesBySupplier
);

// ============= REPORTES FINANCIEROS =============

/**
 * GET /api/v1/reports/profit-loss
 * Estado de resultados (P&L)
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/profit-loss',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getProfitAndLossReport
);

/**
 * GET /api/v1/reports/cash-flow
 * Reporte de flujo de efectivo
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/cash-flow',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getCashFlowReport
);

/**
 * GET /api/v1/reports/accounts-receivable
 * Reporte de cuentas por cobrar (aging)
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/accounts-receivable',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getAccountsReceivableReport
);

/**
 * GET /api/v1/reports/accounts-payable
 * Reporte de cuentas por pagar (aging)
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/accounts-payable',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getAccountsPayableReport
);

// ============= REPORTES DE INVENTARIO =============

/**
 * GET /api/v1/reports/inventory
 * Reporte de inventario valorizado
 * Roles: ADMIN, MANAGER, WAREHOUSE
 */
router.get(
  '/inventory',
  authenticate,
  checkRole('ADMIN', 'MANAGER', 'WAREHOUSE'),
  reportController.getInventoryReport
);

// ============= DASHBOARD =============

/**
 * GET /api/v1/reports/dashboard
 * Reporte ejecutivo del dashboard con KPIs
 * Query params: startDate, endDate
 * Roles: ADMIN, MANAGER
 */
router.get(
  '/dashboard',
  authenticate,
  checkRole('ADMIN', 'MANAGER'),
  reportController.getDashboardReport
);

export default router;
