DROP DATABASE IF EXISTS drinkers;
CREATE DATABASE IF NOT EXISTS drinkers;
USE drinkers;
DROP DATABASE IF EXISTS drinkers;
CREATE DATABASE IF NOT EXISTS drinkers;
USE drinkers;

CREATE TABLE INVENTARIO (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_producto VARCHAR(255) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  litros INT NOT NULL,
  grados INT NOT NULL,
  imagen VARCHAR(255) NOT NULL,
  paquete INT NOT NULL,
  precio_detal DECIMAL(10, 2) NOT NULL,
  precio_mayorista DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE CLIENTES (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  nacimiento DATE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  cedula INT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE FACTURA (
  id INT PRIMARY KEY AUTO_INCREMENT,
  control INT NOT NULL,
  fecha DATE NOT NULL,
  id_user INT NOT NULL,
  base DECIMAL(10, 2) NOT NULL,
  iva INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES CLIENTES(id)
);

CREATE TABLE IMPUESTOS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_impuesto VARCHAR(255) NOT NULL,
    tasa DECIMAL(5, 2) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PRODUCTOS_FACTURADOS (
  id_factura INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  ingresos DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id_factura, id_producto),
  FOREIGN KEY (id_factura) REFERENCES FACTURA(id),
  FOREIGN KEY (id_producto) REFERENCES INVENTARIO(id)
);

CREATE TABLE ENVIOS (
  id INT PRIMARY KEY AUTO_INCREMENT,
  destino TEXT NOT NULL,
  id_factura INT NOT NULL,
  entrega DATE NOT NULL,
  tipo VARCHAR(255) NOT NULL DEFAULT 'minorista',
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (id_factura) REFERENCES FACTURA(id)
);

CREATE TABLE AVISOS (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL
);

CREATE TABLE PROVEEDORES (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(255) NOT NULL,
  rif VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  id_producto INT NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES INVENTARIO(id),
  status VARCHAR(255) NOT NULL DEFAULT 'active'
);

CREATE TABLE COMPRA_PROVEEDORES (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_proveedor INT NOT NULL,
  fecha_compra DATE NOT NULL,
  fecha_entrega DATE NOT NULL,
  cantidad_paquete INT NOT NULL,
  FOREIGN KEY (id_proveedor) REFERENCES PROVEEDORES(id)
);