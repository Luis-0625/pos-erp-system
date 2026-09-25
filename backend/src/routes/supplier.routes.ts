import { Router } from 'express';
import supplierController from '../controllers/supplier.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Rutas específicas primero (antes de las rutas con parámetros)
router.get('/with-debt', authenticate, (req, res) => supplierController.getSuppliersWithDebt(req, res));
router.get('/stats', authenticate, (req, res) => supplierController.getSupplierStats(req, res));
router.get('/search/:term', authenticate, (req, res) => supplierController.searchSuppliers(req, res));
router.get('/document/:documentNumber', authenticate, (req, res) => supplierController.getSupplierByDocument(req, res));
router.get('/payment-terms/:paymentTerms', authenticate, (req, res) => supplierController.getSuppliersByPaymentTerms(req, res));
router.get('/top', authenticate, (req, res) => supplierController.getTopSuppliers(req, res));

// Rutas CRUD principales
router.post('/', authenticate, (req, res) => supplierController.createSupplier(req, res));
router.get('/', authenticate, (req, res) => supplierController.listSuppliers(req, res));
router.get('/:id', authenticate, (req, res) => supplierController.getSupplier(req, res));
router.put('/:id', authenticate, (req, res) => supplierController.updateSupplier(req, res));
router.delete('/:id', authenticate, (req, res) => supplierController.deleteSupplier(req, res));

// Rutas de actualización específica
router.patch('/:id/balance', authenticate, (req, res) => supplierController.updateBalance(req, res));
router.patch('/:id/credit-limit', authenticate, (req, res) => supplierController.updateCreditLimit(req, res));
router.patch('/:id/payment-terms', authenticate, (req, res) => supplierController.updatePaymentTerms(req, res));
router.get('/:id/can-purchase', authenticate, (req, res) => supplierController.canPurchaseFromSupplier(req, res));
router.patch('/:id/toggle-status', authenticate, (req, res) => supplierController.toggleSupplierStatus(req, res));

export default router;
