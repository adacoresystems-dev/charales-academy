# Conectar las vistas por etapas

## Antes de empezar

El ZIP original contiene una aplicación React/Vite con TypeScript. El servidor agregado usa JavaScript/Express. No es Angular. `src/services/store.ts` usa localStorage y el portal de entrenador tiene otro conjunto de datos en `mockData.ts`.

Conservamos esos componentes para no romper las vistas. La carpeta server no los conecta por sí sola. `src/services/api.ts` ya conecta el formulario de acceso y el cierre de sesión. El resto de las vistas todavía no lo usa.

## Orden de trabajo

1. Importar BD, configurar server/.env, crear administrador y comprobar /api/health.
2. Comprobar el login ya conectado: acceso correcto, credenciales incorrectas y cierre de sesión. La identidad viene de POST /auth/login y el selector libre de roles fue retirado. El token vive en memoria; al recargar se pide acceso nuevamente. Las respuestas 401 de consultas autenticadas y el tiempo de expiración devuelven al formulario. GET /auth/me queda disponible para futuras consultas del perfil.
3. Crear temporada, sede, categoría, tutor y jugador desde los endpoints que desarrollen. La API hoy entrega consultas, no todas las altas.
4. Sustituir la lectura de jugadores en store.ts por GET /jugadores (administración) y /mi-portal/jugadores (tutor/entrenador). Retirar los datos de ejemplo para ese módulo una vez conectado.
5. Implementar altas/ediciones con validación y transacciones. Después conectar los formularios.
6. Unificar el portal de entrenador con los mismos identificadores de la API; quitar su mockData. Habilitar consultas de sesiones/asistencias filtradas por categoría y conectar POST /asistencias.
7. Continuar con finanzas y uniformes, luego evaluaciones, comunicaciones y notificaciones.

## Traducciones necesarias

| Frontend actual | SQL / API |
|---|---|
| PADRE_TUTOR | Perfil efectivo TUTOR |
| MASCULINO / FEMENINO | M / F |
| PROGRAMADA / REALIZADA | PROGRAMADO / REALIZADO |
| nombre de categoría, tutor o entrenador repetido en objetos | Consultar mediante JOIN usando IDs. |
| categoriaActualId | Relación vigente en jugador_categoria. |
| fechaIngreso | Definir primera inscripción; no inventar una fecha distinta con cada recarga. |
| tipo de torneo detallado | competencias.tipo: TORNEO/LIGA/OTRO; detalle en modalidad. |
| INSCRIPCIÓN / EN_CURSO / FINALIZADO | PLANIFICADA / ACTIVA / FINALIZADA. |
| posición Portero/Defensa/Mediocampista/Delantero | PORTERO/DEFENSA/MEDIOCAMPISTA/DELANTERO. |
| estado deportivo Activo/Lesionado/En Observación | DISPONIBLE/LESIONADO/EN_OBSERVACION; no sustituye estatus administrativo. |
| EN_LINEA | Canal de cobro futuro, no un método financiero. Elegir TARJETA o TRANSFERENCIA y registrar proveedor aparte al integrar pagos reales. |
| foto de archivo convertida a base64 | Subir a un servicio de archivos y guardar URL; el backend inicial no implementa carga de imágenes. |

Las evaluaciones del portal usan seis criterios y el módulo general ocho. La BD adopta ocho. Actualizar formularios y gráficas para usar esa misma escala antes de guardar. Promedios, asistencia, minutos, goles y asistencias mensuales se consultan, no se incrementan con valores inventados.

Nunca enviar un tutor fijo al pagar ni asociar mensajes al primer jugador del arreglo. El servidor debe determinar la cuenta desde la sesión y verificar el jugador seleccionado.

## Alcance inicial

Entorno local. No incluye despliegue, HTTPS, respaldos automáticos, cargas de fotos, correo, recuperación de acceso, integración con pasarela, webhooks, actualización de estados financieros ni conexión completa del frontend. El repositorio es una base de trabajo documentada.
