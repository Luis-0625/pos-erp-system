import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
// Rutas especializadas primero (antes de las rutas con parámetros)
router.get('/with-debt', authenticate, clientController.getClientsWithDebt);
router.get('/type/:type', authenticate, clientController.getClientsByType);
router.get('/stats', authenticate, clientController.getClientStats);
router.get('/search/:term', authenticate, clientController.searchClients);
router.get('/document/:documentNumber', authenticate, clientController.getClientByDocument);

// Crear cliente
router.post('/', authenticate, clientController.createClient);

// Listar clientes con filtros
router.get('/', authenticate, clientController.listClients);

// Obtener cliente por ID
router.get('/:id', authenticate, clientController.getClient);

// Actualizar cliente
router.put('/:id', authenticate, clientController.updateClient);

// Eliminar cliente (soft delete)
router.delete('/:id', authenticate, clientController.deleteClient);

// Actualizar saldo del cliente
router.patch('/:id/balance', authenticate, clientController.updateBalance);

// Actualizar límite de crédito
router.patch('/:id/credit-limit', authenticate, clientController.updateCreditLimit);

// Verificar si puede comprar a crédito
router.get('/:id/can-purchase-credit', authenticate, clientController.canPurchaseOnCredit);

// Activar/desactivar cliente
router.patch('/:id/toggle-status', authenticate, clientController.toggleClientStatus);

export default router;
