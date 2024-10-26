DROP DATABASE IF EXISTS drinkers;
CREATE DATABASE IF NOT EXISTS drinkers;
USE drinkers;

CREATE TABLE INVENTARIO (
  id INT PRIMARY KEY,
  nombre_producto VARCHAR(255) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  litros INT NOT NULL,
  grados INT NOT NULL,
  imagen VARCHAR(255) NOT NULL,
  paquete INT NOT NULL,
  iva INT NOT NULL,
  precio_detal DECIMAL(10, 2) NOT NULL,
  precio_mayorista DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE CLIENTES (
  id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  nacimiento DATE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE FACTURA (
  id INT PRIMARY KEY,
  fecha DATE NOT NULL,
  id_user INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES CLIENTES(id)
);

CREATE TABLE PRODUCTOS_FACTURADOS (
  id_factura INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  PRIMARY KEY (id_factura, id_producto),
  FOREIGN KEY (id_factura) REFERENCES FACTURA(id),
  FOREIGN KEY (id_producto) REFERENCES INVENTARIO(id)
);

CREATE TABLE ENVIOS (
  id INT PRIMARY KEY,
  id_user INT NOT NULL,
  destino TEXT NOT NULL,
  id_factura INT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  entrega DATE NOT NULL,
  tipo VARCHAR(255) NOT NULL DEFAULT 'minorista',
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (id_user) REFERENCES CLIENTES(id),
  FOREIGN KEY (id_factura) REFERENCES FACTURA(id)
);

CREATE TABLE AVISOS (
  id INT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL
);

CREATE TABLE PROVEEDORES (
  id INT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(255) NOT NULL,
  rif VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE VENTAS (
  id INT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_user INT NOT NULL,
  cantidad INT NOT NULL,
  ingresos DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES INVENTARIO(id),
  FOREIGN KEY (id_user) REFERENCES CLIENTES(id)
);

CREATE TABLE COMPRA_PROVEEDORES (
  id INT PRIMARY KEY,
  id_proveedor INT NOT NULL,
  fecha_compra DATE NOT NULL,
  fecha_entrega DATE NOT NULL,
  cantidad_paquete INT NOT NULL,
  FOREIGN KEY (id_proveedor) REFERENCES PROVEEDORES(id)
);

-- Inserciones en la tabla INVENTARIO
INSERT INTO INVENTARIO (id, nombre_producto, tipo, descripcion, litros, grados, imagen, paquete, iva, precio_detal, precio_mayorista, stock, status) VALUES
(1, 'Vino Tinto', 'Vino', 'Vino tinto de uva Cabernet Sauvignon.', 0.75, 13, 'https://example.com/vino_tinto.jpg', 6, 18, 15.99, 12.99, 100, 'active'),
(2, 'Cerveza Artesanal', 'Cerveza', 'Cerveza artesanal de malta clara.', 0.33, 5, 'https://example.com/cerveza_artesanal.jpg', 12, 18, 3.99, 2.99, 200, 'active'),
(3, 'Whisky Escocés', 'Licor', 'Whisky escocés de malta.', 0.7, 40, 'https://example.com/whisky_escoces.jpg', 12, 18, 29.99, 24.99, 50, 'active'),
(4, 'Agua Mineral', 'Bebida', 'Agua mineral natural.', 1, 0, 'https://example.com/agua_mineral.jpg', 24, 0, 1.50, 1.00, 500, 'active'),
(5, 'Ron Blanco', 'Licor', 'Ron blanco de caña.', 0.7, 37.5, 'https://example.com/ron_blanco.jpg', 12, 18, 25.00, 20.00, 75, 'active'),
(6, 'Cerveza Rubia', 'Cerveza', 'Cerveza rubia de malta.', 0.5, 5, 'https://example.com/cerveza_rubia.jpg', 12, 18, 4.50, 3.50, 150, 'active'),
(7, 'Champán Brut', 'Vino', 'Champán brut de alta calidad.', 0.75, 12, 'https://example.com/champan_brut.jpg', 6, 18, 39.99, 34.99, 30, 'active'),
(8, 'Sidra', 'Bebida', 'Sidra de manzana natural.', 0.33, 5, 'https://example.com/sidra.jpg', 12, 18, 2.50, 1.80, 80, 'active'),
(9, 'Tequila', 'Licor', 'Tequila 100% agave.', 0.7, 40, 'https://example.com/tequila.jpg', 12, 18, 29.99, 24.99, 40, 'active'),
(10, 'Soda', 'Bebida', 'Soda de cola.', 1.5, 0, 'https://example.com/soda.jpg', 24, 0, 1.00, 0.80, 300, 'active');

-- Inserciones en la tabla CLIENTES
INSERT INTO CLIENTES (id, username, email, nacimiento, password, name, lastname, status) VALUES
(1, 'jdoe', 'jdoe@example.com', '1990-05-15', 'password123', 'John', 'Doe', 'active'),
(2, 'asmith', 'asmith@example.com', '1985-08-20', 'password456', 'Alice', 'Smith', 'active'),
(3, 'bwhite', 'bwhite@example.com', '1992-12-05', 'password789', 'Bob', 'White', 'active'),
(4, 'cgreen', 'cgreen@example.com', '1988-03-10', 'password111', 'Charlie', 'Green', 'active'),
(5, 'dblack', 'dblack@example.com', '1995-07-25', 'password222', 'Diana', 'Black', 'active'),
(6, 'emartinez', 'emartinez@example.com', '1983-01-30', 'password333', 'Eve', 'Martinez', 'active'),
(7, 'fgarcia', 'fgarcia@example.com', '1991-06-15', 'password444', 'Frank', 'Garcia', 'active'),
(8, 'hlee ', 'hlee@example.com', '1989-09-20', 'password555', 'Helen', 'Lee', 'active'),
(9, 'ijones', 'ijones@example.com', '1993-02-10', 'password666', 'Ian', 'Jones', 'active'),
(10, 'kwalker', 'kwalker@example.com', '1986-11-25', 'password777', 'Kate', 'Walker', 'active');

-- Inserciones en la tabla FACTURA
INSERT INTO FACTURA (id, fecha, id_user, total) VALUES
(1, '2023-10-01', 1, 45.99),
(2, '2023-10-02', 2, 23.97),
(3, '2023-10-03', 3, 56.99),
(4, '2023-10-04', 4, 34.99),
(5, '2023-10-05', 5, 67.99),
(6, '2023-10-06', 6, 29.99),
(7, '2023-10-07', 7, 49.99),
(8, '2023-10-08', 8, 39.99),
(9, '2023-10-09', 9, 69.99),
(10, '2023-10-10', 10, 59.99);

-- Inserciones en la tabla PRODUCTOS_FACTURADOS
INSERT INTO PRODUCTOS_FACTURADOS (id_factura, id_producto, cantidad) VALUES
(1, 1, 2),  -- 2 Vinos Tintos
(1, 2, 3),  -- 3 Cervezas Artesanales
(2, 3, 1),  -- 1 Whisky Escocés
(3, 4, 2),  -- 2 Agua Mineral
(4, 5, 1),  -- 1 Ron Blanco
(5, 6, 3),  -- 3 Cervezas Rubias
(6, 7, 1),  -- 1 Champán Brut
(7, 8, 2),  -- 2 Sidras
(8, 9, 1),  -- 1 Tequila
(9, 10, 3),  -- 3 Sodas
(10, 1, 2);  -- 2 Vinos Tintos

-- Inserciones en la tabla ENVIOS
INSERT INTO ENVIOS (id, id_user, destino, id_factura, monto, entrega, tipo, status) VALUES
(1, 1, 'Calle Falsa 123', 1, 5.00, '2023-10-03', 'minorista', 'pending'),
(2, 2, 'Avenida Siempre Viva 742', 2, 5.00, '2023-10-04', 'minorista', 'pending'),
(3, 3, 'Calle Real 456', 3, 5.00, '2023-10-05', 'minorista', 'pending'),
(4, 4, 'Avenida Principal 1234', 4, 5.00, '2023-10-06', 'minorista', 'pending'),
(5, 5, 'Calle Larga 789', 5, 5.00, '2023-10-07', 'minorista', 'pending'),
(6, 6, 'Avenida Norte 901', 6, 5.00, '2023-10-08', 'minorista', 'pending'),
(7, 7, 'Calle Sur 234', 7, 5.00, '2023-10-09', 'minorista', 'pending'),
(8, 8, 'Avenida Este 567', 8, 5.00, '2023-10-10', 'minorista', 'pending'),
(9, 9, 'Calle Oeste 890', 9, 5.00, '2023-10-11', 'minorista', 'pending'),
(10, 10, 'Avenida Central 345', 10, 5.00, '2023-10-12', 'minorista', 'pending');

-- Inserciones en la tabla AVISOS
INSERT INTO AVISOS (id, titulo, descripcion, tipo, fecha) VALUES
(1, 'Stock Bajo', 'El stock de Vino Tinto está bajo. Solo quedan 10 unidades.', 'alerta', '2023-10-01'),
(2, 'Producción Detenida', 'La producción de Cerveza Artesanal se ha detenido temporalmente.', 'alerta', '2023-10-02'),
(3, 'Nuevo Producto', 'Se ha agregado un nuevo producto: Ron Blanco.', 'noticia', '2023-10-03'),
(4, 'Oferta Especial', 'Oferta especial en Cerveza Rubia: 3x2.', 'oferta', '2023-10-04'),
(5, 'Stock Agotado', 'El stock de Whisky Escocés se ha agotado.', 'alerta', '2023-10-05'),
(6, 'Nueva Promoción', 'Nueva promoción en Champán Brut: 20% de descuento.', 'oferta', '2023-10-06'),
(7, 'Problema de Envío', 'Se ha producido un problema de envío en la zona norte.', 'alerta', '2023-10-07'),
(8, 'Nuevo Proveedor', 'Se ha agregado un nuevo proveedor: Vinos del Mundo.', 'noticia', '2023-10-08'),
(9, 'Stock Bajo', 'El stock de Sidra está bajo. Solo quedan 20 unidades.', 'alerta', '2023-10-09'),
(10, 'Oferta Especial', 'Oferta especial en Tequila: 2x1.', 'oferta', '2023-10-10');

-- Inserciones en la tabla PROVEEDORES
INSERT INTO PROVEEDORES (id, nombre, telefono, rif, ubicacion, status) VALUES
(1, 'Distribuidora de Bebidas S.A.', '0212-1234567', 'J-12345678-9', 'Caracas, Venezuela', 'active'),
(2, 'Vinos del Mundo', '0212-7654321', 'J-98765432-1', 'Maracaibo, Venezuela', 'active'),
(3, 'Cervecería Nacional', '0212-9012345', 'J-11111111-1', 'Valencia, Venezuela', 'active'),
(4, 'Licorera del Este', '0212-1111111', 'J-22222222-2', 'Maturín, Venezuela', 'active'),
(5, 'Bebidas Internacionales', '0212-2222222', 'J-33333333-3', 'Barquisimeto, Venezuela', 'active'),
(6, 'Distribuidora de Licores', '0212-3333333', 'J-44444444-4', 'Acarigua, Venezuela', 'active'),
(7, 'Cervecería Artesanal', '0212-4444444', 'J-55555555-5', 'San Cristóbal, Venezuela', 'active'),
(8, 'Vinos y Licores', '0212-5555555', 'J-66666666-6', 'Mérida, Venezuela', 'active'),
(9, 'Bebidas Nacionales', '0212-6666666', 'J-77777777-7', 'Trujillo, Venezuela', 'active'),
(10, 'Distribuidora de Bebidas Regionales', '0212-7777777', 'J-88888888-8', 'Táchira, Venezuela', 'active');

-- Inserciones en la tabla VENTAS
INSERT INTO VENTAS (id, id_producto, id_user, cantidad, ingresos) VALUES
(1, 1, 1, 2, 31.98 ),
(2, 2, 2, 3, 11.97),
(3, 3, 3, 1, 29.99),
(4, 4, 4, 2, 3.00),
(5, 5, 5, 1, 25.00),
(6, 6, 6, 3, 13.50),
(7, 7, 7, 1, 39.99),
(8, 8, 8, 2, 5.00),
(9, 9, 9, 1, 29.99),
(10, 10, 10, 3, 3.00);

-- Inserciones en la tabla COMPRA_PROVEEDORES
INSERT INTO COMPRA_PROVEEDORES (id, id_proveedor, fecha_compra, fecha_entrega, cantidad_paquete) VALUES
(1, 1, '2023-09-15', '2023-09-20', 100),
(2, 2, '2023-09-22', '2023-09-25', 50),
(3, 3, '2023-09-25', '2023-09-30', 200),
(4, 4, '2023-09-28', '2023-10-02', 150),
(5, 5, '2023-09-30', '2023-10-05', 300),
(6, 6, '2023-10-02', '2023-10-07', 250),
(7, 7, '2023-10-05', '2023-10-10', 100),
(8, 8, '2023-10-07', '2023-10-12', 200),
(9, 9, '2023-10-10', '2023-10-15', 300),
(10, 10, '2023-10-12', '2023-10-17', 250);