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
Hero → Galería: el barrio → Atributos principales → Galería: la casa
     → Las seis casas → Dónde → Quién → Contacto
```

Dos galerías, no una, y separadas a propósito por los atributos: la primera
muestra lo que se ve llegando (los dos ingresos, la calle interna, el frente de
la manzana) y la segunda lo que se ve adentro de una casa. Entre las dos queda
la lista de atributos, que es la que explica en palabras lo que las imágenes
muestran sin texto. Después de eso viene el plano con las superficies por unidad
y de ahí la ubicación, quién lo hace y el contacto. El relato largo del proyecto, que ocupaba una
secuencia anclada al scroll entre "Las seis casas" y "Dónde", se quitó a pedido
del desarrollo. Queda en el historial: `git revert` del commit que lo saca lo
devuelve entero, con sus imágenes, que siguen en `img/`.

Como esa sección era la única oscura entre dos claras, "Dónde" lleva ahora
`seccion--corte`, un filete que marca dónde termina una y empieza la otra.

## Probarla en local

```bash
python3 -m http.server 8080
```

## Por qué en Safari se veían las imágenes y en los demás navegadores no

Pasó y ya está resuelto. Son dos cosas que se sumaron:

1. **Algunos AVIF generados con `sips` sólo los abre el decodificador de Apple.**
   Chromium y Firefox los rechazan. Pasa sin patrón: mismo origen y misma orden,
   y de dieciocho imágenes salen dos malas.
2. **Un `<picture>` no prueba con la fuente siguiente cuando la elegida falla.**
   Si el AVIF no abre, el navegador no baja el JPEG: deja el hueco vacío para
   siempre. Safari, que sí abría esos archivos, mostraba la página entera.

Desde el 30/09 el JavaScript escucha el error en captura, tira las `<source>` y
vuelve a pedir el JPEG del propio `<img>`, así que el hueco ya no queda. Y desde
ahora las imágenes nuevas se comprueban una por una en un motor que no sea el de
Apple antes de publicarlas: ver "Las imágenes".

Si alguien vuelve a ver huecos, casi seguro es caché: Pages manda
`cache-control: max-age=600`, así que conviene recargar forzando (`cmd+shift+R`)
antes de dar por buena cualquier otra explicación.

## Dónde se cambia cada cosa

**Las seis casas.** Array `CASAS` al inicio de `js/site.js`. Cada entrada tiene `x` e `y` en porcentaje sobre `img/implantacion-ingresos.jpg`, más la orientación del fondo, las cuatro superficies y el estado. Las posiciones son una lectura del plano de proyecto: hay que ajustarlas contra la implantación comercial definitiva. Para agregar un dato, sumar la clave al objeto y la fila correspondiente en `_cuerpo.html`. Los planos por unidad se sirven desde `img/plano-casa-<letra>.jpg`, con su miniatura en `-m`, y el visor los arma solo con la letra.

**Las chinchetas del plano abren la ventana.** Además de cambiar la ficha, una chincheta abre el visor de planos con el material de esa casa, y al cerrarlo el foco vuelve a la chincheta. Las letras de abajo sólo cambian la ficha, para poder comparar superficies sin abrir y cerrar. El disparador de la ventana se pasa como argumento a `abrir()`, que es de donde sale la vuelta del foco.

**El visor de planos.** La ventana `#planos`, en la sección de las casas. A la izquierda queda el plano de la casa elegida, pegado mientras se recorre la tira de la derecha; al tocar una miniatura, esa imagen pasa al marco grande. Para sumar o sacar una imagen alcanza con agregar o borrar un `<button class="mini">` en `_cuerpo.html`: lleva `data-full` con la imagen grande y `data-pie` con el epígrafe. La primera miniatura es la del plano y la actualiza el JavaScript con cada casa, así que no se toca.

**La ficha técnica.** Es una sola, común a las seis casas, en la ventana `#ficha-tecnica` de la sección de las casas. La abre el botón `#abrir-ficha-tecnica` de la tabla de la unidad. Está hecha con `dialog` y `showModal()`, de donde salen el velo, la retención del foco y el cierre con escape. Si alguna casa pasa a tener especificaciones propias, hay que partir el contenido por unidad y alimentarlo desde `CASAS`.

**WhatsApp.** Constante `WA` en `js/site.js`. Cada CTA lleva su propio mensaje en el atributo `data-wa`, así el asesor sabe desde qué sección escribieron.

**Formulario.** Hoy arma el mensaje y abre WhatsApp o el correo. Para conectar un CRM, reemplazar el cuerpo del `submit` por el `fetch` al endpoint y dejar WhatsApp como alternativa.

**Datos pendientes.** Buscar `class="pendiente"` en `_cuerpo.html`. Cada uno marca un dato que no estaba en el material entregado. Al completarlo, se borra la etiqueta.

**Las galerías.** Son dos y usan el mismo mecanismo. Una `<section class="galeria" data-galeria>` con una tira `[data-pista]` adentro alcanza para que el JavaScript la arme sola: cuenta las `<figure class="galeria__slide">`, dibuja los tramos de la barra, escribe el contador y conecta las flechas `[data-ant]` y `[data-sig]`. No hay identificadores en el medio, así que agregar una tercera galería es copiar la sección y cambiarle el `id` y el rótulo.

La ventana de la foto ampliada, `#v-foto`, es una sola para las dos: guarda de cuál galería vino y se mueve dentro de esa. Vive al final del `<main>`, fuera de las dos secciones.

Para sumar o sacar una imagen se agrega o se borra la figura entera. El `data-gal` de cada botón es la posición y no lo reescribe nadie: conviene renumerarlo a mano si se intercalan imágenes. Pasa sola cada cinco segundos; la duración está en `DURACION`, y el mismo número está en la transición de `.galeria__tramo.activo i`, así que se cambian los dos juntos.

El rótulo de abajo a la derecha (`.galeria__donde`) dice cuál de las dos se está mirando. Con dos tiras iguales seguidas, sin eso no se sabe dónde se está.

**Regenerar `index.html`** después de editar `_cuerpo.html`:

```bash
python3 build.py
```

Toma el `<head>` que ya está en `index.html`, le pega el cuerpo entero y cierra con el `<script>`. De paso le pone a la hoja de estilos y al script un sello corto del contenido (`?v=76b160c5`), para que el navegador de quien ya visitó la página no mezcle un CSS viejo con un JS nuevo.

## Las imágenes

Cada foto vive en hasta tres anchos y en dos formatos:

```
nombre.jpg / .avif      1800 px   a sangre y galería
nombre-m.jpg / .avif    1000 px   móvil y visor                    
nombre-t.jpg / .avif     560 px   miniaturas de la ventana de planos
```

Los logotipos van sólo a 800 px (`-m`), que alcanza para los tres lugares donde
aparecen: la cabecera a 120 y el pie a 300. El de Calsina va a 640 y sólo en PNG:
`sips` le tira el canal alfa al pasarlo a AVIF y lo deja con fondo blanco, que
sobre la salvia de esa sección sería un recuadro.

**Si un logotipo llega dibujado sobre blanco**, como el de Calsina, hay que
pasarlo a fondo transparente antes de usarlo:

```bash
python3 fondo-a-alfa.py img/logo.png img/logo.png
```

Deshace la composición sobre blanco píxel por píxel sin tocar el tono de la
tinta: el verde del isotipo sigue siendo ese verde. Volviendo a componer el
resultado sobre blanco se recupera el original con 0,87 de diferencia media sobre
255, así que no hay pérdida visible.

Los planos por casa son la excepción: salen de los PDF del desarrollo y van a
3000 px el original, 1600 el del visor y 560 la miniatura, para que se lean los
nombres y las medidas de cada ambiente al ampliarlos.

El marcado sirve AVIF primero y deja el JPEG de respaldo, así que cada navegador
baja un solo archivo. El AVIF pesa un 60 por ciento menos a igual calidad.

**`sips` saca de vez en cuando un AVIF que sólo abre Safari.** No es frecuente ni
previsible: de las dieciocho imágenes nuevas, dos salieron con un archivo que el
decodificador de Apple lee sin problema y el de Chromium rechaza. Mismo origen,
misma orden, mismos encabezados; el defecto está adentro. Volviéndolas a generar
con otro número de calidad salen bien.

Por eso **toda imagen nueva se comprueba en un navegador que no sea Safari antes
de publicarla**. Con el sitio servido en local, en la consola:

```js
var urls = [...document.querySelectorAll('img')].map(i => i.currentSrc);
await Promise.all(urls.map(u => new Promise(r => {
  var i = new Image(); i.onload = () => r(null); i.onerror = () => r(u); i.src = u;
}))).then(x => console.log(x.filter(Boolean)));
```

Lista vacía, está bien. Lo que aparezca hay que volver a generarlo.

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
- **Las galerías recortan en el escritorio y no recortan en el teléfono.** Los dieciocho renders son apaisados, de 16:9 (salvo la cocina y la galería desde el jardín, de 3:2). Llenando una pantalla de teléfono parada quedaría a la vista poco más de la cuarta parte del ancho, y una cocina deja de parecer una cocina. Abajo de 760 píxeles la imagen entra entera, de borde a borde, y el fondo oscuro de arriba y abajo recibe el pie y los controles. Con recortes verticales del mismo render esto se puede dar vuelta: ver "Lo que falta para que la galería llene el teléfono".
- **"Quién lo hace" va sobre salvia y es la única sección en ese tono.** Es el escalón entre el papel de las dos secciones de arriba y la tinta del contacto, y de paso las separa sin necesidad de un filete. Ahí el naranja del pendiente baja a `#7a4100`, porque el de texto habitual da 3,76:1 sobre salvia y no llega al mínimo.
- **Las tres firmas comparten alto de ranura, haya logotipo o no.** `.marca__firma` fija la altura y adentro va el logotipo o el nombre compuesto. Mientras falten dos de los tres, el banner no se desarma. Cuando lleguen los otros dos, se reemplaza el `<p class="marca__nombre">` por un `<img>` y no hay que tocar nada más.
- **Dos familias de ícono, a propósito.** Los de amenidades son objetos (auto, cámara, árbol). Los cinco de la banda del hero son marcas de planta: el perímetro de la manzana con el corte de 30 grados, las seis huellas, el lote acotado, la planta con ambientes y las copas de arbolado. Si se mezclan, la banda se lee como una repetición de la grilla de amenidades.
- **Las cifras de la banda del hero vienen del material comercial y no cierran con la ficha técnica.** Están puestas tal cual las entregó el desarrollo, pero hay tres diferencias anotadas abajo, en "Datos que no cierran entre sí". Antes de publicar en otros canales conviene unificar.
- **`prefers-reduced-motion`** desactiva barridos, contadores y desplazamientos. Todo el contenido queda accesible.
- **Tipografía:** Host Grotesk desde Google Fonts, la misma del manual de marca.

## Lo que falta para que las galerías llenen el teléfono

Los dieciocho renders vienen apaisados: dieciséis en 1672 por 941 y dos en 1536
por 1024. Esa forma llena bien una pantalla de escritorio y no llena una de
teléfono: para cubrir 375 por 812 habría que recortar hasta dejar a la vista un
26 por ciento del ancho. Hoy en el teléfono la imagen entra entera y ocupa 211
píxeles de alto, que es poco para un render.

Para que las dos galerías vayan de borde a borde también en el teléfono hace
falta un recorte vertical de cada render, encuadrado por quien hizo la imagen y
no por un recorte automático al centro:

```
1200 x 2000 px   (3:5)   JPEG calidad alta, sRGB
nombre-v.jpg             la misma base, con el sufijo -v
```

Con esos dieciocho archivos las galerías pasan a pantalla completa en el teléfono
agregando una `<source media="(max-width: 760px)">` por imagen. Mientras tanto
queda el modo que no recorta, que muestra el render completo.

Si 3:5 resulta demasiado alto para la composición, 4:5 (1200 por 1500) también
sirve y deja algo de fondo arriba y abajo.

Los nombres son los de `img/`: los seis `ext-` de la galería del barrio y los
doce `casa-` de la galería de la casa.

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
3. Logotipos de GRAB y Autónomo. El de Calsina ya está, en PNG; en vectorial sería mejor.
4. Fiduciaria o escribanía interviniente, plazo de obra, fecha de entrega y permisos.
5. Identificador de Google Tag Manager o GA4 para activar la medición.
6. Endpoint de CRM y texto legal de tratamiento de datos en el formulario.
7. Números de WhatsApp diferenciados de GRAB y de Calsina, si se quieren botones separados.

El predio está en **-31.285555, -64.288894** y el enlace a Google Maps apunta
ahí en forma directa, sin pasar por un acortador.

Los que tienen lugar en la página están marcados en `_cuerpo.html` con
`class="pendiente"`, cinco etiquetas en total. Al completar uno, se borra la
etiqueta.

El punto 4 ya no tiene dónde marcarse: el bloque con las condiciones de reserva
se quitó a pedido del desarrollo. Si esos datos llegan, hay que volver a abrir un
lugar para ellos, porque hoy la página no dice nada de fiduciaria, plazo de obra
ni permisos.

Los tiempos al golf, al centro, al aeropuerto y a Córdoba capital los entregó el
desarrollo y están puestos tal cual. No salen de una medición propia ni de la
planimetría.

La URL del sitio publicado es https://brayanparragrimaldo-byte.github.io/Neibor/ y ya está puesta en las etiquetas Open Graph. Si el repositorio cambia de nombre o de dueño, hay que actualizarlas en el `<head>` de `index.html`.
