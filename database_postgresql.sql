-- Base de datos para sistema de gestión de mesas (PostgreSQL/Supabase)

-- Tabla de mesas adaptada para PostgreSQL
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero_mesa INTEGER NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'reservada', 'mantenimiento')),
    cliente_nombre VARCHAR(100) NULL,
    cliente_cantidad INTEGER NULL,
    hora_entrada TIME NULL,
    hora_salida TIME NULL,
    fecha_reserva DATE NULL,
    ubicacion VARCHAR(100) NULL,
    observaciones TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mesas_updated_at 
    BEFORE UPDATE ON mesas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

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
