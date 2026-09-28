import { Op, Transaction } from 'sequelize';
import Purchase from '../models/Purchase.model';
import PurchaseDetail from '../models/PurchaseDetail.model';
import Product from '../models/Product.model';
import Supplier from '../models/Supplier.model';
import User from '../models/User.model';
import sequelize from '../config/database';

interface CreatePurchaseDetailDTO {
  productId: number;
  quantity: number;
  unitCost: number;
  taxRate?: number;
  taxAmount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  subtotal?: number;
  totalAmount?: number;
}

interface CreatePurchaseDTO {
  purchaseDate: Date;
  supplierId: number;
  userId: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  dueDate?: Date;
  notes?: string;
  details: CreatePurchaseDetailDTO[];
}

interface UpdatePurchaseDTO {
  purchaseDate?: Date;
  supplierId?: number;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  paymentMethod?: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  status?: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  dueDate?: Date;
  notes?: string;
  details?: CreatePurchaseDetailDTO[];
}

interface ListPurchasesFilters {
  supplierId?: number;
  userId?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class PurchaseService {
  /**
   * Crear una nueva compra con sus detalles
   */
  async createPurchase(data: CreatePurchaseDTO): Promise<Purchase> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Validar que el proveedor existe
      const supplier = await Supplier.findByPk(data.supplierId);
      if (!supplier) {
        throw new Error('Proveedor no encontrado');
      }

      // Validar que el usuario existe
      const user = await User.findByPk(data.userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Validar que hay detalles
      if (!data.details || data.details.length === 0) {
        throw new Error('Debe incluir al menos un producto en la compra');
      }

      // Validar y obtener productos
      const productIds = data.details.map((detail) => detail.productId);
      const products = await Product.findAll({
        where: { id: productIds },
        transaction,
      });

      if (products.length !== productIds.length) {
        throw new Error('Uno o más productos no fueron encontrados');
      }

      // Crear la compra
      const purchase = await Purchase.create(
        {
          purchaseDate: data.purchaseDate,
          supplierId: data.supplierId,
          userId: data.userId,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          status: data.status,
          dueDate: data.dueDate,
          notes: data.notes,
        },
        { transaction }
      );

      // Crear detalles y actualizar inventario
      for (const detailData of data.details) {
        const product = products.find((p) => p.id === detailData.productId);
        if (!product) continue;

        // Crear detalle
        await PurchaseDetail.create(
          {
            purchaseId: purchase.id,
            productId: detailData.productId,
            productName: product.name,
            productCode: product.code,
            quantity: detailData.quantity,
            unitCost: detailData.unitCost,
            taxRate: detailData.taxRate || 0,
            taxAmount: detailData.taxAmount || 0,
            discountPercentage: detailData.discountPercentage || 0,
            discountAmount: detailData.discountAmount || 0,
            subtotal: detailData.subtotal || detailData.quantity * detailData.unitCost,
            totalAmount:
              detailData.totalAmount ||
              detailData.quantity * detailData.unitCost +
                (detailData.taxAmount || 0) -
                (detailData.discountAmount || 0),
          },
          { transaction }
        );

        // Actualizar inventario si la compra está completada
        if (data.status === 'COMPLETED') {
          product.stock += detailData.quantity;
          // Actualizar costo promedio del producto
          const totalCost = product.cost * (product.stock - detailData.quantity) + 
                           detailData.unitCost * detailData.quantity;
          product.cost = totalCost / product.stock;
          await product.save({ transaction });
        }
      }

      // Si es a crédito, actualizar balance del proveedor
      if (data.paymentMethod === 'CREDIT' && data.status === 'COMPLETED') {
        supplier.currentBalance += data.totalAmount;
        await supplier.save({ transaction });
      }

      await transaction.commit();

      // Retornar compra con detalles
      return await this.getPurchaseById(purchase.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener compra por ID con sus detalles
   */
  async getPurchaseById(id: number): Promise<Purchase> {
    const purchase = await Purchase.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber', 'email', 'phone'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PurchaseDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'code', 'stock', 'cost'],
            },
          ],
        },
      ],
    });

    if (!purchase) {
      throw new Error('Compra no encontrada');
    }

    return purchase;
  }

  /**
   * Obtener compra por número
   */
  async getPurchaseByNumber(purchaseNumber: string): Promise<Purchase> {
    const purchase = await Purchase.findOne({
      where: { purchaseNumber },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber', 'email', 'phone'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PurchaseDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'code', 'stock', 'cost'],
            },
          ],
        },
      ],
    });

    if (!purchase) {
      throw new Error('Compra no encontrada');
    }

    return purchase;
  }

  /**
   * Listar compras con filtros y paginación
   */
  async listPurchases(filters: ListPurchasesFilters = {}) {
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
      page = 1,
      limit = 10,
      sortBy = 'purchaseDate',
      sortOrder = 'DESC',
    } = filters;

    const where: any = {};

    if (supplierId) where.supplierId = supplierId;
    if (userId) where.userId = userId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate[Op.gte] = startDate;
      if (endDate) where.purchaseDate[Op.lte] = endDate;
    }

    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) where.totalAmount[Op.gte] = minAmount;
      if (maxAmount) where.totalAmount[Op.lte] = maxAmount;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Purchase.findAndCountAll({
      where,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PurchaseDetail,
          as: 'details',
          attributes: ['id', 'productId', 'productName', 'quantity', 'unitCost', 'totalAmount'],
        },
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      purchases: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualizar compra
   */
  async updatePurchase(id: number, data: UpdatePurchaseDTO): Promise<Purchase> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const purchase = await Purchase.findByPk(id, {
        include: [{ model: PurchaseDetail, as: 'details' }],
        transaction,
      });

      if (!purchase) {
        throw new Error('Compra no encontrada');
      }

      // No permitir editar compras canceladas o reembolsadas
      if (purchase.status === 'CANCELLED' || purchase.status === 'REFUNDED') {
        throw new Error('No se puede editar una compra cancelada o reembolsada');
      }

      // Validar proveedor si se está cambiando
      if (data.supplierId && data.supplierId !== purchase.supplierId) {
        const supplier = await Supplier.findByPk(data.supplierId);
        if (!supplier) {
          throw new Error('Proveedor no encontrado');
        }
      }

      // Si se están actualizando los detalles
      if (data.details) {
        // Eliminar detalles antiguos
        await PurchaseDetail.destroy({
          where: { purchaseId: id },
          transaction,
        });

        // Crear nuevos detalles
        for (const detailData of data.details) {
          const product = await Product.findByPk(detailData.productId, { transaction });
          if (!product) {
            throw new Error(`Producto con ID ${detailData.productId} no encontrado`);
          }

          await PurchaseDetail.create(
            {
              purchaseId: purchase.id,
              productId: detailData.productId,
              productName: product.name,
              productCode: product.code,
              quantity: detailData.quantity,
              unitCost: detailData.unitCost,
              taxRate: detailData.taxRate || 0,
              taxAmount: detailData.taxAmount || 0,
              discountPercentage: detailData.discountPercentage || 0,
              discountAmount: detailData.discountAmount || 0,
              subtotal: detailData.subtotal || detailData.quantity * detailData.unitCost,
              totalAmount:
                detailData.totalAmount ||
                detailData.quantity * detailData.unitCost +
                  (detailData.taxAmount || 0) -
                  (detailData.discountAmount || 0),
            },
            { transaction }
          );
        }
      }

      // Actualizar compra
      await purchase.update(
        {
          purchaseDate: data.purchaseDate,
          supplierId: data.supplierId,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          status: data.status,
          dueDate: data.dueDate,
          notes: data.notes,
        },
        { transaction }
      );

      await transaction.commit();

      return await this.getPurchaseById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Cancelar compra
   */
  async cancelPurchase(id: number, reason?: string): Promise<Purchase> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const purchase = await Purchase.findByPk(id, {
        include: [
          { model: PurchaseDetail, as: 'details' },
          { model: Supplier, as: 'supplier' },
        ],
        transaction,
      });

      if (!purchase) {
        throw new Error('Compra no encontrada');
      }

      if (purchase.status === 'CANCELLED') {
        throw new Error('La compra ya está cancelada');
      }

      if (purchase.status === 'REFUNDED') {
        throw new Error('No se puede cancelar una compra reembolsada');
      }

      // Revertir inventario si estaba completada
      if (purchase.status === 'COMPLETED' && purchase.details) {
        for (const detail of purchase.details) {
          const product = await Product.findByPk(detail.productId, { transaction });
          if (product) {
            product.stock -= detail.quantity;
            await product.save({ transaction });
          }
        }
      }

      // Actualizar balance del proveedor si era a crédito
      if (purchase.paymentMethod === 'CREDIT' && purchase.status === 'COMPLETED') {
        const supplier = purchase.supplier;
        if (supplier) {
          supplier.currentBalance -= purchase.totalAmount;
          await supplier.save({ transaction });
        }
      }

      // Actualizar compra
      purchase.status = 'CANCELLED';
      purchase.paymentStatus = 'CANCELLED';
      purchase.notes = reason
        ? `${purchase.notes ? purchase.notes + ' | ' : ''}Cancelada: ${reason}`
        : purchase.notes;
      await purchase.save({ transaction });

      await transaction.commit();

      return await this.getPurchaseById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Procesar reembolso de compra
   */
  async refundPurchase(id: number, reason: string): Promise<Purchase> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const purchase = await Purchase.findByPk(id, {
        include: [
          { model: PurchaseDetail, as: 'details' },
          { model: Supplier, as: 'supplier' },
        ],
        transaction,
      });

      if (!purchase) {
        throw new Error('Compra no encontrada');
      }

      if (purchase.status !== 'COMPLETED') {
        throw new Error('Solo se pueden reembolsar compras completadas');
      }

      // Verificar que tenga detalles
      if (!purchase.details || purchase.details.length === 0) {
        throw new Error('La compra no tiene detalles para reembolsar');
      }

      // Revertir inventario
      for (const detail of purchase.details) {
        const product = await Product.findByPk(detail.productId, { transaction });
        if (product) {
          product.stock -= detail.quantity;
          if (product.stock < 0) {
            throw new Error(
              `No hay suficiente stock del producto ${product.name} para reembolsar`
            );
          }
          await product.save({ transaction });
        }
      }

      // Actualizar balance del proveedor
      const supplier = purchase.supplier;
      if (supplier) {
        supplier.currentBalance -= purchase.totalAmount;
        await supplier.save({ transaction });
      }

      // Actualizar compra
      purchase.status = 'REFUNDED';
      purchase.paymentStatus = 'CANCELLED';
      purchase.notes = `${purchase.notes ? purchase.notes + ' | ' : ''}Reembolsada: ${reason}`;
      await purchase.save({ transaction });

      await transaction.commit();

      return await this.getPurchaseById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Actualizar estado de pago
   */
  async updatePaymentStatus(
    id: number,
    paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED',
    amountPaid?: number
  ): Promise<Purchase> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const purchase = await Purchase.findByPk(id, {
        include: [{ model: Supplier, as: 'supplier' }],
        transaction,
      });

      if (!purchase) {
        throw new Error('Compra no encontrada');
      }

      if (purchase.status !== 'COMPLETED') {
        throw new Error('Solo se puede actualizar el pago de compras completadas');
      }

      const oldPaymentStatus = purchase.paymentStatus;

      // Si se está marcando como pagado y era a crédito, actualizar balance del proveedor
      if (
        paymentStatus === 'PAID' &&
        oldPaymentStatus !== 'PAID' &&
        purchase.paymentMethod === 'CREDIT'
      ) {
        const supplier = purchase.supplier;
        if (supplier) {
          supplier.currentBalance -= purchase.totalAmount;
          await supplier.save({ transaction });
        }
      }

      // Si se está marcando como parcial y hay un monto pagado
      if (paymentStatus === 'PARTIAL' && amountPaid && purchase.paymentMethod === 'CREDIT') {
        const supplier = purchase.supplier;
        if (supplier) {
          const previousPaidAmount = 0; // Aquí deberías tener un tracking de pagos parciales previos
          const additionalPayment = amountPaid - previousPaidAmount;
          supplier.currentBalance -= additionalPayment;
          await supplier.save({ transaction });
        }
      }

      purchase.paymentStatus = paymentStatus;
      await purchase.save({ transaction });

      await transaction.commit();

      return await this.getPurchaseById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener estadísticas de compras
   */
  async getPurchaseStats() {
    const totalPurchases = await Purchase.count();
    const completedPurchases = await Purchase.count({ where: { status: 'COMPLETED' } });
    const cancelledPurchases = await Purchase.count({ where: { status: 'CANCELLED' } });
    const pendingPayments = await Purchase.count({
      where: {
        status: 'COMPLETED',
        paymentStatus: { [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'] },
      },
    });

    const totalAmount = await Purchase.sum('totalAmount', { where: { status: 'COMPLETED' } });
    const pendingAmount = await Purchase.sum('totalAmount', {
      where: {
        status: 'COMPLETED',
        paymentStatus: { [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'] },
      },
    });

    return {
      totalPurchases,
      completedPurchases,
      cancelledPurchases,
      pendingPayments,
      totalAmount: totalAmount || 0,
      pendingAmount: pendingAmount || 0,
      paidAmount: (totalAmount || 0) - (pendingAmount || 0),
    };
  }

  /**
   * Obtener compras con pagos pendientes
   */
  async getPurchasesWithPendingPayment() {
    return await Purchase.findAll({
      where: {
        status: 'COMPLETED',
        paymentStatus: { [Op.in]: ['PENDING', 'PARTIAL', 'OVERDUE'] },
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber', 'phone', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
  }

  /**
   * Obtener compras por proveedor
   */
  async getPurchasesBySupplier(supplierId: number) {
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      throw new Error('Proveedor no encontrado');
    }

    return await Purchase.findAll({
      where: { supplierId },
      include: [
        {
          model: PurchaseDetail,
          as: 'details',
          attributes: ['id', 'productName', 'quantity', 'unitCost', 'totalAmount'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });
  }

  /**
   * Buscar compras
   */
  async searchPurchases(term: string) {
    return await Purchase.findAll({
      where: {
        [Op.or]: [
          { purchaseNumber: { [Op.iLike]: `%${term}%` } },
          { notes: { [Op.iLike]: `%${term}%` } },
        ],
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber'],
          where: {
            [Op.or]: [
              { name: { [Op.iLike]: `%${term}%` } },
              { documentNumber: { [Op.iLike]: `%${term}%` } },
            ],
          },
          required: false,
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: 20,
      order: [['purchaseDate', 'DESC']],
    });
  }

  /**
   * Eliminar compra (solo si es borrador)
   */
  async deletePurchase(id: number): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const purchase = await Purchase.findByPk(id, { transaction });

      if (!purchase) {
        throw new Error('Compra no encontrada');
      }

      if (purchase.status !== 'DRAFT') {
        throw new Error('Solo se pueden eliminar compras en estado borrador');
      }

      // Eliminar detalles (por CASCADE se eliminan automáticamente)
      await purchase.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new PurchaseService();
