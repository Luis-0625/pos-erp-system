-- ================================================
-- DATOS DE PRUEBA PARA DESARROLLO
-- Sistema POS ERP
-- ================================================

-- IMPORTANTE: Este archivo contiene datos de prueba
-- NO ejecutar en producción

-- ================================================
-- USUARIOS DE PRUEBA
-- ================================================

-- Cajero (password: cajero123)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES ('cajero@pos-erp.com', '$2b$10$YqZ8YKZh8fvG8kXYz3L.8uKjZ9YJz7Yz9Zz9Zz9Zz9Zz9Zz9Zz9Za', 'Juan', 'Pérez', 'cashier', true);

-- Vendedor (password: vendedor123)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES ('vendedor@pos-erp.com', '$2b$10$ZqZ8YKZh8fvG8kXYz3L.8uKjZ9YJz7Yz9Zz9Zz9Zz9Zz9Zz9Zz9Zb', 'María', 'García', 'seller', true);

-- Gerente (password: gerente123)
INSERT INTO users (email, password, first_name, last_name, role, is_active)
VALUES ('gerente@pos-erp.com', '$2b$10$AqZ8YKZh8fvG8kXYz3L.8uKjZ9YJz7Yz9Zz9Zz9Zz9Zz9Zz9Zz9Zc', 'Carlos', 'López', 'manager', true);

-- ================================================
-- PRODUCTOS DE PRUEBA
-- ================================================

-- Categoría Electrónica
INSERT INTO products (sku, barcode, name, description, category_id, cost_price, sale_price, stock, min_stock, is_active)
VALUES 
('ELEC-001', '7501234567890', 'Laptop HP 15"', 'Laptop HP 15 pulgadas, 8GB RAM, 256GB SSD', 1, 3500000, 4200000, 15, 5, true),
('ELEC-002', '7501234567891', 'Mouse Inalámbrico Logitech', 'Mouse inalámbrico ergonómico', 1, 45000, 65000, 50, 10, true),
('ELEC-003', '7501234567892', 'Teclado Mecánico RGB', 'Teclado mecánico con iluminación RGB', 1, 180000, 250000, 25, 8, true),
('ELEC-004', '7501234567893', 'Monitor 24" Samsung', 'Monitor Full HD 24 pulgadas', 1, 650000, 850000, 12, 4, true),
('ELEC-005', '7501234567894', 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 1, 150000, 220000, 30, 10, true);

-- Categoría Ropa
INSERT INTO products (sku, barcode, name, description, category_id, cost_price, sale_price, stock, min_stock, is_active)
VALUES 
('ROPA-001', '7501234567895', 'Camiseta Polo M', 'Camiseta tipo polo talla M', 2, 35000, 55000, 40, 15, true),
('ROPA-002', '7501234567896', 'Jeans Clásico 32', 'Jeans clásico talla 32', 2, 80000, 120000, 25, 10, true),
('ROPA-003', '7501234567897', 'Chaqueta Impermeable L', 'Chaqueta impermeable talla L', 2, 120000, 180000, 18, 6, true);

-- Categoría Alimentos
INSERT INTO products (sku, barcode, name, description, category_id, cost_price, sale_price, stock, min_stock, is_active)
VALUES 
('ALIM-001', '7501234567898', 'Arroz Diana 1kg', 'Arroz blanco 1 kilogramo', 3, 3500, 5000, 100, 30, true),
('ALIM-002', '7501234567899', 'Aceite Girasol 900ml', 'Aceite de girasol 900 mililitros', 3, 8000, 12000, 80, 25, true),
('ALIM-003', '7501234567900', 'Pasta Fusilli 500g', 'Pasta fusilli 500 gramos', 3, 4000, 6500, 90, 30, true);

-- Categoría Hogar
INSERT INTO products (sku, barcode, name, description, category_id, cost_price, sale_price, stock, min_stock, is_active)
VALUES 
('HOGA-001', '7501234567901', 'Juego de Toallas x3', 'Juego de 3 toallas de baño', 4, 45000, 70000, 35, 12, true),
('HOGA-002', '7501234567902', 'Lámpara LED 15W', 'Lámpara LED luz blanca 15W', 4, 18000, 28000, 60, 20, true),
('HOGA-003', '7501234567903', 'Almohada Viscoelástica', 'Almohada viscoelástica ergonómica', 4, 55000, 85000, 28, 10, true);

-- ================================================
-- CLIENTES DE PRUEBA
-- ================================================

INSERT INTO clients (code, document_type, document_number, first_name, last_name, email, phone, address, city, credit_limit, is_active)
VALUES 
('CLI-001', 'CC', '1234567890', 'Pedro', 'Martínez', 'pedro.martinez@email.com', '3001234567', 'Calle 123 #45-67', 'Bogotá', 5000000, true),
('CLI-002', 'CC', '9876543210', 'Ana', 'Rodríguez', 'ana.rodriguez@email.com', '3109876543', 'Carrera 45 #23-12', 'Medellín', 3000000, true),
('CLI-003', 'CE', '987654321', 'Luis', 'Gómez', 'luis.gomez@email.com', '3207654321', 'Avenida 68 #34-56', 'Cali', 2000000, true);

-- Cliente empresarial
INSERT INTO clients (code, document_type, document_number, business_name, email, phone, address, city, credit_limit, is_active)
VALUES 
('CLI-004', 'NIT', '900123456-7', 'Comercial XYZ S.A.S', 'ventas@comercialxyz.com', '6012345678', 'Calle 72 #10-20', 'Bogotá', 10000000, true);

-- ================================================
-- PROVEEDORES DE PRUEBA
-- ================================================

INSERT INTO suppliers (code, document_type, document_number, business_name, contact_name, email, phone, address, city, payment_terms, is_active)
VALUES 
('PROV-001', 'NIT', '800111222-3', 'Distribuidora Electrónica S.A.', 'Jorge Ramírez', 'ventas@distelectronica.com', '6013334444', 'Zona Industrial Calle 13', 'Bogotá', 30, true),
('PROV-002', 'NIT', '800222333-4', 'Textiles del Sur Ltda', 'Sandra Méndez', 'contacto@textilesdelsur.com', '6024445555', 'Carrera 50 #25-30', 'Medellín', 45, true),
('PROV-003', 'NIT', '800333444-5', 'Alimentos Nacionales S.A.', 'Roberto Silva', 'pedidos@alimentosnac.com', '6025556666', 'Autopista Norte Km 8', 'Cali', 15, true);

-- ================================================
-- VENTAS DE PRUEBA
-- ================================================

-- Venta 1 - Completamente pagada
INSERT INTO sales (invoice_number, client_id, user_id, subtotal, tax, discount, total, payment_status, notes, created_at)
VALUES ('INV-2026-0001', 1, 1, 4200000, 798000, 0, 4998000, 'paid', 'Venta contado', '2026-09-15 10:30:00');

-- Items de la venta 1
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
VALUES 
(1, 1, 1, 4200000, 4200000);

-- Pago de la venta 1
INSERT INTO sale_payments (sale_id, amount, payment_method, reference, notes, payment_date)
VALUES 
(1, 4998000, 'cash', NULL, 'Pago completo en efectivo', '2026-09-15');

-- Venta 2 - Pago parcial (para demostrar pago mixto)
INSERT INTO sales (invoice_number, client_id, user_id, subtotal, tax, discount, total, payment_status, notes, created_at)
VALUES ('INV-2026-0002', 2, 1, 1000000, 190000, 50000, 1140000, 'partial', 'Pago parcial - Saldo a crédito', '2026-09-20 14:15:00');

-- Items de la venta 2
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
VALUES 
(2, 2, 5, 65000, 325000),
(2, 3, 2, 250000, 500000),
(2, 5, 1, 220000, 220000);

-- Pago parcial de la venta 2
INSERT INTO sale_payments (sale_id, amount, payment_method, reference, notes, payment_date)
VALUES 
(2, 500000, 'cash', NULL, 'Abono inicial', '2026-09-20');

-- Cuenta por cobrar de la venta 2 (saldo pendiente)
INSERT INTO accounts_receivable (invoice_number, client_id, sale_id, amount, balance, due_date, status, notes, created_at)
VALUES ('INV-2026-0002', 2, 2, 640000, 640000, '2026-10-20', 'pending', 'Saldo pendiente de pago mixto', '2026-09-20');

-- Venta 3 - Pendiente de pago
INSERT INTO sales (invoice_number, client_id, user_id, subtotal, tax, discount, total, payment_status, notes, created_at)
VALUES ('INV-2026-0003', 4, 2, 850000, 161500, 0, 1011500, 'pending', 'Venta a crédito 30 días', '2026-09-25 09:45:00');

-- Items de la venta 3
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
VALUES 
(3, 4, 1, 850000, 850000);

-- Cuenta por cobrar de la venta 3
INSERT INTO accounts_receivable (invoice_number, client_id, sale_id, amount, balance, due_date, status, notes, created_at)
VALUES ('INV-2026-0003', 4, 3, 1011500, 1011500, '2026-10-25', 'pending', 'Venta a crédito empresarial', '2026-09-25');

-- ================================================
-- COMPRAS DE PRUEBA
-- ================================================

-- Compra 1
INSERT INTO purchases (invoice_number, supplier_id, user_id, subtotal, tax, total, status, notes, created_at)
VALUES ('COMP-2026-0001', 1, 1, 52500000, 9975000, 62475000, 'received', 'Compra de laptops', '2026-09-10 11:00:00');

-- Items de la compra 1
INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, subtotal)
VALUES 
(1, 1, 15, 3500000, 52500000);

-- Cuenta por pagar de la compra 1
INSERT INTO accounts_payable (invoice_number, supplier_id, purchase_id, amount, balance, due_date, status, notes, created_at)
VALUES ('COMP-2026-0001', 1, 1, 62475000, 62475000, '2026-10-10', 'pending', 'Pago a 30 días', '2026-09-10');

-- ================================================
-- MOVIMIENTOS DE INVENTARIO
-- ================================================

-- Entrada por compra
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_at)
VALUES 
(1, 'purchase', 15, 'purchase', 1, 'Entrada por compra COMP-2026-0001', '2026-09-10'),
(2, 'adjustment', 50, NULL, NULL, 'Ajuste de inventario inicial', '2026-09-01'),
(3, 'adjustment', 25, NULL, NULL, 'Ajuste de inventario inicial', '2026-09-01');

-- Salidas por ventas
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_at)
VALUES 
(1, 'sale', -1, 'sale', 1, 'Venta INV-2026-0001', '2026-09-15'),
(2, 'sale', -5, 'sale', 2, 'Venta INV-2026-0002', '2026-09-20'),
(3, 'sale', -2, 'sale', 2, 'Venta INV-2026-0002', '2026-09-20'),
(5, 'sale', -1, 'sale', 2, 'Venta INV-2026-0002', '2026-09-20'),
(4, 'sale', -1, 'sale', 3, 'Venta INV-2026-0003', '2026-09-25');

-- ================================================
-- FIN DEL ARCHIVO SEED
-- ================================================

-- Para ejecutar este archivo:
-- psql -U postgres -d pos_erp_db -f database/seed.sql

-- Para verificar los datos insertados:
-- SELECT * FROM users;
-- SELECT * FROM products;
-- SELECT * FROM clients;
-- SELECT * FROM sales;
