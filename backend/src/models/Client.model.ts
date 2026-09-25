import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir las propiedades del modelo Client
interface ClientAttributes {
  id: number;
  documentType: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  documentNumber: string;
  businessName: string | null; // Para empresas (razón social)
  firstName: string | null; // Para personas naturales
  lastName: string | null; // Para personas naturales
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  clientType: 'PERSON' | 'COMPANY';
  creditLimit: number;
  currentBalance: number; // Saldo actual de deuda
  isActive: boolean;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los campos opcionales para la creación
interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'businessName' | 'firstName' | 'lastName' | 'email' | 'phone' | 'mobile' | 'address' | 'city' | 'state' | 'postalCode' | 'country' | 'creditLimit' | 'currentBalance' | 'isActive' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public documentType!: 'NIT' | 'CC' | 'CE' | 'PASSPORT';
  public documentNumber!: string;
  public businessName!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public mobile!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public postalCode!: string | null;
  public country!: string;
  public clientType!: 'PERSON' | 'COMPANY';
  public creditLimit!: number;
  public currentBalance!: number;
  public isActive!: boolean;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método helper para obtener el nombre completo o razón social
  public get fullName(): string {
    if (this.clientType === 'COMPANY') {
      return this.businessName || 'Sin nombre comercial';
    }
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'Sin nombre';
  }

  // Método helper para verificar si el cliente tiene crédito disponible
  public get availableCredit(): number {
    return this.creditLimit - this.currentBalance;
  }

  // Método helper para verificar si el cliente puede realizar compras a crédito
  public get canPurchaseOnCredit(): boolean {
    return this.isActive && this.availableCredit > 0;
  }

  // Método helper para verificar si el cliente está en mora
  public get hasDebt(): boolean {
    return this.currentBalance > 0;
  }
}

Client.init(
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
      allowNull: true,
      comment: 'Razón social para empresas',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nombre para personas naturales',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Apellido para personas naturales',
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
    clientType: {
      type: DataTypes.ENUM('PERSON', 'COMPANY'),
      allowNull: false,
      defaultValue: 'PERSON',
      comment: 'PERSON: Persona natural, COMPANY: Empresa',
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
      comment: 'Límite de crédito disponible para el cliente',
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
      comment: 'Saldo de deuda actual del cliente',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas adicionales sobre el cliente',
    },
  },
  {
    sequelize,
    tableName: 'clients',
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
        fields: ['client_type'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['document_type', 'document_number'],
      },
    ],
  }
);

export default Client;
