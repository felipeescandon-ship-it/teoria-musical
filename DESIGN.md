---
name: Teoría Musical Interactiva
description: Piano virtual interactivo para aprender teoría musical en español, tocando y escuchando cada concepto.
colors:
  navy-partitura: "#0B2948"
  navy-partitura-hover: "#123A61"
  navy-partitura-pressed: "#071F38"
  crema-papel: "#FCFAF6"
  panel-blanco: "#FFFFFF"
  panel-suave: "#F7F3EC"
  beige-calido: "#F7F1E8"
  texto-tinta: "#0D1B2A"
  texto-muted: "#626A73"
  linea-divisoria: "#E4D9C9"
  terracota-raiz: "#7a2323"
  azul-tercera: "#3a5680"
  periwinkle-quinta: "#7893bd"
  rosa-septima: "#c54667"
  verde-correcto: "#138a76"
  naranja-alerta: "#d98219"
  rojo-error: "#ca4560"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 850
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 3vw, 2rem)"
    fontWeight: 850
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  music:
    fontFamily: "Lora, Georgia, serif"
    fontWeight: 700
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 850
    letterSpacing: "0.085em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "18px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "22px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.navy-partitura}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.navy-partitura-hover}"
  button-primary-active:
    backgroundColor: "{colors.navy-partitura-pressed}"
  button-secondary:
    backgroundColor: "{colors.panel-suave}"
    textColor: "{colors.texto-tinta}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  card:
    backgroundColor: "{colors.panel-blanco}"
    textColor: "{colors.texto-tinta}"
    rounded: "{rounded.lg}"
    padding: "22px"
---

# Design System: Teoría Musical Interactiva

## Overview

**Creative North Star: "La Partitura Editorial"**

El sistema visual se lee como una edición cuidada de partituras: papel crema cálido, tinta navy profunda, jerarquía tipográfica precisa. Es cálido y claro por diseño — un principiante autodidacta nunca debe sentirse intimidado — pero la precisión editorial (alineación, contraste, uso disciplinado del color) le da autoridad de material de estudio serio, no de app infantil.

La tipografía sans-serif (Inter) gobierna toda la interfaz — títulos, botones, navegación — mientras que la serif (Lora) queda reservada exclusivamente para el contenido musical real (nombres de acordes, notas): la regla que separa "la interfaz que enseña" de "la música que se enseña". El color es funcional antes que decorativo: cada tono de la familia raíz/tercera/quinta/séptima existe para que el oído y el ojo aprendan juntos qué nota cumple qué función en un acorde.

**Key Characteristics:**
- Papel crema + tinta navy como base editorial, nunca blanco puro ni negro puro
- Serif solo para música, sans para todo lo demás (interfaz)
- Paleta semántica de roles de acorde (raíz/tercera/quinta/séptima) consistente en teclado, chips y tablas
- Sombras suaves y difusas, nunca duras ni "flotantes"
- Radios generosos (12–18px) en casi todo — nada de esquinas afiladas

## Colors

Paleta cálida de papel editorial con un solo acento frío-neutro (navy) y una familia semántica de colores de rol para las notas del acorde.

### Primary
- **Navy Partitura** (`#0B2948`): acento principal — CTAs, navegación activa, foco, bordes de énfasis. Hover en `#123A61`, pressed en `#071F38`.

### Secondary (roles de acorde — semánticos, no decorativos)
- **Terracota Raíz** (`#7a2323`): marca la nota raíz/tónica en teclado, chips e info-grids.
- **Azul Tercera** (`#3a5680`): marca la tercera del acorde.
- **Periwinkle Quinta** (`#7893bd`): marca la quinta del acorde.
- **Rosa Séptima** (`#c54667`): marca la séptima, cuando aplica.

### Tertiary (estado y feedback)
- **Verde Correcto** (`#138a76`): respuestas correctas, misiones dominadas.
- **Naranja Alerta** (`#d98219`): segundo punto de referencia en comparaciones de intervalos.
- **Rojo Error** (`#ca4560`): respuestas incorrectas.

### Neutral
- **Crema Papel** (`#FCFAF6`): fondo base de toda la app.
- **Panel Blanco** (`#FFFFFF`) / **Panel Suave** (`#F7F3EC`): superficies de tarjetas y controles.
- **Beige Cálido** (`#F7F1E8`): fondo del hero y tarjetas de comparación.
- **Texto Tinta** (`#0D1B2A`): texto principal.
- **Texto Muted** (`#626A73`): texto secundario, labels, eyebrows.
- **Línea Divisoria** (`#E4D9C9`): bordes y separadores.

### Named Rules
**La Regla del Papel.** El fondo nunca es blanco puro ni gris frío: siempre crema o beige cálido, incluso en superficies "neutras". El navy es el único tono frío del sistema y por eso funciona como acento — su rareza es la señal de interactividad.

**La Regla del Rol.** Los cuatro colores de rol de acorde (raíz/tercera/quinta/séptima) son fijos y nunca se reasignan a otro significado; si un componente nuevo necesita distinguir roles armónicos, reutiliza esta paleta en vez de inventar una nueva.

## Typography

**Display/Body Font:** Inter (con ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI" como fallback)
**Music Font:** Lora (con Georgia, serif como fallback) — reservada solo para nombres de notas y acordes

**Character:** Inter aporta claridad funcional y neutralidad a toda la interfaz; Lora aparece únicamente cuando el contenido *es* música, dándole a esos momentos un aire ligeramente más clásico sin romper la legibilidad general.

### Hierarchy
- **Display/Hero** (peso 850, `clamp(1.9rem, 4vw, 2.6rem)`, line-height 1.15): títulos de héroe y de lección.
- **Headline/Big Idea** (peso 850, `clamp(1.3rem, 3vw, 2rem)`, line-height 1.25): ideas centrales dentro de una lección.
- **Music** (Lora, peso 700): nombres de acordes y notas cuando aparecen como contenido, no como UI.
- **Body** (peso 400, 1rem, line-height 1.6): texto de párrafo.
- **Label** (peso 850, 0.76rem–0.84rem, letter-spacing 0.085em, uppercase en eyebrows): etiquetas de campo, eyebrows, badges de estado.

### Named Rules
**La Regla Serif-Solo-Música.** Lora aparece exclusivamente en `.music-heading` para nombres de acordes/notas. Ningún título de interfaz, botón o navegación usa serif — así el ojo aprende a distinguir "esto es música" de "esto es la app".

## Layout

Contenedor centrado (`max-width: 1220px`) con padding lateral fluido (`clamp(18px, 4vw, 44px)`). Layout de lección de dos columnas (sidebar fijo de 250px + contenido) que colapsa a una columna bajo 930px, con la lista de lecciones pasando a grid de 3→2→1 columnas según el viewport. Grids de dos y tres columnas (`.grid.two`, `.grid.three`) colapsan a una sola columna bajo 760px. Espaciado por gaps de 8/12/16/18/24px según densidad del componente — sin sistema numérico estricto, pero consistente por categoría (controles=12px, grids=24px, cards internas=13-22px).

## Elevation & Depth

Sistema de sombras suaves y difusas (nunca duras): `--shadow` para el hero, `--shadow-card` para tarjetas, `--shadow-btn` para botones primarios, `--shadow-kb` para el contenedor del teclado. La profundidad es sutil y ambiental — comunica "superficie elevada de papel", no "objeto flotante". Los botones secundarios y muchos contenedores (info-item, concept, mission) son planos con borde de 1px en vez de sombra, reservando la sombra para los elementos con mayor peso jerárquico (hero, cards, botón primario).

### Shadow Vocabulary
- **Hero** (`0 14px 38px rgba(20,32,45,.09)`): la superficie más grande y elevada de la página.
- **Card** (`0 6px 18px rgba(20,32,45,.07)`): tarjetas de contenido y comparación.
- **Button** (`0 4px 10px rgba(11,41,72,.16)`): botón primario en reposo.
- **Keyboard** (`0 4px 16px rgba(20,30,40,.06)`): contenedor del piano virtual.

### Named Rules
**La Regla de la Sombra Reservada.** La sombra se reserva para superficies que "flotan" sobre el fondo (hero, cards, teclado, botón primario). Contenedores informativos planos (info-item, concept, mission, callout) usan borde de 1px, nunca sombra — evita que la página se sienta sobrecargada de profundidad.

## Shapes

Radios generosos y consistentes: 12px (`--radius-sm`, controles y botones), 16px (`--radius-md`, callouts, chips grandes, info-items), 18px (`--radius-lg`, hero, cards, teclado). Elementos tipo badge/pill (hero-pill, note chips redondeados, score-chip) usan `border-radius: 999px` (píldora completa). Nada en el sistema usa esquinas rectas salvo la tabla y las teclas blancas del piano (que solo redondean la esquina inferior, imitando un teclado real).

## Components

Botones, tarjetas y teclas se sienten **sólidos pero cálidos**: bordes suaves, sombras discretas, sensación de papel o tarjeta física — nunca fríos ni cortantes.

### Buttons
- **Shape:** radio de 12px (`--radius-sm`), padding `16px 24px`.
- **Primary:** fondo Navy Partitura, texto blanco, peso 850, sombra `--shadow-btn`. Hover: `--accent-hover` + `translateY(-1px)`. Active: `--accent-pressed` + `scale(.97)`.
- **Secondary:** fondo Panel Suave, texto Tinta, borde de 1px en Línea Divisoria, sin sombra.
- **Good/Danger:** variantes sólidas en Verde Correcto / Rojo Error, mismo radio y padding.
- **Small:** mismo lenguaje, padding reducido (`8px 11px`), sin sombra.
- **Disabled:** opacidad .48, sin transform.

### Chips / Pills
- **Hero pill:** transparente con borde de 1px, texto del hero, radio 999px.
- **Note chip (roles de acorde):** fondo en la variante "-soft" del color de rol correspondiente, texto en el color de rol sólido, radio `--radius-md`.
- **Score chip:** fondo Panel Suave, radio 999px, uso en resúmenes de puntaje.

### Cards / Containers
- **Corner Style:** 18px (`--radius-lg`) para cards principales; 16px para info-items, concepts, missions, callouts.
- **Background:** Panel Blanco para `.card`; Panel Suave para contenedores informativos anidados; Beige Cálido para `.compare-card`.
- **Shadow Strategy:** ver Elevation & Depth — solo `.card` y `.compare-card` llevan sombra.
- **Border:** 1px en Línea Divisoria en casi todos los contenedores.
- **Internal Padding:** 22px en cards principales, 13–16px en contenedores anidados.

### Inputs / Fields
- **Style:** borde de 1px en Línea Divisoria, fondo Panel Blanco, radio `--radius-sm` (12px), padding `11px 12px`.
- **Focus:** anillo de foco de 3px (`--focus-ring`, navy translúcido) con `outline-offset: 2px` en todo elemento interactivo — nunca solo un cambio de borde.
- **Range inputs:** `accent-color` en Navy Partitura.

### Navigation
- **Mode tabs:** pestañas sticky con fondo translúcido (`backdrop-filter: blur`), tab activo marcado con borde inferior de 2px en color de texto y peso 850 — sin fondo ni pastilla, minimalista.
- **Lesson sidebar:** lista de botones de ancho completo; el estado activo invierte a fondo Navy Partitura sólido con texto blanco; estados `explored`/`practiced`/`mastered` cada uno con su propio chip de color (azul/navy-soft/verde).

### Piano Virtual (componente insignia)
Teclas blancas con gradiente sutil de blanco a gris muy claro y borde redondeado solo en la base (imitando un teclado real); teclas negras en gradiente oscuro casi negro. Cuando una tecla cumple un rol armónico (raíz/tercera/quinta/séptima), se tiñe con el color de rol correspondiente en gradiente — este es el mecanismo central de enseñanza visual del producto: el color conecta lo que se ve con lo que se oye y con la función teórica de la nota.

## Do's and Don'ts

### Do:
- **Do** usar Lora exclusivamente para nombres de notas/acordes (`.music-heading`); todo lo demás en Inter.
- **Do** mantener los cuatro colores de rol de acorde (raíz/tercera/quinta/séptima) fijos en su significado en cualquier componente nuevo que distinga notas de un acorde.
- **Do** reservar la sombra para superficies "elevadas" (hero, cards, teclado, botón primario) y usar borde de 1px para el resto.
- **Do** usar radios generosos (12–18px) consistentes con la categoría del componente.
- **Do** incluir el anillo de foco de 3px en todo control interactivo nuevo (accesibilidad de teclado ya es un compromiso del proyecto).

### Don't:
- **Don't** usar blanco puro ni negro puro como fondo — siempre crema/beige cálido o el navy/negro suave del modo oscuro.
- **Don't** usar Lora en botones, navegación o títulos de interfaz — rompe la regla serif-solo-música.
- **Don't** apilar sombra sobre contenedores ya anidados dentro de una card con sombra (evita "cards dentro de cards" con profundidad doble).
- **Don't** introducir un quinto color de rol de acorde o reasignar los existentes a otro significado.
