import { Router } from 'express';
import configController from '../controllers/config.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ============= RUTAS DE EMPRESA =============

/**
 * @route   POST /api/v1/config/company
 * @desc    Crear empresa (configuración inicial)
 * @access  Admin
 */
router.post('/company', checkRole('ADMIN'), configController.createCompany);

/**
 * @route   GET /api/v1/config/company/active
 * @desc    Obtener empresa activa
 * @access  Private
 */
router.get('/company/active', configController.getActiveCompany);

/**
 * @route   GET /api/v1/config/company/:id
 * @desc    Obtener empresa por ID
 * @access  Private
 */
router.get('/company/:id', configController.getCompany);

/**
 * @route   PUT /api/v1/config/company/:id
 * @desc    Actualizar empresa
 * @access  Admin
 */
router.put('/company/:id', checkRole('ADMIN'), configController.updateCompany);

/**
 * @route   PUT /api/v1/config/company/:id/logo
 * @desc    Actualizar logo de la empresa
 * @access  Admin
 */
router.put('/company/:id/logo', checkRole('ADMIN'), configController.updateCompanyLogo);

/**
 * @route   GET /api/v1/config/currency
 * @desc    Obtener configuración de moneda
 * @access  Private
 */
router.get('/currency', configController.getCurrencySettings);

/**
 * @route   GET /api/v1/config/invoice
 * @desc    Obtener configuración de facturación
 * @access  Private
 */
router.get('/invoice', configController.getInvoiceSettings);

// ============= RUTAS DE TASAS DE IMPUESTOS =============

/**
 * @route   POST /api/v1/config/tax-rates
 * @desc    Crear tasa de impuesto
 * @access  Admin
 */
router.post('/tax-rates', checkRole('ADMIN'), configController.createTaxRate);

/**
 * @route   GET /api/v1/config/tax-rates
 * @desc    Listar tasas de impuestos con filtros
 * @access  Private
 */
router.get('/tax-rates', configController.listTaxRates);

/**
 * @route   GET /api/v1/config/tax-rates/effective
 * @desc    Obtener tasas de impuestos vigentes
 * @access  Private
 */
router.get('/tax-rates/effective', configController.getEffectiveTaxRates);

/**
 * @route   GET /api/v1/config/tax-rates/default/:type
 * @desc    Obtener tasa predeterminada por tipo
 * @access  Private
 */
router.get('/tax-rates/default/:type', configController.getDefaultTaxRate);

/**
 * @route   GET /api/v1/config/tax-rates/:id
 * @desc    Obtener tasa de impuesto por ID
 * @access  Private
 */
router.get('/tax-rates/:id', configController.getTaxRate);

/**
 * @route   PUT /api/v1/config/tax-rates/:id
 * @desc    Actualizar tasa de impuesto
 * @access  Admin
 */
router.put('/tax-rates/:id', checkRole('ADMIN'), configController.updateTaxRate);

/**
 * @route   DELETE /api/v1/config/tax-rates/:id
 * @desc    Eliminar (desactivar) tasa de impuesto
 * @access  Admin
 */
router.delete('/tax-rates/:id', checkRole('ADMIN'), configController.deleteTaxRate);

/**
 * @route   PUT /api/v1/config/tax-rates/:id/set-default
 * @desc    Establecer tasa como predeterminada
 * @access  Admin
 */
router.put('/tax-rates/:id/set-default', checkRole('ADMIN'), configController.setDefaultTaxRate);

// ============= RUTAS DE CÁLCULO DE IMPUESTOS =============

/**
 * @route   POST /api/v1/config/calculate/sales-tax
 * @desc    Calcular impuesto de ventas
 * @access  Private
 */
router.post('/calculate/sales-tax', configController.calculateSalesTax);

/**
 * @route   POST /api/v1/config/calculate/purchase-tax
 * @desc    Calcular impuesto de compras
 * @access  Private
 */
router.post('/calculate/purchase-tax', configController.calculatePurchaseTax);

/**
 * @route   POST /api/v1/config/calculate/multiple-taxes
 * @desc    Calcular múltiples impuestos
 * @access  Private
 */
router.post('/calculate/multiple-taxes', configController.calculateMultipleTaxes);

export default router;
