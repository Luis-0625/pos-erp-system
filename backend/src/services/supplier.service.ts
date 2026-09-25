import { Op } from 'sequelize';
import Supplier from '../models/Supplier.model';

interface CreateSupplierDTO {
  documentType: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  documentNumber: string;
  businessName: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  creditLimit?: number;
  paymentTerms?: number;
  notes?: string | null;
}

interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {}

interface ListSuppliersFilters {
  search?: string;
  isActive?: boolean;
  hasDebt?: boolean;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class SupplierService {
  /**
   * Crear un nuevo proveedor
   */
  async createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
    // Validar que no exista un proveedor con el mismo número de documento
    const existingSupplier = await Supplier.findOne({
      where: { documentNumber: data.documentNumber },
    });

    if (existingSupplier) {
      throw new Error('DOCUMENT_ALREADY_EXISTS');
    }

    // Validar nombre comercial
    if (!data.businessName || data.businessName.trim() === '') {
      throw new Error('BUSINESS_NAME_REQUIRED');
    }

    // Validar email si se proporciona
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('INVALID_EMAIL');
      }
    }

    const supplier = await Supplier.create({
      ...data,
      country: data.country || 'Colombia',
      creditLimit: data.creditLimit || 0,
      paymentTerms: data.paymentTerms || 30,
      currentBalance: 0,
      isActive: true,
    });

    return supplier;
  }

  /**
   * Obtener proveedor por ID
   */
  async getSupplierById(id: number): Promise<Supplier | null> {
    const supplier = await Supplier.findByPk(id);
    return supplier;
  }

  /**
   * Obtener proveedor por número de documento
   */
  async getSupplierByDocument(documentNumber: string): Promise<Supplier | null> {
    const supplier = await Supplier.findOne({
      where: { documentNumber },
    });
    return supplier;
  }

  /**
   * Listar proveedores con filtros
   */
  async listSuppliers(filters: ListSuppliersFilters = {}) {
    const {
      search,
      isActive,
      hasDebt,
      city,
      state,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const where: any = {};

    // Filtro de búsqueda (nombre, documento, email)
    if (search) {
      where[Op.or] = [
        { documentNumber: { [Op.iLike]: `%${search}%` } },
        { businessName: { [Op.iLike]: `%${search}%` } },
        { contactName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtro por estado activo
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Filtro por deuda
    if (hasDebt !== undefined) {
      where.currentBalance = hasDebt ? { [Op.gt]: 0 } : 0;
    }

    // Filtro por ciudad
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    // Filtro por departamento/estado
    if (state) {
      where.state = { [Op.iLike]: `%${state}%` };
    }

    const offset = (page - 1) * limit;

    const { rows: suppliers, count: total } = await Supplier.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Actualizar proveedor
   */
  async updateSupplier(id: number, data: UpdateSupplierDTO): Promise<Supplier> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    // Si se está actualizando el documento, validar que no exista
    if (data.documentNumber && data.documentNumber !== supplier.documentNumber) {
      const existingSupplier = await Supplier.findOne({
        where: { documentNumber: data.documentNumber },
      });

      if (existingSupplier) {
        throw new Error('DOCUMENT_ALREADY_EXISTS');
      }
    }

    // Validar nombre comercial
    if (data.businessName !== undefined && data.businessName.trim() === '') {
      throw new Error('BUSINESS_NAME_REQUIRED');
    }

    // Validar email si se proporciona
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('INVALID_EMAIL');
      }
    }

    await supplier.update(data);

    return await this.getSupplierById(id) as Supplier;
  }

  /**
   * Eliminar proveedor (soft delete)
   */
  async deleteSupplier(id: number): Promise<void> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    // No permitir eliminar proveedores con deuda
    if (supplier.currentBalance > 0) {
      throw new Error('SUPPLIER_HAS_DEBT');
    }

    await supplier.update({ isActive: false });
  }

  /**
   * Actualizar saldo del proveedor (deuda con el proveedor)
   */
  async updateBalance(id: number, amount: number, type: 'add' | 'subtract'): Promise<Supplier> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    if (!supplier.isActive) {
      throw new Error('SUPPLIER_INACTIVE');
    }

    const newBalance = type === 'add' 
      ? supplier.currentBalance + amount 
      : supplier.currentBalance - amount;

    if (newBalance < 0) {
      throw new Error('INVALID_BALANCE_OPERATION');
    }

    // Validar que no exceda el límite de crédito al agregar deuda
    if (type === 'add' && newBalance > supplier.creditLimit) {
      throw new Error('CREDIT_LIMIT_EXCEEDED');
    }

    await supplier.update({ currentBalance: newBalance });

    return await this.getSupplierById(id) as Supplier;
  }

  /**
   * Actualizar límite de crédito
   */
  async updateCreditLimit(id: number, newLimit: number): Promise<Supplier> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    if (newLimit < 0) {
      throw new Error('INVALID_CREDIT_LIMIT');
    }

    // No permitir reducir el límite por debajo del saldo actual
    if (newLimit < supplier.currentBalance) {
      throw new Error('CREDIT_LIMIT_BELOW_BALANCE');
    }

    await supplier.update({ creditLimit: newLimit });

    return await this.getSupplierById(id) as Supplier;
  }

  /**
   * Actualizar plazo de pago
   */
  async updatePaymentTerms(id: number, paymentTerms: number): Promise<Supplier> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    if (paymentTerms < 0) {
      throw new Error('INVALID_PAYMENT_TERMS');
    }

    await supplier.update({ paymentTerms });

    return await this.getSupplierById(id) as Supplier;
  }

  /**
   * Obtener proveedores con deuda
   */
  async getSuppliersWithDebt() {
    const suppliers = await Supplier.findAll({
      where: {
        currentBalance: { [Op.gt]: 0 },
        isActive: true,
      },
      order: [['currentBalance', 'DESC']],
    });

    return suppliers;
  }

  /**
   * Obtener estadísticas de proveedores
   */
  async getSupplierStats() {
    const totalSuppliers = await Supplier.count({ where: { isActive: true } });
    const suppliersWithDebt = await Supplier.count({
      where: { currentBalance: { [Op.gt]: 0 }, isActive: true },
    });

    const totalDebtResult = await Supplier.sum('currentBalance', {
      where: { isActive: true },
    });

    const totalCreditLimitResult = await Supplier.sum('creditLimit', {
      where: { isActive: true },
    });

    return {
      totalSuppliers,
      suppliersWithDebt,
      totalDebt: totalDebtResult || 0,
      totalCreditLimit: totalCreditLimitResult || 0,
      availableCredit: (totalCreditLimitResult || 0) - (totalDebtResult || 0),
    };
  }

  /**
   * Buscar proveedores
   */
  async searchSuppliers(term: string) {
    const suppliers = await Supplier.findAll({
      where: {
        [Op.or]: [
          { documentNumber: { [Op.iLike]: `%${term}%` } },
          { businessName: { [Op.iLike]: `%${term}%` } },
          { contactName: { [Op.iLike]: `%${term}%` } },
          { email: { [Op.iLike]: `%${term}%` } },
        ],
        isActive: true,
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
    });

    return suppliers;
  }

  /**
   * Verificar si se puede comprar a un proveedor
   */
  async canPurchaseFromSupplier(id: number, amount: number): Promise<boolean> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    if (!supplier.isActive) {
      return false;
    }

    const newBalance = supplier.currentBalance + amount;
    return newBalance <= supplier.creditLimit;
  }

  /**
   * Activar/desactivar proveedor
   */
  async toggleSupplierStatus(id: number): Promise<Supplier> {
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      throw new Error('SUPPLIER_NOT_FOUND');
    }

    // No permitir activar proveedores con deuda pendiente
    if (!supplier.isActive && supplier.currentBalance > 0) {
      throw new Error('SUPPLIER_HAS_PENDING_DEBT');
    }

    await supplier.update({ isActive: !supplier.isActive });

    return await this.getSupplierById(id) as Supplier;
  }

  /**
   * Obtener proveedores por plazo de pago
   */
  async getSuppliersByPaymentTerms(paymentTerms: number) {
    const suppliers = await Supplier.findAll({
      where: {
        paymentTerms,
        isActive: true,
      },
      order: [['businessName', 'ASC']],
    });

    return suppliers;
  }

  /**
   * Obtener top proveedores (por mayor crédito utilizado)
   */
  async getTopSuppliers(limit: number = 10) {
    const suppliers = await Supplier.findAll({
      where: {
        isActive: true,
        currentBalance: { [Op.gt]: 0 },
      },
      order: [['currentBalance', 'DESC']],
      limit,
    });

    return suppliers;
  }
}

export default new SupplierService();
