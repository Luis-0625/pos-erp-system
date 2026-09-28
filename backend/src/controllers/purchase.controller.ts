import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import purchaseService from '../services/purchase.service';

class PurchaseController {
  /**
   * Crear una nueva compra
   * POST /api/v1/purchases
   */
  async createPurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        purchaseDate,
        supplierId,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status,
        dueDate,
        notes,
        details,
      } = req.body;

      // Validaciones básicas
      if (!supplierId) {
        res.status(400).json({
          success: false,
          message: 'El proveedor es requerido',
        });
        return;
      }

      if (!details || !Array.isArray(details) || details.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un producto en la compra',
        });
        return;
      }

      if (!totalAmount || totalAmount <= 0) {
        res.status(400).json({
          success: false,
          message: 'El monto total debe ser mayor a 0',
        });
        return;
      }

      // Validar detalles
      for (const detail of details) {
        if (!detail.productId || !detail.quantity || !detail.unitCost) {
          res.status(400).json({
            success: false,
            message: 'Cada detalle debe incluir productId, quantity y unitCost',
          });
          return;
        }

        if (detail.quantity <= 0) {
          res.status(400).json({
            success: false,
            message: 'La cantidad debe ser mayor a 0',
          });
          return;
        }

        if (detail.unitCost <= 0) {
          res.status(400).json({
            success: false,
            message: 'El costo unitario debe ser mayor a 0',
          });
          return;
        }
      }

      const purchase = await purchaseService.createPurchase({
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        supplierId,
        userId: req.user!.id,
        subtotal,
        taxAmount: taxAmount || 0,
        discountAmount: discountAmount || 0,
        totalAmount,
        paymentMethod: paymentMethod || 'CASH',
        paymentStatus: paymentStatus || 'PENDING',
        status: status || 'COMPLETED',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
        details,
      });

      res.status(201).json({
        success: true,
        message: 'Compra creada exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al crear compra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al crear la compra',
      });
    }
  }

  /**
   * Listar compras con filtros
   * GET /api/v1/purchases
   */
  async listPurchases(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        supplierId,
        userId,
        paymentMethod,
        paymentStatus,
        status,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await purchaseService.listPurchases({
        supplierId: supplierId ? Number(supplierId) : undefined,
        userId: userId ? Number(userId) : undefined,
        paymentMethod: paymentMethod as string,
        paymentStatus: paymentStatus as string,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      });

      res.status(200).json({
        success: true,
        message: 'Compras obtenidas exitosamente',
        data: result.purchases,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Error al listar compras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al listar las compras',
      });
    }
  }

  /**
   * Obtener compra por ID
   * GET /api/v1/purchases/:id
   */
  async getPurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const purchase = await purchaseService.getPurchaseById(Number(id));

      res.status(200).json({
        success: true,
        message: 'Compra obtenida exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al obtener compra:', error);
      res.status(error.message === 'Compra no encontrada' ? 404 : 500).json({
        success: false,
        message: error.message || 'Error al obtener la compra',
      });
    }
  }

  /**
   * Obtener compra por número
   * GET /api/v1/purchases/number/:purchaseNumber
   */
  async getPurchaseByNumber(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { purchaseNumber } = req.params;

      const purchase = await purchaseService.getPurchaseByNumber(purchaseNumber);

      res.status(200).json({
        success: true,
        message: 'Compra obtenida exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al obtener compra:', error);
      res.status(error.message === 'Compra no encontrada' ? 404 : 500).json({
        success: false,
        message: error.message || 'Error al obtener la compra',
      });
    }
  }

  /**
   * Actualizar compra
   * PUT /api/v1/purchases/:id
   */
  async updatePurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        purchaseDate,
        supplierId,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status,
        dueDate,
        notes,
        details,
      } = req.body;

      const purchase = await purchaseService.updatePurchase(Number(id), {
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        supplierId,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
        details,
      });

      res.status(200).json({
        success: true,
        message: 'Compra actualizada exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al actualizar compra:', error);
      const statusCode =
        error.message === 'Compra no encontrada'
          ? 404
          : error.message.includes('No se puede editar')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar la compra',
      });
    }
  }

  /**
   * Cancelar compra
   * POST /api/v1/purchases/:id/cancel
   */
  async cancelPurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const purchase = await purchaseService.cancelPurchase(Number(id), reason);

      res.status(200).json({
        success: true,
        message: 'Compra cancelada exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al cancelar compra:', error);
      const statusCode =
        error.message === 'Compra no encontrada'
          ? 404
          : error.message.includes('ya está cancelada') || error.message.includes('No se puede')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al cancelar la compra',
      });
    }
  }

  /**
   * Reembolsar compra
   * POST /api/v1/purchases/:id/refund
   */
  async refundPurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar una razón para el reembolso',
        });
        return;
      }

      const purchase = await purchaseService.refundPurchase(Number(id), reason);

      res.status(200).json({
        success: true,
        message: 'Compra reembolsada exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al reembolsar compra:', error);
      const statusCode =
        error.message === 'Compra no encontrada'
          ? 404
          : error.message.includes('Solo se pueden') ||
            error.message.includes('ya ha sido') ||
            error.message.includes('No hay suficiente')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al reembolsar la compra',
      });
    }
  }

  /**
   * Actualizar estado de pago
   * PUT /api/v1/purchases/:id/payment-status
   */
  async updatePaymentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus, amountPaid } = req.body;

      if (!paymentStatus) {
        res.status(400).json({
          success: false,
          message: 'El estado de pago es requerido',
        });
        return;
      }

      const validStatuses = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'];
      if (!validStatuses.includes(paymentStatus)) {
        res.status(400).json({
          success: false,
          message: 'Estado de pago inválido',
        });
        return;
      }

      const purchase = await purchaseService.updatePaymentStatus(
        Number(id),
        paymentStatus,
        amountPaid ? Number(amountPaid) : undefined
      );

      res.status(200).json({
        success: true,
        message: 'Estado de pago actualizado exitosamente',
        data: purchase,
      });
    } catch (error: any) {
      console.error('Error al actualizar estado de pago:', error);
      const statusCode =
        error.message === 'Compra no encontrada'
          ? 404
          : error.message.includes('Solo se puede')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar el estado de pago',
      });
    }
  }

  /**
   * Obtener estadísticas de compras
   * GET /api/v1/purchases/stats/summary
   */
  async getPurchaseStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await purchaseService.getPurchaseStats();

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
      });
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las estadísticas',
      });
    }
  }

  /**
   * Obtener compras con pagos pendientes
   * GET /api/v1/purchases/pending-payment
   */
  async getPurchasesWithPendingPayment(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const purchases = await purchaseService.getPurchasesWithPendingPayment();

      res.status(200).json({
        success: true,
        message: 'Compras con pagos pendientes obtenidas exitosamente',
        data: purchases,
      });
    } catch (error: any) {
      console.error('Error al obtener compras con pagos pendientes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las compras con pagos pendientes',
      });
    }
  }

  /**
   * Obtener compras por proveedor
   * GET /api/v1/purchases/supplier/:supplierId
   */
  async getPurchasesBySupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { supplierId } = req.params;

      const purchases = await purchaseService.getPurchasesBySupplier(Number(supplierId));

      res.status(200).json({
        success: true,
        message: 'Compras obtenidas exitosamente',
        data: purchases,
      });
    } catch (error: any) {
      console.error('Error al obtener compras por proveedor:', error);
      res.status(error.message === 'Proveedor no encontrado' ? 404 : 500).json({
        success: false,
        message: error.message || 'Error al obtener las compras',
      });
    }
  }

  /**
   * Buscar compras
   * GET /api/v1/purchases/search
   */
  async searchPurchases(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { term } = req.query;

      if (!term) {
        res.status(400).json({
          success: false,
          message: 'El término de búsqueda es requerido',
        });
        return;
      }

      const purchases = await purchaseService.searchPurchases(term as string);

      res.status(200).json({
        success: true,
        message: 'Búsqueda completada exitosamente',
        data: purchases,
      });
    } catch (error: any) {
      console.error('Error al buscar compras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar compras',
      });
    }
  }

  /**
   * Eliminar compra
   * DELETE /api/v1/purchases/:id
   */
  async deletePurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await purchaseService.deletePurchase(Number(id));

      res.status(200).json({
        success: true,
        message: 'Compra eliminada exitosamente',
      });
    } catch (error: any) {
      console.error('Error al eliminar compra:', error);
      const statusCode =
        error.message === 'Compra no encontrada'
          ? 404
          : error.message.includes('Solo se pueden eliminar')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al eliminar la compra',
      });
    }
  }
}

export default new PurchaseController();
