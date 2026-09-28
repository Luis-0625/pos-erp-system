import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz para los atributos del modelo
interface AccountPayableAttributes {
  id: number;
  supplierId: number;
  purchaseId?: number;
  documentNumber: string;
  documentType: 'INVOICE' | 'PROMISSORY_NOTE' | 'DEBIT_NOTE' | 'OTHER';
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
interface AccountPayableCreationAttributes
  extends Optional<AccountPayableAttributes, 'id' | 'purchaseId' | 'paidAmount' | 'balanceAmount' | 'notes' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo
class AccountPayable
  extends Model<AccountPayableAttributes, AccountPayableCreationAttributes>
  implements AccountPayableAttributes
{
  public id!: number;
  public supplierId!: number;
  public purchaseId?: number;
  public documentNumber!: string;
  public documentType!: 'INVOICE' | 'PROMISSORY_NOTE' | 'DEBIT_NOTE' | 'OTHER';
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
  public readonly supplier?: any;
  public readonly purchase?: any;
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
AccountPayable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'purchases',
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
      type: DataTypes.ENUM('INVOICE', 'PROMISSORY_NOTE', 'DEBIT_NOTE', 'OTHER'),
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
    tableName: 'accounts_payable',
    timestamps: true,
    hooks: {
      beforeValidate: (accountPayable: AccountPayable) => {
        // Calcular saldo automáticamente
        accountPayable.balanceAmount =
          accountPayable.originalAmount - accountPayable.paidAmount;

        // Actualizar estado basado en pagos
        if (accountPayable.balanceAmount === 0) {
          accountPayable.status = 'PAID';
        } else if (accountPayable.paidAmount > 0 && accountPayable.balanceAmount > 0) {
          accountPayable.status = 'PARTIAL';
        } else if (new Date() > accountPayable.dueDate && accountPayable.balanceAmount > 0) {
          accountPayable.status = 'OVERDUE';
        }
      },
    },
    indexes: [
      { fields: ['supplierId'] },
      { fields: ['purchaseId'] },
      { fields: ['documentNumber'], unique: true },
      { fields: ['status'] },
      { fields: ['dueDate'] },
      { fields: ['issueDate'] },
    ],
  }
);

export default AccountPayable;
