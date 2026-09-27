# Neibor · Seis Casas

Landing de conversión del proyecto Neibor, seis casas sobre una manzana de Villa Allende Golf, Córdoba, Argentina. Desarrolla GRAB.

Sitio estático, sin dependencias ni proceso de build. Se sirve tal cual desde GitHub Pages o desde cualquier hosting.

```
index.html        página completa
_cuerpo.html      el cuerpo sin <head>, fuente desde la que se genera index.html
css/site.css      sistema visual completo
js/site.js        interacciones
img/              imágenes en AVIF con respaldo JPEG, en tres tamaños
favicon.svg       isotipo vectorial
.nojekyll         evita que Pages procese el sitio con Jekyll
DIAGNOSTICO.md    análisis del material, faltantes y criterios de diseño
CAMBIOS-MOCKUP-V1.md  qué entró desde el mock up y desde los renders nuevos
```

## Las ocho secciones

```
Hero → Amenidades → Galería → Las seis casas → El proyecto → Dónde → Quién → Contacto
```

El orden pone la oferta antes que el relato: quien llega decidido encuentra el
plano con las superficies por unidad en el cuarto bloque, y quien necesita
convencerse sigue hacia "El proyecto", que cuenta la manzana, la calle, el lote,
los materiales y el interior en una sola secuencia anclada al scroll.

## Probarla en local

```bash
python3 -m http.server 8080
```

## Dónde se cambia cada cosa

**Las seis casas.** Array `CASAS` al inicio de `js/site.js`. Cada entrada tiene `x` e `y` en porcentaje sobre `img/implantacion-ingresos.jpg`, más la orientación del fondo, las cuatro superficies y el estado. Las posiciones son una lectura del plano de proyecto: hay que ajustarlas contra la implantación comercial definitiva. Para agregar un dato, sumar la clave al objeto y la fila correspondiente en `_cuerpo.html`. Los planos por unidad se sirven desde `img/plano-casa-<letra>.jpg`, con su miniatura en `-m`, y el visor los arma solo con la letra.

**El visor de planos.** La ventana `#planos`, en la sección de las casas. A la izquierda queda el plano de la casa elegida, pegado mientras se recorre la tira de la derecha; al tocar una miniatura, esa imagen pasa al marco grande. Para sumar o sacar una imagen alcanza con agregar o borrar un `<button class="mini">` en `_cuerpo.html`: lleva `data-full` con la imagen grande y `data-pie` con el epígrafe. La primera miniatura es la del plano y la actualiza el JavaScript con cada casa, así que no se toca.

**La ficha técnica.** Es una sola, común a las seis casas, en la ventana `#ficha-tecnica` de la sección de las casas. La abre el botón `#abrir-ficha-tecnica` de la tabla de la unidad. Está hecha con `dialog` y `showModal()`, de donde salen el velo, la retención del foco y el cierre con escape. Si alguna casa pasa a tener especificaciones propias, hay que partir el contenido por unidad y alimentarlo desde `CASAS`.

**La secuencia anclada de "El proyecto".** Cada punto son dos piezas que tienen que quedar en el mismo orden dentro de `_cuerpo.html`: el `<img data-arq="N">` dentro de `.arq__marco` y el `<li data-arq-item="N">` dentro de `.arq__lista`. El JavaScript no necesita saber cuántos son.

**WhatsApp.** Constante `WA` en `js/site.js`. Cada CTA lleva su propio mensaje en el atributo `data-wa`, así el asesor sabe desde qué sección escribieron.

**Formulario.** Hoy arma el mensaje y abre WhatsApp o el correo. Para conectar un CRM, reemplazar el cuerpo del `submit` por el `fetch` al endpoint y dejar WhatsApp como alternativa.

**Datos pendientes.** Buscar `class="pendiente"` en `_cuerpo.html`. Cada uno marca un dato que no estaba en el material entregado. Al completarlo, se borra la etiqueta.

**Regenerar `index.html`** después de editar `_cuerpo.html`: el archivo es el `<head>` de `index.html` más el cuerpo más el `<script>` final.

## Las imágenes

Cada foto vive en hasta tres anchos y en dos formatos:

```
nombre.jpg / .avif      1800 px   a sangre y galería
nombre-m.jpg / .avif    1000 px   móvil, secuencia anclada y visor
nombre-t.jpg / .avif     560 px   miniaturas de la ventana de planos
```

El marcado sirve AVIF primero y deja el JPEG de respaldo, así que cada navegador
baja un solo archivo. El AVIF pesa un 60 por ciento menos a igual calidad.

Para sumar una imagen nueva, con `sips` alcanza:

```bash
sips -Z 1000 --setProperty formatOptions 72 foto.jpg --out foto-m.jpg
sips -s format avif --setProperty formatOptions 60 foto.jpg --out foto.avif
sips -s format avif --setProperty formatOptions 58 foto-m.jpg --out foto-m.avif
```

Calidad 60 para fotos y renders, 70 para planos y dibujos de línea, que es donde
más se nota la compresión.

La del hero es la única que no espera: va con `fetchpriority="high"`, sin carga
diferida, y con dos `preload` en el `<head>`, uno por tamaño. Todas las demás
llevan `loading="lazy"` y `decoding="async"`.

## Decisiones que conviene conocer antes de tocar

- **El ángulo de 30 grados** de los recortes de imagen sale de la arista del isotipo, que sale de la forma del lote. Si se cambia, se pierde la relación con la marca. Las clases `corte-ti` y `corte-td` traen el polígono ya calculado para cada relación de aspecto.
- **Dos niveles de botón, nunca tres.** Sólido para la acción de conversión, contorno para todo lo demás.
- **El naranja de marca no se usa en botones.** Sobre papel da 4.28:1 de contraste, por debajo del mínimo para texto chico. Queda reservado para titulares grandes, la chincheta activa y las etiquetas de pendiente, que es además el uso que le da el manual.
- **`prefers-reduced-motion`** desactiva barridos, contadores y desplazamientos. Todo el contenido queda accesible.
- **Tipografía:** Host Grotesk desde Google Fonts, la misma del manual de marca.

## Pendiente antes de considerarla terminada

El detalle completo, con lo que entró desde el mock up y lo que sigue faltando, está en `CAMBIOS-MOCKUP-V1.md`. En corto:

1. Valores, forma de pago y disponibilidad por casa. Es el único que bloquea la venta.
2. Confirmar qué letra corresponde a cada lote sobre el plano de implantación.
3. Logotipos de GRAB, Autónomo y Calsina en vectorial.
4. Coordenadas exactas del predio para el enlace a Google Maps.
5. Distancias y tiempos verificados a los puntos de interés del entorno.
6. Fiduciaria o escribanía interviniente, plazo de obra, fecha de entrega y permisos.
7. Identificador de Google Tag Manager o GA4 para activar la medición.
8. Endpoint de CRM y texto legal de tratamiento de datos en el formulario.
9. Números de WhatsApp diferenciados de GRAB y de Calsina, si se quieren botones separados.

Los nueve están marcados en `_cuerpo.html` con `class="pendiente"`. Al completar
uno, se borra la etiqueta.

La URL del sitio publicado es https://brayanparragrimaldo-byte.github.io/Neibor/ y ya está puesta en las etiquetas Open Graph. Si el repositorio cambia de nombre o de dueño, hay que actualizarlas en el `<head>` de `index.html`.
