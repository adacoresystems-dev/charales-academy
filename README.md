# Charales de Chapala · Escuela de fútbol

Los datos del frontend están anonimizados para esta publicación: nombres genéricos, correo example.test, contactos y notas médicas vacíos. No representan personas reales.

Base para continuar el proyecto: vistas existentes en React + TypeScript, servidor en JavaScript/Express y esquema MariaDB ampliado.

## Estado real

- Las vistas originales se conservan y siguen en **modo demostración**: administración con `localStorage` y portal del entrenador con `mockData.ts`.
- La API implementa inicio/cierre de sesión, permisos, consultas administrativas paginadas, consulta de jugadores propios, avisos filtrados, mensajes propios, notificaciones por usuario y registro transaccional de asistencia.
- **Todavía no se han conectado las pantallas a la API.** Crear el repositorio y las rutas no realiza esa conexión automáticamente.
- La pasarela de pago es simulada. No hay cobros reales, recuperación de contraseña, préstamos de material ni envíos externos de correo/push implementados.
- El SQL contiene 47 tablas y 2 vistas. Incluye clasificación capturada del organizador para respaldar la tabla de posiciones.

## Requisitos

Node.js 22.12 o posterior, npm y MariaDB 10.6 o posterior. La versión comprobada en este entorno se registra en `docs/VALIDACION.md`.

## Si utilizas MySQL 8.0

Usa **database/charales_mysql.sql**, que crea la base nueva **charales_mysql**, y configura `DB_NAME=charales_mysql` en server/.env. Consulta [la guía de MySQL](docs/MYSQL.md). No ejecutes el script de MariaDB en MySQL. Si un intento previo dejó tablas en escuela_futbol, esta instalación las conserva.

## 1. Base de datos nueva (MariaDB)

Abre `database/charales_completa.sql` en tu cliente de MariaDB y ejecútalo completo en una instalación nueva.

También puedes importarlo desde una terminal:

```bash
mariadb -u root -p < database/charales_completa.sql
```

El script utiliza `escuela_futbol`. **No lo ejecutes sobre las tablas de un proyecto que ya tenga información.** No es una migración y no elimina tablas. Si ya existe esa base, usa otra instalación vacía o cambia tanto el nombre del SQL como `DB_NAME` antes de importar.

No se insertan jugadores, tutores, entrenadores ni usuarios de ejemplo. Las pantallas muestran sus propios datos de demostración, que no están en MariaDB.

## 2. Usuario de conexión

Crea una cuenta local para la aplicación desde una sesión administrativa de MariaDB. Sustituye el marcador de contraseña antes de ejecutar:

```sql
CREATE USER 'charales_app'@'127.0.0.1' IDENTIFIED BY 'CAMBIA_POR_UNA_CLAVE_PROPIA';
GRANT SELECT, INSERT, UPDATE, DELETE ON escuela_futbol.* TO 'charales_app'@'127.0.0.1';
```

Esta cuenta de MariaDB es diferente de las cuentas que entran al portal. No requiere permisos para crear o eliminar tablas.

## 3. Dependencias y configuración

Desde la carpeta raíz:

```bash
npm ci
cp server/.env.example server/.env
```

En Windows puedes copiar el archivo manualmente. Edita `server/.env` con los datos de MariaDB. Nunca publiques ese archivo. Para el navegador, `VITE_API_URL` es opcional: por defecto se usa `/api`, redirigido por Vite al servidor local.

## 4. Crear el primer administrador

En `server/.env` configura `ADMIN_EMAIL`, `ADMIN_NOMBRE` y una `ADMIN_PASSWORD` propia (mínimo 12 caracteres; máximo 72 bytes). Después ejecuta:

```bash
npm run crear-admin --workspace server
```

Retira `ADMIN_PASSWORD` de ese archivo al terminar. No hay contraseña predeterminada. Un correo ya existente no se sobrescribe.

## 5. Arrancar en dos terminales

Terminal 1, desde la raíz:

```bash
npm run dev:server
```

Terminal 2, desde la raíz:

```bash
npm run dev
```

Frontend: http://localhost:3000 · API: http://127.0.0.1:3001/api/health

Para comprobar el acceso real usa un cliente de API con `POST /api/auth/login`, cuerpo JSON `email` y `password`. Copia el token de la respuesta en `Authorization: Bearer TU_TOKEN` para las rutas protegidas. El selector de rol de las vistas es únicamente de demostración.

## Comprobaciones

```bash
npm run check
```

Las pruebas con BD están desactivadas por defecto. Consulta `docs/VALIDACION.md` para ejecutarlas en una base aislada de pruebas.

## Carpetas

```text
src/                   Vistas React originales y cliente api.ts
server/
  server.js            Arranque del servidor
  app.js               Aplicación Express y manejo de errores
  config/              Variables de entorno y pool MariaDB
  routes/              Rutas por módulo
  middleware/          Autenticación y permisos
  lib/                 Validación y funciones compartidas
  scripts/             Creación del administrador
  tests/               Pruebas
database/              SQL completo para instalación nueva
docs/                  API, modelo, integración y validación
```

No es obligatorio crear controllers desde el inicio: cada módulo puede desarrollar su lógica en `server/routes/`. Si crece, extrae lógica de negocio a servicios. Usa siempre consultas parametrizadas y transacciones cuando una acción escriba varias tablas.

Lee `docs/API.md`, `docs/BASE_DE_DATOS.md` y `docs/INTEGRACION.md` antes de conectar el primer módulo.
