import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Definir atributos del modelo PurchaseDetail
interface PurchaseDetailAttributes {
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  taxRate: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  subtotal: number;
  totalAmount: number;
  productName: string;
  productCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales al crear un detalle
interface PurchaseDetailCreationAttributes extends Optional<PurchaseDetailAttributes, 'id' | 'taxRate' | 'taxAmount' | 'discountPercentage' | 'discountAmount' | 'subtotal' | 'totalAmount' | 'createdAt' | 'updatedAt'> {}

class PurchaseDetail extends Model<PurchaseDetailAttributes, PurchaseDetailCreationAttributes> implements PurchaseDetailAttributes {
  public id!: number;
  public purchaseId!: number;
  public productId!: number;
  public quantity!: number;
  public unitCost!: number;
  public taxRate!: number;
  public taxAmount!: number;
  public discountPercentage!: number;
  public discountAmount!: number;
  public subtotal!: number;
  public totalAmount!: number;
  public productName!: string;
  public productCode!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Getters calculados
  public get netCost(): number {
    return this.unitCost - (this.unitCost * this.discountPercentage / 100);
  }

  public get lineSubtotal(): number {
    return this.quantity * this.unitCost;
  }

  public get lineDiscount(): number {
    return this.lineSubtotal * (this.discountPercentage / 100);
  }

  public get lineNetAmount(): number {
    return this.lineSubtotal - this.lineDiscount;
  }

  public get lineTax(): number {
    return this.lineNetAmount * (this.taxRate / 100);
  }

  public get lineTotal(): number {
    return this.lineNetAmount + this.lineTax;
  }

  public get hasDiscount(): boolean {
    return this.discountPercentage > 0 || this.discountAmount > 0;
  }

  public get hasTax(): boolean {
    return this.taxRate > 0 || this.taxAmount > 0;
  }

  public get effectiveUnitCost(): number {
    return this.totalAmount / this.quantity;
  }
}

PurchaseDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID de la compra',
      references: {
        model: 'purchases',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID del producto',
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Cantidad comprada',
      validate: {
        min: 0.01,
      },
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Costo unitario del producto',
      validate: {
        min: 0,
      },
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Tasa de impuesto (%)',
      validate: {
        min: 0,
        max: 100,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Monto del impuesto',
      validate: {
        min: 0,
      },
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Porcentaje de descuento (%)',
      validate: {
        min: 0,
        max: 100,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Monto del descuento',
      validate: {
        min: 0,
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Subtotal de la línea (cantidad * costo unitario)',
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Total de la línea (subtotal - descuento + impuesto)',
      validate: {
        min: 0,
      },
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre del producto al momento de la compra',
    },
    productCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Código del producto al momento de la compra',
    },
  },
  {
    sequelize,
    tableName: 'purchase_details',
    timestamps: true,
    indexes: [
      {
        fields: ['purchaseId'],
      },
      {
        fields: ['productId'],
      },
    ],
    hooks: {
      beforeValidate: (detail: PurchaseDetail) => {
        // Calcular subtotal si no está definido
        if (!detail.subtotal || detail.subtotal === 0) {
          detail.subtotal = detail.quantity * detail.unitCost;
        }

        // Calcular descuento en monto si solo hay porcentaje
        if (detail.discountPercentage > 0 && detail.discountAmount === 0) {
          detail.discountAmount = detail.subtotal * (detail.discountPercentage / 100);
        }

        // Calcular monto neto después del descuento
        const netAmount = detail.subtotal - detail.discountAmount;

        // Calcular impuesto en monto si solo hay tasa
        if (detail.taxRate > 0 && detail.taxAmount === 0) {
          detail.taxAmount = netAmount * (detail.taxRate / 100);
        }

        // Calcular total si no está definido
        if (!detail.totalAmount || detail.totalAmount === 0) {
          detail.totalAmount = netAmount + detail.taxAmount;
        }
      },
      beforeSave: (detail: PurchaseDetail) => {
        // Validar que el total sea correcto
        const netAmount = detail.subtotal - detail.discountAmount;
        const calculatedTotal = netAmount + detail.taxAmount;
        
        if (Math.abs(calculatedTotal - detail.totalAmount) > 0.01) {
          throw new Error('El total de la línea no coincide con el cálculo (subtotal - descuento + impuesto)');
        }

        // Validar que el descuento no sea mayor que el subtotal
        if (detail.discountAmount > detail.subtotal) {
          throw new Error('El descuento no puede ser mayor que el subtotal de la línea');
        }

        // Validar que la cantidad sea positiva
        if (detail.quantity <= 0) {
          throw new Error('La cantidad debe ser mayor que cero');
        }
      },
    },
  }
);

export default PurchaseDetail;
