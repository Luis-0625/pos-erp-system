import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SaleAttributes {
  id: number;
  saleNumber: string;
  saleDate: Date;
  clientId: number | null;
  userId: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SaleCreationAttributes extends Optional<SaleAttributes, 'id' | 'saleNumber' | 'clientId' | 'taxAmount' | 'discountAmount' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public id!: number;
  public saleNumber!: string;
  public saleDate!: Date;
  public clientId!: number | null;
  public userId!: number;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public paymentMethod!: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  public paymentStatus!: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  public status!: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Getters calculados
  public get isPending(): boolean {
    return this.paymentStatus === 'PENDING' || this.paymentStatus === 'PARTIAL';
  }

  public get isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  public get isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }

  public get isPaid(): boolean {
    return this.paymentStatus === 'PAID';
  }

  public get isCredit(): boolean {
    return this.paymentMethod === 'CREDIT';
  }

  public get netAmount(): number {
    return this.subtotal - this.discountAmount;
  }

  public get effectiveTaxRate(): number {
    return this.subtotal > 0 ? (this.taxAmount / this.subtotal) * 100 : 0;
  }

  public get discountPercentage(): number {
    return this.subtotal > 0 ? (this.discountAmount / this.subtotal) * 100 : 0;
  }
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saleNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'sale_number',
      comment: 'Número único de venta generado automáticamente',
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'sale_date',
      comment: 'Fecha y hora de la venta',
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'client_id',
      references: {
        model: 'clients',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'Cliente asociado (null para ventas de mostrador)',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Usuario que realizó la venta',
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Suma de todos los items antes de impuestos y descuentos',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_amount',
      validate: {
        min: 0,
      },
      comment: 'Monto total de impuestos',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount',
      validate: {
        min: 0,
      },
      comment: 'Monto total de descuentos aplicados',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_amount',
      validate: {
        min: 0,
      },
      comment: 'Monto total final a pagar (subtotal + impuestos - descuentos)',
    },
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'TRANSFER', 'CREDIT', 'MIXED'),
      allowNull: false,
      defaultValue: 'CASH',
      field: 'payment_method',
      comment: 'Método de pago utilizado',
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
      field: 'payment_status',
      comment: 'Estado del pago',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'COMPLETED', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'DRAFT',
      comment: 'Estado general de la venta',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas u observaciones adicionales',
    },
  },
  {
    sequelize,
    tableName: 'sales',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['sale_number'],
        name: 'idx_sales_sale_number',
      },
      {
        fields: ['client_id'],
        name: 'idx_sales_client_id',
      },
      {
        fields: ['user_id'],
        name: 'idx_sales_user_id',
      },
      {
        fields: ['sale_date'],
        name: 'idx_sales_sale_date',
      },
      {
        fields: ['status'],
        name: 'idx_sales_status',
      },
      {
        fields: ['payment_status'],
        name: 'idx_sales_payment_status',
      },
      {
        fields: ['payment_method'],
        name: 'idx_sales_payment_method',
      },
      {
        fields: ['sale_date', 'status'],
        name: 'idx_sales_date_status',
      },
    ],
    hooks: {
      beforeValidate: (sale: Sale) => {
        // Generar número de venta si no existe
        if (!sale.saleNumber) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          sale.saleNumber = `SALE-${timestamp}-${random}`;
        }
      },
      beforeSave: (sale: Sale) => {
        // Validar que el total sea consistente
        const calculatedTotal = sale.subtotal + sale.taxAmount - sale.discountAmount;
        if (Math.abs(calculatedTotal - sale.totalAmount) > 0.01) {
          throw new Error('INVALID_TOTAL_AMOUNT');
        }

        // Validar que el descuento no exceda el subtotal
        if (sale.discountAmount > sale.subtotal) {
          throw new Error('DISCOUNT_EXCEEDS_SUBTOTAL');
        }

        // Si el estado es CANCELLED, el pago debe ser CANCELLED
        if (sale.status === 'CANCELLED' && sale.paymentStatus !== 'CANCELLED') {
          sale.paymentStatus = 'CANCELLED';
        }

        // Si el método de pago no es CREDIT, marcar como PAID si está completado
        if (sale.status === 'COMPLETED' && sale.paymentMethod !== 'CREDIT' && sale.paymentStatus === 'PENDING') {
          sale.paymentStatus = 'PAID';
        }
      },
    },
  }
);

export default Sale;
