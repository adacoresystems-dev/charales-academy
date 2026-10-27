# Instalación con MySQL 8.0

Para MySQL 8.0.16 o posterior utiliza **database/charales_mysql.sql**. El archivo `charales_completa.sql` se conserva para MariaDB y no debe importarse en MySQL.

## Si un intento anterior dejó 8 tablas en escuela_futbol

No borres esa base ni vuelvas a ejecutar el archivo de MariaDB. La instalación MySQL utiliza una base nueva llamada **charales_mysql**, conservando las tablas existentes.

1. Desde la terminal de tu proyecto ejecuta `git pull` para descargar la corrección.
2. En MySQL Workbench usa **File → Open SQL Script** y abre `database/charales_mysql.sql`.
3. Ejecuta el archivo completo una sola vez, con la opción de detener la ejecución ante un error activada.
4. La verificación final debe indicar **47 BASE TABLE y 2 VIEW**.
5. Actualiza el panel Schemas. Debe aparecer `charales_mysql`.

El script usa CREATE DATABASE sin IF NOT EXISTS: si `charales_mysql` ya existe, debes detenerte y revisar qué contiene. No es una migración ni un reparador para bases parcialmente creadas. No contiene DROP ni elimina información.

## Conexión del backend

Copia `server/.env.example` como `server/.env`. En este último configura tus credenciales locales; por ejemplo:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=charales_mysql
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD=TU_CONTRASEÑA
```

El usuario configurado debe tener acceso a esa base. En tu instalación local puedes usar temporalmente una cuenta que ya tenga esos permisos. No compartas ni subas la contraseña a GitHub.

Si prefieres crear la cuenta de aplicación, ejecuta desde una sesión administrativa de MySQL, sustituyendo la contraseña del marcador:

```sql
CREATE USER 'charales_app'@'127.0.0.1' IDENTIFIED BY 'CAMBIA_POR_UNA_CLAVE_PROPIA';
GRANT SELECT, INSERT, UPDATE, DELETE ON charales_mysql.* TO 'charales_app'@'127.0.0.1';
```

Después usa `DB_USER=charales_app` y la clave que elegiste.

Desde la raíz del proyecto:

```bash
npm run dev:server
```

Comprueba http://127.0.0.1:3001/api/health. Debe mostrar `{"status":"ok","database":"ok"}`. Mantén otra terminal con `npm run dev` para las vistas.

Para crear el administrador, configura ADMIN_EMAIL, ADMIN_NOMBRE y ADMIN_PASSWORD en server/.env y ejecuta `npm run crear-admin --workspace server`. Retira ADMIN_PASSWORD después. Las pantallas de demostración siguen pendientes de conexión a la API.

## Diferencias del script

- Sintaxis de columnas generadas adaptada a MySQL.
- Relaciones con acciones RESTRICT explícitas y restricciones verificadas en el servidor de pruebas.
- Base independiente para evitar el error 1050 causado por las tablas existentes.
- Se conservan las 47 tablas, las 2 vistas y las reglas principales; no se ocultan errores con CREATE TABLE IF NOT EXISTS ni se desactivan las llaves foráneas.
