import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import configService from '../services/config.service';

class ConfigController {
  // ============= EMPRESA =============

  /**
   * Crear empresa (configuración inicial)
   */
  async createCompany(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        legalName,
        taxId,
        taxIdType,
        email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        website,
        logo,
        currency,
        currencySymbol,
        decimalPlaces,
        taxRate,
        invoicePrefix,
        invoiceStartNumber,
        invoiceFooter,
        fiscalYearStart,
        dateFormat,
        timeFormat,
        timezone,
      } = req.body;

      // Validar campos requeridos
      if (!name || !legalName || !taxId || !taxIdType || !email || !phone || !address || !city || !state || !country) {
        res.status(400).json({
          success: false,
          message: 'Todos los campos requeridos deben ser proporcionados',
        });
        return;
      }

      const company = await configService.createCompany({
        name,
        legalName,
        taxId,
        taxIdType,
        email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        website,
        logo,
        currency,
        currencySymbol,
        decimalPlaces,
        taxRate,
        invoicePrefix,
        invoiceStartNumber,
        invoiceFooter,
        fiscalYearStart,
        dateFormat,
        timeFormat,
        timezone,
      });

      res.status(201).json({
        success: true,
        message: 'Empresa creada exitosamente',
        data: company,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la empresa',
      });
    }
  }

  /**
   * Obtener empresa activa
   */
  async getActiveCompany(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const company = await configService.getActiveCompany();

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'No hay empresa configurada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la empresa',
      });
    }
  }

  /**
   * Obtener empresa por ID
   */
  async getCompany(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await configService.getCompanyById(parseInt(id));

      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Empresa no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la empresa',
      });
    }
  }

  /**
   * Actualizar empresa
   */
  async updateCompany(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const company = await configService.updateCompany(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Empresa actualizada exitosamente',
        data: company,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la empresa',
      });
    }
  }

  /**
   * Actualizar logo de la empresa
   */
  async updateCompanyLogo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { logoUrl } = req.body;

      if (!logoUrl) {
        res.status(400).json({
          success: false,
          message: 'URL del logo es requerida',
        });
        return;
      }

      const company = await configService.updateCompanyLogo(parseInt(id), logoUrl);

      res.status(200).json({
        success: true,
        message: 'Logo actualizado exitosamente',
        data: company,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el logo',
      });
    }
  }

  /**
   * Obtener configuración de moneda
   */
  async getCurrencySettings(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await configService.getCurrencySettings();

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener configuración de moneda',
      });
    }
  }

  /**
   * Obtener configuración de facturación
   */
  async getInvoiceSettings(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await configService.getInvoiceSettings();

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener configuración de facturación',
      });
    }
  }

  // ============= TASAS DE IMPUESTOS =============

  /**
   * Crear tasa de impuesto
   */
  async createTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        rate,
        type,
        isDefault,
        applyToProducts,
        applyToServices,
        taxCode,
        country,
        effectiveFrom,
        effectiveTo,
      } = req.body;

      // Validar campos requeridos
      if (!name || rate === undefined || !type) {
        res.status(400).json({
          success: false,
          message: 'Nombre, tasa y tipo son requeridos',
        });
        return;
      }

      // Validar que la tasa sea un número válido
      if (isNaN(rate) || rate < 0 || rate > 100) {
        res.status(400).json({
          success: false,
          message: 'La tasa debe ser un número entre 0 y 100',
        });
        return;
      }

      const taxRate = await configService.createTaxRate({
        name,
        description,
        rate: parseFloat(rate),
        type,
        isDefault,
        applyToProducts,
        applyToServices,
        taxCode,
        country,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
        effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
      });

      res.status(201).json({
        success: true,
        message: 'Tasa de impuesto creada exitosamente',
        data: taxRate,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la tasa de impuesto',
      });
    }
  }

  /**
   * Listar tasas de impuestos
   */
  async listTaxRates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type, isActive, isDefault, country } = req.query;

      const filters: any = {};

      if (type) {
        filters.type = type as string;
      }

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      if (isDefault !== undefined) {
        filters.isDefault = isDefault === 'true';
      }

      if (country) {
        filters.country = country as string;
      }

      const taxRates = await configService.listTaxRates(filters);

      res.status(200).json({
        success: true,
        data: taxRates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al listar tasas de impuestos',
      });
    }
  }

  /**
   * Obtener tasa de impuesto por ID
   */
  async getTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taxRate = await configService.getTaxRateById(parseInt(id));

      if (!taxRate) {
        res.status(404).json({
          success: false,
          message: 'Tasa de impuesto no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: taxRate,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la tasa de impuesto',
      });
    }
  }

  /**
   * Actualizar tasa de impuesto
   */
  async updateTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validar tasa si se proporciona
      if (updateData.rate !== undefined) {
        const rate = parseFloat(updateData.rate);
        if (isNaN(rate) || rate < 0 || rate > 100) {
          res.status(400).json({
            success: false,
            message: 'La tasa debe ser un número entre 0 y 100',
          });
          return;
        }
        updateData.rate = rate;
      }

      // Convertir fechas si se proporcionan
      if (updateData.effectiveFrom) {
        updateData.effectiveFrom = new Date(updateData.effectiveFrom);
      }
      if (updateData.effectiveTo) {
        updateData.effectiveTo = new Date(updateData.effectiveTo);
      }

      const taxRate = await configService.updateTaxRate(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Tasa de impuesto actualizada exitosamente',
        data: taxRate,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la tasa de impuesto',
      });
    }
  }

  /**
   * Eliminar (desactivar) tasa de impuesto
   */
  async deleteTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await configService.deleteTaxRate(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Tasa de impuesto desactivada exitosamente',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al eliminar la tasa de impuesto',
      });
    }
  }

  /**
   * Obtener tasa predeterminada por tipo
   */
  async getDefaultTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      if (!['SALES', 'PURCHASE', 'WITHHOLDING', 'OTHER'].includes(type)) {
        res.status(400).json({
          success: false,
          message: 'Tipo de tasa inválido',
        });
        return;
      }

      const taxRate = await configService.getDefaultTaxRate(type as 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER');

      if (!taxRate) {
        res.status(404).json({
          success: false,
          message: 'No hay tasa predeterminada para este tipo',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: taxRate,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la tasa predeterminada',
      });
    }
  }

  /**
   * Establecer tasa como predeterminada
   */
  async setDefaultTaxRate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const taxRate = await configService.setDefaultTaxRate(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Tasa establecida como predeterminada',
        data: taxRate,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al establecer tasa predeterminada',
      });
    }
  }

  /**
   * Obtener tasas vigentes
   */
  async getEffectiveTaxRates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { date } = req.query;

      const effectiveDate = date ? new Date(date as string) : new Date();

      const taxRates = await configService.getEffectiveTaxRates(effectiveDate);

      res.status(200).json({
        success: true,
        data: taxRates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener tasas vigentes',
      });
    }
  }

  /**
   * Calcular impuesto de ventas
   */
  async calculateSalesTax(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { baseAmount, taxRateId } = req.body;

      if (!baseAmount || isNaN(baseAmount)) {
        res.status(400).json({
          success: false,
          message: 'Monto base es requerido y debe ser un número',
        });
        return;
      }

      const calculation = await configService.calculateSalesTax(
        parseFloat(baseAmount),
        taxRateId ? parseInt(taxRateId) : undefined
      );

      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al calcular impuesto',
      });
    }
  }

  /**
   * Calcular impuesto de compras
   */
  async calculatePurchaseTax(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { baseAmount, taxRateId } = req.body;

      if (!baseAmount || isNaN(baseAmount)) {
        res.status(400).json({
          success: false,
          message: 'Monto base es requerido y debe ser un número',
        });
        return;
      }

      const calculation = await configService.calculatePurchaseTax(
        parseFloat(baseAmount),
        taxRateId ? parseInt(taxRateId) : undefined
      );

      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al calcular impuesto',
      });
    }
  }

  /**
   * Calcular múltiples impuestos
   */
  async calculateMultipleTaxes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { baseAmount, taxRateIds } = req.body;

      if (!baseAmount || isNaN(baseAmount)) {
        res.status(400).json({
          success: false,
          message: 'Monto base es requerido y debe ser un número',
        });
        return;
      }

      if (!Array.isArray(taxRateIds) || taxRateIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'IDs de tasas de impuesto son requeridos',
        });
        return;
      }

      const calculation = await configService.calculateMultipleTaxes(
        parseFloat(baseAmount),
        taxRateIds.map((id: any) => parseInt(id))
      );

      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al calcular impuestos',
      });
    }
  }
}

export default new ConfigController();
