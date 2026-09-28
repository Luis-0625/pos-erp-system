import { Op, Transaction } from 'sequelize';
import sequelize from '../config/database';
import Sale from '../models/Sale.model';
import SaleDetail from '../models/SaleDetail.model';
import Product from '../models/Product.model';
import Client from '../models/Client.model';
import User from '../models/User.model';
import { QueryFilters } from '../types';

interface CreateSaleDTO {
  saleDate: Date;
  clientId?: number;
  userId: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  status?: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  notes?: string;
  details: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discountPercentage?: number;
    discountAmount?: number;
  }>;
}

interface UpdateSaleDTO {
  saleDate?: Date;
  clientId?: number;
  paymentMethod?: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  status?: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  notes?: string;
}

interface SaleFilters extends QueryFilters {
  saleNumber?: string;
  clientId?: number;
  userId?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

interface SaleStats {
  totalSales: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalCredit: number;
  averageTicket: number;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

class SaleService {
  /**
   * Crea una nueva venta con sus detalles en una transacción
   */
  async createSale(data: CreateSaleDTO): Promise<Sale> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Verificar que el cliente existe si se proporciona
      if (data.clientId) {
        const client = await Client.findByPk(data.clientId);
        if (!client) {
          throw new Error('CLIENT_NOT_FOUND');
        }
        if (!client.isActive) {
          throw new Error('CLIENT_INACTIVE');
        }
      }

      // Verificar que el usuario existe
      const user = await User.findByPk(data.userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Validar que hay detalles
      if (!data.details || data.details.length === 0) {
        throw new Error('SALE_DETAILS_REQUIRED');
      }

      // Calcular totales de la venta
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      // Validar productos y calcular totales
      const detailsWithProducts = await Promise.all(
        data.details.map(async (detail) => {
          const product = await Product.findByPk(detail.productId, { transaction });
          
          if (!product) {
            throw new Error(`PRODUCT_NOT_FOUND: ${detail.productId}`);
          }

          if (!product.isActive) {
            throw new Error(`PRODUCT_INACTIVE: ${product.name}`);
          }

          // Verificar stock disponible
          if (product.stock < detail.quantity) {
            throw new Error(`INSUFFICIENT_STOCK: ${product.name} (Disponible: ${product.stock}, Requerido: ${detail.quantity})`);
          }

          // Calcular subtotal de la línea
          const lineSubtotal = detail.quantity * detail.unitPrice;
          
          // Calcular descuento de la línea
          const lineDiscount = detail.discountAmount || 
            (detail.discountPercentage ? lineSubtotal * (detail.discountPercentage / 100) : 0);
          
          // Calcular monto neto (subtotal - descuento)
          const lineNetAmount = lineSubtotal - lineDiscount;
          
          // Calcular impuesto de la línea (sobre el monto neto)
          const lineTax = detail.taxRate ? lineNetAmount * (detail.taxRate / 100) : 0;
          
          // Calcular total de la línea
          const lineTotal = lineNetAmount + lineTax;

          subtotal += lineSubtotal;
          discountAmount += lineDiscount;
          taxAmount += lineTax;

          return {
            ...detail,
            productName: product.name,
            productCode: product.code,
            subtotal: lineSubtotal,
            discountAmount: lineDiscount,
            taxAmount: lineTax,
            totalAmount: lineTotal
          };
        })
      );

      // Calcular total de la venta
      const totalAmount = subtotal + taxAmount - discountAmount;

      // Crear el encabezado de la venta
      const sale = await Sale.create(
        {
          saleDate: data.saleDate,
          clientId: data.clientId,
          userId: data.userId,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus || 
            (data.paymentMethod === 'CREDIT' ? 'PENDING' : 'PAID'),
          status: data.status || 'COMPLETED',
          notes: data.notes
        },
        { transaction }
      );

      // Crear los detalles de la venta
      await SaleDetail.bulkCreate(
        detailsWithProducts.map((detail) => ({
          saleId: sale.id,
          productId: detail.productId,
          productName: detail.productName,
          productCode: detail.productCode,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          taxRate: detail.taxRate || 0,
          taxAmount: detail.taxAmount,
          discountPercentage: detail.discountPercentage || 0,
          discountAmount: detail.discountAmount,
          subtotal: detail.subtotal,
          totalAmount: detail.totalAmount
        })),
        { transaction }
      );

      // Actualizar inventario de productos solo si la venta está COMPLETED
      if (sale.status === 'COMPLETED') {
        await Promise.all(
          data.details.map(async (detail) => {
            await Product.decrement('stock', {
              by: detail.quantity,
              where: { id: detail.productId },
              transaction
            });
          })
        );

        // Actualizar balance del cliente si la venta es a crédito
        if (data.clientId && sale.paymentStatus !== 'PAID') {
          const pendingAmount = sale.totalAmount;
          await Client.increment(
            { currentBalance: pendingAmount },
            {
              where: { id: data.clientId },
              transaction
            }
          );
        }
      }

      await transaction.commit();

      // Retornar la venta con sus detalles
      return await this.getSaleById(sale.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene una venta por su ID con todos sus detalles
   */
  async getSaleById(id: number): Promise<Sale> {
    const sale = await Sale.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'documentType', 'documentNumber', 'email', 'phone']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email']
        },
        {
          model: SaleDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'code', 'name', 'stock', 'isActive']
            }
          ]
        }
      ],
      order: [[{ model: SaleDetail, as: 'details' }, 'id', 'ASC']]
    });

    if (!sale) {
      throw new Error('SALE_NOT_FOUND');
    }

    return sale;
  }

  /**
   * Obtiene una venta por su número
   */
  async getSaleByNumber(saleNumber: string): Promise<Sale> {
    const sale = await Sale.findOne({
      where: { saleNumber },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'documentType', 'documentNumber', 'email', 'phone']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email']
        },
        {
          model: SaleDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'code', 'name', 'stock', 'isActive']
            }
          ]
        }
      ],
      order: [[{ model: SaleDetail, as: 'details' }, 'id', 'ASC']]
    });

    if (!sale) {
      throw new Error('SALE_NOT_FOUND');
    }

    return sale;
  }

  /**
   * Lista ventas con filtros y paginación
   */
  async listSales(filters: SaleFilters = {}): Promise<{
    sales: Sale[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
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
    } = filters;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Filtro por número de venta
    if (saleNumber) {
      where.saleNumber = { [Op.like]: `%${saleNumber}%` };
    }

    // Filtro por cliente
    if (clientId) {
      where.clientId = clientId;
    }

    // Filtro por usuario
    if (userId) {
      where.userId = userId;
    }

    // Filtro por estado
    if (status) {
      where.status = status;
    }

    // Filtro por estado de pago
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Filtro por método de pago
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) {
        where.saleDate[Op.gte] = startDate;
      }
      if (endDate) {
        where.saleDate[Op.lte] = endDate;
      }
    }

    // Filtro por rango de montos
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.totalAmount = {};
      if (minAmount !== undefined) {
        where.totalAmount[Op.gte] = minAmount;
      }
      if (maxAmount !== undefined) {
        where.totalAmount[Op.lte] = maxAmount;
      }
    }

    // Búsqueda general
    if (search) {
      where[Op.or] = [
        { saleNumber: { [Op.like]: `%${search}%` } },
        { notes: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: sales, count: total } = await Sale.findAndCountAll({
      where,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'documentType', 'documentNumber']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    return {
      sales,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Actualiza una venta existente
   */
  async updateSale(id: number, data: UpdateSaleDTO): Promise<Sale> {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      throw new Error('SALE_NOT_FOUND');
    }

    // No permitir modificar ventas canceladas o reembolsadas
    if (sale.status === 'CANCELLED' || sale.status === 'REFUNDED') {
      throw new Error('CANNOT_UPDATE_CANCELLED_OR_REFUNDED_SALE');
    }

    // Verificar cliente si se actualiza
    if (data.clientId) {
      const client = await Client.findByPk(data.clientId);
      if (!client) {
        throw new Error('CLIENT_NOT_FOUND');
      }
      if (!client.isActive) {
        throw new Error('CLIENT_INACTIVE');
      }
    }

    await sale.update(data);
    return await this.getSaleById(id);
  }

  /**
   * Cancela una venta y revierte los cambios en inventario y balance
   */
  async cancelSale(id: number, reason?: string): Promise<Sale> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const sale = await Sale.findByPk(id, {
        include: [{ model: SaleDetail, as: 'details' }],
        transaction
      });

      if (!sale) {
        throw new Error('SALE_NOT_FOUND');
      }

      if (sale.status === 'CANCELLED') {
        throw new Error('SALE_ALREADY_CANCELLED');
      }

      if (sale.status === 'REFUNDED') {
        throw new Error('CANNOT_CANCEL_REFUNDED_SALE');
      }

      // Restaurar inventario si la venta estaba completada
      if (sale.status === 'COMPLETED') {
        const details = (sale as any).details as SaleDetail[];
        if (details && details.length > 0) {
          await Promise.all(
            details.map(async (detail: SaleDetail) => {
              await Product.increment(
                { stock: detail.quantity },
                {
                  where: { id: detail.productId },
                  transaction
                }
              );
            })
          );
        }

        // Revertir balance del cliente si era a crédito
        if (sale.clientId && sale.paymentStatus !== 'PAID') {
          const pendingAmount = sale.totalAmount;
          await Client.decrement(
            { currentBalance: pendingAmount },
            {
              where: { id: sale.clientId },
              transaction
            }
          );
        }
      }

      // Actualizar estado de la venta
      await sale.update(
        {
          status: 'CANCELLED',
          paymentStatus: 'CANCELLED',
          notes: reason ? `${sale.notes || ''}\n[CANCELACIÓN]: ${reason}`.trim() : sale.notes
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getSaleById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Procesa un reembolso de venta
   */
  async refundSale(id: number, reason: string): Promise<Sale> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const sale = await Sale.findByPk(id, {
        include: [{ model: SaleDetail, as: 'details' }],
        transaction
      });

      if (!sale) {
        throw new Error('SALE_NOT_FOUND');
      }

      if (sale.status !== 'COMPLETED') {
        throw new Error('ONLY_COMPLETED_SALES_CAN_BE_REFUNDED');
      }

      // Restaurar inventario
      const details = (sale as any).details as SaleDetail[];
      if (details && details.length > 0) {
        await Promise.all(
          details.map(async (detail: SaleDetail) => {
            await Product.increment(
              { stock: detail.quantity },
              {
                where: { id: detail.productId },
                transaction
              }
            );
          })
        );
      }

      // Revertir balance del cliente
      if (sale.clientId) {
        // Si la venta no estaba pagada, reducir balance
        if (sale.paymentStatus !== 'PAID') {
          await Client.decrement(
            { currentBalance: sale.totalAmount },
            {
              where: { id: sale.clientId },
              transaction
            }
          );
        }
      }

      // Actualizar estado de la venta
      await sale.update(
        {
          status: 'REFUNDED',
          paymentStatus: 'CANCELLED',
          notes: `${sale.notes || ''}\n[REEMBOLSO]: ${reason}`.trim()
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getSaleById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Actualiza el estado de pago de una venta
   */
  async updatePaymentStatus(
    id: number,
    paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED',
    paidAmount?: number
  ): Promise<Sale> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const sale = await Sale.findByPk(id, { transaction });

      if (!sale) {
        throw new Error('SALE_NOT_FOUND');
      }

      if (sale.status === 'CANCELLED' || sale.status === 'REFUNDED') {
        throw new Error('CANNOT_UPDATE_PAYMENT_FOR_CANCELLED_OR_REFUNDED_SALE');
      }

      const previousPaymentStatus = sale.paymentStatus;

      // Si se está marcando como PAID y antes no estaba pagada, reducir balance del cliente
      if (paymentStatus === 'PAID' && previousPaymentStatus !== 'PAID' && sale.clientId) {
        const pendingAmount = paidAmount || sale.totalAmount;
        await Client.decrement(
          { currentBalance: pendingAmount },
          {
            where: { id: sale.clientId },
            transaction
          }
        );
      }

      // Si se está marcando como PENDING/PARTIAL desde PAID, aumentar balance del cliente
      if (
        (paymentStatus === 'PENDING' || paymentStatus === 'PARTIAL') &&
        previousPaymentStatus === 'PAID' &&
        sale.clientId
      ) {
        const pendingAmount = paidAmount || sale.totalAmount;
        await Client.increment(
          { currentBalance: pendingAmount },
          {
            where: { id: sale.clientId },
            transaction
          }
        );
      }

      await sale.update({ paymentStatus }, { transaction });

      await transaction.commit();

      return await this.getSaleById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de ventas
   */
  async getSaleStats(filters: {
    startDate?: Date;
    endDate?: Date;
    clientId?: number;
    userId?: number;
  } = {}): Promise<SaleStats> {
    const where: any = { status: { [Op.ne]: 'CANCELLED' } };

    if (filters.startDate || filters.endDate) {
      where.saleDate = {};
      if (filters.startDate) {
        where.saleDate[Op.gte] = filters.startDate;
      }
      if (filters.endDate) {
        where.saleDate[Op.lte] = filters.endDate;
      }
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    // Obtener totales generales
    const sales = await Sale.findAll({ where });

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const totalPaid = sales
      .filter((s) => s.paymentStatus === 'PAID')
      .reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const totalPending = sales
      .filter((s) => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIAL')
      .reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const totalCredit = sales
      .filter((s) => s.paymentMethod === 'CREDIT')
      .reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
    const averageTicket = totalSales > 0 ? totalAmount / totalSales : 0;

    // Ventas por método de pago
    const salesByPaymentMethod: Record<string, number> = {};
    sales.forEach((sale) => {
      salesByPaymentMethod[sale.paymentMethod] = 
        (salesByPaymentMethod[sale.paymentMethod] || 0) + Number(sale.totalAmount);
    });

    // Ventas por estado
    const salesByStatus: Record<string, number> = {};
    sales.forEach((sale) => {
      salesByStatus[sale.status] = (salesByStatus[sale.status] || 0) + 1;
    });

    // Productos más vendidos
    const detailsWhere: any = {};
    if (filters.startDate || filters.endDate || filters.clientId || filters.userId) {
      const saleIds = sales.map((s) => s.id);
      detailsWhere.saleId = { [Op.in]: saleIds };
    }

    const topSellingProducts = await SaleDetail.findAll({
      where: detailsWhere,
      attributes: [
        'productId',
        'productName',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']
      ],
      group: ['productId', 'productName'],
      order: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'DESC']],
      limit: 10,
      raw: true
    }) as any[];

    return {
      totalSales,
      totalAmount,
      totalPaid,
      totalPending,
      totalCredit,
      averageTicket,
      salesByPaymentMethod,
      salesByStatus,
      topSellingProducts: topSellingProducts.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        totalQuantity: Number(p.totalQuantity),
        totalRevenue: Number(p.totalRevenue)
      }))
    };
  }

  /**
   * Obtiene las ventas pendientes de pago (a crédito)
   */
  async getSalesWithPendingPayment(): Promise<Sale[]> {
    return await Sale.findAll({
      where: {
        status: { [Op.ne]: 'CANCELLED' },
        paymentStatus: { [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'] }
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'documentType', 'documentNumber', 'email', 'phone']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['saleDate', 'ASC']]
    });
  }

  /**
   * Obtiene las ventas de un cliente
   */
  async getSalesByClient(clientId: number): Promise<Sale[]> {
    const client = await Client.findByPk(clientId);
    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }

    return await Sale.findAll({
      where: { clientId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['saleDate', 'DESC']]
    });
  }

  /**
   * Busca ventas por múltiples criterios
   */
  async searchSales(searchTerm: string): Promise<Sale[]> {
    return await Sale.findAll({
      where: {
        [Op.or]: [
          { saleNumber: { [Op.like]: `%${searchTerm}%` } },
          { notes: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      include: [
        {
          model: Client,
          as: 'client',
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${searchTerm}%` } },
              { documentNumber: { [Op.like]: `%${searchTerm}%` } }
            ]
          },
          required: false
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['saleDate', 'DESC']],
      limit: 50
    });
  }

  /**
   * Elimina una venta (solo si es borrador)
   */
  async deleteSale(id: number): Promise<void> {
    const sale = await Sale.findByPk(id);

    if (!sale) {
      throw new Error('SALE_NOT_FOUND');
    }

    if (sale.status !== 'DRAFT') {
      throw new Error('ONLY_DRAFT_SALES_CAN_BE_DELETED');
    }

    await sale.destroy();
  }
}

export default new SaleService();
