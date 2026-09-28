import { Op } from 'sequelize';
import Sale from '../models/Sale.model';
import Purchase from '../models/Purchase.model';
import Product from '../models/Product.model';
import Client from '../models/Client.model';
import Supplier from '../models/Supplier.model';
import AccountReceivable from '../models/AccountReceivable.model';
import AccountPayable from '../models/AccountPayable.model';
import Payment from '../models/Payment.model';
import SaleDetail from '../models/SaleDetail.model';
import PurchaseDetail from '../models/PurchaseDetail.model';
import Category from '../models/Category.model';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

class ReportService {
  // ============= REPORTES DE VENTAS =============

  /**
   * Reporte de ventas por período
   */
  async getSalesReport(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const sales = await Sale.findAll({
      where: {
        saleDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.notIn]: ['CANCELLED'],
        },
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber'],
        },
        {
          model: SaleDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku'],
            },
          ],
        },
      ],
      order: [['saleDate', 'DESC']],
    });

    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount.toString()), 0);
    const totalTax = sales.reduce((sum, sale) => sum + parseFloat(sale.taxAmount.toString()), 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + parseFloat(sale.discountAmount.toString()), 0);

    return {
      period: { startDate, endDate },
      summary: {
        totalSales: sales.length,
        totalAmount: totalSales,
        totalTax,
        totalDiscount,
        netAmount: totalSales - totalDiscount,
        averageTicket: sales.length > 0 ? totalSales / sales.length : 0,
      },
      sales: sales.map((sale) => ({
        id: sale.id,
        saleNumber: sale.saleNumber,
        saleDate: sale.saleDate,
        client: sale.client ? `${sale.client.firstName} ${sale.client.lastName}` : 'Cliente General',
        totalAmount: sale.totalAmount,
        paymentStatus: sale.paymentStatus,
        itemsCount: sale.details?.length || 0,
      })),
    };
  }

  /**
   * Reporte de ventas por producto
   */
  async getSalesByProduct(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const saleDetails = await SaleDetail.findAll({
      include: [
        {
          model: Sale,
          as: 'sale',
          where: {
            saleDate: {
              [Op.between]: [startDate, endDate],
            },
            status: {
              [Op.notIn]: ['CANCELLED'],
            },
          },
          attributes: [],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    // Agrupar por producto
    const productSales = saleDetails.reduce((acc: any, detail) => {
      const productId = detail.productId;
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: detail.product?.name || 'Desconocido',
          sku: detail.product?.sku || '',
          category: detail.product?.category?.name || 'Sin categoría',
          quantitySold: 0,
          totalRevenue: 0,
          averagePrice: 0,
        };
      }
      acc[productId].quantitySold += detail.quantity;
      acc[productId].totalRevenue += parseFloat(detail.subtotal.toString());
      return acc;
    }, {});

    // Calcular precio promedio
    Object.values(productSales).forEach((item: any) => {
      item.averagePrice = item.quantitySold > 0 ? item.totalRevenue / item.quantitySold : 0;
    });

    // Ordenar por ingresos
    const sortedProducts = Object.values(productSales).sort(
      (a: any, b: any) => b.totalRevenue - a.totalRevenue
    );

    return {
      period: { startDate, endDate },
      totalProducts: sortedProducts.length,
      products: sortedProducts,
    };
  }

  /**
   * Reporte de ventas por cliente
   */
  async getSalesByClient(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const sales = await Sale.findAll({
      where: {
        saleDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.notIn]: ['CANCELLED'],
        },
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber', 'email', 'phone'],
        },
      ],
    });

    // Agrupar por cliente
    const clientSales = sales.reduce((acc: any, sale) => {
      const clientId = sale.clientId || 0;
      if (!acc[clientId]) {
        acc[clientId] = {
          clientId,
          clientName: sale.client
            ? `${sale.client.firstName} ${sale.client.lastName}`
            : 'Cliente General',
          documentNumber: sale.client?.documentNumber || '',
          email: sale.client?.email || '',
          phone: sale.client?.phone || '',
          totalSales: 0,
          totalAmount: 0,
          averageTicket: 0,
        };
      }
      acc[clientId].totalSales += 1;
      acc[clientId].totalAmount += parseFloat(sale.totalAmount.toString());
      return acc;
    }, {});

    // Calcular ticket promedio
    Object.values(clientSales).forEach((item: any) => {
      item.averageTicket = item.totalSales > 0 ? item.totalAmount / item.totalSales : 0;
    });

    // Ordenar por monto total
    const sortedClients = Object.values(clientSales).sort(
      (a: any, b: any) => b.totalAmount - a.totalAmount
    );

    return {
      period: { startDate, endDate },
      totalClients: sortedClients.length,
      clients: sortedClients,
    };
  }

  // ============= REPORTES DE COMPRAS =============

  /**
   * Reporte de compras por período
   */
  async getPurchasesReport(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const purchases = await Purchase.findAll({
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.notIn]: ['CANCELLED'],
        },
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber'],
        },
        {
          model: PurchaseDetail,
          as: 'details',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku'],
            },
          ],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });

    const totalPurchases = purchases.reduce(
      (sum, purchase) => sum + parseFloat(purchase.totalAmount.toString()),
      0
    );
    const totalTax = purchases.reduce(
      (sum, purchase) => sum + parseFloat(purchase.taxAmount.toString()),
      0
    );
    const totalDiscount = purchases.reduce(
      (sum, purchase) => sum + parseFloat(purchase.discountAmount.toString()),
      0
    );

    return {
      period: { startDate, endDate },
      summary: {
        totalPurchases: purchases.length,
        totalAmount: totalPurchases,
        totalTax,
        totalDiscount,
        netAmount: totalPurchases - totalDiscount,
        averageOrder: purchases.length > 0 ? totalPurchases / purchases.length : 0,
      },
      purchases: purchases.map((purchase) => ({
        id: purchase.id,
        purchaseNumber: purchase.purchaseNumber,
        purchaseDate: purchase.purchaseDate,
        supplier: purchase.supplier?.name || 'Desconocido',
        totalAmount: purchase.totalAmount,
        paymentStatus: purchase.paymentStatus,
        itemsCount: purchase.details?.length || 0,
      })),
    };
  }

  /**
   * Reporte de compras por proveedor
   */
  async getPurchasesBySupplier(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const purchases = await Purchase.findAll({
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.notIn]: ['CANCELLED'],
        },
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber', 'email', 'phone'],
        },
      ],
    });

    // Agrupar por proveedor
    const supplierPurchases = purchases.reduce((acc: any, purchase) => {
      const supplierId = purchase.supplierId;
      if (!acc[supplierId]) {
        acc[supplierId] = {
          supplierId,
          supplierName: purchase.supplier?.name || 'Desconocido',
          documentNumber: purchase.supplier?.documentNumber || '',
          email: purchase.supplier?.email || '',
          phone: purchase.supplier?.phone || '',
          totalPurchases: 0,
          totalAmount: 0,
          averageOrder: 0,
        };
      }
      acc[supplierId].totalPurchases += 1;
      acc[supplierId].totalAmount += parseFloat(purchase.totalAmount.toString());
      return acc;
    }, {});

    // Calcular orden promedio
    Object.values(supplierPurchases).forEach((item: any) => {
      item.averageOrder = item.totalPurchases > 0 ? item.totalAmount / item.totalPurchases : 0;
    });

    // Ordenar por monto total
    const sortedSuppliers = Object.values(supplierPurchases).sort(
      (a: any, b: any) => b.totalAmount - a.totalAmount
    );

    return {
      period: { startDate, endDate },
      totalSuppliers: sortedSuppliers.length,
      suppliers: sortedSuppliers,
    };
  }

  // ============= REPORTES FINANCIEROS =============

  /**
   * Reporte de estado de resultados (P&L)
   */
  async getProfitAndLossReport(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    // Ingresos (ventas completadas)
    const sales = await Sale.findAll({
      where: {
        saleDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.in]: ['COMPLETED', 'PENDING'],
        },
      },
      attributes: ['totalAmount', 'taxAmount', 'discountAmount'],
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount.toString()), 0);
    const totalSalesTax = sales.reduce(
      (sum, sale) => sum + parseFloat(sale.taxAmount.toString()),
      0
    );
    const totalSalesDiscount = sales.reduce(
      (sum, sale) => sum + parseFloat(sale.discountAmount.toString()),
      0
    );

    // Costos (compras)
    const purchases = await Purchase.findAll({
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.in]: ['COMPLETED', 'PENDING'],
        },
      },
      attributes: ['totalAmount', 'taxAmount', 'discountAmount'],
    });

    const totalCosts = purchases.reduce(
      (sum, purchase) => sum + parseFloat(purchase.totalAmount.toString()),
      0
    );
    const totalPurchasesTax = purchases.reduce(
      (sum, purchase) => sum + parseFloat(purchase.taxAmount.toString()),
      0
    );

    // Calcular márgenes
    const grossProfit = totalRevenue - totalCosts;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      period: { startDate, endDate },
      revenue: {
        grossRevenue: totalRevenue,
        discounts: totalSalesDiscount,
        netRevenue: totalRevenue - totalSalesDiscount,
        tax: totalSalesTax,
      },
      costs: {
        purchases: totalCosts,
        tax: totalPurchasesTax,
      },
      profitability: {
        grossProfit,
        grossMargin: parseFloat(grossMargin.toFixed(2)),
        netProfit: grossProfit - totalSalesTax - totalPurchasesTax,
      },
    };
  }

  /**
   * Reporte de flujo de caja
   */
  async getCashFlowReport(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    // Entradas de efectivo (pagos recibidos)
    const receivedPayments = await Payment.findAll({
      where: {
        accountType: 'RECEIVABLE',
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['amount', 'paymentMethod', 'paymentDate'],
    });

    const totalInflow = receivedPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount.toString()),
      0
    );

    // Salidas de efectivo (pagos realizados)
    const madePayments = await Payment.findAll({
      where: {
        accountType: 'PAYABLE',
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['amount', 'paymentMethod', 'paymentDate'],
    });

    const totalOutflow = madePayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount.toString()),
      0
    );

    // Agrupar por método de pago
    const inflowByMethod = receivedPayments.reduce((acc: any, payment) => {
      const method = payment.paymentMethod;
      if (!acc[method]) {
        acc[method] = 0;
      }
      acc[method] += parseFloat(payment.amount.toString());
      return acc;
    }, {});

    const outflowByMethod = madePayments.reduce((acc: any, payment) => {
      const method = payment.paymentMethod;
      if (!acc[method]) {
        acc[method] = 0;
      }
      acc[method] += parseFloat(payment.amount.toString());
      return acc;
    }, {});

    return {
      period: { startDate, endDate },
      summary: {
        totalInflow,
        totalOutflow,
        netCashFlow: totalInflow - totalOutflow,
      },
      inflow: {
        total: totalInflow,
        byMethod: inflowByMethod,
        payments: receivedPayments.length,
      },
      outflow: {
        total: totalOutflow,
        byMethod: outflowByMethod,
        payments: madePayments.length,
      },
    };
  }

  /**
   * Reporte de cuentas por cobrar
   */
  async getAccountsReceivableReport() {
    const accountsReceivable = await AccountReceivable.findAll({
      where: {
        status: {
          [Op.notIn]: ['PAID', 'WRITTEN_OFF'],
        },
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    const totalPending = accountsReceivable.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    const overdue = accountsReceivable.filter((account) => account.isOverdue);
    const totalOverdue = overdue.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    // Agrupar por aging (antigüedad)
    const aging = {
      current: 0, // 0-30 días
      days30to60: 0, // 31-60 días
      days61to90: 0, // 61-90 días
      over90: 0, // Más de 90 días
    };

    accountsReceivable.forEach((account) => {
      const days = account.daysOverdue;
      const balance = parseFloat(account.balanceAmount.toString());

      if (days <= 0) {
        aging.current += balance;
      } else if (days <= 30) {
        aging.current += balance;
      } else if (days <= 60) {
        aging.days30to60 += balance;
      } else if (days <= 90) {
        aging.days61to90 += balance;
      } else {
        aging.over90 += balance;
      }
    });

    return {
      summary: {
        totalAccounts: accountsReceivable.length,
        totalPending,
        totalOverdue,
        overdueAccounts: overdue.length,
      },
      aging,
      accounts: accountsReceivable.map((account) => ({
        id: account.id,
        documentNumber: account.documentNumber,
        client: account.client
          ? `${account.client.firstName} ${account.client.lastName}`
          : 'Desconocido',
        issueDate: account.issueDate,
        dueDate: account.dueDate,
        originalAmount: account.originalAmount,
        balanceAmount: account.balanceAmount,
        status: account.status,
        daysOverdue: account.daysOverdue,
      })),
    };
  }

  /**
   * Reporte de cuentas por pagar
   */
  async getAccountsPayableReport() {
    const accountsPayable = await AccountPayable.findAll({
      where: {
        status: {
          [Op.notIn]: ['PAID', 'WRITTEN_OFF'],
        },
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'documentNumber'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    const totalPending = accountsPayable.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    const overdue = accountsPayable.filter((account) => account.isOverdue);
    const totalOverdue = overdue.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    // Agrupar por aging
    const aging = {
      current: 0,
      days30to60: 0,
      days61to90: 0,
      over90: 0,
    };

    accountsPayable.forEach((account) => {
      const days = account.daysOverdue;
      const balance = parseFloat(account.balanceAmount.toString());

      if (days <= 0) {
        aging.current += balance;
      } else if (days <= 30) {
        aging.current += balance;
      } else if (days <= 60) {
        aging.days30to60 += balance;
      } else if (days <= 90) {
        aging.days61to90 += balance;
      } else {
        aging.over90 += balance;
      }
    });

    return {
      summary: {
        totalAccounts: accountsPayable.length,
        totalPending,
        totalOverdue,
        overdueAccounts: overdue.length,
      },
      aging,
      accounts: accountsPayable.map((account) => ({
        id: account.id,
        documentNumber: account.documentNumber,
        supplier: account.supplier?.name || 'Desconocido',
        issueDate: account.issueDate,
        dueDate: account.dueDate,
        originalAmount: account.originalAmount,
        balanceAmount: account.balanceAmount,
        status: account.status,
        daysOverdue: account.daysOverdue,
      })),
    };
  }

  // ============= REPORTES DE INVENTARIO =============

  /**
   * Reporte de inventario actual
   */
  async getInventoryReport() {
    const products = await Product.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });

    const totalValue = products.reduce(
      (sum, product) =>
        sum + parseFloat(product.currentStock.toString()) * parseFloat(product.price.toString()),
      0
    );

    const lowStock = products.filter((product) => product.isLowStock);
    const outOfStock = products.filter((product) => product.currentStock === 0);

    // Agrupar por categoría
    const byCategory = products.reduce((acc: any, product) => {
      const categoryName = product.category?.name || 'Sin categoría';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          totalProducts: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }
      acc[categoryName].totalProducts += 1;
      acc[categoryName].totalStock += product.currentStock;
      acc[categoryName].totalValue +=
        parseFloat(product.currentStock.toString()) * parseFloat(product.price.toString());
      return acc;
    }, {});

    return {
      summary: {
        totalProducts: products.length,
        totalValue,
        lowStockProducts: lowStock.length,
        outOfStockProducts: outOfStock.length,
      },
      byCategory: Object.values(byCategory),
      lowStockProducts: lowStock.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.currentStock,
        minStock: product.minStock,
        price: product.price,
      })),
      outOfStockProducts: outOfStock.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
      })),
    };
  }

  // ============= DASHBOARD GENERAL =============

  /**
   * Reporte de dashboard con métricas principales
   */
  async getDashboardReport(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    // Obtener datos de ventas
    const salesReport = await this.getSalesReport(dateRange);

    // Obtener datos de compras
    const purchasesReport = await this.getPurchasesReport(dateRange);

    // Obtener estado financiero
    const profitAndLoss = await this.getProfitAndLossReport(dateRange);

    // Obtener flujo de caja
    const cashFlow = await this.getCashFlowReport(dateRange);

    // Obtener cuentas pendientes
    const accountsReceivable = await AccountReceivable.findAll({
      where: {
        status: {
          [Op.notIn]: ['PAID', 'WRITTEN_OFF'],
        },
      },
    });

    const accountsPayable = await AccountPayable.findAll({
      where: {
        status: {
          [Op.notIn]: ['PAID', 'WRITTEN_OFF'],
        },
      },
    });

    const totalReceivable = accountsReceivable.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    const totalPayable = accountsPayable.reduce(
      (sum, account) => sum + parseFloat(account.balanceAmount.toString()),
      0
    );

    return {
      period: { startDate, endDate },
      sales: {
        totalSales: salesReport.summary.totalSales,
        totalAmount: salesReport.summary.totalAmount,
        averageTicket: salesReport.summary.averageTicket,
      },
      purchases: {
        totalPurchases: purchasesReport.summary.totalPurchases,
        totalAmount: purchasesReport.summary.totalAmount,
      },
      profitability: {
        grossProfit: profitAndLoss.profitability.grossProfit,
        grossMargin: profitAndLoss.profitability.grossMargin,
        netProfit: profitAndLoss.profitability.netProfit,
      },
      cashFlow: {
        totalInflow: cashFlow.summary.totalInflow,
        totalOutflow: cashFlow.summary.totalOutflow,
        netCashFlow: cashFlow.summary.netCashFlow,
      },
      accounts: {
        receivable: {
          total: totalReceivable,
          count: accountsReceivable.length,
        },
        payable: {
          total: totalPayable,
          count: accountsPayable.length,
        },
      },
    };
  }
}

export default new ReportService();
