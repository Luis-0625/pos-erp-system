import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SaleDetailAttributes {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  subtotal: number;
  totalAmount: number;
  productName: string;
  productCode: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SaleDetailCreationAttributes extends Optional<SaleDetailAttributes, 'id' | 'taxRate' | 'taxAmount' | 'discountPercentage' | 'discountAmount' | 'productCode' | 'createdAt' | 'updatedAt'> {}

class SaleDetail extends Model<SaleDetailAttributes, SaleDetailCreationAttributes> implements SaleDetailAttributes {
  public id!: number;
  public saleId!: number;
  public productId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public taxRate!: number;
  public taxAmount!: number;
  public discountPercentage!: number;
  public discountAmount!: number;
  public subtotal!: number;
  public totalAmount!: number;
  public productName!: string;
  public productCode!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Getters calculados
  public get netPrice(): number {
    return this.unitPrice - (this.unitPrice * this.discountPercentage / 100);
  }

  public get lineSubtotal(): number {
    return this.quantity * this.unitPrice;
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
}

SaleDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sale_id',
      references: {
        model: 'sales',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'Venta a la que pertenece este detalle',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Producto vendido',
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
      comment: 'Cantidad vendida',
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'unit_price',
      validate: {
        min: 0,
      },
      comment: 'Precio unitario al momento de la venta',
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_rate',
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Tasa de impuesto aplicada (%)',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_amount',
      validate: {
        min: 0,
      },
      comment: 'Monto de impuesto calculado',
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_percentage',
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Porcentaje de descuento aplicado',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount',
      validate: {
        min: 0,
      },
      comment: 'Monto de descuento calculado',
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Subtotal de la línea (cantidad * precio unitario)',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_amount',
      validate: {
        min: 0,
      },
      comment: 'Total de la línea (subtotal - descuento + impuesto)',
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'product_name',
      comment: 'Nombre del producto al momento de la venta (para histórico)',
    },
    productCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'product_code',
      comment: 'Código del producto al momento de la venta (para histórico)',
    },
  },
  {
    sequelize,
    tableName: 'sale_details',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['sale_id'],
        name: 'idx_sale_details_sale_id',
      },
      {
        fields: ['product_id'],
        name: 'idx_sale_details_product_id',
      },
      {
        fields: ['sale_id', 'product_id'],
        name: 'idx_sale_details_sale_product',
      },
    ],
    hooks: {
      beforeValidate: (detail: SaleDetail) => {
        // Calcular subtotal si no está definido
        if (!detail.subtotal || detail.subtotal === 0) {
          detail.subtotal = detail.quantity * detail.unitPrice;
        }

        // Calcular descuento si solo se proporcionó el porcentaje
        if (detail.discountPercentage > 0 && detail.discountAmount === 0) {
          detail.discountAmount = detail.subtotal * (detail.discountPercentage / 100);
        }

        // Calcular porcentaje de descuento si solo se proporcionó el monto
        if (detail.discountAmount > 0 && detail.discountPercentage === 0 && detail.subtotal > 0) {
          detail.discountPercentage = (detail.discountAmount / detail.subtotal) * 100;
        }

        // Calcular monto neto (después del descuento)
        const netAmount = detail.subtotal - detail.discountAmount;

        // Calcular impuesto si solo se proporcionó la tasa
        if (detail.taxRate > 0 && detail.taxAmount === 0) {
          detail.taxAmount = netAmount * (detail.taxRate / 100);
        }

        // Calcular tasa de impuesto si solo se proporcionó el monto
        if (detail.taxAmount > 0 && detail.taxRate === 0 && netAmount > 0) {
          detail.taxRate = (detail.taxAmount / netAmount) * 100;
        }

        // Calcular total si no está definido
        if (!detail.totalAmount || detail.totalAmount === 0) {
          detail.totalAmount = netAmount + detail.taxAmount;
        }
      },
      beforeSave: (detail: SaleDetail) => {
        // Validar que el subtotal sea correcto
        const calculatedSubtotal = detail.quantity * detail.unitPrice;
        if (Math.abs(calculatedSubtotal - detail.subtotal) > 0.01) {
          throw new Error('INVALID_SUBTOTAL');
        }

        // Validar que el descuento no exceda el subtotal
        if (detail.discountAmount > detail.subtotal) {
          throw new Error('DISCOUNT_EXCEEDS_SUBTOTAL');
        }

        // Validar que el total sea consistente
        const netAmount = detail.subtotal - detail.discountAmount;
        const calculatedTotal = netAmount + detail.taxAmount;
        if (Math.abs(calculatedTotal - detail.totalAmount) > 0.01) {
          throw new Error('INVALID_TOTAL_AMOUNT');
        }

        // Validar cantidad mínima
        if (detail.quantity <= 0) {
          throw new Error('INVALID_QUANTITY');
        }

        // Validar precio unitario no negativo
        if (detail.unitPrice < 0) {
          throw new Error('INVALID_UNIT_PRICE');
        }
      },
    },
  }
);

export default SaleDetail;
