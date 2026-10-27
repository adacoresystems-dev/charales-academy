# API inicial

Base local: `/api`. JSON. Los BIGINT se devuelven como cadenas para evitar pérdida de precisión; los DECIMAL también pueden recibirse como cadenas. No conviertas identificadores automáticamente con Number(). Fechas de registro y sesiones usan UTC; configura MariaDB en UTC. `fecha` de entrenamientos/partidos representa el día local del evento y no se convierte como un instante UTC.

## Implementado

| Método | Ruta | Acceso / comportamiento |
|---|---|---|
| GET | /health | Comprobar conexión con BD; 503 si no está disponible. |
| POST | /auth/login | `{ "email": "...", "password": "..." }`; token aleatorio con vencimiento y límite de intentos. |
| GET | /auth/me | Cuenta, perfiles efectivos y permisos. No devuelve contraseña ni hash. |
| POST | /auth/logout | Cierra la sesión en la BD; HTTP 204. |
| GET | /jugadores, /tutores, /categorias, /temporadas, /sedes, /entrenadores, /inscripciones | Listas administrativas; administrador o secretaria y permiso correspondiente. |
| GET | /entrenamientos, /horarios, /asistencias, /competencias, /partidos, /clasificacion | Listas administrativas. |
| GET | /cargos, /pagos, /uniformes, /pedidos, /materiales, /rendimiento | Listas administrativas. `/cargos` utiliza saldos derivados. |
| GET | /usuarios, /auditoria | Solo administrador. |
| GET | /mi-portal/jugadores | Tutor: sus hijos. Entrenador: sus categorías vigentes. Si tiene ambos perfiles, unión de ambos conjuntos. |
| GET | /avisos | Solo publicados, vigentes y dirigidos al usuario o a sus categorías; personal administrativo puede consultar todos los publicados vigentes. |
| GET | /mensajes | Solo mensajes donde la cuenta sea remitente o destinataria. |
| GET | /notificaciones | Solo notificaciones destinadas a la cuenta actual. |
| PATCH | /notificaciones/:id/leida | Marca únicamente la lectura del usuario actual; HTTP 204. |
| POST | /asistencias | Registro en transacción; administrador/secretaria o entrenador asignado a la categoría. Ver cuerpo debajo. |

Listas paginadas: `?page=1&limit=50`, máximo 100. Respuesta `{ data, page, limit }`. No hay total global implementado. `/mi-portal/jugadores` devuelve `{ data }`.

```json
{
  "sesion_id": "1",
  "registros": [
    {"jugador_id": "1", "estado": "PRESENTE", "observaciones": ""},
    {"jugador_id": "2", "estado": "RETARDO", "observaciones": "Llegó 10 minutos tarde"}
  ]
}
```

El registro de asistencia comprueba la categoría del jugador en la fecha de la sesión; guarda o actualiza las filas enviadas, marca la sesión como realizada y escribe auditoría. No marca ausentes a jugadores omitidos. No permite sesiones canceladas ni futuras. Una fila inválida revierte todo el lote. Estados: PRESENTE, AUSENTE, RETARDO, JUSTIFICADO.

## Pendiente de desarrollar por módulo

La existencia de un archivo en routes no significa que el CRUD esté terminado. Quedan altas/ediciones/bajas de jugadores, tutores, categorías, entrenadores, sesiones, competencias, resultados, convocatorias, evaluaciones, cobros, descuentos, cancelaciones financieras, pedidos, materiales, publicaciones y envíos de mensajes/notificaciones.

Los listados generales están cerrados para tutores y entrenadores. Antes de habilitarles otras rutas, implementar el filtro por hijo/categoría en cada consulta. Tener un permiso no autoriza consultar cualquier jugador.

Los POST/PUT/DELETE todavía no desarrollados devuelven 404. No hay API genérica que escriba cualquier tabla.
