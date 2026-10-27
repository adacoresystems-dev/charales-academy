# Desarrollo por módulos

Cada responsable trabaja en su archivo de `server/routes/` y en sus componentes de `src/components/`. El proyecto tiene un solo servidor y una sola BD compartida; no es necesario levantar un servidor distinto por integrante.

## Archivos compartidos

- `server/server.js`: arranca la API; no duplicarlo por módulo.
- `server/app.js`: configuración y errores.
- `server/config/db.js`: pool y transacciones; reutilizarlo.
- `server/middleware/auth.js`: identidad, roles y permisos; no confiar en el rol enviado por el navegador.
- `server/routes/index.js`: registrar aquí rutas nuevas.
- `database/charales_completa.sql`: esquema inicial. Los cambios posteriores deben acordarse y prepararse como migraciones; no reenviar un esquema que borre datos de los demás.

## Entrega mínima de un módulo

1. Consulta con los JOIN necesarios y filtros de propiedad.
2. Alta/edición con validación, parámetros SQL y respuesta útil.
3. Baja/cancelación según el negocio; conservar historial cuando corresponda.
4. Conectar la vista a `src/services/api.ts` y retirar sus datos de ejemplo para ese módulo.
5. Verificar un caso válido, uno inválido y un usuario sin acceso.
6. Registrar cambios en Git. No subir node_modules, archivos .env, contraseñas ni datos reales de alumnos.

La BD devuelve nombres de columnas en snake_case; los componentes existentes usan camelCase. Definir una función de transformación por módulo y mantenerla consistente. No duplicar nombres relacionados en las tablas solo para que coincidan con los objetos de ejemplo.

## Módulo de ejemplo con escritura

`POST /api/asistencias` muestra cómo validar un lote y guardar asistencia, estado de sesión y auditoría en una misma transacción. Úsalo como referencia de estructura, no como sustituto de las reglas específicas de pagos o inventario.
