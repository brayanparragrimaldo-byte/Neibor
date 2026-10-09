# Neibor · Seis Casas

Landing de conversión del proyecto Neibor, seis casas sobre una manzana de Villa Allende Golf, Córdoba, Argentina. Desarrolla GRAB.

Sitio estático, sin dependencias ni proceso de build. Se sirve tal cual desde GitHub Pages o desde cualquier hosting.

**El sitio vive en Cloudflare, en `neiborcasas.com`**, y se actualiza solo con
cada push a `main`: el panel corre `npx wrangler deploy`.

Los dos nombres, el de raiz y el `www`, estan atados al Worker desde las `routes`
de `wrangler.jsonc`, con `custom_domain`. Cloudflare crea el registro DNS y el
certificado solo, asi que el dominio no se toca por el panel: se toca ese archivo.

Al poner `routes`, wrangler apaga la direccion `workers.dev`, que ahora devuelve
404. No hace falta para nada y es una direccion duplicada menos. La regla de
`noindex` de `_headers` sigue apuntando ahi por si alguna vez se vuelve a
encender.

Es un Worker de assets sin código de servidor: `wrangler.jsonc` no lleva `main`,
sólo la carpeta, que es la raíz del repo. `.assetsignore` deja afuera las fuentes
y estas notas. `_headers` pone la caché y un `noindex` sobre `workers.dev`, para
que esa dirección provisoria no se indexe: hoy el sitio **no aparece en Google a
propósito**, y eso se levanta el día que haya dominio.

El repo pasó a privado, así que GitHub Pages dejó de servirlo. Cloudflare sigue
igual, porque su acceso al repo va por la app de GitHub y no depende de que sea
público.

La dirección está escrita en tres líneas del `<head>`, `canonical`, `og:url` y
`og:image`, mas el pie de la pagina y `robots.txt`/`sitemap.xml`. El `noindex` de
`_headers` apunta solo a `workers.dev`, asi que el dominio si se indexa.

La cache de las imagenes esta en una hora a proposito, porque los archivos se
siguen pisando con el mismo nombre. Cuando el sitio quede quieto conviene subirla
a 30 dias en `_headers`: la carpeta `img` pesa 30 MB.

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

## Las nueve secciones

```
Hero → Galería: el barrio → Atributos principales → Galería: la casa
     → Atributos de cada casa → Las seis casas → Dónde → Quién → Contacto
```

Dos galerías, no una, y separadas a propósito por los atributos: la primera
muestra lo que se ve llegando (los dos ingresos, la calle interna, el frente de
la manzana) y la segunda lo que se ve adentro de una casa. Entre las dos queda
la lista de atributos, que es la que explica en palabras lo que las imágenes
muestran sin texto. Después de la galería de la casa viene la lista de lo que
tiene cada casa, y recién ahí el plano con las superficies por unidad. De ahí la
ubicación, quién lo hace y el contacto. El relato largo del proyecto, que ocupaba una
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

3. **La red que atrapaba ese error llegaba tarde para las tres imágenes que
   más se ven.** Estaba en `js/site.js`, que va al final del `<body>`. La del
   hero y la primera de cada galería no esperan: cargan mientras se lee el
   documento y fallan antes de que ese script exista, así que nadie las
   rescataba. Las de más abajo sí, porque fallan después. Por eso el síntoma
   era "no se ven las imágenes" y no "falta una imagen": faltaban justo la
   portada y la primera de cada tira.

La red está ahora en un `<script>` dentro del `<head>` de `index.html`, antes de
que empiece a cargar nada, y hace tres cosas: escucha el error en captura, barre
todas las imágenes al terminar de leer el documento y vuelve a barrer al
terminar de cargar. Comprobado rompiendo a propósito los tres AVIF que no
esperan: con la red al pie quedaban dos huecos, con la red en el `<head>` no
queda ninguno.

Como `build.py` conserva el `<head>` tal cual, ese script sobrevive a cada
reconstrucción. Si se toca, hay que tocarlo en `index.html`.

Y desde ahora las imágenes nuevas se comprueban una por una en un motor que no
sea el de Apple antes de publicarlas: ver "Las imágenes".

## La página de revisión

`diagnostico.html` prueba, una por una, todas las imágenes del sitio en el
navegador donde se abra, y dice cuáles fallan y por qué: si no están en el
servidor (página vieja en caché) o si llegan enteras y el decodificador las
rechaza (archivo defectuoso). Trae un botón que copia el informe.

```
https://brayanparragrimaldo-byte.github.io/Neibor/diagnostico.html
```

Lleva `noindex` y no está enlazada desde ningún lado. Es una herramienta de
trabajo, no parte del sitio.

## Dónde se cambia cada cosa

**Las seis casas.** Array `CASAS` al inicio de `js/site.js`. Cada entrada tiene `x` e `y` en porcentaje sobre `img/implantacion-aerea.jpg`, más el tipo, la orientación del fondo, el terreno propio, la superficie cubierta y el estado. Las posiciones las dio el desarrollo sobre esta aérea: de izquierda a derecha, N, E, I, B en las cuatro casas de arriba de la calle interna y O, R en las dos de abajo. Si se cambia la imagen, hay que recalcular los seis porcentajes. Para agregar un dato, sumar la clave al objeto y la fila correspondiente en `_cuerpo.html`. `tipo` agrupa las casas por tipología, `neib` u `or`. La ventana lleva tres láminas: el plano de la unidad, `img/plano-casa-<letra>.jpg`, y la planta y la axonométrica de su tipología, `img/tipo-<tipo>-planta.jpg` e `img/tipo-<tipo>-axo.jpg`. Cada una con sus `-m` y `-t`.

**Las chinchetas del plano abren la ventana.** Además de cambiar la ficha, una chincheta abre el visor de planos con el material de esa casa, y al cerrarlo el foco vuelve a la chincheta. Las letras de abajo sólo cambian la ficha, para poder comparar superficies sin abrir y cerrar. El disparador de la ventana se pasa como argumento a `abrir()`, que es de donde sale la vuelta del foco.

**El visor de la casa.** La ventana `#planos`, en la sección de las casas. Lleva tres láminas y nada más: el plano de la unidad, la planta y la axonométrica de la tipología. Las tres las arma el JavaScript con cada casa a partir del array `LAMINAS`, así que las miniaturas de `_cuerpo.html` no se editan a mano: hay que tocar `LAMINAS`, que es de donde salen la clave del archivo, el epígrafe y el texto alternativo. La entrada con `porCasa: true` es la que va por unidad y no por tipología.

**El tamaño completo se abre adentro de la página.** Tocando el marco grande o el botón del pie, la imagen pasa a la ventana `#v-foto`, la misma de las galerías, con la clase `foto--sola`: sin flechas ni contador, porque no hay a dónde ir. Un toque más y la imagen pasa a su medida real con `foto--lupa` y la ventana se recorre. Antes el pie era un enlace con `target="_blank"` que sacaba al visitante a una pestaña con un JPEG suelto.

Los seis planos salen de los PDF del desarrollo con `qlmanage`, no con `sips`: `sips` ignora el `/Rotate` de la página y devuelve tres de los seis cabeza abajo y los seis recortados por el borde. La leyenda de superficies, que va en una columna de texto vertical sobre el margen derecho, se recorta midiendo la tinta por columna y descartando la banda fina.

Dentro de un `<picture>` el `<source>` gana sobre el `src` del `<img>`, así que al cambiar de casa hay que cambiar los dos. Si se cambia sólo el `src`, la miniatura se queda mostrando la tipología anterior.

**La ficha técnica.** Es una sola, común a las seis casas, en la ventana `#ficha-tecnica` de la sección de las casas. La abre el botón `#abrir-ficha-tecnica` de la tabla de la unidad. Está hecha con `dialog` y `showModal()`, de donde salen el velo, la retención del foco y el cierre con escape. Si alguna casa pasa a tener especificaciones propias, hay que partir el contenido por unidad y alimentarlo desde `CASAS`.

**WhatsApp.** Cada CTA lleva su propio mensaje en el atributo `data-wa`, así el asesor sabe desde qué sección escribieron. Un botón va a un número fijo poniéndolo en `data-wa-num`: eso hacen los cuatro con nombre propio, los dos de Respaldo y los dos de Contacto, porque ahí la persona ya eligió a quién le escribe. Los tres sin ese atributo (Consultar, Pedir valores y el del formulario) van al que toque por reparto.

**Reparto de consultas.** Mitad y mitad entre GRAB (+54 9 351 757 0326) y Calsina (+54 9 351 864 4742). El turno lo lleva `worker/index.js`, un Durable Object con almacenamiento SQLite, que entra en el plan gratuito de Workers. Atiende de a una consulta por vez, así que la alternancia es exacta: probado con treinta pedidos en paralelo, quince y quince.

Un contador en el navegador no servía. La mayoría de las visitas hace un solo clic, así que el primer turno de cada visitante nuevo habría sido siempre el mismo y una de las dos empresas se llevaba casi todo.

Tres decisiones que conviene no deshacer sin pensarlas:

- **Se reparte por visitante, no por clic.** Si rotara en cada botón, una misma persona caería en las dos empresas y las dos la llamarían por la misma consulta. La asignación se guarda en `localStorage` bajo `neibor.reparto` y dura 30 días, de modo que quien vuelve cae con el vendedor que ya lo venía atendiendo.
- **El turno se pide en el primer gesto, no al cargar la página.** El que entra y se va sin tocar nada no gasta un turno, y la cuenta sigue a las consultas de verdad. Los gestos escuchados corren antes del clic, así que para cuando alguien aprieta un botón el enlace ya es el que corresponde. Para el caso raro del que toca un botón como primera acción, la página sortea localmente mientras espera.
- **El endpoint es POST.** Por GET responde 404, para que ningún buscador ni precarga del navegador gaste turnos con solo mirar.

Para cambiar el reparto se edita la lista `RUEDA` en `worker/index.js` y nada más. Con dos entradas da mitad y mitad; siete de GRAB y tres de Calsina sería una lista de diez.

**El conteo.** `GET /api/reparto?clave=...` devuelve cuántas le tocaron a cada una. Está cerrado hasta que en el panel de Cloudflare se cargue la variable `CLAVE_REPARTO`: mientras no exista, esa dirección responde 404.

**Si el contador falla,** la página sortea localmente y el botón funciona igual. El sitio son archivos y Cloudflare los sirve antes de llegar al código, así que una falla del Worker no se lleva puesta la página.

**Formulario.** Hoy arma el mensaje y abre WhatsApp, con el número que le tocó a ese visitante. Para conectar un CRM, reemplazar el cuerpo del `submit` por el `fetch` al endpoint y dejar WhatsApp como alternativa.

**El correo está dado de baja.** Había un botón "Enviar por correo" y la dirección `info@grab.com` en la lista de contacto. Ese dominio no es del desarrollo: pertenece a una empresa internacional sin relación y tiene correo activo en Google, así que cada consulta le dejaba el nombre y el teléfono de la persona a una casilla ajena. Vuelve cuando haya una dirección propia confirmada, idealmente en `neiborcasas.com`, que de paso resolvería el SPF y el DMARC que hoy faltan.

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
aparecen: la cabecera a 120 y el pie a 300. Los de Calsina y Autónomo van a 207
de alto (640 y 504 de ancho) y sólo en PNG: `sips` les tira el canal alfa al
pasarlos a AVIF y los deja con fondo blanco, que sobre la salvia de esa sección
sería un recuadro. Los dos se recortan al ras de la tinta: la ranura de
`.marca__firma` manda la altura y así los dos quedan del mismo tamaño óptico.
El de Autónomo llegó ya con transparencia, así que no hizo falta pasarlo por
`fondo-a-alfa.py`.

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

### La regla de las medidas pares

**Arriba de unos 1000 píxeles, `sips` saca un AVIF vacío si alguna de las dos
medidas es impar.** El archivo pesa lo que tiene que pesar, declara su ancho y su
alto en la cabecera y adentro no trae imagen. El navegador dispara `load`,
`naturalWidth` da el número correcto, y en pantalla no se ve nada. El
decodificador de Apple lo abre igual, así que en Safari no se nota.

Esto tuvo la página con el hero y las dos galerías en blanco durante un día
entero en Chrome, Firefox y Edge.

La regla, entonces:

```
hasta 1000 px de ancho   cualquier medida sirve
arriba de 1000 px        ancho y alto tienen que ser pares
```

`sips -Z 1600` sobre un original de 1672 x 941 da 1600 x 900 y está bien. Sobre
uno de 1671 x 941 da 1600 x 901 y sale vacío. Cuando la cuenta no cierra, se
fuerzan las dos medidas:

```bash
sips -s format avif -s formatOptions 48 --resampleHeightWidth 900 1600 foto.png --out foto.avif
```

### Comprobar que una imagen trae imagen

**No alcanza con que el archivo abra.** Hay que dibujarlo y mirar si salió algo.
Con el sitio servido en local, en la consola del navegador:

```js
var urls = [...document.querySelectorAll('img')].map(i => i.currentSrc);
await Promise.all(urls.map(u => new Promise(ok => {
  var i = new Image();
  i.onload = () => {
    var c = document.createElement('canvas'); c.width = c.height = 16;
    var x = c.getContext('2d'); x.drawImage(i, 0, 0, 16, 16);
    var d = x.getImageData(0, 0, 16, 16).data;
    for (var p = 3; p < d.length; p += 4) if (d[p] > 10) return ok(null);
    ok(u + ' VACIA');
  };
  i.onerror = () => ok(u + ' no abre');
  i.src = u;
}))).then(x => console.log(x.filter(Boolean)));
```

Lista vacía, está bien. Lo que aparezca hay que volver a generarlo con las dos
medidas pares. `diagnostico.html` hace esta misma prueba sobre todos los
archivos del sitio.

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

- **Ninguna imagen cuelga de una cadena de alturas en porcentaje.** El hero y las
  diapositivas de galería estiran la foto con `position:absolute; inset:0`, no con
  `height:100%`. Un porcentaje de alto necesita que el padre tenga una altura ya
  resuelta, y si no la tiene la imagen carga bien y se dibuja con cero de alto, que
  no deja rastro en ningún lado. En la galería la cadena además pasaba por un
  `<button>`, que no siempre le pasa su altura a lo de adentro.
- **Cada medida en `svh` lleva delante la misma medida en `vh`.** La unidad `svh`
  existe desde Chrome 108, de fines de 2022; un navegador que no la entiende
  descarta la declaración entera y la sección se queda sin alto. Son trece. Si se
  agrega una nueva, hay que agregarle el respaldo.
- **La aérea de "Las seis" va recortada al predio.** El render original trae el
  predio ocupando el 69 % del ancho y el 61 % del alto, con el barrio alrededor.
  Con ese encuadre, en un teléfono las seis chinchetas quedan a 27 px una de otra
  y se pisan, porque miden 30. El recorte publicado es de 1240 x 670 tomado en
  225, 185 sobre el render de 1672 x 941, y deja 36 px de separación mínima. Si
  se vuelve al encuadre entero, hay que achicar las chinchetas o se superponen.
- **El ángulo de 30 grados** de los recortes de imagen sale de la arista del isotipo, que sale de la forma del lote. Si se cambia, se pierde la relación con la marca. Las clases `corte-ti` y `corte-td` traen el polígono ya calculado para cada relación de aspecto.
- **Tres papeles de botón, uno por intención.** Sólido tinta para convertir (pedir valores, agendar visita), naranja `btn--acento` para abrir material (el plano, la ficha técnica), contorno para navegar. `btn--chico` es una medida, no un papel.
- **El naranja de marca sólo va con texto blanco.** Sobre `#af5d00` el blanco puro da 4.79:1 y pasa AA; el papel de marca daría 4.28 y no llegaría. En texto suelto sobre papel el naranja sigue reservado para titulares grandes, la chincheta activa y las etiquetas de pendiente.
- **Si una imagen no llega, hay red.** Dentro de un `<picture>`, cuando la fuente elegida falla el navegador no prueba con la siguiente: deja el hueco vacío. El JavaScript escucha el error en captura, tira las `<source>` y vuelve a pedir el JPEG del propio `<img>`.
- **Las dos listas de atributos usan la misma grilla.** La del barrio lleva
  bajada debajo del título y la de cada casa no, porque ahí los atributos son
  etiquetas y no conceptos que haya que explicar. Esa diferencia la cubre
  `.amen--solo`, que achica el aire entre filas y le da al título la medida donde
  cortar que antes le daba el párrafo. Las dos tienen diez atributos, así que la
  regla que centra los dos últimos en la tercera fila sirve para las dos.
- **Los atributos van en cuatro columnas y la última fila se centra.** Son diez, así que sobran dos en la tercera fila: las reglas `.amen > li:nth-child(9)` y `:nth-child(10)` los corren a las columnas del medio. Si cambia la cantidad de atributos, hay que revisarlas.
- **Los números de la página se tratan igual en los dos lugares donde hay.** Los metros de la banda del hero y los minutos de la ubicación comparten el mismo dibujo: cifra en peso liviano con el interletrado cerrado, unidad chica al lado en peso medio. Es lo que hace que las dos listas se lean como parientes y no como dos tablas sueltas.
- **Las galerías recortan en el escritorio y no recortan en el teléfono.** Los dieciocho renders son apaisados, de 16:9 (salvo la cocina y la galería desde el jardín, de 3:2). Llenando una pantalla de teléfono parada quedaría a la vista poco más de la cuarta parte del ancho, y una cocina deja de parecer una cocina. Abajo de 760 píxeles la imagen entra entera, de borde a borde, y el fondo oscuro de arriba y abajo recibe el pie y los controles. Con recortes verticales del mismo render esto se puede dar vuelta: ver "Lo que falta para que la galería llene el teléfono".
- **"Quién lo hace" va sobre salvia y es la única sección en ese tono.** Es el escalón entre el papel de las dos secciones de arriba y la tinta del contacto, y de paso las separa sin necesidad de un filete. Ahí el naranja del pendiente baja a `#7a4100`, porque el de texto habitual da 3,76:1 sobre salvia y no llega al mínimo.
- **Las tres firmas comparten alto de ranura, haya logotipo o no.** `.marca__firma` fija la altura y adentro va el logotipo o el nombre compuesto. Mientras falte el de GRAB, la fila no se desarma. Cuando llegue, se reemplaza el `<p class="marca__nombre">` por un `<img>` y no hay que tocar nada más: es exactamente lo que se hizo al llegar el de Autónomo.
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
| Superficie del lote | entre 500 y 750 m² | 500, 515, 525, 544, 660 y 756 m² |
| Superficie de la casa | 225 m², rotulado "superficie total" | 225 m², rotulado "superficie cubierta" |
| Superficie del predio | 4.237 m² | los seis lotes suman 3.500 m², y con los 1.000 de áreas comunes dan 4.500 |

El desarrollo mandó la planilla nueva el 01/10 y las tres quedaron más cerca. La
del lote casi cierra: cinco entran entre 500 y 750 y el más grande mide 756, seis
metros arriba del techo declarado. La del predio bajó la diferencia de 468 a 263
metros. La de la casa es la que hay que mirar: el número es el mismo en los dos
lados, pero el hero lo llama superficie total y la ficha lo llama cubierta, que
no son lo mismo. Uno de los dos rótulos está mal.

**Y ahora hay una diferencia dentro de la propia página.** La banda del hero dice
"entre 500 y 750 m²" y el atributo "Patios propios extensos", en los atributos
del barrio, dice "entre 502 y 790 m² de terreno por casa", que es lo que sale de
la ficha. Dos frases de la misma página que no dicen lo mismo es peor que una
diferencia con un documento interno: la ve cualquiera que lea las dos secciones.
Hay que decidir cuál vale y dejar esa sola.

## Pendiente antes de considerarla terminada

El detalle completo, con lo que entró desde el mock up y lo que sigue faltando, está en `CAMBIOS-MOCKUP-V1.md`.

**Ninguno de estos se avisa ya en la página.** Los tres carteles de "Pendiente"
que quedaban salieron a pedido del desarrollo, así que esta lista es el único
lugar donde se siguen. En corto:

1. Valores, forma de pago y disponibilidad por casa. Es el único que bloquea la venta.
2. Logotipo de GRAB. Los de Calsina y Autónomo ya están, los dos en PNG; en vectorial sería mejor.
3. Fiduciaria o escribanía interviniente, plazo de obra, fecha de entrega y permisos.
4. Identificador de Google Tag Manager o GA4 para activar la medición.
5. Endpoint de CRM y texto legal de tratamiento de datos en el formulario.

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
