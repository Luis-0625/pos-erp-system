import { Op } from 'sequelize';
import Company from '../models/Company.model';
import TaxRate from '../models/TaxRate.model';

interface CreateCompanyDTO {
  name: string;
  legalName: string;
  taxId: string;
  taxIdType: 'RUC' | 'NIT' | 'RFC' | 'CUIT' | 'OTHER';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  website?: string;
  logo?: string;
  currency?: string;
  currencySymbol?: string;
  decimalPlaces?: number;
  taxRate?: number;
  invoicePrefix?: string;
  invoiceStartNumber?: number;
  invoiceFooter?: string;
  fiscalYearStart?: number;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  timezone?: string;
}

interface UpdateCompanyDTO extends Partial<CreateCompanyDTO> {}

interface CreateTaxRateDTO {
  name: string;
  description?: string;
  rate: number;
  type: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  isDefault?: boolean;
  applyToProducts?: boolean;
  applyToServices?: boolean;
  taxCode?: string;
  country?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
}

interface UpdateTaxRateDTO extends Partial<CreateTaxRateDTO> {}

interface ListTaxRatesFilters {
  type?: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  isActive?: boolean;
  isDefault?: boolean;
  country?: string;
}

class ConfigService {
  // ============= GESTIÓN DE EMPRESA =============

  /**
   * Crear una nueva empresa (configuración inicial)
   */
  async createCompany(data: CreateCompanyDTO): Promise<Company> {
    // Verificar que no exista otra empresa activa
    const existingCompany = await Company.findOne({
      where: { isActive: true },
    });

    if (existingCompany) {
      throw new Error('Ya existe una empresa activa en el sistema');
    }

    const company = await Company.create({
      name: data.name,
      legalName: data.legalName,
      taxId: data.taxId,
      taxIdType: data.taxIdType,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      website: data.website,
      logo: data.logo,
      currency: data.currency || 'USD',
      currencySymbol: data.currencySymbol || '$',
      decimalPlaces: data.decimalPlaces || 2,
      taxRate: data.taxRate || 0,
      invoicePrefix: data.invoicePrefix || 'INV',
      invoiceStartNumber: data.invoiceStartNumber || 1,
      invoiceFooter: data.invoiceFooter,
      fiscalYearStart: data.fiscalYearStart || 1,
      dateFormat: data.dateFormat || 'DD/MM/YYYY',
      timeFormat: data.timeFormat || '24h',
      timezone: data.timezone || 'UTC',
      isActive: true,
    } as any);

    return company;
  }

  /**
   * Obtener la empresa activa
   */
  async getActiveCompany(): Promise<Company | null> {
    const company = await Company.findOne({
      where: { isActive: true },
    });

    return company;
  }

  /**
   * Obtener empresa por ID
   */
  async getCompanyById(id: number): Promise<Company | null> {
    const company = await Company.findByPk(id);
    return company;
  }

  /**
   * Actualizar información de la empresa
   */
  async updateCompany(id: number, data: UpdateCompanyDTO): Promise<Company> {
    const company = await this.getCompanyById(id);

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    // Si se está cambiando el taxId, verificar que no esté en uso
    if (data.taxId && data.taxId !== company.taxId) {
      const existingTaxId = await Company.findOne({
        where: {
          taxId: data.taxId,
          id: { [Op.ne]: id },
        },
      });

      if (existingTaxId) {
        throw new Error('Este identificador fiscal ya está en uso');
      }
    }

    await company.update(data);
    return company;
  }

  /**
   * Actualizar logo de la empresa
   */
  async updateCompanyLogo(id: number, logoUrl: string): Promise<Company> {
    const company = await this.getCompanyById(id);

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    await company.update({ logo: logoUrl });
    return company;
  }

  /**
   * Obtener configuración de moneda
   */
  async getCurrencySettings(): Promise<{
    currency: string;
    currencySymbol: string;
    decimalPlaces: number;
  }> {
    const company = await this.getActiveCompany();

    if (!company) {
      throw new Error('No hay empresa configurada');
    }

    return {
      currency: company.currency,
      currencySymbol: company.currencySymbol,
      decimalPlaces: company.decimalPlaces,
    };
  }

  /**
   * Obtener configuración de facturación
   */
  async getInvoiceSettings(): Promise<{
    prefix: string;
    startNumber: number;
    footer?: string;
  }> {
    const company = await this.getActiveCompany();

    if (!company) {
      throw new Error('No hay empresa configurada');
    }

    return {
      prefix: company.invoicePrefix,
      startNumber: company.invoiceStartNumber,
      footer: company.invoiceFooter,
    };
  }

  // ============= GESTIÓN DE TASAS DE IMPUESTOS =============

  /**
   * Crear una nueva tasa de impuesto
   */
  async createTaxRate(data: CreateTaxRateDTO): Promise<TaxRate> {
    const taxRate = await TaxRate.create({
      name: data.name,
      description: data.description,
      rate: data.rate,
      type: data.type,
      isDefault: data.isDefault || false,
      isActive: true,
      applyToProducts: data.applyToProducts !== undefined ? data.applyToProducts : true,
      applyToServices: data.applyToServices !== undefined ? data.applyToServices : true,
      taxCode: data.taxCode,
      country: data.country,
      effectiveFrom: data.effectiveFrom,
      effectiveTo: data.effectiveTo,
    } as any);

    return taxRate;
  }

  /**
   * Obtener tasa de impuesto por ID
   */
  async getTaxRateById(id: number): Promise<TaxRate | null> {
    const taxRate = await TaxRate.findByPk(id);
    return taxRate;
  }

  /**
   * Listar tasas de impuestos con filtros
   */
  async listTaxRates(filters: ListTaxRatesFilters = {}) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isDefault !== undefined) {
      where.isDefault = filters.isDefault;
    }

    if (filters.country) {
      where.country = filters.country;
    }

    const taxRates = await TaxRate.findAll({
      where,
      order: [
        ['isDefault', 'DESC'],
        ['type', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return taxRates;
  }

  /**
   * Actualizar tasa de impuesto
   */
  async updateTaxRate(id: number, data: UpdateTaxRateDTO): Promise<TaxRate> {
    const taxRate = await this.getTaxRateById(id);

    if (!taxRate) {
      throw new Error('Tasa de impuesto no encontrada');
    }

    await taxRate.update(data);
    return taxRate;
  }

  /**
   * Eliminar (desactivar) tasa de impuesto
   */
  async deleteTaxRate(id: number): Promise<void> {
    const taxRate = await this.getTaxRateById(id);

    if (!taxRate) {
      throw new Error('Tasa de impuesto no encontrada');
    }

    // No permitir eliminar la tasa predeterminada
    if (taxRate.isDefault) {
      throw new Error('No se puede eliminar la tasa de impuesto predeterminada');
    }

    await taxRate.update({ isActive: false });
  }

  /**
   * Obtener tasa de impuesto predeterminada por tipo
   */
  async getDefaultTaxRate(type: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER'): Promise<TaxRate | null> {
    const taxRate = await TaxRate.findOne({
      where: {
        type,
        isDefault: true,
        isActive: true,
      },
    });

    return taxRate;
  }

  /**
   * Establecer una tasa como predeterminada
   */
  async setDefaultTaxRate(id: number): Promise<TaxRate> {
    const taxRate = await this.getTaxRateById(id);

    if (!taxRate) {
      throw new Error('Tasa de impuesto no encontrada');
    }

    if (!taxRate.isActive) {
      throw new Error('No se puede establecer como predeterminada una tasa inactiva');
    }

    await taxRate.update({ isDefault: true });
    return taxRate;
  }

  /**
   * Obtener tasas de impuestos vigentes en una fecha
   */
  async getEffectiveTaxRates(date: Date = new Date()): Promise<TaxRate[]> {
    // Obtener todas las tasas activas y filtrar por fechas
    const allTaxRates = await TaxRate.findAll({
      where: {
        isActive: true,
      },
      order: [
        ['type', 'ASC'],
        ['isDefault', 'DESC'],
        ['name', 'ASC'],
      ],
    });

    // Filtrar por fechas de vigencia
    const taxRates = allTaxRates.filter((taxRate) => taxRate.isEffective(date));

    return taxRates;
  }

  /**
   * Calcular impuesto de ventas para un monto
   */
  async calculateSalesTax(baseAmount: number, taxRateId?: number): Promise<{
    baseAmount: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    let taxRate: TaxRate | null;

    if (taxRateId) {
      taxRate = await this.getTaxRateById(taxRateId);
      if (!taxRate || !taxRate.isActive) {
        throw new Error('Tasa de impuesto no válida');
      }
    } else {
      taxRate = await this.getDefaultTaxRate('SALES');
      if (!taxRate) {
        throw new Error('No hay tasa de impuesto predeterminada para ventas');
      }
    }

    const taxAmount = taxRate.calculateTax(baseAmount);
    const totalAmount = baseAmount + taxAmount;

    return {
      baseAmount,
      taxRate: parseFloat(taxRate.rate.toString()),
      taxAmount,
      totalAmount,
    };
  }

  /**
   * Calcular impuesto de compras para un monto
   */
  async calculatePurchaseTax(baseAmount: number, taxRateId?: number): Promise<{
    baseAmount: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    let taxRate: TaxRate | null;

    if (taxRateId) {
      taxRate = await this.getTaxRateById(taxRateId);
      if (!taxRate || !taxRate.isActive) {
        throw new Error('Tasa de impuesto no válida');
      }
    } else {
      taxRate = await this.getDefaultTaxRate('PURCHASE');
      if (!taxRate) {
        throw new Error('No hay tasa de impuesto predeterminada para compras');
      }
    }

    const taxAmount = taxRate.calculateTax(baseAmount);
    const totalAmount = baseAmount + taxAmount;

    return {
      baseAmount,
      taxRate: parseFloat(taxRate.rate.toString()),
      taxAmount,
      totalAmount,
    };
  }

  /**
   * Calcular múltiples impuestos sobre un monto base
   */
  async calculateMultipleTaxes(baseAmount: number, taxRateIds: number[]): Promise<{
    baseAmount: number;
    taxes: Array<{
      taxRateId: number;
      name: string;
      rate: number;
      amount: number;
    }>;
    totalTaxAmount: number;
    totalAmount: number;
  }> {
    const taxes = [];
    let totalTaxAmount = 0;

    for (const taxRateId of taxRateIds) {
      const taxRate = await this.getTaxRateById(taxRateId);

      if (!taxRate) {
        throw new Error(`Tasa de impuesto con ID ${taxRateId} no encontrada`);
      }

      if (!taxRate.isActive) {
        throw new Error(`Tasa de impuesto "${taxRate.name}" no está activa`);
      }

      const taxAmount = taxRate.calculateTax(baseAmount);
      totalTaxAmount += taxAmount;

      taxes.push({
        taxRateId: taxRate.id,
        name: taxRate.name,
        rate: parseFloat(taxRate.rate.toString()),
        amount: taxAmount,
      });
    }

    return {
      baseAmount,
      taxes,
      totalTaxAmount,
      totalAmount: baseAmount + totalTaxAmount,
    };
  }

  /**
   * Obtener todas las configuraciones del sistema
   */
  async getAllSettings() {
    const company = await this.getActiveCompany();
    const taxRates = await this.listTaxRates({ isActive: true });

    return {
      company,
      taxRates: {
        all: taxRates,
        sales: await this.getDefaultTaxRate('SALES'),
        purchase: await this.getDefaultTaxRate('PURCHASE'),
        withholding: await this.getDefaultTaxRate('WITHHOLDING'),
      },
    };
  }
}

export default new ConfigService();
