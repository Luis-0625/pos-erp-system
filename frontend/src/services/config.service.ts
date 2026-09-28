import apiService from './api.service';
import { ApiResponse } from '../types';

interface Company {
  id: number;
  name: string;
  tradeName?: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaxRate {
  id: number;
  name: string;
  rate: number;
  type: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrencySettings {
  currency: string;
  decimalPlaces: number;
  symbol: string;
  symbolPosition: 'before' | 'after';
}

interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  footerText?: string;
  termsAndConditions?: string;
}

/**
 * Config Service
 * Gestiona todas las operaciones relacionadas con configuración del sistema
 */
class ConfigService {
  private readonly BASE_URL = '/config';

  /**
   * Obtener información de la empresa activa
   */
  async getActiveCompany(): Promise<Company> {
    const response = await apiService.get<ApiResponse<Company>>(
      `${this.BASE_URL}/company/active`
    );
    return response.data.data;
  }

  /**
   * Obtener una empresa por ID
   */
  async getCompanyById(id: number): Promise<Company> {
    const response = await apiService.get<ApiResponse<Company>>(
      `${this.BASE_URL}/company/${id}`
    );
    return response.data.data;
  }

  /**
   * Crear una nueva empresa
   */
  async createCompany(companyData: Partial<Company>): Promise<Company> {
    const response = await apiService.post<ApiResponse<Company>>(
      `${this.BASE_URL}/company`,
      companyData
    );
    return response.data.data;
  }

  /**
   * Actualizar información de la empresa
   */
  async updateCompany(id: number, companyData: Partial<Company>): Promise<Company> {
    const response = await apiService.put<ApiResponse<Company>>(
      `${this.BASE_URL}/company/${id}`,
      companyData
    );
    return response.data.data;
  }

  /**
   * Actualizar logo de la empresa
   */
  async updateCompanyLogo(id: number, logoFile: File): Promise<Company> {
    const formData = new FormData();
    formData.append('logo', logoFile);

    const response = await apiService.post<ApiResponse<Company>>(
      `${this.BASE_URL}/company/${id}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  /**
   * Obtener configuración de moneda
   */
  async getCurrencySettings(): Promise<CurrencySettings> {
    const response = await apiService.get<ApiResponse<CurrencySettings>>(
      `${this.BASE_URL}/currency`
    );
    return response.data.data;
  }

  /**
   * Actualizar configuración de moneda
   */
  async updateCurrencySettings(settings: CurrencySettings): Promise<CurrencySettings> {
    const response = await apiService.put<ApiResponse<CurrencySettings>>(
      `${this.BASE_URL}/currency`,
      settings
    );
    return response.data.data;
  }

  /**
   * Obtener configuración de facturación
   */
  async getInvoiceSettings(): Promise<InvoiceSettings> {
    const response = await apiService.get<ApiResponse<InvoiceSettings>>(
      `${this.BASE_URL}/invoice`
    );
    return response.data.data;
  }

  /**
   * Actualizar configuración de facturación
   */
  async updateInvoiceSettings(settings: InvoiceSettings): Promise<InvoiceSettings> {
    const response = await apiService.put<ApiResponse<InvoiceSettings>>(
      `${this.BASE_URL}/invoice`,
      settings
    );
    return response.data.data;
  }

  /**
   * Obtener todas las tasas de impuestos
   */
  async getTaxRates(): Promise<TaxRate[]> {
    const response = await apiService.get<ApiResponse<TaxRate[]>>(
      `${this.BASE_URL}/tax-rates`
    );
    return response.data.data;
  }

  /**
   * Obtener una tasa de impuesto por ID
   */
  async getTaxRateById(id: number): Promise<TaxRate> {
    const response = await apiService.get<ApiResponse<TaxRate>>(
      `${this.BASE_URL}/tax-rates/${id}`
    );
    return response.data.data;
  }

  /**
   * Crear una nueva tasa de impuesto
   */
  async createTaxRate(taxRateData: Partial<TaxRate>): Promise<TaxRate> {
    const response = await apiService.post<ApiResponse<TaxRate>>(
      `${this.BASE_URL}/tax-rates`,
      taxRateData
    );
    return response.data.data;
  }

  /**
   * Actualizar una tasa de impuesto
   */
  async updateTaxRate(id: number, taxRateData: Partial<TaxRate>): Promise<TaxRate> {
    const response = await apiService.put<ApiResponse<TaxRate>>(
      `${this.BASE_URL}/tax-rates/${id}`,
      taxRateData
    );
    return response.data.data;
  }

  /**
   * Eliminar una tasa de impuesto
   */
  async deleteTaxRate(id: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/tax-rates/${id}`);
  }

  /**
   * Establecer una tasa de impuesto como predeterminada
   */
  async setDefaultTaxRate(id: number): Promise<TaxRate> {
    const response = await apiService.patch<ApiResponse<TaxRate>>(
      `${this.BASE_URL}/tax-rates/${id}/set-default`
    );
    return response.data.data;
  }

  /**
   * Obtener todas las configuraciones del sistema
   */
  async getAllSettings(): Promise<{
    company: Company;
    currency: CurrencySettings;
    invoice: InvoiceSettings;
    taxRates: TaxRate[];
  }> {
    const response = await apiService.get<ApiResponse<any>>(
      `${this.BASE_URL}/all`
    );
    return response.data.data;
  }
}

export default new ConfigService();
