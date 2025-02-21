Proyecto de Gestión de Ventas
Este proyecto es una API RESTful desarrollada con Next.js, TypeScript y TypeORM para gestionar ventas, productos, categorías y proveedores. La API permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre estas entidades.

Tabla de Contenidos
Requisitos

Instalación

Configuración

Ejecución

Endpoints

Contribución

Licencia

Requisitos
Node.js (v16 o superior)

npm (v7 o superior)

MySQL (o cualquier otra base de datos compatible con TypeORM)

Instalación
Clona el repositorio:

bash
Copy
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Instala las dependencias:

bash
Copy
npm install
Configuración
Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias:

env
Copy
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu-contraseña
DB_NAME=nombre_de_tu_base_de_datos
Asegúrate de que la base de datos esté creada y accesible con las credenciales proporcionadas.

Ejecución
Inicia el servidor de desarrollo:

bash
Copy
npm run dev
La API estará disponible en http://localhost:3000.

Endpoints
Productos
GET /api/productos - Obtener todos los productos.

GET /api/productos/:id - Obtener un producto por ID.

POST /api/productos - Crear un nuevo producto.

PUT /api/productos/:id - Actualizar un producto existente.

DELETE /api/productos/:id - Eliminar un producto.

Ventas
GET /api/ventas - Obtener todas las ventas.

GET /api/ventas/:id - Obtener una venta por ID.

POST /api/ventas - Crear una nueva venta.

PUT /api/ventas/:id - Actualizar una venta existente.

DELETE /api/ventas/:id - Eliminar una venta.

Categorías
GET /api/categorias - Obtener todas las categorías.

GET /api/categorias/:id - Obtener una categoría por ID.

POST /api/categorias - Crear una nueva categoría.

PUT /api/categorias/:id - Actualizar una categoría existente.

DELETE /api/categorias/:id - Eliminar una categoría.

Proveedores
GET /api/proveedores - Obtener todos los proveedores.

GET /api/proveedores/:id - Obtener un proveedor por ID.

POST /api/proveedores - Crear un nuevo proveedor.

PUT /api/proveedores/:id - Actualizar un proveedor existente.

DELETE /api/proveedores/:id - Eliminar un proveedor.

Contribución
Haz un fork del repositorio.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -am 'Añade nueva funcionalidad').

Haz push a la rama (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.

Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
