import { Op } from 'sequelize';
import AccountReceivable from '../models/AccountReceivable.model';
import AccountPayable from '../models/AccountPayable.model';
import Payment from '../models/Payment.model';
import Client from '../models/Client.model';
import Supplier from '../models/Supplier.model';
import Sale from '../models/Sale.model';
import Purchase from '../models/Purchase.model';
import User from '../models/User.model';
import sequelize from '../config/database';

// ==================== INTERFACES ====================

interface CreateAccountReceivableDTO {
  clientId: number;
  saleId?: number;
  documentNumber: string;
  documentType: 'INVOICE' | 'PROMISSORY_NOTE' | 'CREDIT_NOTE' | 'OTHER';
  issueDate: Date;
  dueDate: Date;
  originalAmount: number;
  notes?: string;
}

interface CreateAccountPayableDTO {
  supplierId: number;
  purchaseId?: number;
  documentNumber: string;
  documentType: 'INVOICE' | 'PROMISSORY_NOTE' | 'DEBIT_NOTE' | 'OTHER';
  issueDate: Date;
  dueDate: Date;
  originalAmount: number;
  notes?: string;
}

interface CreatePaymentDTO {
  accountType: 'RECEIVABLE' | 'PAYABLE';
  accountId: number;
  paymentDate: Date;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'OTHER';
  reference?: string;
  notes?: string;
  userId: number;
}

interface ListAccountsFilters {
  status?: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WRITTEN_OFF';
  clientId?: number;
  supplierId?: number;
  documentType?: string;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

interface ListPaymentsFilters {
  accountType?: 'RECEIVABLE' | 'PAYABLE';
  accountId?: number;
  paymentMethod?: string;
  fromDate?: Date;
  toDate?: Date;
  userId?: number;
  page?: number;
  limit?: number;
}

// ==================== PORTFOLIO SERVICE ====================

class PortfolioService {
  // ==================== CUENTAS POR COBRAR ====================

  /**
   * Crear una cuenta por cobrar
   */
  async createAccountReceivable(data: CreateAccountReceivableDTO): Promise<AccountReceivable> {
    const transaction = await sequelize.transaction();

    try {
      // Verificar que el cliente existe
      const client = await Client.findByPk(data.clientId);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      // Si hay saleId, verificar que la venta existe
      if (data.saleId) {
        const sale = await Sale.findByPk(data.saleId);
        if (!sale) {
          throw new Error('Venta no encontrada');
        }
      }

      // Crear la cuenta por cobrar
      const accountReceivable = await AccountReceivable.create(
        {
          ...data,
          paidAmount: 0,
          balanceAmount: data.originalAmount,
          status: 'PENDING',
        },
        { transaction }
      );

      await transaction.commit();
      return accountReceivable;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener cuenta por cobrar por ID
   */
  async getAccountReceivableById(id: number): Promise<AccountReceivable | null> {
    return await AccountReceivable.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber', 'email', 'phone'],
        },
        {
          model: Sale,
          as: 'sale',
          attributes: ['id', 'saleNumber', 'totalAmount'],
        },
      ],
    });
  }

  /**
   * Listar cuentas por cobrar con filtros
   */
  async listAccountsReceivable(filters: ListAccountsFilters = {}) {
    const {
      status,
      clientId,
      documentType,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (documentType) where.documentType = documentType;
    if (fromDate || toDate) {
      where.issueDate = {};
      if (fromDate) where.issueDate[Op.gte] = fromDate;
      if (toDate) where.issueDate[Op.lte] = toDate;
    }
    if (minAmount || maxAmount) {
      where.originalAmount = {};
      if (minAmount) where.originalAmount[Op.gte] = minAmount;
      if (maxAmount) where.originalAmount[Op.lte] = maxAmount;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await AccountReceivable.findAndCountAll({
      where,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber'],
        },
      ],
      limit,
      offset,
      order: [['issueDate', 'DESC']],
    });

    return {
      accounts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualizar cuenta por cobrar
   */
  async updateAccountReceivable(
    id: number,
    data: Partial<CreateAccountReceivableDTO>
  ): Promise<AccountReceivable> {
    const accountReceivable = await AccountReceivable.findByPk(id);
    if (!accountReceivable) {
      throw new Error('Cuenta por cobrar no encontrada');
    }

    if (accountReceivable.status === 'PAID') {
      throw new Error('No se puede actualizar una cuenta pagada');
    }

    await accountReceivable.update(data);
    return accountReceivable;
  }

  /**
   * Obtener cuentas vencidas por cobrar
   */
  async getOverdueReceivables() {
    return await AccountReceivable.findAll({
      where: {
        status: {
          [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'],
        },
        dueDate: {
          [Op.lt]: new Date(),
        },
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
  }

  // ==================== CUENTAS POR PAGAR ====================

  /**
   * Crear una cuenta por pagar
   */
  async createAccountPayable(data: CreateAccountPayableDTO): Promise<AccountPayable> {
    const transaction = await sequelize.transaction();

    try {
      // Verificar que el proveedor existe
      const supplier = await Supplier.findByPk(data.supplierId);
      if (!supplier) {
        throw new Error('Proveedor no encontrado');
      }

      // Si hay purchaseId, verificar que la compra existe
      if (data.purchaseId) {
        const purchase = await Purchase.findByPk(data.purchaseId);
        if (!purchase) {
          throw new Error('Compra no encontrada');
        }
      }

      // Crear la cuenta por pagar
      const accountPayable = await AccountPayable.create(
        {
          ...data,
          paidAmount: 0,
          balanceAmount: data.originalAmount,
          status: 'PENDING',
        },
        { transaction }
      );

      await transaction.commit();
      return accountPayable;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener cuenta por pagar por ID
   */
  async getAccountPayableById(id: number): Promise<AccountPayable | null> {
    return await AccountPayable.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber', 'email', 'phone'],
        },
        {
          model: Purchase,
          as: 'purchase',
          attributes: ['id', 'purchaseNumber', 'totalAmount'],
        },
      ],
    });
  }

  /**
   * Listar cuentas por pagar con filtros
   */
  async listAccountsPayable(filters: ListAccountsFilters = {}) {
    const {
      status,
      supplierId,
      documentType,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    if (documentType) where.documentType = documentType;
    if (fromDate || toDate) {
      where.issueDate = {};
      if (fromDate) where.issueDate[Op.gte] = fromDate;
      if (toDate) where.issueDate[Op.lte] = toDate;
    }
    if (minAmount || maxAmount) {
      where.originalAmount = {};
      if (minAmount) where.originalAmount[Op.gte] = minAmount;
      if (maxAmount) where.originalAmount[Op.lte] = maxAmount;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await AccountPayable.findAndCountAll({
      where,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber'],
        },
      ],
      limit,
      offset,
      order: [['issueDate', 'DESC']],
    });

    return {
      accounts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualizar cuenta por pagar
   */
  async updateAccountPayable(
    id: number,
    data: Partial<CreateAccountPayableDTO>
  ): Promise<AccountPayable> {
    const accountPayable = await AccountPayable.findByPk(id);
    if (!accountPayable) {
      throw new Error('Cuenta por pagar no encontrada');
    }

    if (accountPayable.status === 'PAID') {
      throw new Error('No se puede actualizar una cuenta pagada');
    }

    await accountPayable.update(data);
    return accountPayable;
  }

  /**
   * Obtener cuentas vencidas por pagar
   */
  async getOverduePayables() {
    return await AccountPayable.findAll({
      where: {
        status: {
          [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'],
        },
        dueDate: {
          [Op.lt]: new Date(),
        },
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
  }

  // ==================== PAGOS ====================

  /**
   * Registrar un pago
   */
  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
    const transaction = await sequelize.transaction();

    try {
      let account: AccountReceivable | AccountPayable | null = null;

      // Obtener la cuenta correspondiente
      if (data.accountType === 'RECEIVABLE') {
        account = await AccountReceivable.findByPk(data.accountId);
        if (!account) {
          throw new Error('Cuenta por cobrar no encontrada');
        }
      } else {
        account = await AccountPayable.findByPk(data.accountId);
        if (!account) {
          throw new Error('Cuenta por pagar no encontrada');
        }
      }

      // Validar que la cuenta no esté pagada o cancelada
      if (account.status === 'PAID') {
        throw new Error('La cuenta ya está pagada');
      }
      if (account.status === 'WRITTEN_OFF') {
        throw new Error('La cuenta está cancelada');
      }

      // Validar que el monto del pago no exceda el saldo
      if (data.amount > account.balanceAmount) {
        throw new Error('El monto del pago excede el saldo pendiente');
      }

      // Crear el pago
      const payment = await Payment.create(data, { transaction });

      // Actualizar el saldo de la cuenta
      const newPaidAmount = parseFloat(account.paidAmount.toString()) + data.amount;
      const newBalanceAmount = parseFloat(account.originalAmount.toString()) - newPaidAmount;

      if (data.accountType === 'RECEIVABLE') {
        await (account as AccountReceivable).update(
          {
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
          },
          { transaction }
        );
      } else {
        await (account as AccountPayable).update(
          {
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
          },
          { transaction }
        );
      }

      // Actualizar balance del cliente o proveedor
      if (data.accountType === 'RECEIVABLE') {
        const client = await Client.findByPk((account as AccountReceivable).clientId);
        if (client) {
          client.currentBalance = parseFloat(client.currentBalance.toString()) - data.amount;
          await client.save({ transaction });
        }
      } else {
        const supplier = await Supplier.findByPk((account as AccountPayable).supplierId);
        if (supplier) {
          supplier.currentBalance = parseFloat(supplier.currentBalance.toString()) - data.amount;
          await supplier.save({ transaction });
        }
      }

      await transaction.commit();
      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener pago por ID
   */
  async getPaymentById(id: number): Promise<Payment | null> {
    return await Payment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  /**
   * Listar pagos con filtros
   */
  async listPayments(filters: ListPaymentsFilters = {}) {
    const {
      accountType,
      accountId,
      paymentMethod,
      fromDate,
      toDate,
      userId,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (accountType) where.accountType = accountType;
    if (accountId) where.accountId = accountId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (userId) where.userId = userId;
    if (fromDate || toDate) {
      where.paymentDate = {};
      if (fromDate) where.paymentDate[Op.gte] = fromDate;
      if (toDate) where.paymentDate[Op.lte] = toDate;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      limit,
      offset,
      order: [['paymentDate', 'DESC']],
    });

    return {
      payments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Anular un pago
   */
  async cancelPayment(id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Pago no encontrado');
      }

      let account: AccountReceivable | AccountPayable | null = null;

      // Obtener la cuenta correspondiente
      if (payment.accountType === 'RECEIVABLE') {
        account = await AccountReceivable.findByPk(payment.accountId);
        if (!account) {
          throw new Error('Cuenta por cobrar no encontrada');
        }
      } else {
        account = await AccountPayable.findByPk(payment.accountId);
        if (!account) {
          throw new Error('Cuenta por pagar no encontrada');
        }
      }

      // Revertir el pago en la cuenta
      const newPaidAmount = parseFloat(account.paidAmount.toString()) - payment.amount;
      const newBalanceAmount = parseFloat(account.originalAmount.toString()) - newPaidAmount;

      if (payment.accountType === 'RECEIVABLE') {
        await (account as AccountReceivable).update(
          {
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
          },
          { transaction }
        );
      } else {
        await (account as AccountPayable).update(
          {
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
          },
          { transaction }
        );
      }

      // Revertir balance del cliente o proveedor
      if (payment.accountType === 'RECEIVABLE') {
        const client = await Client.findByPk((account as AccountReceivable).clientId);
        if (client) {
          client.currentBalance = parseFloat(client.currentBalance.toString()) + payment.amount;
          await client.save({ transaction });
        }
      } else {
        const supplier = await Supplier.findByPk((account as AccountPayable).supplierId);
        if (supplier) {
          supplier.currentBalance = parseFloat(supplier.currentBalance.toString()) + payment.amount;
          await supplier.save({ transaction });
        }
      }

      // Eliminar el pago
      await payment.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas de cartera
   */
  async getPortfolioStats() {
    // Cuentas por cobrar
    const receivables = await AccountReceivable.findAll({
      attributes: ['status', 'originalAmount', 'paidAmount', 'balanceAmount'],
    });

    const receivablesStats = {
      total: receivables.reduce((sum, r) => sum + parseFloat(r.originalAmount.toString()), 0),
      paid: receivables.reduce((sum, r) => sum + parseFloat(r.paidAmount.toString()), 0),
      pending: receivables.reduce((sum, r) => sum + parseFloat(r.balanceAmount.toString()), 0),
      overdue: receivables
        .filter((r) => r.status === 'OVERDUE')
        .reduce((sum, r) => sum + parseFloat(r.balanceAmount.toString()), 0),
      count: receivables.length,
    };

    // Cuentas por pagar
    const payables = await AccountPayable.findAll({
      attributes: ['status', 'originalAmount', 'paidAmount', 'balanceAmount'],
    });

    const payablesStats = {
      total: payables.reduce((sum, p) => sum + parseFloat(p.originalAmount.toString()), 0),
      paid: payables.reduce((sum, p) => sum + parseFloat(p.paidAmount.toString()), 0),
      pending: payables.reduce((sum, p) => sum + parseFloat(p.balanceAmount.toString()), 0),
      overdue: payables
        .filter((p) => p.status === 'OVERDUE')
        .reduce((sum, p) => sum + parseFloat(p.balanceAmount.toString()), 0),
      count: payables.length,
    };

    return {
      receivables: receivablesStats,
      payables: payablesStats,
      netPosition: receivablesStats.pending - payablesStats.pending,
    };
  }

  /**
   * Obtener flujo de caja proyectado
   */
  async getCashFlow(days: number = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const inflows = await AccountReceivable.findAll({
      where: {
        status: {
          [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'],
        },
        dueDate: {
          [Op.between]: [today, futureDate],
        },
      },
      attributes: ['dueDate', 'balanceAmount'],
      order: [['dueDate', 'ASC']],
    });

    const outflows = await AccountPayable.findAll({
      where: {
        status: {
          [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'],
        },
        dueDate: {
          [Op.between]: [today, futureDate],
        },
      },
      attributes: ['dueDate', 'balanceAmount'],
      order: [['dueDate', 'ASC']],
    });

    return {
      inflows: inflows.map((i) => ({
        date: i.dueDate,
        amount: parseFloat(i.balanceAmount.toString()),
      })),
      outflows: outflows.map((o) => ({
        date: o.dueDate,
        amount: parseFloat(o.balanceAmount.toString()),
      })),
      totalInflows: inflows.reduce((sum, i) => sum + parseFloat(i.balanceAmount.toString()), 0),
      totalOutflows: outflows.reduce((sum, o) => sum + parseFloat(o.balanceAmount.toString()), 0),
    };
  }

  /**
   * Dar de baja una cuenta (write off)
   */
  async writeOffAccount(
    accountType: 'RECEIVABLE' | 'PAYABLE',
    accountId: number,
    notes?: string
  ): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      let account: AccountReceivable | AccountPayable | null = null;

      if (accountType === 'RECEIVABLE') {
        account = await AccountReceivable.findByPk(accountId);
        if (!account) {
          throw new Error('Cuenta por cobrar no encontrada');
        }

        // Actualizar balance del cliente
        const client = await Client.findByPk((account as AccountReceivable).clientId);
        if (client) {
          client.currentBalance =
            parseFloat(client.currentBalance.toString()) - parseFloat(account.balanceAmount.toString());
          await client.save({ transaction });
        }
      } else {
        account = await AccountPayable.findByPk(accountId);
        if (!account) {
          throw new Error('Cuenta por pagar no encontrada');
        }

        // Actualizar balance del proveedor
        const supplier = await Supplier.findByPk((account as AccountPayable).supplierId);
        if (supplier) {
          supplier.currentBalance =
            parseFloat(supplier.currentBalance.toString()) - parseFloat(account.balanceAmount.toString());
          await supplier.save({ transaction });
        }
      }

      // Actualizar la cuenta a WRITTEN_OFF
      if (accountType === 'RECEIVABLE') {
        await (account as AccountReceivable).update(
          {
            status: 'WRITTEN_OFF',
            notes: notes || account.notes,
          },
          { transaction }
        );
      } else {
        await (account as AccountPayable).update(
          {
            status: 'WRITTEN_OFF',
            notes: notes || account.notes,
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new PortfolioService();
