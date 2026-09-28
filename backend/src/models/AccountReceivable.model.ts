import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz para los atributos del modelo
interface AccountReceivableAttributes {
  id: number;
  clientId: number;
  saleId?: number;
  documentNumber: string;
  documentType: 'INVOICE' | 'PROMISSORY_NOTE' | 'CREDIT_NOTE' | 'OTHER';
  issueDate: Date;
  dueDate: Date;
  originalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WRITTEN_OFF';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para la creación (sin id, createdAt, updatedAt)
interface AccountReceivableCreationAttributes
  extends Optional<AccountReceivableAttributes, 'id' | 'saleId' | 'paidAmount' | 'balanceAmount' | 'notes' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo
class AccountReceivable
  extends Model<AccountReceivableAttributes, AccountReceivableCreationAttributes>
  implements AccountReceivableAttributes
{
  public id!: number;
  public clientId!: number;
  public saleId?: number;
  public documentNumber!: string;
  public documentType!: 'INVOICE' | 'PROMISSORY_NOTE' | 'CREDIT_NOTE' | 'OTHER';
  public issueDate!: Date;
  public dueDate!: Date;
  public originalAmount!: number;
  public paidAmount!: number;
  public balanceAmount!: number;
  public status!: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'WRITTEN_OFF';
  public notes?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones
  public readonly client?: any;
  public readonly sale?: any;
  public readonly payments?: any[];

  // Getters calculados
  public get isOverdue(): boolean {
    if (this.status === 'PAID' || this.status === 'WRITTEN_OFF') {
      return false;
    }
    return new Date() > this.dueDate;
  }

  public get daysOverdue(): number {
    if (!this.isOverdue) return 0;
    const today = new Date();
    const diffTime = today.getTime() - this.dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public get daysUntilDue(): number {
    if (this.status === 'PAID' || this.status === 'WRITTEN_OFF') {
      return 0;
    }
    const today = new Date();
    const diffTime = this.dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public get paymentPercentage(): number {
    if (this.originalAmount === 0) return 0;
    return (this.paidAmount / this.originalAmount) * 100;
  }
}

// Definición del modelo
AccountReceivable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sales',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    documentType: {
      type: DataTypes.ENUM('INVOICE', 'PROMISSORY_NOTE', 'CREDIT_NOTE', 'OTHER'),
      allowNull: false,
      defaultValue: 'INVOICE',
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    originalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    paidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'WRITTEN_OFF'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'accounts_receivable',
    timestamps: true,
    hooks: {
      beforeValidate: (accountReceivable: AccountReceivable) => {
        // Calcular saldo automáticamente
        accountReceivable.balanceAmount =
          accountReceivable.originalAmount - accountReceivable.paidAmount;

        // Actualizar estado basado en pagos
        if (accountReceivable.balanceAmount === 0) {
          accountReceivable.status = 'PAID';
        } else if (accountReceivable.paidAmount > 0 && accountReceivable.balanceAmount > 0) {
          accountReceivable.status = 'PARTIAL';
        } else if (new Date() > accountReceivable.dueDate && accountReceivable.balanceAmount > 0) {
          accountReceivable.status = 'OVERDUE';
        }
      },
    },
    indexes: [
      { fields: ['clientId'] },
      { fields: ['saleId'] },
      { fields: ['documentNumber'], unique: true },
      { fields: ['status'] },
      { fields: ['dueDate'] },
      { fields: ['issueDate'] },
    ],
  }
);

export default AccountReceivable;
