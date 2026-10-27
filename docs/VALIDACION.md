# Comprobaciones realizadas

Fecha: 27 de octubre de 2026.

Entorno de comprobación: Node.js 24.22.1, npm, MariaDB 10.11.14. Dependencias exactas fijadas en package-lock.json.

## Resultados

- `npm run lint`: correcto, TypeScript sin errores.
- `npm run build`: correcto, frontend compilado con Vite 6.4.5.
- `npm test`: 8 pruebas de validación/acceso sin necesitar una BD; la integración se omite por defecto.
- Importación completa del SQL en una instancia aislada MariaDB 10.11.14: correcta, 47 tablas y 2 vistas.
- Pruebas con `RUN_DB_TESTS=1`: 16 comprobaciones reportadas por node:test, todas correctas (incluye el contenedor de integración y 7 subpruebas).

Se comprobaron las consultas iniciales, login/logout, perfiles efectivos, aislamiento de jugadores de tutor/entrenador, destinatarios de avisos y notificaciones, propiedad de lectura, reversión completa de un lote de asistencia inválido, actualización sin duplicados y saldos que excluyen pagos cancelados. La BD rechazó aplicar un pago a un cargo de otro jugador.

La compilación informa un aviso por tamaño del JavaScript del frontend original. No impide el arranque; se puede dividir por módulos más adelante. No se hizo una revisión visual completa ni una prueba manual de todos los botones de las vistas de demostración.

## Repetir pruebas con MariaDB

Usa una instancia local de pruebas. Importa una copia de `database/charales_completa.sql` sustituyendo **ambas** apariciones del nombre `escuela_futbol` por `charales_test` antes de ejecutar. Debe quedar recién creada, sin cuentas ni datos previos. No reutilices una BD que tenga información.

Configura variables de entorno de tu terminal (sin guardarlas en Git):

```bash
RUN_DB_TESTS=1 DB_NAME=charales_test DB_USER=TU_USUARIO DB_PASSWORD=TU_CLAVE DB_HOST=127.0.0.1 DB_PORT=3306 npm test
```

En PowerShell configura cada variable con `$env:NOMBRE = 'valor'` y después ejecuta `npm test`.

Las pruebas insertan datos sintéticos de ejemplo en esa BD y no los eliminan al terminar. Para repetirlas, crea otra BD vacía terminada en `_test` e importa el esquema con ese nombre. El flujo de GitHub Actions utiliza una instancia temporal independiente.

No se han probado cobros reales, recuperación de contraseña, envío de correo, cargas de imágenes ni la conexión completa de las pantallas, porque no están implementados en esta base inicial.

## Comprobación adicional con MySQL

El archivo database/charales_mysql.sql se importó completo en MySQL 8.0.46: 47 tablas y 2 vistas, sin errores. Las 16 comprobaciones de acceso, propiedad, asistencia transaccional y saldos terminaron correctamente. La instalación de destino del usuario es MySQL 8.0.45; no se ejecutó esa versión exacta en este entorno.

Se utiliza STORED y acciones RESTRICT explícitas. El esquema MySQL crea charales_mysql sin tocar escuela_futbol. Además, el backend interpreta numéricamente la comparación de fecha de sesión: mysql2 puede devolver "0" y "1" como cadenas al conservar BIGINT.

GitHub Actions incluye trabajos independientes para MySQL 8.0 y MariaDB 10.11. Para repetir la integración MySQL en una BD recién creada, sustituye charales_mysql por un nombre terminado en _test antes de importar el script; utiliza ese mismo nombre en DB_NAME.
