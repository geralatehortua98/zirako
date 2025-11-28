-- ============================================
-- SCRIPT DE CREACIÓN DE TABLAS - ZIRAKO
-- Base de datos: MySQL (Railway)
-- ============================================
-- Ejecutar este script en Railway MySQL
-- ============================================

-- Eliminar tablas existentes (en orden de dependencias)
DROP TABLE IF EXISTS reportes;
DROP TABLE IF EXISTS mensajes;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS items_recoleccion;
DROP TABLE IF EXISTS recolecciones;
DROP TABLE IF EXISTS intercambios;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS tickets_soporte;
DROP TABLE IF EXISTS usuarios;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ciudad VARCHAR(100) DEFAULT 'Cali',
    direccion TEXT,
    foto_perfil VARCHAR(500),
    puntos INT DEFAULT 0,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(500),
    token_reset_password VARCHAR(500),
    reset_password_expira DATETIME,
    ultimo_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_ciudad (ciudad),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE categorias (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activa BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías predeterminadas
INSERT INTO categorias (id, nombre, descripcion, icono, orden) VALUES
('electronica', 'Electrónica', 'Teléfonos, computadoras, tablets y dispositivos electrónicos', 'Smartphone', 1),
('muebles', 'Muebles', 'Sofás, mesas, sillas, camas y decoración del hogar', 'Sofa', 2),
('ropa', 'Ropa y Accesorios', 'Ropa, calzado, bolsos y accesorios de moda', 'Shirt', 3),
('hogar', 'Hogar y Cocina', 'Electrodomésticos, utensilios y artículos para el hogar', 'Home', 4),
('deportes', 'Deportes', 'Equipos deportivos, fitness y actividades al aire libre', 'Dumbbell', 5),
('libros', 'Libros y Educación', 'Libros, revistas, material educativo y cursos', 'BookOpen', 6),
('juguetes', 'Juguetes y Juegos', 'Juguetes, videojuegos y entretenimiento', 'Gamepad2', 7),
('herramientas', 'Herramientas', 'Herramientas manuales, eléctricas y equipos de trabajo', 'Wrench', 8),
('vehiculos', 'Vehículos', 'Bicicletas, motos, repuestos y accesorios', 'Car', 9),
('electrodomesticos', 'Electrodomésticos', 'Neveras, lavadoras, estufas y electrodomésticos grandes', 'Tv', 10),
('otros', 'Otros', 'Artículos diversos y misceláneos', 'Package', 11);

-- ============================================
-- TABLA: items (artículos)
-- ============================================
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo ENUM('venta', 'donacion', 'intercambio') NOT NULL,
    condicion ENUM('Nuevo', 'Como nuevo', 'Usado') NOT NULL,
    precio DECIMAL(12, 2) DEFAULT 0,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    imagenes JSON,
    estado ENUM('disponible', 'reservado', 'completado', 'cancelado') DEFAULT 'disponible',
    vistas INT DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_ciudad (ciudad),
    INDEX idx_created (created_at),
    FULLTEXT INDEX idx_busqueda (titulo, descripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: favoritos
-- ============================================
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_favorito (usuario_id, item_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_item (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: intercambios
-- ============================================
CREATE TABLE intercambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_ofrecido_id INT NOT NULL,
    item_solicitado_id INT NOT NULL,
    usuario_propone_id INT NOT NULL,
    usuario_recibe_id INT NOT NULL,
    mensaje TEXT,
    estado ENUM('pendiente', 'aceptado', 'rechazado', 'completado', 'cancelado') DEFAULT 'pendiente',
    fecha_respuesta DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (item_ofrecido_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (item_solicitado_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_propone_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_recibe_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_propone (usuario_propone_id),
    INDEX idx_recibe (usuario_recibe_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: recolecciones
-- ============================================
CREATE TABLE recolecciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    fecha_programada DATE,
    horario_preferido VARCHAR(100),
    descripcion TEXT,
    estado ENUM('pendiente', 'confirmada', 'en_camino', 'completada', 'cancelada') DEFAULT 'pendiente',
    notas_recolector TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_programada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: items_recoleccion (relación N:M)
-- ============================================
CREATE TABLE items_recoleccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recoleccion_id INT NOT NULL,
    descripcion_item VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    cantidad INT DEFAULT 1,
    
    FOREIGN KEY (recoleccion_id) REFERENCES recolecciones(id) ON DELETE CASCADE,
    
    INDEX idx_recoleccion (recoleccion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: mensajes
-- ============================================
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remitente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    item_id INT,
    contenido TEXT NOT NULL,
    tipo ENUM('texto', 'imagen', 'sistema') DEFAULT 'texto',
    leido BOOLEAN DEFAULT FALSE,
    fecha_leido DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (remitente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    
    INDEX idx_remitente (remitente_id),
    INDEX idx_destinatario (destinatario_id),
    INDEX idx_item (item_id),
    INDEX idx_leido (leido),
    INDEX idx_conversacion (remitente_id, destinatario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: tickets_soporte
-- ============================================
CREATE TABLE tickets_soporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    categoria VARCHAR(100),
    estado ENUM('abierto', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'abierto',
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    respuesta TEXT,
    respondido_por INT,
    fecha_respuesta DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (respondido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reportes
-- ============================================
CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_reporta_id INT NOT NULL,
    item_id INT,
    usuario_reportado_id INT,
    motivo ENUM('contenido_inapropiado', 'fraude', 'spam', 'producto_ilegal', 'otro') NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'revisando', 'resuelto', 'descartado') DEFAULT 'pendiente',
    accion_tomada TEXT,
    revisado_por INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_reporta_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_reportado_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_estado (estado),
    INDEX idx_item (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTA: items con información completa
-- ============================================
CREATE OR REPLACE VIEW vista_items_completos AS
SELECT 
    i.*,
    u.nombre AS nombre_vendedor,
    u.telefono AS telefono_vendedor,
    u.foto_perfil AS foto_vendedor,
    u.puntos AS puntos_vendedor,
    c.nombre AS nombre_categoria,
    c.icono AS icono_categoria,
    (SELECT COUNT(*) FROM favoritos f WHERE f.item_id = i.id) AS total_favoritos
FROM items i
JOIN usuarios u ON i.usuario_id = u.id
JOIN categorias c ON i.categoria_id = c.id;

-- ============================================
-- VISTA: estadísticas por usuario
-- ============================================
CREATE OR REPLACE VIEW vista_estadisticas_usuario AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.puntos,
    (SELECT COUNT(*) FROM items WHERE usuario_id = u.id) AS total_items,
    (SELECT COUNT(*) FROM items WHERE usuario_id = u.id AND tipo = 'venta') AS items_venta,
    (SELECT COUNT(*) FROM items WHERE usuario_id = u.id AND tipo = 'donacion') AS items_donacion,
    (SELECT COUNT(*) FROM items WHERE usuario_id = u.id AND tipo = 'intercambio') AS items_intercambio,
    (SELECT COUNT(*) FROM intercambios WHERE usuario_propone_id = u.id OR usuario_recibe_id = u.id) AS total_intercambios
FROM usuarios u;
