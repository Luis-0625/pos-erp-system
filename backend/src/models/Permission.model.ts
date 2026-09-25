import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir atributos del modelo Permission
interface PermissionAttributes {
  id: number;
  name: string;
  description: string | null;
  module: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos opcionales para la creación
interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

// Extender el modelo de Sequelize
class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public module!: string;
  public action!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones (se definirán después)
  public readonly roles?: any[];
}

// Inicializar el modelo
Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre del permiso es requerido',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El módulo es requerido',
        },
        isIn: {
          args: [['products', 'sales', 'pos', 'clients', 'purchases', 'suppliers', 'cartera', 'reports', 'config', 'users']],
          msg: 'El módulo no es válido',
        },
      },
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La acción es requerida',
        },
        isIn: {
          args: [['create', 'read', 'update', 'delete', 'list', 'export']],
          msg: 'La acción no es válida',
        },
      },
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
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['module', 'action'],
        name: 'unique_module_action',
      },
    ],
  }
);

export default Permission;
