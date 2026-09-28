import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Definir atributos del modelo Purchase
interface PurchaseAttributes {
  id: number;
  purchaseNumber: string;
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
  notes?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales al crear una compra
interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, 'id' | 'purchaseNumber' | 'discountAmount' | 'notes' | 'dueDate' | 'createdAt' | 'updatedAt'> {}

class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> implements PurchaseAttributes {
  public id!: number;
  public purchaseNumber!: string;
  public purchaseDate!: Date;
  public supplierId!: number;
  public userId!: number;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public paymentMethod!: 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT' | 'MIXED';
  public paymentStatus!: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  public status!: 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  public notes?: string;
  public dueDate?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones
  public readonly supplier?: any;
  public readonly user?: any;
  public readonly details?: any[];

  // Getters calculados
  public get isPending(): boolean {
    return this.paymentStatus === 'PENDING';
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

  public get isOverdue(): boolean {
    if (!this.dueDate || this.paymentStatus === 'PAID' || this.status === 'CANCELLED') {
      return false;
    }
    return new Date() > this.dueDate;
  }

  public get daysUntilDue(): number | null {
    if (!this.dueDate || this.paymentStatus === 'PAID' || this.status === 'CANCELLED') {
      return null;
    }
    const today = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchaseNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Número único de compra (P-00001, P-00002, etc.)',
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de la compra',
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID del proveedor',
      references: {
        model: 'suppliers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID del usuario que registró la compra',
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Subtotal antes de impuestos y descuentos',
      validate: {
        min: 0,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Monto total de impuestos',
      validate: {
        min: 0,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Monto total de descuentos',
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Monto total a pagar (subtotal + impuestos - descuentos)',
      validate: {
        min: 0,
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'TRANSFER', 'CREDIT', 'MIXED'),
      allowNull: false,
      defaultValue: 'CREDIT',
      comment: 'Método de pago',
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
      comment: 'Estado del pago',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'COMPLETED', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'DRAFT',
      comment: 'Estado de la compra',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas adicionales sobre la compra',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de vencimiento para pagos a crédito',
    },
  },
  {
    sequelize,
    tableName: 'purchases',
    timestamps: true,
    indexes: [
      {
        fields: ['purchaseNumber'],
        unique: true,
      },
      {
        fields: ['supplierId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['purchaseDate'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['paymentStatus'],
      },
      {
        fields: ['dueDate'],
      },
    ],
    hooks: {
      beforeValidate: async (purchase: Purchase) => {
        // Generar número de compra si no existe
        if (!purchase.purchaseNumber) {
          const lastPurchase = await Purchase.findOne({
            order: [['id', 'DESC']],
            attributes: ['purchaseNumber'],
          });

          if (lastPurchase && lastPurchase.purchaseNumber) {
            const lastNumber = parseInt(lastPurchase.purchaseNumber.split('-')[1]);
            purchase.purchaseNumber = `P-${String(lastNumber + 1).padStart(5, '0')}`;
          } else {
            purchase.purchaseNumber = 'P-00001';
          }
        }

        // Establecer fecha de vencimiento si es compra a crédito y no tiene fecha
        if (purchase.paymentMethod === 'CREDIT' && !purchase.dueDate) {
          const dueDate = new Date(purchase.purchaseDate);
          dueDate.setDate(dueDate.getDate() + 30); // 30 días por defecto
          purchase.dueDate = dueDate;
        }
      },
      beforeSave: (purchase: Purchase) => {
        // Validar que el total sea correcto
        const calculatedTotal = purchase.subtotal + purchase.taxAmount - purchase.discountAmount;
        if (Math.abs(calculatedTotal - purchase.totalAmount) > 0.01) {
          throw new Error('El monto total no coincide con el cálculo (subtotal + impuestos - descuentos)');
        }

        // Validar que el subtotal sea mayor que el descuento
        if (purchase.discountAmount > purchase.subtotal) {
          throw new Error('El descuento no puede ser mayor que el subtotal');
        }

        // Si la compra está cancelada, el estado de pago debe ser CANCELLED
        if (purchase.status === 'CANCELLED' && purchase.paymentStatus !== 'CANCELLED') {
          purchase.paymentStatus = 'CANCELLED';
        }
      },
    },
  }
);

export default Purchase;
