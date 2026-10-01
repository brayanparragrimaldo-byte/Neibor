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

## Las siete secciones

```
Hero → Atributos principales → Galería → Las seis casas → Dónde → Quién → Contacto
```

El orden pone la oferta antes que el relato: quien llega encuentra el plano con
las superficies por unidad en el cuarto bloque y de ahí pasa a la ubicación,
quién lo hace y el contacto. El relato largo del proyecto, que ocupaba una
secuencia anclada al scroll entre "Las seis casas" y "Dónde", se quitó a pedido
del desarrollo. Queda en el historial: `git revert` del commit que lo saca lo
devuelve entero, con sus imágenes, que siguen en `img/`.

Como esa sección era la única oscura entre dos claras, "Dónde" lleva ahora
`seccion--corte`, un filete que marca dónde termina una y empieza la otra.

## Probarla en local

```bash
python3 -m http.server 8080
```

## Dónde se cambia cada cosa

**Las seis casas.** Array `CASAS` al inicio de `js/site.js`. Cada entrada tiene `x` e `y` en porcentaje sobre `img/implantacion-ingresos.jpg`, más la orientación del fondo, las cuatro superficies y el estado. Las posiciones son una lectura del plano de proyecto: hay que ajustarlas contra la implantación comercial definitiva. Para agregar un dato, sumar la clave al objeto y la fila correspondiente en `_cuerpo.html`. Los planos por unidad se sirven desde `img/plano-casa-<letra>.jpg`, con su miniatura en `-m`, y el visor los arma solo con la letra.

**Las chinchetas del plano abren la ventana.** Además de cambiar la ficha, una chincheta abre el visor de planos con el material de esa casa, y al cerrarlo el foco vuelve a la chincheta. Las letras de abajo sólo cambian la ficha, para poder comparar superficies sin abrir y cerrar. El disparador de la ventana se pasa como argumento a `abrir()`, que es de donde sale la vuelta del foco.

**El visor de planos.** La ventana `#planos`, en la sección de las casas. A la izquierda queda el plano de la casa elegida, pegado mientras se recorre la tira de la derecha; al tocar una miniatura, esa imagen pasa al marco grande. Para sumar o sacar una imagen alcanza con agregar o borrar un `<button class="mini">` en `_cuerpo.html`: lleva `data-full` con la imagen grande y `data-pie` con el epígrafe. La primera miniatura es la del plano y la actualiza el JavaScript con cada casa, así que no se toca.

**La ficha técnica.** Es una sola, común a las seis casas, en la ventana `#ficha-tecnica` de la sección de las casas. La abre el botón `#abrir-ficha-tecnica` de la tabla de la unidad. Está hecha con `dialog` y `showModal()`, de donde salen el velo, la retención del foco y el cierre con escape. Si alguna casa pasa a tener especificaciones propias, hay que partir el contenido por unidad y alimentarlo desde `CASAS`.

**WhatsApp.** Constante `WA` en `js/site.js`. Cada CTA lleva su propio mensaje en el atributo `data-wa`, así el asesor sabe desde qué sección escribieron.

**Formulario.** Hoy arma el mensaje y abre WhatsApp o el correo. Para conectar un CRM, reemplazar el cuerpo del `submit` por el `fetch` al endpoint y dejar WhatsApp como alternativa.

**Datos pendientes.** Buscar `class="pendiente"` en `_cuerpo.html`. Cada uno marca un dato que no estaba en el material entregado. Al completarlo, se borra la etiqueta.

**Regenerar `index.html`** después de editar `_cuerpo.html`: el archivo es el `<head>` de `index.html` más el cuerpo más el `<script>` final.

## Las imágenes

Cada foto vive en hasta tres anchos y en dos formatos:

```
nombre.jpg / .avif      1800 px   a sangre y galería
nombre-m.jpg / .avif    1000 px   móvil y visor                    
nombre-t.jpg / .avif     560 px   miniaturas de la ventana de planos
```

Los logotipos van sólo a 800 px (`-m`), que alcanza para los tres lugares donde
aparecen: la cabecera a 120 y el pie a 300.

Los planos por casa son la excepción: salen de los PDF del desarrollo y van a
3000 px el original, 1600 el del visor y 560 la miniatura, para que se lean los
nombres y las medidas de cada ambiente al ampliarlos.

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
- **Tres papeles de botón, uno por intención.** Sólido tinta para convertir (pedir valores, agendar visita), naranja `btn--acento` para abrir material (el plano, la ficha técnica), contorno para navegar. `btn--chico` es una medida, no un papel.
- **El naranja de marca sólo va con texto blanco.** Sobre `#af5d00` el blanco puro da 4.79:1 y pasa AA; el papel de marca daría 4.28 y no llegaría. En texto suelto sobre papel el naranja sigue reservado para titulares grandes, la chincheta activa y las etiquetas de pendiente.
- **Si una imagen no llega, hay red.** Dentro de un `<picture>`, cuando la fuente elegida falla el navegador no prueba con la siguiente: deja el hueco vacío. El JavaScript escucha el error en captura, tira las `<source>` y vuelve a pedir el JPEG del propio `<img>`.
- **Los atributos van en cuatro columnas y la última fila se centra.** Son diez, así que sobran dos en la tercera fila: las reglas `.amen > li:nth-child(9)` y `:nth-child(10)` los corren a las columnas del medio. Si cambia la cantidad de atributos, hay que revisarlas.
- **Los números de la página se tratan igual en los dos lugares donde hay.** Los metros de la banda del hero y los minutos de la ubicación comparten el mismo dibujo: cifra en peso liviano con el interletrado cerrado, unidad chica al lado en peso medio. Es lo que hace que las dos listas se lean como parientes y no como dos tablas sueltas.
- **Dos familias de ícono, a propósito.** Los de amenidades son objetos (auto, cámara, árbol). Los cinco de la banda del hero son marcas de planta: el perímetro de la manzana con el corte de 30 grados, las seis huellas, el lote acotado, la planta con ambientes y las copas de arbolado. Si se mezclan, la banda se lee como una repetición de la grilla de amenidades.
- **Las cifras de la banda del hero vienen del material comercial y no cierran con la ficha técnica.** Están puestas tal cual las entregó el desarrollo, pero hay tres diferencias anotadas abajo, en "Datos que no cierran entre sí". Antes de publicar en otros canales conviene unificar.
- **`prefers-reduced-motion`** desactiva barridos, contadores y desplazamientos. Todo el contenido queda accesible.
- **Tipografía:** Host Grotesk desde Google Fonts, la misma del manual de marca.

## Datos que no cierran entre sí

La banda del hero lleva las cinco cifras del material comercial. La ficha de cada
casa y la ventana de planos llevan las del legajo de obra. En tres puntos no dicen
lo mismo, así que figuran los dos valores en la web y ninguno fue corregido por
cuenta propia:

| Dato | Banda del hero | Ficha por casa |
|---|---|---|
| Superficie del lote | entre 450 y 550 m² | 502, 550, 557, 595, 711 y 790 m² |
| Superficie de la casa | 215 m² | entre 224 y 241 m² (cubierta más semicubierta) |
| Superficie del predio | 4.237 m² | los seis lotes suman 3.705 m², y con los 1.000 de áreas comunes dan 4.705 |

Dos lecturas posibles: que la banda hable de superficie cubierta y de lote promedio
de una etapa anterior del proyecto, o que la ficha sume semicubierto donde la banda
no lo hace. Hace falta que el desarrollo diga cuál de las dos vale para que la web
quede con una sola cifra por concepto.

## Pendiente antes de considerarla terminada

El detalle completo, con lo que entró desde el mock up y lo que sigue faltando, está en `CAMBIOS-MOCKUP-V1.md`. En corto:

1. Valores, forma de pago y disponibilidad por casa. Es el único que bloquea la venta.
2. Confirmar qué letra corresponde a cada lote sobre el plano de implantación.
3. Logotipos de GRAB, Autónomo y Calsina en vectorial.
4. Fiduciaria o escribanía interviniente, plazo de obra, fecha de entrega y permisos.
5. Identificador de Google Tag Manager o GA4 para activar la medición.
6. Endpoint de CRM y texto legal de tratamiento de datos en el formulario.
7. Números de WhatsApp diferenciados de GRAB y de Calsina, si se quieren botones separados.

El predio está en **-31.285555, -64.288894** y el enlace a Google Maps apunta
ahí en forma directa, sin pasar por un acortador.

Los que tienen lugar en la página están marcados en `_cuerpo.html` con
`class="pendiente"`, seis etiquetas en total. Al completar uno, se borra la
etiqueta.

Los tiempos al golf, al centro, al aeropuerto y a Córdoba capital los entregó el
desarrollo y están puestos tal cual. No salen de una medición propia ni de la
planimetría.

La URL del sitio publicado es https://brayanparragrimaldo-byte.github.io/Neibor/ y ya está puesta en las etiquetas Open Graph. Si el repositorio cambia de nombre o de dueño, hay que actualizarlas en el `<head>` de `index.html`.
