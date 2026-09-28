import { Response } from 'express';
import reportService from '../services/report.service';
import { AuthenticatedRequest } from '../types';

class ReportController {
  /**
   * GET /api/v1/reports/sales
   * Obtiene el reporte de ventas por período
   */
  async getSalesReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getSalesReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de ventas',
      });
    }
  }

  /**
   * GET /api/v1/reports/sales/by-product
   * Obtiene el reporte de ventas por producto
   */
  async getSalesByProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getSalesByProduct({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de ventas por producto',
      });
    }
  }

  /**
   * GET /api/v1/reports/sales/by-client
   * Obtiene el reporte de ventas por cliente
   */
  async getSalesByClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getSalesByClient({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de ventas por cliente',
      });
    }
  }

  /**
   * GET /api/v1/reports/purchases
   * Obtiene el reporte de compras por período
   */
  async getPurchasesReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getPurchasesReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de compras',
      });
    }
  }

  /**
   * GET /api/v1/reports/purchases/by-supplier
   * Obtiene el reporte de compras por proveedor
   */
  async getPurchasesBySupplier(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getPurchasesBySupplier({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de compras por proveedor',
      });
    }
  }

  /**
   * GET /api/v1/reports/profit-loss
   * Obtiene el estado de resultados (P&L)
   */
  async getProfitAndLossReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getProfitAndLossReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de estado de resultados',
      });
    }
  }

  /**
   * GET /api/v1/reports/cash-flow
   * Obtiene el reporte de flujo de efectivo
   */
  async getCashFlowReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getCashFlowReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de flujo de efectivo',
      });
    }
  }

  /**
   * GET /api/v1/reports/accounts-receivable
   * Obtiene el reporte de cuentas por cobrar (aging)
   */
  async getAccountsReceivableReport(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const report = await reportService.getAccountsReceivableReport();

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de cuentas por cobrar',
      });
    }
  }

  /**
   * GET /api/v1/reports/accounts-payable
   * Obtiene el reporte de cuentas por pagar (aging)
   */
  async getAccountsPayableReport(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const report = await reportService.getAccountsPayableReport();

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de cuentas por pagar',
      });
    }
  }

  /**
   * GET /api/v1/reports/inventory
   * Obtiene el reporte de inventario valorizado
   */
  async getInventoryReport(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const report = await reportService.getInventoryReport();

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte de inventario',
      });
    }
  }

  /**
   * GET /api/v1/reports/dashboard
   * Obtiene el reporte del dashboard ejecutivo con KPIs
   */
  async getDashboardReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos',
        });
        return;
      }

      const report = await reportService.getDashboardReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar reporte del dashboard',
      });
    }
  }

}

export default new ReportController();
