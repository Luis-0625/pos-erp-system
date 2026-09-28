import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Interfaz para los atributos del modelo
interface CompanyAttributes {
  id: number;
  name: string;
  legalName: string;
  taxId: string; // RUC, NIT, RFC, etc.
  taxIdType: 'RUC' | 'NIT' | 'RFC' | 'CUIT' | 'OTHER';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  website?: string;
  logo?: string; // URL del logo
  
  // Configuraciones del sistema
  currency: string; // USD, MXN, COP, ARS, etc.
  currencySymbol: string;
  decimalPlaces: number;
  taxRate: number; // Tasa de impuesto predeterminada
  
  // Configuraciones de facturación
  invoicePrefix: string;
  invoiceStartNumber: number;
  invoiceFooter?: string;
  
  // Configuraciones de negocio
  fiscalYearStart: number; // Mes de inicio del año fiscal (1-12)
  dateFormat: string; // 'DD/MM/YYYY', 'MM/DD/YYYY', etc.
  timeFormat: '12h' | '24h';
  timezone: string;
  
  // Estado
  isActive: boolean;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para la creación (campos opcionales)
interface CompanyCreationAttributes
  extends Optional<
    CompanyAttributes,
    | 'id'
    | 'postalCode'
    | 'website'
    | 'logo'
    | 'invoiceFooter'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'
  > {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public legalName!: string;
  public taxId!: string;
  public taxIdType!: 'RUC' | 'NIT' | 'RFC' | 'CUIT' | 'OTHER';
  public email!: string;
  public phone!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public country!: string;
  public postalCode?: string;
  public website?: string;
  public logo?: string;
  
  public currency!: string;
  public currencySymbol!: string;
  public decimalPlaces!: number;
  public taxRate!: number;
  
  public invoicePrefix!: string;
  public invoiceStartNumber!: number;
  public invoiceFooter?: string;
  
  public fiscalYearStart!: number;
  public dateFormat!: string;
  public timeFormat!: '12h' | '24h';
  public timezone!: string;
  
  public isActive!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para formatear moneda
  public formatCurrency(amount: number): string {
    return `${this.currencySymbol}${amount.toFixed(this.decimalPlaces)}`;
  }

  // Método para obtener la dirección completa
  public get fullAddress(): string {
    const parts = [this.address, this.city, this.state, this.country];
    if (this.postalCode) {
      parts.push(this.postalCode);
    }
    return parts.filter(Boolean).join(', ');
  }
}

// Definición del modelo
Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de la empresa es requerido',
        },
        len: {
          args: [2, 200],
          msg: 'El nombre debe tener entre 2 y 200 caracteres',
        },
      },
    },
    legalName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La razón social es requerida',
        },
      },
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: 'unique_tax_id',
        msg: 'Este identificador fiscal ya está registrado',
      },
      validate: {
        notEmpty: {
          msg: 'El identificador fiscal es requerido',
        },
      },
    },
    taxIdType: {
      type: DataTypes.ENUM('RUC', 'NIT', 'RFC', 'CUIT', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Debe ser un correo electrónico válido',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Debe ser una URL válida',
        },
      },
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      validate: {
        len: {
          args: [3, 3],
          msg: 'El código de moneda debe tener 3 caracteres',
        },
      },
    },
    currencySymbol: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '$',
    },
    decimalPlaces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        min: {
          args: [0],
          msg: 'Los decimales no pueden ser negativos',
        },
        max: {
          args: [4],
          msg: 'Máximo 4 decimales permitidos',
        },
      },
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: 'La tasa de impuesto no puede ser negativa',
        },
        max: {
          args: [100],
          msg: 'La tasa de impuesto no puede superar el 100%',
        },
      },
    },
    invoicePrefix: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INV',
    },
    invoiceStartNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'El número de inicio debe ser al menos 1',
        },
      },
    },
    invoiceFooter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fiscalYearStart: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'El mes debe estar entre 1 y 12',
        },
        max: {
          args: [12],
          msg: 'El mes debe estar entre 1 y 12',
        },
      },
    },
    dateFormat: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'DD/MM/YYYY',
    },
    timeFormat: {
      type: DataTypes.ENUM('12h', '24h'),
      allowNull: false,
      defaultValue: '24h',
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'America/New_York',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['taxId'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Company;
