import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

// Definición de atributos de Product
interface ProductAttributes {
  id: number;
  code: string;
  name: string;
  description: string | null;
  categoryId: number;
  barcode: string | null;
  price: number;
  cost: number;
  taxRate: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos opcionales al crear un producto
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'barcode' | 'taxRate' | 'stock' | 'minStock' | 'maxStock' | 'unit' | 'imageUrl' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Definición del modelo Product
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public categoryId!: number;
  public barcode!: string | null;
  public price!: number;
  public cost!: number;
  public taxRate!: number;
  public stock!: number;
  public minStock!: number;
  public maxStock!: number;
  public unit!: string;
  public imageUrl!: string | null;
  public isActive!: boolean;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Campos calculados
  public get margin(): number {
    if (this.cost === 0) return 0;
    return ((this.price - this.cost) / this.cost) * 100;
  }

  public get marginAmount(): number {
    return this.price - this.cost;
  }

  public get needsRestock(): boolean {
    return this.stock <= this.minStock;
  }

  public get stockValue(): number {
    return this.stock * this.cost;
  }

  public get finalPrice(): number {
    return this.price * (1 + this.taxRate / 100);
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El código del producto es requerido',
        },
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del producto es requerido',
        },
        len: {
          args: [2, 200],
          msg: 'El nombre debe tener entre 2 y 200 caracteres',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      field: 'category_id',
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El precio debe ser mayor o igual a 0',
        },
      },
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El costo debe ser mayor o igual a 0',
        },
      },
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_rate',
      validate: {
        min: {
          args: [0],
          msg: 'La tasa de impuesto debe ser mayor o igual a 0',
        },
        max: {
          args: [100],
          msg: 'La tasa de impuesto debe ser menor o igual a 100',
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El stock no puede ser negativo',
        },
      },
    },
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'min_stock',
      validate: {
        min: {
          args: [0],
          msg: 'El stock mínimo debe ser mayor o igual a 0',
        },
      },
    },
    maxStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'max_stock',
      validate: {
        min: {
          args: [0],
          msg: 'El stock máximo debe ser mayor o igual a 0',
        },
      },
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'UND',
      validate: {
        isIn: {
          args: [['UND', 'KG', 'LB', 'LT', 'MT', 'M2', 'M3', 'PAQ', 'CAJ', 'DOC', 'GAL']],
          msg: 'Unidad de medida no válida',
        },
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        fields: ['code'],
        unique: true,
      },
      {
        fields: ['barcode'],
        unique: true,
        where: {
          barcode: {
            [Op.ne]: null,
          },
        },
      },
      {
        fields: ['category_id'],
      },
      {
        fields: ['name'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['stock'],
      },
    ],
  }
);

export default Product;
