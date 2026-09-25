import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir las propiedades del modelo Supplier
interface SupplierAttributes {
  id: number;
  documentType: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  documentNumber: string;
  businessName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  creditLimit: number;
  currentBalance: number; // Saldo de deuda actual con el proveedor
  paymentTerms: number; // Plazo de pago en días (ej: 30, 60, 90)
  isActive: boolean;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los campos opcionales para la creación
interface SupplierCreationAttributes extends Optional<SupplierAttributes, 'id' | 'contactName' | 'email' | 'phone' | 'mobile' | 'address' | 'city' | 'state' | 'postalCode' | 'country' | 'creditLimit' | 'currentBalance' | 'paymentTerms' | 'isActive' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Supplier extends Model<SupplierAttributes, SupplierCreationAttributes> implements SupplierAttributes {
  public id!: number;
  public documentType!: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  public documentNumber!: string;
  public businessName!: string;
  public contactName!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public mobile!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public postalCode!: string | null;
  public country!: string;
  public creditLimit!: number;
  public currentBalance!: number;
  public paymentTerms!: number;
  public isActive!: boolean;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método helper para obtener el crédito disponible
  public get availableCredit(): number {
    return this.creditLimit - this.currentBalance;
  }

  // Método helper para verificar si hay deuda pendiente
  public get hasDebt(): boolean {
    return this.currentBalance > 0;
  }

  // Método helper para verificar si se puede comprar con este proveedor
  public get canPurchase(): boolean {
    return this.isActive && this.availableCredit > 0;
  }
}

Supplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    documentType: {
      type: DataTypes.ENUM('NIT', 'CC', 'CE', 'PASSPORT'),
      allowNull: false,
      comment: 'NIT: Empresas, CC: Cédula ciudadanía, CE: Cédula extranjería, PASSPORT: Pasaporte',
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El número de documento no puede estar vacío',
        },
      },
    },
    businessName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre comercial es requerido',
        },
      },
      comment: 'Nombre comercial o razón social del proveedor',
    },
    contactName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Nombre de la persona de contacto',
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Departamento o estado',
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Colombia',
    },
    creditLimit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El límite de crédito no puede ser negativo',
        },
      },
      comment: 'Límite de crédito que el proveedor nos otorga',
    },
    currentBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El saldo actual no puede ser negativo',
        },
      },
      comment: 'Deuda actual con el proveedor',
    },
    paymentTerms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: {
          args: [0],
          msg: 'Los días de plazo no pueden ser negativos',
        },
      },
      comment: 'Plazo de pago en días (30, 60, 90, etc.)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas adicionales sobre el proveedor',
    },
  },
  {
    sequelize,
    tableName: 'suppliers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['document_number'],
      },
      {
        fields: ['email'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['business_name'],
      },
      {
        fields: ['document_type', 'document_number'],
      },
    ],
  }
);

export default Supplier;
