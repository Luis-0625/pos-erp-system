import User from './User.model';
import Role from './Role.model';
import Permission from './Permission.model';
import Category from './Category.model';
import Product from './Product.model';
import Client from './Client.model';
import Supplier from './Supplier.model';
import Sale from './Sale.model';
import SaleDetail from './SaleDetail.model';
import Purchase from './Purchase.model';
import PurchaseDetail from './PurchaseDetail.model';
import AccountReceivable from './AccountReceivable.model';
import AccountPayable from './AccountPayable.model';
import Payment from './Payment.model';
import Company from './Company.model';
import TaxRate from './TaxRate.model';
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

// Sale - Client (Many to One)
Sale.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client',
});

Client.hasMany(Sale, {
  foreignKey: 'clientId',
  as: 'sales',
});

// Sale - User (Many to One)
Sale.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Sale, {
  foreignKey: 'userId',
  as: 'sales',
});

// Sale - SaleDetail (One to Many)
Sale.hasMany(SaleDetail, {
  foreignKey: 'saleId',
  as: 'details',
});

SaleDetail.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale',
});

// SaleDetail - Product (Many to One)
SaleDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

Product.hasMany(SaleDetail, {
  foreignKey: 'productId',
  as: 'saleDetails',
});

// Purchase - Supplier (Many to One)
Purchase.belongsTo(Supplier, {
  foreignKey: 'supplierId',
  as: 'supplier',
});

Supplier.hasMany(Purchase, {
  foreignKey: 'supplierId',
  as: 'purchases',
});

// Purchase - User (Many to One)
Purchase.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Purchase, {
  foreignKey: 'userId',
  as: 'purchases',
});

// Purchase - PurchaseDetail (One to Many)
Purchase.hasMany(PurchaseDetail, {
  foreignKey: 'purchaseId',
  as: 'details',
});

PurchaseDetail.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'purchase',
});

// PurchaseDetail - Product (Many to One)
PurchaseDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

Product.hasMany(PurchaseDetail, {
  foreignKey: 'productId',
  as: 'purchaseDetails',
});

// AccountReceivable - Client (Many to One)
AccountReceivable.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client',
});

Client.hasMany(AccountReceivable, {
  foreignKey: 'clientId',
  as: 'accountsReceivable',
});

// AccountReceivable - Sale (Many to One, optional)
AccountReceivable.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale',
});

Sale.hasMany(AccountReceivable, {
  foreignKey: 'saleId',
  as: 'accountsReceivable',
});

// AccountPayable - Supplier (Many to One)
AccountPayable.belongsTo(Supplier, {
  foreignKey: 'supplierId',
  as: 'supplier',
});

Supplier.hasMany(AccountPayable, {
  foreignKey: 'supplierId',
  as: 'accountsPayable',
});

// AccountPayable - Purchase (Many to One, optional)
AccountPayable.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'purchase',
});

Purchase.hasMany(AccountPayable, {
  foreignKey: 'purchaseId',
  as: 'accountsPayable',
});

// Payment - User (Many to One)
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments',
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
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
  AccountReceivable,
  AccountPayable,
  Payment,
  Company,
  TaxRate,
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
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
  AccountReceivable,
  AccountPayable,
  Payment,
  Company,
  TaxRate,
  syncModels,
  closeConnection,
};
