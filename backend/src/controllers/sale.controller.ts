import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import saleService from '../services/sale.service';

class SaleController {
  /**
   * Crear una nueva venta
   * POST /api/v1/sales
   */
  async createSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { saleDate, clientId, paymentMethod, paymentStatus, status, notes, details } = req.body;

      // Validar campos requeridos
      if (!saleDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha de venta es requerida'
        });
        return;
      }

      if (!paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'El método de pago es requerido'
        });
        return;
      }

      if (!details || !Array.isArray(details) || details.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Los detalles de la venta son requeridos'
        });
        return;
      }

      // Validar cada detalle
      for (const detail of details) {
        if (!detail.productId || !detail.quantity || !detail.unitPrice) {
          res.status(400).json({
            success: false,
            message: 'Cada detalle debe tener productId, quantity y unitPrice'
          });
          return;
        }

        if (detail.quantity <= 0) {
          res.status(400).json({
            success: false,
            message: 'La cantidad debe ser mayor a 0'
          });
          return;
        }

        if (detail.unitPrice < 0) {
          res.status(400).json({
            success: false,
            message: 'El precio unitario no puede ser negativo'
          });
          return;
        }
      }

      const sale = await saleService.createSale({
        saleDate: new Date(saleDate),
        clientId,
        userId: req.user!.id,
        paymentMethod,
        paymentStatus,
        status,
        notes,
        details
      });

      res.status(201).json({
        success: true,
        message: 'Venta creada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      
      if (error instanceof Error) {
        if (error.message === 'CLIENT_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Cliente no encontrado'
          });
          return;
        }

        if (error.message === 'CLIENT_INACTIVE') {
          res.status(400).json({
            success: false,
            message: 'El cliente está inactivo'
          });
          return;
        }

        if (error.message === 'USER_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
          });
          return;
        }

        if (error.message === 'SALE_DETAILS_REQUIRED') {
          res.status(400).json({
            success: false,
            message: 'Los detalles de la venta son requeridos'
          });
          return;
        }

        if (error.message.startsWith('PRODUCT_NOT_FOUND')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }

        if (error.message.startsWith('PRODUCT_INACTIVE')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }

        if (error.message.startsWith('INSUFFICIENT_STOCK')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear la venta'
      });
    }
  }

  /**
   * Listar ventas con filtros
   * GET /api/v1/sales
   */
  async listSales(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '20',
        search,
        saleNumber,
        clientId,
        userId,
        status,
        paymentStatus,
        paymentMethod,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        sortBy = 'saleDate',
        sortOrder = 'DESC'
      } = req.query;

      const result = await saleService.listSales({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        saleNumber: saleNumber as string,
        clientId: clientId ? parseInt(clientId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        status: status as string,
        paymentStatus: paymentStatus as string,
        paymentMethod: paymentMethod as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });

      res.status(200).json({
        success: true,
        message: 'Ventas obtenidas exitosamente',
        data: result.sales,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      console.error('Error listing sales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar las ventas'
      });
    }
  }

  /**
   * Obtener una venta por ID
   * GET /api/v1/sales/:id
   */
  async getSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const sale = await saleService.getSaleById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Venta obtenida exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error getting sale:', error);

      if (error instanceof Error && error.message === 'SALE_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Venta no encontrada'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al obtener la venta'
      });
    }
  }

  /**
   * Obtener una venta por número
   * GET /api/v1/sales/number/:saleNumber
   */
  async getSaleByNumber(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { saleNumber } = req.params;

      const sale = await saleService.getSaleByNumber(saleNumber);

      res.status(200).json({
        success: true,
        message: 'Venta obtenida exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error getting sale by number:', error);

      if (error instanceof Error && error.message === 'SALE_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Venta no encontrada'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al obtener la venta'
      });
    }
  }

  /**
   * Actualizar una venta
   * PUT /api/v1/sales/:id
   */
  async updateSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { saleDate, clientId, paymentMethod, paymentStatus, status, notes } = req.body;

      const sale = await saleService.updateSale(parseInt(id), {
        saleDate: saleDate ? new Date(saleDate) : undefined,
        clientId,
        paymentMethod,
        paymentStatus,
        status,
        notes
      });

      res.status(200).json({
        success: true,
        message: 'Venta actualizada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error updating sale:', error);

      if (error instanceof Error) {
        if (error.message === 'SALE_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Venta no encontrada'
          });
          return;
        }

        if (error.message === 'CANNOT_UPDATE_CANCELLED_OR_REFUNDED_SALE') {
          res.status(400).json({
            success: false,
            message: 'No se puede actualizar una venta cancelada o reembolsada'
          });
          return;
        }

        if (error.message === 'CLIENT_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Cliente no encontrado'
          });
          return;
        }

        if (error.message === 'CLIENT_INACTIVE') {
          res.status(400).json({
            success: false,
            message: 'El cliente está inactivo'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar la venta'
      });
    }
  }

  /**
   * Cancelar una venta
   * POST /api/v1/sales/:id/cancel
   */
  async cancelSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const sale = await saleService.cancelSale(parseInt(id), reason);

      res.status(200).json({
        success: true,
        message: 'Venta cancelada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error cancelling sale:', error);

      if (error instanceof Error) {
        if (error.message === 'SALE_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Venta no encontrada'
          });
          return;
        }

        if (error.message === 'SALE_ALREADY_CANCELLED') {
          res.status(400).json({
            success: false,
            message: 'La venta ya está cancelada'
          });
          return;
        }

        if (error.message === 'CANNOT_CANCEL_REFUNDED_SALE') {
          res.status(400).json({
            success: false,
            message: 'No se puede cancelar una venta reembolsada'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al cancelar la venta'
      });
    }
  }

  /**
   * Reembolsar una venta
   * POST /api/v1/sales/:id/refund
   */
  async refundSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        res.status(400).json({
          success: false,
          message: 'La razón del reembolso es requerida'
        });
        return;
      }

      const sale = await saleService.refundSale(parseInt(id), reason);

      res.status(200).json({
        success: true,
        message: 'Venta reembolsada exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error refunding sale:', error);

      if (error instanceof Error) {
        if (error.message === 'SALE_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Venta no encontrada'
          });
          return;
        }

        if (error.message === 'ONLY_COMPLETED_SALES_CAN_BE_REFUNDED') {
          res.status(400).json({
            success: false,
            message: 'Solo se pueden reembolsar ventas completadas'
          });
          return;
        }

        if (error.message === 'SALE_ALREADY_REFUNDED') {
          res.status(400).json({
            success: false,
            message: 'La venta ya está reembolsada'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al reembolsar la venta'
      });
    }
  }

  /**
   * Actualizar estado de pago
   * PATCH /api/v1/sales/:id/payment-status
   */
  async updatePaymentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus, paidAmount } = req.body;

      if (!paymentStatus) {
        res.status(400).json({
          success: false,
          message: 'El estado de pago es requerido'
        });
        return;
      }

      const validStatuses = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'];
      if (!validStatuses.includes(paymentStatus)) {
        res.status(400).json({
          success: false,
          message: 'Estado de pago inválido'
        });
        return;
      }

      const sale = await saleService.updatePaymentStatus(
        parseInt(id),
        paymentStatus,
        paidAmount ? parseFloat(paidAmount) : undefined
      );

      res.status(200).json({
        success: true,
        message: 'Estado de pago actualizado exitosamente',
        data: sale
      });
    } catch (error) {
      console.error('Error updating payment status:', error);

      if (error instanceof Error) {
        if (error.message === 'SALE_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Venta no encontrada'
          });
          return;
        }

        if (error.message === 'CANNOT_UPDATE_PAYMENT_FOR_CANCELLED_OR_REFUNDED_SALE') {
          res.status(400).json({
            success: false,
            message: 'No se puede actualizar el estado de pago de una venta cancelada o reembolsada'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado de pago'
      });
    }
  }

  /**
   * Obtener estadísticas de ventas
   * GET /api/v1/sales/stats
   */
  async getSaleStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate, clientId, userId } = req.query;

      const stats = await saleService.getSaleStats({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        clientId: clientId ? parseInt(clientId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined
      });

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      console.error('Error getting sale stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas'
      });
    }
  }

  /**
   * Obtener ventas pendientes de pago
   * GET /api/v1/sales/pending-payment
   */
  async getSalesWithPendingPayment(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sales = await saleService.getSalesWithPendingPayment();

      res.status(200).json({
        success: true,
        message: 'Ventas pendientes obtenidas exitosamente',
        data: sales
      });
    } catch (error) {
      console.error('Error getting sales with pending payment:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las ventas pendientes'
      });
    }
  }

  /**
   * Obtener ventas por cliente
   * GET /api/v1/sales/client/:clientId
   */
  async getSalesByClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;

      const sales = await saleService.getSalesByClient(parseInt(clientId));

      res.status(200).json({
        success: true,
        message: 'Ventas del cliente obtenidas exitosamente',
        data: sales
      });
    } catch (error) {
      console.error('Error getting sales by client:', error);

      if (error instanceof Error && error.message === 'CLIENT_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error al obtener las ventas del cliente'
      });
    }
  }

  /**
   * Buscar ventas
   * GET /api/v1/sales/search
   */
  async searchSales(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro de búsqueda es requerido'
        });
        return;
      }

      const sales = await saleService.searchSales(q);

      res.status(200).json({
        success: true,
        message: 'Búsqueda completada exitosamente',
        data: sales
      });
    } catch (error) {
      console.error('Error searching sales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar ventas'
      });
    }
  }

  /**
   * Eliminar una venta (solo borradores)
   * DELETE /api/v1/sales/:id
   */
  async deleteSale(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await saleService.deleteSale(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Venta eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting sale:', error);

      if (error instanceof Error) {
        if (error.message === 'SALE_NOT_FOUND') {
          res.status(404).json({
            success: false,
            message: 'Venta no encontrada'
          });
          return;
        }

        if (error.message === 'ONLY_DRAFT_SALES_CAN_BE_DELETED') {
          res.status(400).json({
            success: false,
            message: 'Solo se pueden eliminar ventas en borrador'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error al eliminar la venta'
      });
    }
  }
}

export default new SaleController();
