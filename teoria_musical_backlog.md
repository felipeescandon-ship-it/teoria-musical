# Backlog — Teoría musical interactiva con piano

**Estado del producto:** versión inmediata implementada  
**Objetivo del producto:** que una persona sin conocimientos musicales comprenda, escuche y toque la relación entre nota, intervalo, acorde, bajo e inversión antes de avanzar hacia armonía y acompañamiento.

---

## 1. Versión inmediata — implementada

### Ruta pedagógica esencial

- [x] Reducir el recorrido obligatorio a cinco conceptos: notas, semitonos, mayor/menor, alteraciones e inversiones.
- [x] Corregir el encabezado para no presentar “sostenido” como una calidad de acorde.
- [x] Corregir expresiones confusas sobre las doce notas y la octava.
- [x] Mover las demás familias de acordes fuera del recorrido obligatorio y mantenerlas en Referencia y Laboratorio.

### Aprendizaje verificable

- [x] Reemplazar el progreso basado en clics por cuatro estados: Sin iniciar, Explorada, Practicada y Dominada.
- [x] Permitir navegación libre sin marcar automáticamente una lección como aprendida.
- [x] Eliminar el botón que completaba toda la ruta artificialmente.
- [x] Añadir una misión verificable a cada una de las cinco lecciones.
- [x] Guardar el progreso localmente cuando el navegador lo permite.

### Misiones implementadas

- [x] Reconocer Do en dos octavas y encontrar Mi y Sol.
- [x] Construir un semitono ascendente, un tono y un semitono descendente.
- [x] Construir Do mayor y transformarlo en Do menor cambiando únicamente la tercera.
- [x] Aplicar sostenido y bemol como movimientos de un semitono.
- [x] Identificar raíz, bajo y símbolo en dos inversiones distintas.

### Piano aplicado

- [x] Mostrar digitaciones iniciales para mano derecha e izquierda.
- [x] Explicar que las digitaciones son sugeridas y dependen del contexto.
- [x] Demostrar que la inversión global depende de la nota más grave de ambas manos.
- [x] Visualizar la conducción de voces y el movimiento aproximado entre acordes.
- [x] Aclarar que una inversión no siempre es musicalmente mejor.

### Interacción y sonido

- [x] Mantener el sonido mientras la tecla permanece presionada y liberarlo al soltar.
- [x] Añadir control mediante teclado del computador.
- [x] Mantener reproducción de acordes y arpegios.
- [x] Corregir el desborde horizontal de la interfaz en pantallas móviles.

### Laboratorio y práctica

- [x] Separar escritura práctica y escritura teórica avanzada.
- [x] Mantener raíz, bajo, símbolo, fórmula, semitonos y nombres de notas.
- [x] Mover los ejercicios de construcción desde Laboratorio a Practicar.
- [x] Dar pistas progresivas antes de revelar la respuesta de un ejercicio.
- [x] Mantener entrenamiento auditivo con repetición del mismo acorde.

---

# 2. Siguiente versión — armonía y progresiones

## Épica A — Escalas y tonalidad

### A1. Constructor de escala mayor

**Objetivo:** mostrar de dónde salen las notas de una tonalidad.

- [ ] Construir una escala mediante el patrón tono–tono–semitono–tono–tono–tono–semitono.
- [ ] Comenzar con Do mayor y continuar con Sol mayor y Fa mayor.
- [ ] Mostrar notas, grados y alteraciones.
- [ ] Permitir que el alumno construya la escala sobre el piano.

**Criterio de dominio:** construir correctamente dos escalas sin recibir la respuesta completa.  
**Prioridad:** máxima.  
**Dificultad:** media.

### A2. Acordes diatónicos

**Objetivo:** explicar por qué ciertos acordes pertenecen a una tonalidad.

- [ ] Construir tríadas tomando una nota sí y otra no dentro de la escala.
- [ ] Mostrar el patrón I–ii–iii–IV–V–vi–vii°.
- [ ] Relacionar cada acorde con sus notas y su calidad.
- [ ] Permitir cambiar de tonalidad y conservar el patrón.

**Criterio de dominio:** identificar y construir I, IV, V y vi en dos tonalidades.  
**Prioridad:** máxima.  
**Dificultad:** media-alta.

### A3. Ortografía musical contextual

**Objetivo:** completar la explicación de sostenidos, bemoles y enarmonía.

- [ ] Explicar por qué una escala usa una vez cada letra musical.
- [ ] Explicar Do♯ mayor frente a Re♭ mayor después de enseñar grados y tonalidades.
- [ ] Añadir ejercicios de elección de grafía correcta.

**Criterio de dominio:** elegir la escritura correcta de una escala o acorde en ejemplos básicos.  
**Prioridad:** alta.  
**Dificultad:** media.

---

## Épica B — Funciones armónicas

### B1. Tónica, predominante y dominante

**Objetivo:** explicar reposo, movimiento y tensión sin convertir sensaciones en reglas absolutas.

- [ ] Introducir funciones con ejemplos auditivos.
- [ ] Mostrar qué acordes cumplen cada función en una tonalidad mayor.
- [ ] Escuchar I–IV–V–I y comparar alternativas.

**Criterio de dominio:** reconocer qué acorde genera llegada y cuál impulsa el regreso.  
**Prioridad:** alta.  
**Dificultad:** media.

### B2. Constructor de progresiones

**Objetivo:** pasar de acordes aislados a secuencias musicales.

- [ ] Crear progresiones por grados romanos.
- [ ] Incluir I–IV–V–I, I–V–vi–IV, vi–IV–I–V y ii–V–I.
- [ ] Permitir transponer automáticamente a otra tonalidad.
- [ ] Mostrar nombres, símbolos y grados simultáneamente.

**Criterio de dominio:** construir y trasladar una progresión sencilla a dos tonalidades.  
**Prioridad:** máxima.  
**Dificultad:** alta.

### B3. Inversiones dentro de progresiones

**Objetivo:** aplicar inversiones con una razón musical concreta.

- [ ] Sugerir inversiones que reduzcan el movimiento de las voces.
- [ ] Mostrar qué nota permanece y cuánto se mueve cada voz.
- [ ] Comparar una progresión en posiciones fundamentales con una versión conectada.
- [ ] Mantener visible el bajo resultante.

**Criterio de dominio:** elegir una inversión que reduzca el movimiento sin perder de vista el bajo.  
**Prioridad:** alta.  
**Dificultad:** alta.

---

## Épica C — Tiempo y práctica

### C1. Pulso y reproducción en bucle

**Objetivo:** convertir una progresión armónica en música temporal.

- [ ] Añadir tempo ajustable.
- [ ] Reproducir un acorde por compás.
- [ ] Permitir dos acordes por compás.
- [ ] Incluir conteo previo y reproducción en bucle.

**Criterio de dominio:** cambiar de acorde siguiendo cuatro compases a tempo lento.  
**Prioridad:** alta.  
**Dificultad:** media-alta.

### C2. Estadísticas por habilidad

**Objetivo:** mostrar qué concepto necesita práctica, no solo una precisión global.

- [ ] Registrar resultados de notas, intervalos, construcción, calidad e inversiones.
- [ ] Separar errores visuales y auditivos.
- [ ] Recomendar una práctica breve según el error recurrente.

**Criterio de aceptación:** la recomendación debe basarse en errores observados, no en una ruta fija.  
**Prioridad:** media.  
**Dificultad:** media.

---

# 3. Desarrollo posterior — piano aplicado

## Épica D — Voicings y distribución

### D1. Inversión frente a voicing

- [ ] Diferenciar inversión, posición cerrada, posición abierta y duplicación.
- [ ] Mostrar que la inversión depende del bajo global.
- [ ] Permitir repartir las notas entre ambas manos.
- [ ] Añadir voicings básicos de acompañamiento.

**Prioridad:** alta dentro de esta etapa.  
**Dificultad:** alta.

### D2. Mano izquierda y patrones de acompañamiento

- [ ] Raíz sola.
- [ ] Raíz y quinta.
- [ ] Bajo–acorde.
- [ ] Arpegios básicos.
- [ ] Patrones de cuatro tiempos.

**Prioridad:** alta.  
**Dificultad:** alta.

### D3. Digitación contextual

- [ ] Sugerir digitación según el acorde anterior y siguiente.
- [ ] Distinguir mano derecha e izquierda.
- [ ] Evitar presentar una única digitación como universal.
- [ ] Añadir advertencias ergonómicas básicas y movimientos lentos.

**Prioridad:** media.  
**Dificultad:** alta.

---

## Épica E — Melodía y canción

### E1. Melodía sobre acordes

- [ ] Mostrar notas del acorde, notas de paso y notas de tensión.
- [ ] Comparar una melodía sobre acorde mayor y menor.
- [ ] Resaltar qué notas coinciden con el acorde actual.
- [ ] Usar melodías originales o de dominio público.

**Prioridad:** alta dentro de esta etapa.  
**Dificultad:** alta.

### E2. Acompañamiento de una pieza completa

- [ ] Crear una pieza pedagógica breve con cuatro acordes.
- [ ] Separar mano derecha, mano izquierda y ambas manos.
- [ ] Añadir velocidad lenta, normal y práctica por fragmentos.
- [ ] Permitir silenciar una mano para tocar encima.

**Prioridad:** alta.  
**Dificultad:** muy alta.

---

## Épica F — Instrumento y audio

### F1. Sonido de piano más realista

- [ ] Evaluar muestras de piano frente a síntesis mejorada.
- [ ] Añadir diferencias de intensidad.
- [ ] Incorporar resonancia y sustain.
- [ ] Optimizar carga y funcionamiento sin conexión.

**Prioridad:** media.  
**Dificultad:** alta.

### F2. Teclado MIDI

- [ ] Detectar un teclado conectado mediante Web MIDI.
- [ ] Validar ejercicios con el instrumento físico.
- [ ] Leer velocidad de pulsación.
- [ ] Mantener alternativa con pantalla y teclado del computador.

**Prioridad:** media.  
**Dificultad:** alta.

### F3. Entrenamiento auditivo avanzado

- [ ] Variar registros y octavas.
- [ ] Incorporar inversiones y posiciones abiertas.
- [ ] Reconocer acordes dentro de progresiones.
- [ ] Completar el acorde que falta.
- [ ] Evitar pistas involuntarias de registro o timbre.

**Prioridad:** media.  
**Dificultad:** alta.

---

# 4. Principios de producto para todo el backlog

1. **Cada concepto debe pasar por:** ver → escuchar → construir → equivocarse → recibir una pista → corregir → aplicar.
2. **No añadir contenido sin una interacción que permita comprobar comprensión.**
3. **No bloquear la exploración libre**, pero no confundir exploración con dominio.
4. **La definición musical debe aparecer antes que la descripción emocional.**
5. **Las sensaciones son orientativas y siempre dependen del contexto.**
6. **El bajo global manda al identificar una inversión.**
7. **Las digitaciones son sugerencias contextuales, no reglas absolutas.**
8. **Priorizar progresiones y música real antes que acordes cada vez más exóticos.**
9. **Mantener una capa básica clara y otra avanzada opcional.**
10. **Probar cada versión en escritorio, tablet y móvil.**

---

# 5. Orden recomendado de desarrollo

1. Escala mayor interactiva.
2. Acordes diatónicos y grados romanos.
3. Constructor de progresiones.
4. Funciones armónicas.
5. Inversiones dentro de progresiones.
6. Pulso y reproducción en bucle.
7. Estadísticas por habilidad.
8. Voicings y acompañamiento con ambas manos.
9. Melodía sobre acordes.
10. Piano muestreado, MIDI y entrenamiento avanzado.
