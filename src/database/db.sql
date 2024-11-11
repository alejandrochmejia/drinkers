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
  control INT NOT NULL,
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


INSERT INTO INVENTARIO (id, nombre_producto, tipo, descripcion, litros, grados, imagen, paquete, iva, precio_detal, precio_mayorista, stock, status) VALUES
(1, 'Lagrimauva', 'Vinos', '', 1, 12, '/images/Licores/vino-lagrimauva.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(2, 'Carupano', 'Ron', '', 1, 40, '/images/Licores/ron-carupano.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(3, 'Highland', 'Whisky', '', 1, 40, '/images/Licores/whisky-highland.png', 12, 16, 10.0, 9.0, 100, 'active'),
(4, 'Monumental', 'Sangria', '', 1, 7, '/images/Licores/sangria-monumental.jpeg', 12, 16, 10.0, 9.0, 100, 'active'),
(5, 'Oldpar', 'Whisky', '', 1, 40, '/images/Licores/whisky-oldpar.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(6, 'Buchanan', 'Whisky', '', 1, 40, '/images/Licores/whisky-buchanan.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(7, 'Kingofqueens', 'Whisky', '', 1, 40, '/images/Licores/whisky-kingofqueens.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(8, 'Grant12', 'Whisky', '', 1, 40, '/images/Licores/whisky-grant12.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(9, 'Canaclara', 'Aguardiente', '', 1, 50, '/images/Licores/aguardiente-canaclara.png', 12, 16, 10.0, 9.0, 100, 'active'),
(10, 'Breezeice', 'Vodka', '', 1, 35, '/images/Licores/vodka-breezeice.jpg', 12, 16, 15.0, 13.5, 100, 'active'),
(11, 'Cincoestrellas', 'Ron', '', 1, 40, '/images/Licores/ron-cincoestrellas.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(12, 'Bajoceromaracuya', 'Vodka', '', 1, 35, '/images/Licores/vodka-bajoceromaracuya.jpeg', 12, 16, 15.0, 13.5, 100, 'active'),
(13, 'Gallorojo', 'Anis', '', 1, 35, '/images/Licores/anis-gallorojo.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(14, 'Cattos', 'Whisky', '', 1, 40, '/images/Licores/whisky-cattos.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(15, 'Bajocerococo', 'Vodka', '', 1, 35, '/images/Licores/vodka-bajocerococo.png', 12, 16, 15.0, 13.5, 100, 'active'),
(16, 'Smirnoff', 'Vodka', '', 1, 35, '/images/Licores/vodka-smirnoff.jpg', 12, 16, 15.0, 13.5, 100, 'active'),
(17, 'Cartaroja', 'Baseron', '', 1, 40, '/images/Licores/baseron-cartaroja.webp', 12, 16 , 10.0, 9.0, 100, 'active'),
(18, 'Barrica', 'Ron', '', 1, 40, '/images/Licores/ron-barrica.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(19, 'Deward', 'Whisky', '', 1, 40, '/images/Licores/whisky-deward.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(20, 'Caribublanco', 'Ron', '', 1, 40, '/images/Licores/ron-caribublanco.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(21, 'Grant', 'Whisky', '', 1, 40, '/images/Licores/whisky-grant.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(22, 'Quimera', 'Ron', '', 1, 40, '/images/Licores/ron-quimera.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(23, 'Cartacho', 'Vinos', '', 1, 12, '/images/Licores/vino-cartacho.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(24, 'Caribuselection', 'Ron', '', 1, 40, '/images/Licores/ron-caribuselection.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(25, 'Cartacho', 'Sangria', '', 1, 7, '/images/Licores/sangria-cartacho.bmp', 12, 16, 10.0, 9.0, 100, 'active'),
(26, 'Old', 'Whisky', '', 1, 40, '/images/Licores/whisky-old.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(27, 'Malportada', 'Sangria', '', 1, 7, '/images/Licores/sangria-malportada.webp', 12, 16, 10.0, 9.0, 100, 'active'),
(28, 'Barricacrema', 'Ron', '', 1, 40, '/images/Licores/ron-barricacrema.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(29, 'Caribucoco', 'Ron', '', 1, 40, '/images/Licores/ron-caribucoco.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(30, 'Bodega', 'Ron', '', 1, 40, '/images/Licores/ron-bodega.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(31, 'Cartujo', 'Anis', '', 1, 35, '/images/Licores/anis-cartujo.png', 12, 16, 10.0, 9.0, 100, 'active'),
(32, 'Cincoestrellasblanco', 'Ron', '', 1, 40, '/images/Licores/ron-cincoestrellasblanco.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(33, 'Casillerodiablo', 'Vinos', '', 1, 12, '/images/Licores/vino-casillerodiablo.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(34, 'Blackandwhite', 'Whiskey', '', 1, 40, '/images/Licores/whiskey-blackandwhite.jpg', 12, 16, 20.0, 18.0, 100, 'active'),
(35, 'Santateresablanco', 'Ron', '', 1, 40, '/images/Licores/ron-santateresablanco.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(36, 'Madeira', 'Aguardiente', '', 1, 50, '/images/Licores/aguardiente-madeira.png', 12, 16 , 10.0, 9.0, 100, 'active'),
(37, 'Bajocerofrutas', 'Vodka', '', 1, 35, '/images/Licores/vodka-bajocerofrutas.png', 12, 16, 15.0, 13.5, 100, 'active'),
(38, 'Santateresa1796', 'Ron', '', 1, 40, '/images/Licores/ron-santateresa1796.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(39, 'Naiguata', 'Baseron', '', 1, 40, '/images/Licores/baseron-naiguata.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(40, 'Cacique500', 'Ron', '', 1, 40, '/images/Licores/ron-cacique500.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(41, 'Santateresadanny', 'Ron', '', 1, 40, '/images/Licores/ron-santateresadanny.jpeg', 12, 16, 12.0, 10.8, 100, 'active'),
(42, 'Caribena', 'Sangria', '', 1, 7, '/images/Licores/sangria-caribena.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(43, 'Smirnoffbotella', 'Vodka', '', 1, 35, '/images/Licores/vodka-smirnoffbotella.jpg', 12, 16, 15.0, 13.5, 100, 'active'),
(44, 'Caraquena', 'Sangria', '', 1, 7, '/images/Licores/sangria-caraquena.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(45, 'Caribuparchita', 'Ron', '', 1, 40, '/images/Licores/ron-caribuparchita.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(46, 'Sagradafamilia', 'Vinos', '', 1, 12, '/images/Licores/vino-sagradafamilia.webp', 12, 16, 10.0, 9.0, 100, 'active'),
(47, 'Sagradafamiliablanco', 'Vinos', '', 1, 12, '/images/Licores/vino-sagradafamiliablanco.webp', 12, 16, 10.0, 9.0, 100, 'active'),
(48, 'Bandera', 'Anis', '', 1, 35, '/images/Licores/anis-bandera.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(49, 'Bajocerofresa', 'Vodka', '', 1, 35, '/images/Licores/vodka-bajocerofresa.jpg', 12, 16, 15.0, 13.5, 100, 'active'),
(50, 'Cacique', 'Ron', '', 1, 40, '/images/Licores/ron-cacique.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(51, 'Chevalier', 'Basebrandy', '', 1, 40, '/images/Licores/basebrandy-chevalier.jpg', 12, 16, 10.0, 9.0, 100, 'active'),
(52, 'Polarbear', 'Vodka', '', 1, 35, '/images/Licores/vodka-polarbear.png', 12, 16, 15.0, 13.5, 100, 'active'),
(53, 'Cartachorose', 'Sangria', '', 1, 7, '/images/Licores/sangria-cartachorose.webp', 12, 16, 10.0, 9.0, 100, 'active'),
(54, 'Superior', 'Ron', '', 1, 40, '/images/Licores/ron-superior.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(55, 'Bajoceroneutro', 'Vodka', '', 1, 35, '/images/Licores/vodka-bajoceroneutro.jpg', 12, 16, 15.0, 13.5, 100, 'active'),
(56, 'Caribugold', 'Ron', '', 1, 40, '/images/Licores/ron-caribugold.jpg', 12, 16, 12.0, 10.8, 100, 'active'),
(57, 'Santateresabicentenario', 'Ron', '', 1, 40, '/images/Licores/ron-santateresabicentenario.png', 12, 16, 12.0, 10.8, 100, 'active'),
(58, 'Santateresalinaje', 'Ron', '', 1, 40, '/images/Licores/ron-santateresalinaje.jpg', 12, 16, 12.0, 10.8, 100, 'active');


UPDATE INVENTARIO SET descripcion = 'Un vino tinto suave y afrutado, ideal para acompañar carnes rojas y pastas.' WHERE id = 1;
UPDATE INVENTARIO SET descripcion = 'Ron oscuro de sabor intenso, perfecto para disfrutar solo o en cócteles.' WHERE id = 2;
UPDATE INVENTARIO SET descripcion = 'Whisky escocés con notas de frutas y especias, ideal para beber solo o con hielo.' WHERE id = 3;
UPDATE INVENTARIO SET descripcion = 'Sangría refrescante con frutas, perfecta para compartir en reuniones.' WHERE id = 4;
UPDATE INVENTARIO SET descripcion = 'Un whisky de malta con un sabor robusto y un final ahumado.' WHERE id = 5;
UPDATE INVENTARIO SET descripcion = 'Whisky suave y equilibrado, con un toque de miel y vainilla.' WHERE id = 6;
UPDATE INVENTARIO SET descripcion = 'Un whisky de alta calidad con un perfil de sabor complejo y refinado.' WHERE id = 7;
UPDATE INVENTARIO SET descripcion = 'Whisky de 12 años con un sabor suave y afrutado, ideal para los amantes del whisky.' WHERE id = 8;
UPDATE INVENTARIO SET descripcion = 'Aguardiente con un sabor fuerte y un toque de anís, perfecto para celebrar.' WHERE id = 9;
UPDATE INVENTARIO SET descripcion = 'Vodka puro y suave, ideal para cócteles y mezclas.' WHERE id = 10;
UPDATE INVENTARIO SET descripcion = 'Ron de calidad premium, con un sabor rico y profundo.' WHERE id = 11;
UPDATE INVENTARIO SET descripcion = 'Vodka con un toque exótico de maracuyá, ideal para cócteles tropicales.' WHERE id = 12;
UPDATE INVENTARIO SET descripcion = 'Aguardiente anisado, perfecto para disfrutar solo o en cócteles.' WHERE id = 13;
UPDATE INVENTARIO SET descripcion = 'Whisky de malta con un sabor suave y un toque de caramelo.' WHERE id = 14;
UPDATE INVENTARIO SET descripcion = 'Vodka suave y fresco, ideal para preparar deliciosos cócteles.' WHERE id = 15;
UPDATE INVENTARIO SET descripcion = 'Un vodka premium, conocido por su pureza y suavidad.' WHERE id = 16;
UPDATE INVENTARIO SET descripcion = 'Baseron con un sabor profundo y característico, ideal para disfrutar solo.' WHERE id = 17;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor rico y un final dulce, ideal para cócteles tropicales.' WHERE id = 18;
UPDATE INVENTARIO SET descripcion = 'Whisky con un perfil de sabor complejo, ideal para los amantes del whisky.' WHERE id = 19;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de especias, perfecto para mezclar.' WHERE id = 20;
UPDATE INVENTARIO SET descripcion = 'Whisky suave y dulce, ideal para disfrutar solo o en cócteles.' WHERE id = 21;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor intenso y un toque de vainilla, ideal para cócteles.' WHERE id = 22;
UPDATE INVENTARIO SET descripcion = 'Vino tinto de cuerpo medio, ideal para acompañar comidas.' WHERE id = 23;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de frutas tropicales.' WHERE id = 24;
UPDATE INVENTARIO SET descripcion = 'Sangría refrescante con un toque de frutas, perfecta para compartir.' WHERE id = 25;
UPDATE INVENTARIO SET descripcion = 'Whisky con un sabor robusto y un final ahumado.' WHERE id = 26;
UPDATE INVENTARIO SET descripcion = 'Sangría dulce y afrutada, ideal para disfrutar en verano.' WHERE id = 27;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de caramelo.' WHERE id = 28;
UPDATE INVENTARIO SET descripcion = 'Ron con un perfil de sabor complejo, ideal para cócteles.' WHERE id = 29;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de especias.' WHERE id = 30;
UPDATE INVENTARIO SET descripcion = 'Aguardiente anisado, ideal para disfrutar solo o en cócteles.' WHERE id = 31;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de frutas tropicales.' WHERE id = 32;
UPDATE INVENTARIO SET descripcion = 'Vino tinto de cuerpo medio, ideal para acompañar comidas.' WHERE id = 33;
UPDATE INVENTARIO SET descripcion = 'Whisky con un perfil de sabor complejo, ideal para los amantes del whisky.' WHERE id = 34;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor intenso y un toque de vainilla.' WHERE id = 35;
UPDATE INVENTARIO SET descripcion = 'Sangría refrescante con un toque de frutas, perfecta para compartir.' WHERE id = 36;
UPDATE INVENTARIO SET descripcion = 'Vodka con un toque exótico de frutas, ideal para cócteles tropicales.' WHERE id = 37;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de caramelo.' WHERE id = 38;
UPDATE INVENTARIO SET descripcion = 'Baseron con un sabor profundo y característico.' WHERE id = 39;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor rico y un final dulce.' WHERE id = 40;
UPDATE INVENTARIO SET descripcion = 'Whisky con un perfil de sabor complejo, ideal para los amantes del whisky.' WHERE id = 41;
UPDATE INVENTARIO SET descripcion = 'Sangría dulce y afrutada, ideal para disfrutar en verano.' WHERE id = 42;
UPDATE INVENTARIO SET descripcion = 'Vodka suave y fresco, ideal para preparar deliciosos cócteles.' WHERE id = 43;
UPDATE INVENTARIO SET descripcion = 'Sangría refrescante con un toque de frutas, perfecta para compartir.' WHERE id = 44;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor intenso y un toque de vainilla.' WHERE id = 45;
UPDATE INVENTARIO SET descripcion = 'Vino tinto de cuerpo medio, ideal para acompañar comidas.' WHERE id = 46;
UPDATE INVENTARIO SET descripcion = 'Vino tinto de cuerpo medio, ideal para acompañar comidas.' WHERE id = 47;
UPDATE INVENTARIO SET descripcion = 'Aguardiente anisado, ideal para disfrutar solo o en cócteles.' WHERE id = 48;
UPDATE INVENTARIO SET descripcion = 'Vodka con un toque exótico de frutas, ideal para cócteles tropicales.' WHERE id = 49;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de caramelo.' WHERE id = 50;
UPDATE INVENTARIO SET descripcion = 'Basebrandy con un sabor suave y un toque de frutas.' WHERE id = 51;
UPDATE INVENTARIO SET descripcion = 'Vodka suave y fresco, ideal para preparar deliciosos cócteles.' WHERE id = 52;
UPDATE INVENTARIO SET descripcion = 'Sangría refrescante con un toque de frutas, perfecta para compartir.' WHERE id = 53;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor rico y un final dulce.' WHERE id = 54;
UPDATE INVENTARIO SET descripcion = 'Vodka con un toque exótico de frutas, ideal para cócteles tropicales.' WHERE id = 55;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor intenso y un toque de vainilla.' WHERE id = 56;
UPDATE INVENTARIO SET descripcion = 'Ron con un perfil de sabor complejo, ideal para cócteles.' WHERE id = 57;
UPDATE INVENTARIO SET descripcion = 'Ron con un sabor suave y un toque de caramelo.' WHERE id = 58;


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
INSERT INTO FACTURA (id, control, fecha, id_user, total) VALUES
(1, 123456, '2023-10-01', 1, 45.99),
(2, 654321, '2023-10-02', 2, 23.97),
(3, 112233, '2023-10-03', 3, 56.99),
(4, 445566, '2023-10-04', 4, 34.99),
(5, 778899, '2023-10-05', 5, 67.99),
(6, 987654, '2023-10-06', 6, 29.99),
(7, 135792, '2023-10-07', 7, 49.99),
(8, 246801, '2023-10-08', 8, 39.99),
(9, 102938, '2023-10-09', 9, 69.99),
(10, 564738, '2023-10-10', 10, 59.99);


INSERT INTO PRODUCTOS_FACTURADOS (id_factura, id_producto, cantidad) VALUES
(1, 1, 2),  
(1, 2, 3),
(2, 3, 1),  
(3, 4, 2),  
(4, 5, 1),  
(5, 6, 3),  
(6, 7, 1),  
(7, 8, 2),  
(8, 9, 1),  
(9, 10, 3), 
(10, 1, 2); 

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