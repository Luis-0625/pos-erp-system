import { DataTypes, Model, Optional, Op } from 'sequelize';
import { sequelize } from '../config/database';

// Interfaz para los atributos del modelo
interface TaxRateAttributes {
  id: number;
  name: string;
  description?: string;
  rate: number; // Porcentaje del impuesto
  type: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  
  // Clasificación
  isDefault: boolean; // Si es la tasa predeterminada para su tipo
  isActive: boolean;
  
  // Aplicabilidad
  applyToProducts: boolean;
  applyToServices: boolean;
  
  // Información adicional
  taxCode?: string; // Código del impuesto (ej: IVA, IGV, GST, VAT)
  country?: string;
  
  // Vigencia
  effectiveFrom?: Date;
  effectiveTo?: Date;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para la creación (campos opcionales)
interface TaxRateCreationAttributes
  extends Optional<
    TaxRateAttributes,
    | 'id'
    | 'description'
    | 'isDefault'
    | 'isActive'
    | 'taxCode'
    | 'country'
    | 'effectiveFrom'
    | 'effectiveTo'
    | 'createdAt'
    | 'updatedAt'
  > {}

class TaxRate extends Model<TaxRateAttributes, TaxRateCreationAttributes> implements TaxRateAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public rate!: number;
  public type!: 'SALES' | 'PURCHASE' | 'WITHHOLDING' | 'OTHER';
  
  public isDefault!: boolean;
  public isActive!: boolean;
  
  public applyToProducts!: boolean;
  public applyToServices!: boolean;
  
  public taxCode?: string;
  public country?: string;
  
  public effectiveFrom?: Date;
  public effectiveTo?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para calcular el monto del impuesto
  public calculateTax(baseAmount: number): number {
    return (baseAmount * this.rate) / 100;
  }

  // Método para calcular el monto total incluyendo impuesto
  public calculateTotal(baseAmount: number): number {
    return baseAmount + this.calculateTax(baseAmount);
  }

  // Método para verificar si la tasa está vigente
  public isEffective(date: Date = new Date()): boolean {
    if (!this.isActive) {
      return false;
    }

    if (this.effectiveFrom && date < this.effectiveFrom) {
      return false;
    }

    if (this.effectiveTo && date > this.effectiveTo) {
      return false;
    }

    return true;
  }

  // Método para obtener el porcentaje formateado
  public get formattedRate(): string {
    return `${this.rate.toFixed(2)}%`;
  }
}

// Definición del modelo
TaxRate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de la tasa es requerido',
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'La tasa no puede ser negativa',
        },
        max: {
          args: [100],
          msg: 'La tasa no puede superar el 100%',
        },
        notNull: {
          msg: 'La tasa es requerida',
        },
      },
    },
    type: {
      type: DataTypes.ENUM('SALES', 'PURCHASE', 'WITHHOLDING', 'OTHER'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El tipo de impuesto es requerido',
        },
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    applyToProducts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    applyToServices: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    taxCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [0, 20],
          msg: 'El código de impuesto no puede superar los 20 caracteres',
        },
      },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isAfterEffectiveFrom(value: Date) {
          if (value && this.effectiveFrom && value <= this.effectiveFrom) {
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'tax_rates',
    timestamps: true,
    indexes: [
      {
        fields: ['type', 'isActive'],
      },
      {
        fields: ['isDefault', 'type'],
      },
      {
        fields: ['taxCode'],
      },
      {
        fields: ['effectiveFrom', 'effectiveTo'],
      },
    ],
    hooks: {
      // Asegurar que solo haya una tasa predeterminada por tipo
      beforeSave: async (taxRate: TaxRate) => {
        if (taxRate.isDefault) {
          await TaxRate.update(
            { isDefault: false },
            {
              where: {
                type: taxRate.type,
                isDefault: true,
                id: { [Op.ne]: taxRate.id },
              },
            }
          );
        }
      },
    },
  }
);

export default TaxRate;
