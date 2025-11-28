-- ============================================
-- SCRIPT DE ACTUALIZACIÓN DE TABLAS - ZIRAKO
-- Ejecutar DESPUÉS de 01-crear-tablas-mysql.sql
-- ============================================

-- ============================================
-- ACTUALIZAR TABLA: usuarios (agregar campos faltantes)
-- ============================================
ALTER TABLE usuarios 
ADD COLUMN nivel INT DEFAULT 1 AFTER puntos,
ADD COLUMN nombre_empresa VARCHAR(200) AFTER ciudad,
ADD COLUMN avatar_url VARCHAR(500) AFTER foto_perfil;

-- ============================================
-- NUEVA TABLA: donaciones
-- ============================================
CREATE TABLE IF NOT EXISTS donaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donante_id INT NOT NULL,
    receptor_id INT,
    item_id INT NOT NULL,
    estado ENUM('pendiente', 'aceptada', 'completada', 'cancelada') DEFAULT 'pendiente',
    mensaje TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (donante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    
    INDEX idx_donante (donante_id),
    INDEX idx_receptor (receptor_id),
    INDEX idx_item (item_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NUEVA TABLA: impacto_ambiental
-- ============================================
CREATE TABLE IF NOT EXISTS impacto_ambiental (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    item_id INT,
    tipo_accion ENUM('donacion', 'venta', 'intercambio', 'recoleccion') NOT NULL,
    co2_ahorrado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo_accion),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NUEVA TABLA: ventas
-- ============================================
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id INT NOT NULL,
    comprador_id INT,
    item_id INT NOT NULL,
    precio_final DECIMAL(12, 2) NOT NULL,
    estado ENUM('pendiente', 'pagada', 'completada', 'cancelada') DEFAULT 'pendiente',
    metodo_pago VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_comprador (comprador_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AGREGAR item_id a recolecciones
-- ============================================
ALTER TABLE recolecciones 
ADD COLUMN item_id INT AFTER usuario_id,
ADD CONSTRAINT fk_recoleccion_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL;

-- ============================================
-- VISTA: Dashboard ambiental por usuario
-- ============================================
CREATE OR REPLACE VIEW vista_impacto_usuario AS
SELECT 
    u.id AS usuario_id,
    u.nombre,
    u.puntos,
    u.nivel,
    COALESCE(SUM(ia.co2_ahorrado), 0) AS total_co2_ahorrado,
    COUNT(CASE WHEN ia.tipo_accion = 'donacion' THEN 1 END) AS total_donaciones,
    COUNT(CASE WHEN ia.tipo_accion = 'venta' THEN 1 END) AS total_ventas,
    COUNT(CASE WHEN ia.tipo_accion = 'intercambio' THEN 1 END) AS total_intercambios,
    COUNT(CASE WHEN ia.tipo_accion = 'recoleccion' THEN 1 END) AS total_recolecciones
FROM usuarios u
LEFT JOIN impacto_ambiental ia ON u.id = ia.usuario_id
GROUP BY u.id, u.nombre, u.puntos, u.nivel;

-- ============================================
-- VISTA: Impacto ambiental por mes
-- ============================================
CREATE OR REPLACE VIEW vista_impacto_mensual AS
SELECT 
    usuario_id,
    YEAR(created_at) AS anio,
    MONTH(created_at) AS mes,
    SUM(co2_ahorrado) AS co2_mes,
    COUNT(*) AS acciones_mes
FROM impacto_ambiental
GROUP BY usuario_id, YEAR(created_at), MONTH(created_at)
ORDER BY anio DESC, mes DESC;
