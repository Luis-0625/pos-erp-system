import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz para los atributos del modelo
interface PaymentAttributes {
  id: number;
  accountType: 'RECEIVABLE' | 'PAYABLE';
  accountId: number;
  paymentNumber: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'OTHER';
  reference?: string;
  notes?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para la creación (sin id, createdAt, updatedAt)
interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, 'id' | 'paymentNumber' | 'reference' | 'notes' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public accountType!: 'RECEIVABLE' | 'PAYABLE';
  public accountId!: number;
  public paymentNumber!: string;
  public paymentDate!: Date;
  public amount!: number;
  public paymentMethod!: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'OTHER';
  public reference?: string;
  public notes?: string;
  public userId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones
  public readonly user?: any;
}

// Definición del modelo
Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accountType: {
      type: DataTypes.ENUM('RECEIVABLE', 'PAYABLE'),
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID de la cuenta por cobrar o pagar',
    },
    paymentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'TRANSFER', 'CHECK', 'OTHER'),
      allowNull: false,
      defaultValue: 'CASH',
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Número de referencia, cheque, transacción, etc.',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    hooks: {
      beforeValidate: async (payment: Payment) => {
        // Auto-generar número de pago si no existe
        if (!payment.paymentNumber) {
          const lastPayment = await Payment.findOne({
            order: [['id', 'DESC']],
          });

          let nextNumber = 1;
          if (lastPayment && lastPayment.paymentNumber) {
            const lastNumber = parseInt(lastPayment.paymentNumber.split('-')[1]);
            nextNumber = lastNumber + 1;
          }

          payment.paymentNumber = `PAY-${String(nextNumber).padStart(6, '0')}`;
        }
      },
    },
    indexes: [
      { fields: ['accountType', 'accountId'] },
      { fields: ['paymentNumber'], unique: true },
      { fields: ['paymentDate'] },
      { fields: ['userId'] },
      { fields: ['paymentMethod'] },
    ],
  }
);

export default Payment;
