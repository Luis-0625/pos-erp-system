import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definición de atributos de Category
interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos opcionales al crear una categoría
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'parentId' | 'isActive' | 'order' | 'createdAt' | 'updatedAt'> {}

// Definición del modelo Category
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public parentId!: number | null;
  public isActive!: boolean;
  public order!: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para obtener el path completo de la categoría
  public getFullPath?: () => Promise<string>;
}

Category.init(
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
          msg: 'El nombre de la categoría es requerido',
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      field: 'parent_id',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El orden debe ser mayor o igual a 0',
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
    tableName: 'categories',
    timestamps: true,
    indexes: [
      {
        fields: ['name'],
        unique: true,
      },
      {
        fields: ['parent_id'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['order'],
      },
    ],
  }
);

export default Category;
