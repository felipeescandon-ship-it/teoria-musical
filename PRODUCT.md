# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Principiantes autodidactas de teoría musical: personas sin conocimientos previos que aprenden por su cuenta, a su propio ritmo, sin instructor ni curso formal. Usan la app en español, en cualquier dispositivo (el README indica soporte responsive), típicamente en sesiones cortas y autoguiadas.

## Product Purpose

Enseñar teoría musical (notas, intervalos, tríadas mayores/menores, alteraciones, inversiones) de forma visual y auditiva mediante un piano virtual interactivo. El éxito es que el usuario complete la Ruta Guiada de lecciones y domine los conceptos mediante misiones prácticas con seguimiento de progreso.

## Positioning

A diferencia de herramientas de teoría musical que solo muestran diagramas o texto estático, cada concepto en esta app se toca y se escucha en tiempo real sobre un piano virtual (síntesis Web Audio), con misiones progresivas que exigen practicar antes de avanzar, no solo leer.

## Operating Context

- App de una sola página (`index.html`) con tres modos: Ruta Guiada (11 lecciones secuenciales), Laboratorio de Acordes (construcción libre) y Practicar (entrenamiento auditivo y desafíos).
- Sin build step: JavaScript vanilla con módulos ES nativos (`js/*.js`), sin framework ni bundler.
- Desplegada en GitHub Pages: https://felipeescandon-ship-it.github.io/teoria-musical/
- Uso local requiere servidor HTTP (los módulos ES bloquean `file://`).
- El progreso de lecciones y misiones persiste en `localStorage` (ver `js/storage.js`), versionado.

## Capabilities and Constraints

- Síntesis de audio en tiempo real vía Web Audio API (`js/audio.js`), sin samples de audio pregrabados.
- Piano virtual interactivo (`js/keyboard.js`) controlable con clics o teclado físico (A-K).
- Sistema de misiones con progreso por lección (explorada / practicada / dominada) y persistencia local.
- Contenido y UI en español (nomenclatura latina de notas: Do, Re, Mi, Fa, Sol, La, Si).
- 11 lecciones cubren: nota y teclado, semitonos e intervalos, mayor/menor, sostenidos y bemoles, inversiones, grados, escala mayor, función armónica, progresiones (ver navegación en `index.html`).
- Sin backend ni cuentas de usuario; todo el estado vive en el navegador del visitante.

## Brand Commitments

Nombre del producto: "Teoría Musical Interactiva". Paleta visual crema/navy editorial con tipografía sans/serif, adoptada recientemente (ver commits de rediseño visual) — tratada como sistema visual incumbente, no como decisión de este documento.

## Evidence on Hand

Ninguna evidencia externa (testimonios, casos de uso, datos de usuarios reales) disponible; no inventar métricas, testimonios ni casos de estudio en trabajo futuro.

## Product Principles

1. Cada concepto se demuestra tocando y escuchando el piano, nunca solo con texto o diagramas estáticos.
2. El aprendizaje es progresivo y autoguiado: las misiones exigen practicar antes de marcar una lección como dominada.
3. Cero fricción de acceso: sin cuentas, sin instalación, funciona en el navegador desde el primer clic.
4. El español y la nomenclatura latina de notas son la convención primaria de todo el contenido.

## Accessibility & Inclusion

El proyecto ya incorpora atributos ARIA (`aria-label` en el piano y otros componentes) y diseño responsive; no se ha establecido un estándar de accesibilidad formal (p. ej. WCAG AA) más allá de esa práctica existente.
