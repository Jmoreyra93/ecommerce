# Connecticus — Ecommerce de Tecnología

Tienda online full-stack construida con JS Vanilla, Node.js, Express, MongoDB y Mercado Pago.  
Diseño moderno con Tailwind CSS · SPA con hash routing · Deploy en Hostinger con PM2.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | JS Vanilla, Tailwind CSS CDN, Handlebars (cliente), Lucide Icons |
| Backend | Node.js ≥ 20, Express 4.x |
| Base de datos | MongoDB Atlas (Mongoose 8.x) |
| Pagos | Mercado Pago SDK v2 |
| Deploy | Hostinger (Node.js hosting) + PM2 |

---

## Instalación local

```bash
git clone https://github.com/TU_USUARIO/connecticus.git
cd connecticus
npm install
```

Copiá el archivo de ejemplo y completá las variables:

```bash
cp .env.example .env
```

Editá `.env` con tus credenciales reales (ver sección Variables de entorno).

```bash
npm run dev
```

La app corre en `http://localhost:9000` (o el puerto que definiste en `.env`).

---

## Variables de entorno

Copiá `.env.example` como `.env` y completá cada valor:

```env
PORT=9000
TIPO=MONGODB

# Cadena de conexión directa a MongoDB Atlas (sin SRV — ver nota abajo)
MONGODB_URI=mongodb://usuario:password@host1:27017,host2:27017,host3:27017/ecommerce?ssl=true&authSource=admin&replicaSet=REPLICA_SET&retryWrites=true&w=majority

# Mercado Pago — Access Token del panel de desarrolladores
MP_ACCESS_TOKEN=APP_USR-...

# URL de retorno para MP (localhost en dev, HTTPS en producción)
CALLBACK_URL=http://localhost:9000/api/carrito/feedback
```

> **Nota MongoDB Atlas + Node.js v24 en Windows:** `c-ares` (motor DNS de Node) tiene un bug con registros SRV en Windows. Usá cadena de conexión directa con los 3 shards en lugar de `mongodb+srv://`. Resolvé los hosts con PowerShell:
> ```powershell
> Resolve-DnsName -Name _mongodb._tcp.TU-CLUSTER.mongodb.net -Type SRV
> ```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Producción (Node.js) |
| `npm run dev` | Desarrollo con nodemon (recarga automática) |
| `npm run dev-mem` | Puerto 3000, persistencia en memoria |
| `npm run dev-file` | Puerto 5000, persistencia en archivo |

---

## Arquitectura SPA

El frontend es una Single Page Application con **hash routing**:

- `index.html` — shell fijo (navbar, carrito, footer, scripts)
- `vistas/*.html` — fragmentos inyectados en `<main>` según el hash
- `plantillas/*.hbs` — templates Handlebars compilados en el cliente
- `js/main.js` — router: escucha `hashchange`, fetchea la vista y llama `initJS(id)`

```
#inicio  → vistas/inicio.html   → initInicio()
#alta    → vistas/alta.html     → initAlta()
#nosotros→ vistas/nosotros.html → initNosotros()
#contacto→ vistas/contacto.html → initContacto()
```

---

## Funcionalidades

- **Catálogo de productos** — grid responsive con skeleton loaders
- **Carrito lateral** — panel deslizante con total calculado en tiempo real
- **Favoritos** — corazón por producto, persistido en `localStorage`, filtro "Todos / Favoritos" en el catálogo
- **Checkout con Mercado Pago** — preferencia creada en el backend, botón renderizado por SDK v2
- **Panel de administración (Alta)** — CRUD completo con validación, drag & drop de imágenes, previsualización
- **Contador en navbar** — badges para carrito y favoritos
- **Slider de marcas** — animación CSS infinita
- **Newsletter popup** — overlay con formulario
- **Páginas**: Inicio, Alta (admin), Nosotros, Contacto

---

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Obtener un producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |
| POST | `/api/carrito` | Crear preferencia de pago en MP |
| GET | `/api/carrito/feedback` | Callback de retorno de MP |
| POST | `/upload` | Subir imagen (multer) |

---

## Mercado Pago

### Configuración

1. Entrá a [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers/panel/credentials)
2. Copiá tu **Access Token** → `.env` en `MP_ACCESS_TOKEN`
3. Copiá tu **Public Key** → `public/js/menu/pago.js` línea 4
4. En producción, actualizá `CALLBACK_URL` con tu dominio HTTPS

### Notas importantes

- `auto_return: "approved"` solo funciona con URLs HTTPS. En localhost se omite automáticamente.
- Para pruebas usá las [credenciales de sandbox](https://www.mercadopago.com.ar/developers/panel/credentials) (no las de producción).

---

## Deploy en Hostinger

### 1. Subir el código

**Opción A — GitHub (recomendado):**
1. Conectá tu repo desde el panel de Hostinger → Node.js → "Importar repositorio de Git"
2. Seleccioná la rama `main`

**Opción B — Archivos:**
1. Comprimí la carpeta del proyecto (sin `node_modules` ni `.env`)
2. Subí el ZIP desde el panel → "Subir archivos"

### 2. Variables de entorno

En Hostinger → Node.js → Variables de entorno, agregá todas las variables de `.env.example` con tus valores reales de producción.

### 3. Punto de entrada

- **Archivo de entrada:** `server.js`
- **Versión de Node:** ≥ 20

### 4. Instalar dependencias

Desde el panel de Hostinger o SSH:
```bash
npm install --production
```

### 5. PM2 (opcional — SSH)

Si tenés acceso SSH:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Dominio y HTTPS

Una vez que el dominio esté activo con SSL, actualizá en las variables de entorno:
```
CALLBACK_URL=https://TU-DOMINIO.com/api/carrito/feedback
```

---

## Estructura del proyecto

```
Eccomerce/
├── api/                  # Capa de acceso a datos
│   ├── carrito.js
│   └── productos.js
├── controller/           # Controladores Express
│   ├── carrito.js        # Integración Mercado Pago SDK v2
│   ├── pago.js           # Callback feedback MP
│   └── productos.js
├── model/
│   ├── DB_mongo.js       # Conexión Mongoose
│   ├── productos.js      # Factory model (mongo/file/mem)
│   └── validaciones/
│       └── productos.js  # Validación Joi
├── router/               # Rutas Express
├── public/
│   ├── index.html        # SPA shell
│   ├── css/custom.css    # Estilos propios (animations, cart, etc.)
│   ├── js/
│   │   ├── clientes/     # HTTP client (fetch wrapper)
│   │   ├── servicios/    # Llamadas a la API
│   │   ├── modelos/      # Clases de modelo cliente
│   │   ├── controladores/# Lógica de negocio cliente
│   │   └── menu/         # Scripts por vista (inicio, alta, carrito, pago, favoritos...)
│   ├── vistas/           # Fragmentos HTML inyectados por hash routing
│   ├── plantillas/       # Templates Handlebars (.hbs)
│   └── uploads/          # Imágenes subidas por multer
├── .env                  # Variables de entorno (NO commitear)
├── .env.example          # Plantilla de variables (sí commitear)
├── .gitignore
├── config.js             # Lee process.env y exporta config
├── ecosystem.config.js   # PM2 config para producción
├── package.json
└── server.js             # Entry point Express
```

---

## Checklist antes del deploy

- [ ] `.env` con credenciales reales de producción (MongoDB Atlas + MP producción)
- [ ] `CALLBACK_URL` actualizada con dominio HTTPS real
- [ ] MP Public Key actualizada en `public/js/menu/pago.js`
- [ ] `node_modules` y `.env` en `.gitignore` (ya incluido)
- [ ] Probaste el flujo completo en local: agregar producto → carrito → MP checkout
- [ ] MongoDB Atlas: IP `0.0.0.0/0` en Network Access (o IP de Hostinger)

---

## Seguridad

- Credenciales en variables de entorno, nunca en el código
- `.env` incluido en `.gitignore`
- Validación de entrada con Joi en todos los endpoints de escritura
- `MP_ACCESS_TOKEN` solo en el backend — jamás expuesto al cliente
- `MP_PUBLIC_KEY` en el frontend es seguro (es pública por diseño)

---

## Licencia

MIT
