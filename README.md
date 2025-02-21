# Proyecto de Gestión de Ventas

Este proyecto es una API RESTful desarrollada con Next.js, TypeScript y TypeORM para gestionar ventas, productos, categorías y proveedores. La API permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre estas entidades.

## Tabla de Contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Deploy en Vercel](#deploy-en-vercel)

## Requisitos
- Node.js (v16 o superior)
- npm (v7 o superior)
- MySQL (o cualquier otra base de datos compatible con TypeORM)

## Instalación
Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

Instala las dependencias:

```bash
npm install
```

## Configuración
Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu-contraseña
DB_NAME=nombre_de_tu_base_de_datos
```

Asegúrate de que la base de datos esté creada y accesible con las credenciales proporcionadas.

## Ejecución
Inicia el servidor de desarrollo:

```bash
npm run dev
```

La API estará disponible en [http://localhost:3000](http://localhost:3000).

## Endpoints

### Productos
- `GET /api/productos` - Obtener todos los productos.
- `GET /api/productos/:id` - Obtener un producto por ID.
- `POST /api/productos` - Crear un nuevo producto.
- `PUT /api/productos/:id` - Actualizar un producto existente.
- `DELETE /api/productos/:id` - Eliminar un producto.

### Ventas
- `GET /api/ventas` - Obtener todas las ventas.
- `GET /api/ventas/:id` - Obtener una venta por ID.
- `POST /api/ventas` - Crear una nueva venta.
- `PUT /api/ventas/:id` - Actualizar una venta existente.
- `DELETE /api/ventas/:id` - Eliminar una venta.

### Categorías
- `GET /api/categorias` - Obtener todas las categorías.
- `GET /api/categorias/:id` - Obtener una categoría por ID.
- `POST /api/categorias` - Crear una nueva categoría.
- `PUT /api/categorias/:id` - Actualizar una categoría existente.
- `DELETE /api/categorias/:id` - Eliminar una categoría.

### Proveedores
- `GET /api/proveedores` - Obtener todos los proveedores.
- `GET /api/proveedores/:id` - Obtener un proveedor por ID.
- `POST /api/proveedores` - Crear un nuevo proveedor.
- `PUT /api/proveedores/:id` - Actualizar un proveedor existente.
- `DELETE /api/proveedores/:id` - Eliminar un proveedor.

## Contribución
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Deploy en Vercel

La forma más sencilla de desplegar tu aplicación Next.js es usando la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

