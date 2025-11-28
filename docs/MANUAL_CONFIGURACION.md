# Manual de Configuración - ZIRAKO

## Plataforma de Economía Circular para el Valle del Cauca

ZIRAKO es una plataforma que transforma objetos en desuso en recursos valiosos mediante:
- **Venta**: Vende tus artículos usados
- **Intercambio**: Cambia lo que no usas por lo que necesitas
- **Donación**: Dona para ayudar a otros

---

## Por qué Supabase en lugar de Firebase/Firestore

| Característica | Supabase (PostgreSQL) | Firestore (NoSQL) |
|---------------|----------------------|-------------------|
| Tipo de BD | Relacional (SQL) | NoSQL (Colecciones) |
| Consultas | SQL estándar, JOINs | Limitadas, sin JOINs |
| Relaciones | Nativas con FK | Manuales y complejas |
| Filtros | Múltiples y combinados | Limitados |
| Costo | Gratis hasta 500MB | Gratis pero límites de lectura |

**Recomendación**: Supabase es mejor para tu proyecto de grado porque usa SQL tradicional que es más fácil de entender y depurar.

---

## Índice

1. [Requisitos Previos](#1-requisitos-previos)
2. [Configuración de Supabase](#2-configuración-de-supabase)
3. [Variables de Entorno](#3-variables-de-entorno)
4. [Crear Tablas](#4-crear-tablas)
5. [Ejecutar en Local](#5-ejecutar-en-local)
6. [Estructura del Proyecto](#6-estructura-del-proyecto)

---

## 1. Requisitos Previos

| Herramienta | Versión Mínima | Descargar |
|-------------|----------------|-----------|
| Node.js | 18.x o superior | [nodejs.org](https://nodejs.org/) |
| npm o pnpm | 9.x o superior | Incluido con Node.js |

\`\`\`bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
\`\`\`

---

## 2. Configuración de Supabase

### Paso 2.1: Crear Cuenta y Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Clic en **"Start your project"**
3. Inicia sesión con GitHub o correo
4. Clic en **"New project"**
5. Completa:
   - **Name**: `zirako`
   - **Database Password**: (guarda esta contraseña)
   - **Region**: South America (São Paulo)
6. Clic en **"Create new project"**
7. Espera 2 minutos

### Paso 2.2: Obtener Credenciales

1. Ve a **Settings** (engranaje) → **API**
2. Copia estos 3 valores:

\`\`\`
Project URL:        https://xxxxxxxxxx.supabase.co
anon public key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

---

## 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
# ========================================
# SUPABASE - Configuración Principal
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ========================================
# CORREO (Ya configurados)
# ========================================
SMTP_HOST=tu_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email
SMTP_PASSWORD=tu_password
\`\`\`

| Variable | Descripción | Obligatoria |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anónima | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (secreta) | Sí |

---

## 4. Crear Tablas

Ve a **SQL Editor** en Supabase y ejecuta estos scripts en orden:

### Script 1: Tablas principales

\`\`\`sql
-- Tabla de usuarios
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  ciudad VARCHAR(50) DEFAULT 'Cali',
  foto_perfil TEXT,
  calificacion DECIMAL(2,1) DEFAULT 0.0,
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de categorías
CREATE TABLE public.categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  icono VARCHAR(50) NOT NULL,
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE
);

-- Insertar categorías
INSERT INTO public.categorias (nombre, slug, icono) VALUES
('Electrónica', 'electronica', 'electronica'),
('Tecnología', 'tecnologia', 'tecnologia'),
('Muebles', 'muebles', 'muebles'),
('Electrodomésticos', 'electrodomesticos', 'electrodomesticos'),
('Ropa y Accesorios', 'ropa', 'ropa'),
('Libros', 'libros', 'libros'),
('Herramientas', 'herramientas', 'herramientas'),
('Oficina', 'oficina', 'oficina');

-- Tabla de items/productos
CREATE TABLE public.items (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  categoria_id INT NOT NULL REFERENCES public.categorias(id),
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('venta', 'donacion', 'intercambio')),
  precio DECIMAL(12,2) DEFAULT 0,
  condicion VARCHAR(20) NOT NULL CHECK (condicion IN ('Nuevo', 'Como nuevo', 'Usado')),
  ciudad VARCHAR(50) NOT NULL,
  imagen_principal TEXT,
  estado VARCHAR(20) DEFAULT 'disponible',
  vistas INT DEFAULT 0,
  fecha_publicacion TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de intercambios
CREATE TABLE public.intercambios (
  id SERIAL PRIMARY KEY,
  item_solicitado_id INT NOT NULL REFERENCES public.items(id),
  item_ofrecido_id INT NOT NULL REFERENCES public.items(id),
  solicitante_id UUID NOT NULL REFERENCES public.usuarios(id),
  propietario_id UUID NOT NULL REFERENCES public.usuarios(id),
  mensaje TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE public.mensajes (
  id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES public.items(id),
  remitente_id UUID NOT NULL REFERENCES public.usuarios(id),
  destinatario_id UUID NOT NULL REFERENCES public.usuarios(id),
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  fecha_envio TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### Script 2: Seguridad (RLS)

\`\`\`sql
-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercambios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;

-- Políticas de usuarios
CREATE POLICY "Usuarios públicos" ON public.usuarios FOR SELECT USING (true);
CREATE POLICY "Usuarios editan su perfil" ON public.usuarios FOR UPDATE USING (auth.uid() = id);

-- Políticas de items
CREATE POLICY "Items públicos" ON public.items FOR SELECT USING (activo = true);
CREATE POLICY "Usuarios crean items" ON public.items FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuarios editan sus items" ON public.items FOR UPDATE USING (auth.uid() = usuario_id);

-- Categorías públicas
CREATE POLICY "Categorías públicas" ON public.categorias FOR SELECT USING (true);
\`\`\`

### Script 3: Función para crear usuario automáticamente

\`\`\`sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre_completo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

---

## 5. Ejecutar en Local

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
\`\`\`

---

## 6. Estructura del Proyecto

\`\`\`
zirako/
├── app/                    # Páginas de la aplicación
│   ├── api/                # API Routes (Backend)
│   ├── auth/               # Login, Register, Forgot Password
│   ├── categorias/         # Navegación por categorías
│   ├── dashboard/          # Panel principal
│   ├── item/               # Detalle de producto
│   ├── intercambio/        # Gestión de intercambios
│   └── publicar/           # Publicar productos
├── components/             # Componentes reutilizables
├── lib/                    # Configuraciones
│   ├── supabase.ts         # Cliente de Supabase
│   └── supabase-server.ts  # Cliente para servidor
├── types/                  # Tipos TypeScript
└── docs/                   # Documentación
\`\`\`

---

## Ciudades del Valle del Cauca

- Cali
- Palmira
- Buenaventura
- Tuluá
- Cartago
- Buga
- Yumbo
- Jamundí
- Sevilla
- Zarzal

---

## Datos que Necesito para Configurar

Para dejarte todo funcionando, necesito que me envíes:

1. **NEXT_PUBLIC_SUPABASE_URL**: La URL de tu proyecto
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: La clave anónima
3. **SUPABASE_SERVICE_ROLE_KEY**: La clave de servicio

Estos datos los encuentras en: **Supabase** → **Settings** → **API**

---

**ZIRAKO** - Transformando residuos en recursos para el Valle del Cauca
