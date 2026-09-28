import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import portfolioService from '../services/portfolio.service';

class PortfolioController {
  // ==================== CUENTAS POR COBRAR ====================

  /**
   * Crear una cuenta por cobrar
   * POST /api/v1/portfolio/receivables
   */
  async createAccountReceivable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        clientId,
        saleId,
        documentNumber,
        documentType,
        issueDate,
        dueDate,
        originalAmount,
        notes,
      } = req.body;

      // Validaciones
      if (!clientId || !documentNumber || !issueDate || !dueDate || !originalAmount) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
        });
        return;
      }

      if (originalAmount <= 0) {
        res.status(400).json({
          success: false,
          message: 'El monto debe ser mayor a 0',
        });
        return;
      }

      const account = await portfolioService.createAccountReceivable({
        clientId,
        saleId,
        documentNumber,
        documentType: documentType || 'INVOICE',
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        originalAmount,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Cuenta por cobrar creada exitosamente',
        data: account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear cuenta por cobrar',
      });
    }
  }

  /**
   * Obtener cuenta por cobrar por ID
   * GET /api/v1/portfolio/receivables/:id
   */
  async getAccountReceivable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const account = await portfolioService.getAccountReceivableById(parseInt(id));

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Cuenta por cobrar no encontrada',
        });
        return;
      }

      res.json({
        success: true,
        data: account,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener cuenta por cobrar',
      });
    }
  }

  /**
   * Listar cuentas por cobrar
   * GET /api/v1/portfolio/receivables
   */
  async listAccountsReceivable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        status,
        clientId,
        documentType,
        fromDate,
        toDate,
        minAmount,
        maxAmount,
        page,
        limit,
      } = req.query;

      const result = await portfolioService.listAccountsReceivable({
        status: status as any,
        clientId: clientId ? parseInt(clientId as string) : undefined,
        documentType: documentType as string,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json({
        success: true,
        data: result.accounts,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al listar cuentas por cobrar',
      });
    }
  }

  /**
   * Actualizar cuenta por cobrar
   * PUT /api/v1/portfolio/receivables/:id
   */
  async updateAccountReceivable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const account = await portfolioService.updateAccountReceivable(
        parseInt(id),
        updateData
      );

      res.json({
        success: true,
        message: 'Cuenta por cobrar actualizada exitosamente',
        data: account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar cuenta por cobrar',
      });
    }
  }

  /**
   * Obtener cuentas vencidas por cobrar
   * GET /api/v1/portfolio/receivables/overdue
   */
  async getOverdueReceivables(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const accounts = await portfolioService.getOverdueReceivables();

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener cuentas vencidas',
      });
    }
  }

  // ==================== CUENTAS POR PAGAR ====================

  /**
   * Crear una cuenta por pagar
   * POST /api/v1/portfolio/payables
   */
  async createAccountPayable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        supplierId,
        purchaseId,
        documentNumber,
        documentType,
        issueDate,
        dueDate,
        originalAmount,
        notes,
      } = req.body;

      // Validaciones
      if (!supplierId || !documentNumber || !issueDate || !dueDate || !originalAmount) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
        });
        return;
      }

      if (originalAmount <= 0) {
        res.status(400).json({
          success: false,
          message: 'El monto debe ser mayor a 0',
        });
        return;
      }

      const account = await portfolioService.createAccountPayable({
        supplierId,
        purchaseId,
        documentNumber,
        documentType: documentType || 'INVOICE',
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        originalAmount,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Cuenta por pagar creada exitosamente',
        data: account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear cuenta por pagar',
      });
    }
  }

  /**
   * Obtener cuenta por pagar por ID
   * GET /api/v1/portfolio/payables/:id
   */
  async getAccountPayable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const account = await portfolioService.getAccountPayableById(parseInt(id));

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Cuenta por pagar no encontrada',
        });
        return;
      }

      res.json({
        success: true,
        data: account,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener cuenta por pagar',
      });
    }
  }

  /**
   * Listar cuentas por pagar
   * GET /api/v1/portfolio/payables
   */
  async listAccountsPayable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        status,
        supplierId,
        documentType,
        fromDate,
        toDate,
        minAmount,
        maxAmount,
        page,
        limit,
      } = req.query;

      const result = await portfolioService.listAccountsPayable({
        status: status as any,
        supplierId: supplierId ? parseInt(supplierId as string) : undefined,
        documentType: documentType as string,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json({
        success: true,
        data: result.accounts,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al listar cuentas por pagar',
      });
    }
  }

  /**
   * Actualizar cuenta por pagar
   * PUT /api/v1/portfolio/payables/:id
   */
  async updateAccountPayable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const account = await portfolioService.updateAccountPayable(parseInt(id), updateData);

      res.json({
        success: true,
        message: 'Cuenta por pagar actualizada exitosamente',
        data: account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar cuenta por pagar',
      });
    }
  }

  /**
   * Obtener cuentas vencidas por pagar
   * GET /api/v1/portfolio/payables/overdue
   */
  async getOverduePayables(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const accounts = await portfolioService.getOverduePayables();

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener cuentas vencidas',
      });
    }
  }

  // ==================== PAGOS ====================

  /**
   * Registrar un pago
   * POST /api/v1/portfolio/payments
   */
  async createPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        accountType,
        accountId,
        paymentDate,
        amount,
        paymentMethod,
        reference,
        notes,
      } = req.body;

      const userId = req.user?.id;

      // Validaciones
      if (!accountType || !accountId || !amount || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
        });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'El monto debe ser mayor a 0',
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const payment = await portfolioService.createPayment({
        accountType,
        accountId: parseInt(accountId),
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        amount,
        paymentMethod,
        reference,
        notes,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Pago registrado exitosamente',
        data: payment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar pago',
      });
    }
  }

  /**
   * Obtener pago por ID
   * GET /api/v1/portfolio/payments/:id
   */
  async getPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const payment = await portfolioService.getPaymentById(parseInt(id));

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Pago no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener pago',
      });
    }
  }

  /**
   * Listar pagos
   * GET /api/v1/portfolio/payments
   */
  async listPayments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        accountType,
        accountId,
        paymentMethod,
        fromDate,
        toDate,
        userId,
        page,
        limit,
      } = req.query;

      const result = await portfolioService.listPayments({
        accountType: accountType as any,
        accountId: accountId ? parseInt(accountId as string) : undefined,
        paymentMethod: paymentMethod as string,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json({
        success: true,
        data: result.payments,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al listar pagos',
      });
    }
  }

  /**
   * Anular un pago
   * DELETE /api/v1/portfolio/payments/:id
   */
  async cancelPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await portfolioService.cancelPayment(parseInt(id));

      res.json({
        success: true,
        message: 'Pago anulado exitosamente',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al anular pago',
      });
    }
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas de cartera
   * GET /api/v1/portfolio/stats
   */
  async getPortfolioStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await portfolioService.getPortfolioStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener estadísticas',
      });
    }
  }

  /**
   * Obtener flujo de caja proyectado
   * GET /api/v1/portfolio/cash-flow
   */
  async getCashFlow(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { days } = req.query;

      const cashFlow = await portfolioService.getCashFlow(
        days ? parseInt(days as string) : 30
      );

      res.json({
        success: true,
        data: cashFlow,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener flujo de caja',
      });
    }
  }

  /**
   * Dar de baja una cuenta
   * POST /api/v1/portfolio/write-off
   */
  async writeOffAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { accountType, accountId, notes } = req.body;

      if (!accountType || !accountId) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
        });
        return;
      }

      await portfolioService.writeOffAccount(accountType, parseInt(accountId), notes);

      res.json({
        success: true,
        message: 'Cuenta dada de baja exitosamente',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al dar de baja cuenta',
      });
    }
  }
}

export default new PortfolioController();
