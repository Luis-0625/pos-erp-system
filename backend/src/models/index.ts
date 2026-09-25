import User from './User.model';
import Role from './Role.model';
import Permission from './Permission.model';
import Category from './Category.model';
import Product from './Product.model';
import Client from './Client.model';
import Supplier from './Supplier.model';
import sequelize from '../config/database';

// Definir asociaciones entre modelos

// User - Role (Many to One)
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

Role.hasMany(User, {
  foreignKey: 'roleId',
  as: 'users',
});

// Role - Permission (Many to Many) a través de la tabla role_permissions
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});

Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

// Category - Category (Self-referencing: Parent-Child)
Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'parent',
});

Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'children',
});

// Product - Category (Many to One)
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

// Exportar modelos y sequelize
export {
  sequelize,
  User,
  Role,
  Permission,
  Category,
  Product,
  Client,
  Supplier,
};

// Exportar una función para sincronizar todos los modelos
export const syncModels = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Todos los modelos se sincronizaron correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    throw error;
  }
};

// Exportar función para cerrar la conexión
export const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    throw error;
  }
};

export default {
  sequelize,
  User,
  Role,
  Permission,
  Category,
  Product,
  Client,
  Supplier,
  syncModels,
  closeConnection,
};
