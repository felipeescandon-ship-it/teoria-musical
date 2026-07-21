# Teoría Musical Interactiva 🎹

Una aplicación web interactiva para aprender teoría musical de forma visual y auditiva usando un piano virtual.

## Características

### 📚 Ruta Guiada (5 Lecciones)
1. **Nota y teclado** - Entiende cómo se nombran las notas y las octavas
2. **Semitonos e intervalos** - Aprende a medir distancias entre notas
3. **Mayor y menor** - Descubre qué hace que un acorde sea mayor o menor
4. **Sostenidos y bemoles** - Comprende las alteraciones musicales
5. **Inversiones** - Explora cómo cambia un acorde según su bajo

### 🎼 Modos de Aprendizaje

- **Piano Interactivo** - Explora libremente con retroalimentación inmediata
- **Laboratorio de Acordes** - Construye y escucha cualquier acorde
- **Entrenamiento Auditivo** - Desarrolla tu oído musical reconociendo tipos de acordes
- **Modo Práctica** - Desafíos para reforzar lo aprendido
- **Referencia** - Consulta rápida de conceptos, intervalos y acordes

## Cómo Usar

`app.html` usa módulos ES (`js/*.js`), así que los navegadores lo bloquean si se abre por doble clic (`file://`). Sirve la carpeta con un servidor local:

```bash
python3 -m http.server 8811
# abre http://localhost:8811/app.html
```

1. Comienza con la Ruta Guiada o explora libremente
2. Haz clic en las teclas del piano (o usa el teclado: A-K)
3. Escucha los acordes y aprende las relaciones musicales

## Conceptos Cubiertos

- **Notas y octavas** - Do, Re, Mi, Fa, Sol, La, Si (Do)
- **Intervalos** - Distancias en semitonos
- **Tríadas** - Mayor, menor, aumentada, disminuida
- **Extensiones** - Sus2, Sus4, 7 dominante, 7 mayor
- **Inversiones** - Fundamental, 1ª, 2ª inversión
- **Alteraciones** - Sostenidos (♯) y bemoles (♭)

## Tecnología

- **HTML5** - Estructura y semántica
- **CSS3** - Diseño responsivo y animaciones
- **JavaScript** - Web Audio API para síntesis de sonido

## Características Técnicas

- ✨ Síntesis de audio en tiempo real
- 🎯 Sistema de misiones con progreso
- 💾 Persistencia local (localStorage)
- 📱 Diseño responsive
- ♿ Accesibilidad ARIA

## Progreso

El app registra tu progreso:
- **Sin iniciar** - No has comenzado la lección
- **Explorada** - Has visto el contenido
- **Practicada** - Has hecho ejercicios
- **Dominada** - Completaste la misión

## Instalación Local

```bash
git clone https://github.com/felipeescandon-ship-it/teoria-musical.git
cd teoria-musical
python3 -m http.server 8811
# abre http://localhost:8811/app.html
```

## Notas

- Los datos de progreso se guardan localmente en tu navegador
- Requiere servidor local (por los módulos ES); funciona offline una vez servido
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

---

Aprender música es aprender a escuchar relaciones. El resto son nombres útiles para poder hablar de ellas.
