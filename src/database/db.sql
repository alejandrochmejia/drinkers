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
  precio_detal INT NOT NULL,
  precio_mayorista INT NOT NULL,
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
  total INT NOT NULL,
  FOREIGN KEY (id_user) REFERENCES USUARIO(id)
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
  monto INT NOT NULL,
  entrega DATE NOT NULL,
  tipo VARCHAR(255) NOT NULL DEFAULT 'minorista',
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (id_user) REFERENCES USUARIO(id),
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
  fecha_compra DATE NOT NULL,
  fecha_entrega DATE NOT NULL,
  producto VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE VENTAS (
  id INT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_user INT NOT NULL,
  cantidad INT NOT NULL,
  ingresos INT NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES INVENTARIO(id),
  FOREIGN KEY (id_user) REFERENCES USUARIO(id)
);

INSERT INTO PROVEEDORES (id, nombre, telefono, rif, ubicacion, fecha_compra, fecha_entrega, producto) VALUES
(1, 'Proveedor 1', 'Teléfono 1', 'RIF 1', 'Ubicación 1', '2023-01-01', '2023-01-02', 'Whisky'),
(2, 'Proveedor 2', 'Teléfono 2', 'RIF 2', 'Ubicación 2', '2023-01-03', '2023-01-04', 'Vodka'),
(3, 'Proveedor 3', 'Teléfono 3', 'RIF 3', 'Ubicación 3', '2023-01-05', '2023-01-06', 'Ron'),
(4, 'Proveedor 4', 'Teléfono 4', 'RIF 4', 'Ubicación 4', '2023-01-07', '2023-01-08', 'Whisky'),
(5, 'Proveedor 5', 'Teléfono 5', 'RIF 5', 'Ubicación 5', '2023-01-09', '2023-01-10', 'AnisCartujo'),
(6, 'Proveedor 6', 'Teléfono 6', 'RIF 6', 'Ubicación 6', '2023-01-11', '2023-01-12', 'Ron'),
(7, 'Proveedor 7', 'Teléfono 7', 'RIF 7', 'Ubicación 7', '2023-01-13', '2023-01-14', 'Vodka'),
(8, 'Proveedor 8', 'Teléfono 8', 'RIF 8', 'Ubicación 8', '2023-01-15', '2023-01-16', 'Ron'),
(9, 'Proveedor 9', 'Teléfono 9', 'RIF 9', 'Ubicación 9', '2023-01-17', '2023-01-18', 'Whisky'),
(10, 'Proveedor 10', 'Teléfono 10', 'RIF 10', 'Ubicación 10', '2023-01-19', '2023-01-20', 'Vodka');


INSERT INTO AVISOS (id, titulo, descripcion, tipo, fecha) VALUES
(1, 'Whisky', 'Nuevo lote de whisky escocés disponible en inventario', 'Producto', '2023-01-01'),
(2, 'Vinos', 'Promoción especial en vinos tintos reserva', 'Producto', '2023-01-02'),
(3, 'Tequilas', 'Actualización de precios en la línea de tequilas', 'Producto', '2023-01-03'),
(4, 'Capacitación', 'Reunión de personal para capacitación en atención al cliente', 'Personal', '2023-01-04'),
(5, 'Ginebra', 'Nuevo acuerdo con proveedor de ginebra premium', 'Proveedor', '2023-01-05'),
(6, 'Horarios', 'Cambio en el horario de turnos del personal de ventas', 'Personal', '2023-01-06'),
(7, 'Evaluación', 'Evaluación de desempeño trimestral para el equipo de logística', 'Personal', '2023-01-07'),
(8, 'Sommelier', 'Convocatoria para cubrir puesto de sommelier', 'Personal', '2023-01-08'),
(9, 'Nómina', 'Recordatorio: entrega de documentos para actualización de nómina', 'Personal', '2023-01-09'),
(10, 'Retraso', 'Retraso en envíos debido a condiciones climáticas adversas', 'Envio', '2023-01-10');

-- Insertar datos en la tabla INVENTARIO
INSERT INTO INVENTARIO (id, nombre_producto, tipo, descripcion, litros, grados, imagen, paquete, iva, precio_detal, precio_mayorista, stock, status) VALUES
(1, 'Whisky Escocés', 'Whisky', 'Whisky de malta premium', 0.75, 40, 'whisky_escoces.jpg', 1, 19, 50000, 45000, 100, 'active'),
(2, 'Vodka Ruso', 'Vodka', 'Vodka destilado 5 veces', 1, 37, 'vodka_ruso.jpg', 1, 19, 35000, 30000, 150, 'active'),
(3, 'Ron Añejo', 'Ron', 'Ron añejado 7 años', 0.7, 40, 'ron_anejo.jpg', 1, 19, 40000, 35000, 80, 'active'),
(4, 'Gin London Dry', 'Gin', 'Gin con botánicos selectos', 0.75, 43, 'gin_london.jpg', 1, 19, 45000, 40000, 120, 'active'),
(5, 'Tequila Reposado', 'Tequila', 'Tequila reposado 100% agave', 0.75, 38, 'tequila_reposado.jpg', 1, 19, 55000, 50000, 90, 'active'),
(6, 'Vino Tinto Reserva', 'Vino', 'Vino tinto reserva español', 0.75, 13, 'vino_tinto.jpg', 1, 19, 30000, 25000, 200, 'active'),
(7, 'Champagne Brut', 'Champagne', 'Champagne francés brut', 0.75, 12, 'champagne_brut.jpg', 1, 19, 60000, 55000, 70, 'active'),
(8, 'Licor de Café', 'Licor', 'Licor cremoso de café', 0.7, 17, 'licor_cafe.jpg', 1, 19, 25000, 20000, 110, 'active'),
(9, 'Cognac VSOP', 'Cognac', 'Cognac VSOP francés', 0.7, 40, 'cognac_vsop.jpg', 1, 19, 70000, 65000, 60, 'active'),
(10, 'Mezcal Artesanal', 'Mezcal', 'Mezcal artesanal de Oaxaca', 0.75, 45, 'mezcal_artesanal.jpg', 1, 19, 65000, 60000, 50, 'active'),
(11, 'Cerveza Artesanal', 'Cerveza', 'Cerveza artesanal de cebada', 0.5, 5, 'cerveza_artesanal.jpg', 1, 19, 20000, 15000, 200, 'active'),
-- Manera de Agregar la imagen
(12, 'Anis Cartujo', 'Anis', 'Anís tradicional', 0.7, 35, '/images/Licores/anis-cartujo.png', 12, 19, 30000, 25000, 120, 'active');

-- Insertar datos en la tabla USUARIO
INSERT INTO USUARIO (id, username, email, nacimiento, password, name, lastname, status) VALUES
(1, 'juan123', 'juan@email.com', '1990-05-15', 'hash_password1', 'Juan', 'Pérez', 'active'),
(2, 'maria_g', 'maria@email.com', '1988-10-20', 'hash_password2', 'María', 'González', 'active'),
(3, 'carlos_r', 'carlos@email.com', '1995-03-08', 'hash_password3', 'Carlos', 'Rodríguez', 'active'),
(4, 'ana_m', 'ana@email.com', '1992-12-01', 'hash_password4', 'Ana', 'Martínez', 'active'),
(5, 'pedro_s', 'pedro@email.com', '1985-07-30', 'hash_password5', 'Pedro', 'Sánchez', 'inactive'),
(6, 'laura_l', 'laura@email.com', '1993-09-18', 'hash_password6', 'Laura', 'López', 'active'),
(7, 'diego_f', 'diego@email.com', '1991-02-25', 'hash_password7', 'Diego', 'Fernández', 'active'),
(8, 'sofia_b', 'sofia@email.com', '1987-11-12', 'hash_password8', 'Sofía', 'Blanco', 'active'),
(9, 'javier_h', 'javier@email.com', '1994-06-05', 'hash_password9', 'Javier', 'Hernández', 'active'),
(10, 'elena_t', 'elena@email.com', '1989-04-22', 'hash_password10', 'Elena', 'Torres', 'active');
-- Insertar datos en la tabla FACTURA
INSERT INTO FACTURA (id, fecha, id_user, total) VALUES
(1, '2023-05-01', 1, 150000),
(2, '2023-05-02', 2, 85000),
(3, '2023-05-03', 3, 120000),
(4, '2023-05-04', 4, 200000),
(5, '2023-05-05', 5, 75000),
(6, '2023-05-06', 6, 180000),
(7, '2023-05-07', 7, 95000),
(8, '2023-05-08', 8, 135000),
(9, '2023-05-09', 9, 110000),
(10, '2023-05-10', 10, 160000);
-- Insertar datos en la tabla PRODUCTOS_FACTURADOS
INSERT INTO PRODUCTOS_FACTURADOS (id_factura, id_producto, cantidad) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 1),
(2, 6, 2),
(3, 4, 1),
(3, 5, 1),
(3, 8, 2),
(4, 7, 2),
(4, 9, 1),
(5, 10, 1),
(6, 1, 1),
(6, 2, 1),
(6, 3, 1),
(7, 5, 1),
(7, 6, 1),
(8, 4, 2),
(8, 8, 1),
(9, 3, 2),
(9, 7, 1),
(10, 9, 1),
(10, 10, 1);
-- Insertar datos en la tabla ENVIOS
INSERT INTO ENVIOS (id, id_user, destino, id_factura, monto, entrega, status, tipo) VALUES
(1, 1, 'Calle 123, Ciudad A', 1, 10000, '2023-05-03', 'pending', 'minorista'),
(2, 2, 'Avenida 456, Ciudad B', 2, 8000, '2023-05-04', 'pending', 'minorista'),
(3, 3, 'Plaza 789, Ciudad C', 3, 12000, '2023-05-05', 'pending', 'minorista'),
(4, 4, 'Calle 321, Ciudad D', 4, 15000, '2023-05-06', 'completado', 'mayorista'  ),
(5, 5, 'Avenida 654, Ciudad E', 5, 9000, '2023-05-07', 'completado', 'minorista'),
(6, 6, 'Plaza 987, Ciudad F', 6, 11000, '2023-05-08', 'completado', 'minorista'),
(7, 7, 'Calle 135, Ciudad G', 7, 7000, '2023-05-09', 'pending', 'minorista'),
(8, 8, 'Avenida 246, Ciudad H', 8, 13000, '2023-05-10', 'completado', 'minorista'),
(9, 9, 'Plaza 357, Ciudad I', 9, 10000, '2023-05-11', 'completado', 'minorista'),
(10, 10, 'Calle 468, Ciudad J', 10, 14000, '2023-05-12', 'completado', 'minorista');

INSERT INTO VENTAS (id, id_producto, id_user, cantidad, ingresos) VALUES
(1, 1, 1, 2, 20000),
(2, 3, 2, 1, 12000),
(3, 2, 3, 1, 15000),
(4, 6, 4, 2, 30000),
(5, 4, 5, 1, 15000),
(6, 5, 6, 1, 10000),
(7, 8, 7, 2, 25000),
(8, 7, 8, 2, 20000);
