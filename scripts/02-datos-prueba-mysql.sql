-- ============================================
-- DATOS DE PRUEBA - ZIRAKO
-- Base de datos: MySQL (Railway)
-- ============================================

-- Usuario de prueba (contraseña: Test123!)
-- Hash generado con bcrypt (12 rounds)
INSERT INTO usuarios (email, password_hash, nombre, telefono, ciudad, puntos, rol, email_verificado) VALUES
('admin@zirako.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4y5JH0LmOMtyZ5.W', 'Administrador ZIRAKO', '3001234567', 'Cali', 1000, 'admin', TRUE),
('usuario@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4y5JH0LmOMtyZ5.W', 'Usuario Prueba', '3109876543', 'Palmira', 50, 'usuario', TRUE),
('maria@ejemplo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4y5JH0LmOMtyZ5.W', 'María García', '3151234567', 'Cali', 120, 'usuario', TRUE),
('carlos@ejemplo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4y5JH0LmOMtyZ5.W', 'Carlos Rodríguez', '3201234567', 'Tuluá', 80, 'usuario', TRUE),
('ana@ejemplo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4y5JH0LmOMtyZ5.W', 'Ana Martínez', '3001112233', 'Buga', 200, 'usuario', TRUE);

-- Items de prueba
INSERT INTO items (usuario_id, categoria_id, titulo, descripcion, tipo, condicion, precio, ciudad, imagenes, estado) VALUES
-- Electrónica
(2, 'electronica', 'Samsung Galaxy A54', 'Smartphone Samsung Galaxy A54 en excelente estado, 128GB, color negro. Incluye cargador original y estuche protector.', 'venta', 'Como nuevo', 850000, 'Cali', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]', 'disponible'),
(3, 'electronica', 'MacBook Air M1', 'MacBook Air con chip M1, 8GB RAM, 256GB SSD. Perfecto para estudiantes y profesionales.', 'venta', 'Como nuevo', 3200000, 'Cali', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400"]', 'disponible'),
(4, 'electronica', 'Audífonos Sony WH-1000XM4', 'Audífonos inalámbricos con cancelación de ruido. Batería de 30 horas.', 'intercambio', 'Usado', 0, 'Palmira', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]', 'disponible'),

-- Muebles
(2, 'muebles', 'Sofá 3 puestos', 'Sofá en tela gris, muy cómodo y en buen estado. Ideal para sala pequeña.', 'venta', 'Usado', 450000, 'Cali', '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"]', 'disponible'),
(3, 'muebles', 'Escritorio de madera', 'Escritorio de madera con 3 cajones. Perfecto para home office.', 'donacion', 'Usado', 0, 'Tuluá', '["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400"]', 'disponible'),
(5, 'muebles', 'Silla ergonómica', 'Silla de oficina ergonómica con soporte lumbar ajustable.', 'venta', 'Como nuevo', 380000, 'Buga', '["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400"]', 'disponible'),

-- Ropa
(3, 'ropa', 'Chaqueta de cuero', 'Chaqueta de cuero genuino talla M, color negro. Muy poco uso.', 'venta', 'Como nuevo', 180000, 'Cali', '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"]', 'disponible'),
(4, 'ropa', 'Zapatos deportivos Nike', 'Zapatos Nike Air Max talla 42, color blanco con negro.', 'intercambio', 'Usado', 0, 'Palmira', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]', 'disponible'),
(5, 'ropa', 'Vestido de fiesta', 'Vestido elegante talla S, color azul marino. Usado una sola vez.', 'donacion', 'Como nuevo', 0, 'Cali', '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"]', 'disponible'),

-- Hogar
(2, 'hogar', 'Licuadora Oster', 'Licuadora Oster de 10 velocidades con vaso de vidrio.', 'venta', 'Usado', 85000, 'Cali', '["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400"]', 'disponible'),
(3, 'hogar', 'Juego de ollas', 'Juego de 5 ollas de acero inoxidable con tapas de vidrio.', 'donacion', 'Usado', 0, 'Jamundí', '["https://images.unsplash.com/photo-1584990347449-a6d2ed02c3b0?w=400"]', 'disponible'),

-- Deportes
(4, 'deportes', 'Bicicleta montañera', 'Bicicleta GW rin 26, 21 velocidades. Incluye casco y candado.', 'venta', 'Usado', 650000, 'Tuluá', '["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400"]', 'disponible'),
(5, 'deportes', 'Pesas y mancuernas', 'Set de pesas con mancuernas ajustables de 2.5 a 10 kg.', 'intercambio', 'Como nuevo', 0, 'Cali', '["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"]', 'disponible'),

-- Libros
(2, 'libros', 'Colección Gabriel García Márquez', '5 libros de Gabo: Cien años de soledad, El amor en tiempos del cólera, y más.', 'venta', 'Usado', 120000, 'Cali', '["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"]', 'disponible'),
(3, 'libros', 'Libros de programación', 'Pack de 3 libros: JavaScript, Python y bases de datos.', 'donacion', 'Usado', 0, 'Palmira', '["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"]', 'disponible'),

-- Electrodomésticos
(4, 'electrodomesticos', 'Nevera Samsung', 'Nevera Samsung 250 litros, no frost, excelente estado.', 'venta', 'Usado', 1200000, 'Cali', '["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400"]', 'disponible'),
(5, 'electrodomesticos', 'Lavadora LG', 'Lavadora LG 18 kg, carga superior, funciona perfectamente.', 'venta', 'Usado', 950000, 'Buga', '["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400"]', 'disponible');

-- Algunos favoritos
INSERT INTO favoritos (usuario_id, item_id) VALUES
(2, 3), (2, 5), (3, 1), (3, 4), (4, 2), (5, 1);

-- Intercambios de prueba
INSERT INTO intercambios (item_ofrecido_id, item_solicitado_id, usuario_propone_id, usuario_recibe_id, mensaje, estado) VALUES
(3, 8, 4, 4, 'Hola! Me interesa intercambiar mis audífonos por tus zapatos Nike.', 'pendiente'),
(13, 3, 5, 4, 'Te cambio las pesas por los audífonos Sony.', 'pendiente');

-- Mensajes de prueba
INSERT INTO mensajes (remitente_id, destinatario_id, item_id, contenido) VALUES
(3, 2, 1, '¡Hola! ¿Aún tienes disponible el Samsung Galaxy?'),
(2, 3, 1, 'Sí, todavía está disponible. ¿Te interesa?'),
(3, 2, 1, 'Sí, ¿podríamos vernos en el centro de Cali?');

-- Ticket de soporte de prueba
INSERT INTO tickets_soporte (usuario_id, nombre, email, asunto, mensaje, categoria, estado) VALUES
(2, 'Usuario Prueba', 'usuario@test.com', 'Problema con publicación', 'No puedo subir fotos a mi publicación.', 'Técnico', 'abierto');
