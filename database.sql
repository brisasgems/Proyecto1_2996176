-- Base de datos para sistema de gestión de mesas
CREATE DATABASE IF NOT EXISTS restaurante;
USE restaurante;

-- Tabla de mesas mejorada
CREATE TABLE IF NOT EXISTS mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_mesa INT NOT NULL UNIQUE,
    capacidad INT NOT NULL CHECK (capacidad > 0),
    estado ENUM('disponible', 'ocupada', 'reservada', 'mantenimiento') DEFAULT 'disponible',
    cliente_nombre VARCHAR(100) NULL,
    cliente_cantidad INT NULL,
    hora_entrada TIME NULL,
    hora_salida TIME NULL,
    fecha_reserva DATE NULL,
    ubicacion VARCHAR(100) NULL,
    observaciones TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar mesas de ejemplo
INSERT INTO mesas (numero_mesa, capacidad, estado) VALUES
(1, 4, 'disponible'),
(2, 2, 'disponible'),
(3, 6, 'disponible'),
(4, 4, 'disponible'),
(5, 2, 'disponible'),
(6, 8, 'disponible'),
(7, 4, 'disponible'),
(8, 3, 'disponible'),
(9, 4, 'disponible');