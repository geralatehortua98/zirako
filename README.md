# ZIRAKO - Plataforma de Economía Circular

ZIRAKO es una plataforma web que promueve la economía circular en el Valle del Cauca, Colombia. Permite a los usuarios vender, donar e intercambiar objetos en desuso, transformando "residuos" en "recursos valiosos".

## Características

- **Venta**: Publica artículos para vender con precios en COP
- **Donación**: Dona artículos que ya no necesitas
- **Intercambio**: Intercambia artículos con otros usuarios
- **Recolección**: Programa recolección de artículos a domicilio
- **Chat**: Comunicación directa entre usuarios
- **Sistema de puntos**: Gana puntos por participar en la plataforma

## Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: API Routes de Next.js
- **Base de Datos**: MySQL (Railway)
- **Autenticación**: JWT + bcrypt
- **Despliegue**: Vercel


## Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@zirako.com | Test123! | Admin |
| usuario@test.com | Test123! | Usuario |

## Estructura del Proyecto

\`\`\`
zirako/
├── app/                    # Páginas y rutas (App Router)
│   ├── api/               # API Routes (backend)
│   ├── auth/              # Páginas de autenticación
│   ├── categorias/        # Navegación por categorías
│   ├── dashboard/         # Panel principal
│   ├── item/              # Detalle de artículos
│   └── ...
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y configuraciones
│   ├── db.ts             # Cliente MySQL
│   ├── auth.ts           # Funciones de autenticación
│   └── email.tsx         # Envío de correos
├── scripts/              # Scripts SQL
├── types/                # Tipos TypeScript
└── docs/                 # Documentación
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Artículos
- `GET /api/items` - Listar artículos
- `GET /api/items/[id]` - Obtener artículo
- `POST /api/items` - Crear artículo
- `PUT /api/items/[id]` - Actualizar artículo
- `DELETE /api/items/[id]` - Eliminar artículo

### Otros
- `GET/POST /api/exchanges` - Intercambios
- `GET/POST /api/favoritos` - Favoritos
- `GET/POST /api/mensajes` - Mensajes
- `GET/POST /api/collections` - Recolecciones
- `GET /api/categorias` - Categorías


## Ciudades Soportadas (Valle del Cauca)

Cali, Palmira, Buenaventura, Tuluá, Buga, Cartago, Yumbo, Jamundí, Sevilla, Zarzal, Candelaria, Florida, Pradera, El Cerrito, Dagua

## Licencia

Proyecto académico - Universidad Nacional Abierta y a Distancia

---

**ZIRAKO** - Transformando residuos en recursos para el Valle del Cauca
