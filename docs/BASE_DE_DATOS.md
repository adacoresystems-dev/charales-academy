# Modelo de datos

`database/charales_completa.sql`: instalación nueva en MariaDB 10.6+, 47 tablas y 2 vistas. Conserva las 39 tablas originales y agrega 8. No es una migración y no contiene DROP TABLE, contraseñas ni alumnos de ejemplo.

## Ampliaciones

| Módulo | Tablas / campos agregados |
|---|---|
| Jugadores | jugadores.foto_url, posicion_habitual, numero_camiseta, observaciones_medicas, estado_deportivo. El estatus administrativo se conserva separado. |
| Tutores | tutores.ocupacion. |
| Usuarios | usuarios.avatar_url, telefono. |
| Entrenadores | entrenadores.foto_url, licencia, titulo, anio_inicio_experiencia. |
| Sedes | sedes.tipo_cancha. Cada evento conserva además un texto de cancha; no hay catálogo independiente de canchas en esta versión. |
| Entrenamientos | sesiones_entrenamiento.titulo, cancha, calentamiento, ejercicio_principal, vuelta_calma, materiales_requeridos. |
| Asistencia | Estado RETARDO. |
| Competencias | competencias.modalidad; jugador_competencia_categoria.numero_camiseta. |
| Partidos | partidos.cancha, goleadores_resumen; estado EN_CURSO. El resumen es opcional y no alimenta estadísticas. |
| Pagos | pagos.cancelado_por y cancelado_en, con consistencia del estado de cancelación. |
| Uniformes | productos_uniforme.imagen_url y variantes_uniforme.existencias. |
| Avisos | avisos.importante. |

## Tablas nuevas

1. evaluaciones_rendimiento: 8 criterios de 1 a 10, fecha, jugador, entrenador, categoría y comentarios.
2. convocatoria_partido: un jugador por partido, usuario que convocó y observaciones.
3. estadisticas_jugador_partido: minutos, goles y asistencias individuales; sin duplicar jugador/partido.
4. clasificacion_competencia: captura actual de la clasificación oficial por equipo y categoría de competencia; fuente y fecha de corte. Esta octava tabla completa la vista de posiciones. No pretende calcular partidos entre rivales no registrados.
5. materiales_deportivos: existencias totales/disponibles, condición y ubicación. Sin préstamos ni historial de movimientos.
6. mensajes_directos: remitente, destinatario, jugador opcional, contenido, envío y lectura.
7. notificaciones: contenido, tipo y referencia opcional al jugador.
8. notificacion_usuario: destinatarios y lectura individual.

## Vistas SQL

- v_estado_cuenta: un cargo con suma de descuentos y aplicaciones de pagos no cancelados, monto final y saldo. La pantalla puede ocultar cargos cancelados sin borrar su evidencia.
- v_asistencia_jugador: porcentaje de sesiones realizadas con asistencia registrada. PRESENTE y RETARDO cuentan; JUSTIFICADO queda fuera del denominador. No genera faltas por registros ausentes ni inventa porcentajes cuando no hay datos.

## Reglas que corresponden al backend

- Permisos y propiedad: validar hijo del tutor o categoría asignada al entrenador.
- Cupos, edad al corte de temporada y motivos de excepción.
- Inscripción, categoría y temporada compatibles; el mismo jugador puede pertenecer a una categoría vigente según la regla del esquema original.
- Convocatorias y estadísticas: validar pertenencia al plantel de esa competencia y partido; goles individuales no deben exceder el marcador del equipo. Definir goles en propia puerta y estadísticas incompletas antes de exigir igualdad.
- Pagos: bloquear cargos/pagos con SELECT FOR UPDATE; total de descuentos no mayor al cargo, aplicaciones no mayores al pago/saldo, mismo jugador y estados consistentes. Cancelar un pago debe recalcular todos los cargos afectados. No basta con poner monto_pagado=0.
- Un pago pertenece a un jugador. Un cobro familiar para varios hijos requeriría otro modelo.
- Un pedido puede tener varias líneas. Precio y cantidad se conservan en detalle_uniforme; no se usa el precio actual para reconstruir el pasado.
- Uniformes: esta base no reserva stock automáticamente; implementar y documentar el momento de reserva/descuento y el retorno al cancelar en una transacción.
- Cada tarifa recurrente debe generar un cargo por periodo YYYY-MM; la restricción existente evita duplicados por jugador/concepto/periodo no nulo.
- Avisos: un aviso general requiere su fila GENERAL en aviso_destinatario. Vincular a cada destinatario antes de permitir publicación.
- Notificaciones: generar destinatarios concretos en notificacion_usuario; la lectura siempre se asocia a usuarios.id.
- No mezclar contraseñas con perfiles deportivos. Un usuario puede ser tutor y entrenador y además tener un rol administrativo.

No se insertan temporadas, categorías, sedes ni tarifas definitivas: son decisiones de la escuela. Los conceptos iniciales tienen importe sugerido cero y deben configurarse antes de cobrar.
