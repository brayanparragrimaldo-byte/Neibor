# Cambios aplicados desde "Mock up web - v1"

Presentación de 9 diapositivas con las correcciones del desarrollo. Esto es lo que se incorporó y lo que quedó pendiente.

## Datos nuevos que entraron al sitio

**Las seis casas.** La planilla de la diapositiva 8 reemplazó todos los campos que estaban marcados como pendientes. Las unidades no se numeran: se identifican por letra, y en orden deletrean el nombre del barrio.

| Casa | Orientación del fondo | Terreno propio | Cubierta | Semicubierta | Total |
|---|---|---|---|---|---|
| N | Noreste | 711 m² | 161 m² | 67 m² | 228 m² |
| E | Este | 557 m² | 161 m² | 67 m² | 228 m² |
| I | Este | 550 m² | 172 m² | 69 m² | 241 m² |
| B | Sudeste | 502 m² | 158 m² | 66 m² | 224 m² |
| O | Noroeste | 595 m² | 161 m² | 67 m² | 228 m² |
| R | Noroeste | 790 m² | 170 m² | 66 m² | 236 m² |

Suman 3.705 m² de lotes privados, 983 m² cubiertos y 1.385 m² totales.

> Estas superficies reemplazan a las de la presentación. Ante la diferencia
> entre la planilla del mock up y los planos por casa, el desarrollo confirmó
> que valen los planos.

**Programa de la casa.** Cochera doble, dormitorio principal con vestidor y baño en suite, dos dormitorios secundarios, dos baños y un toilette, cocina comedor y living integrados, lavadero con tender, galería con asador, espacio de guardado, calefacción central y aberturas de vidrio doble.

**Memoria técnica completa.** Fundación, estructura, terminaciones exteriores e interiores, equipamiento sanitario, instalaciones sanitaria y eléctrica, carpintería de aluminio, equipamiento fijo y climatización. Se abre en una ventana sobre la página, desde la ficha de cada casa.

**Prestaciones del barrio.** Las diez de la captura: estacionamiento de cortesía, parquización, seguridad y cámaras, control de acceso inteligente, servicios subterráneos, expensas eficientes, ubicación, casas de una planta, patios propios y dos ingresos.

**Las tres firmas.** GRAB desarrolla y comercializa, Autónomo hace el proyecto, Calsina Hnos. comercializa.

## Cambios de estructura

1. **Hero.** Pasó a la axonométrica del sector a sangre, con la manzana en color sobre las vecinas en volumen blanco, y el titular "Menos casas. Más comunidad." en peso liviano. Como la imagen es clara, todo el hero se invirtió: tipografía y logotipo en tinta, veladuras claras, y una cabecera que arranca oscura y se vuelve papel al pegarse. En móvil se sirve un recorte vertical centrado en la manzana.
2. **Nueva sección .01, el proyecto en números.** Tres cifras grandes con el criterio de la captura de referencia, más enlace a Google Maps.
3. **Nueva sección .07, lo que trae el barrio.** Grilla de íconos de línea dibujados a medida, sin imagen.
4. **Nueva galería a pantalla completa.** Seis ambientes, avance manual con flechas o deslizando, avance automático cada cinco segundos con barra de progreso, y pausa cuando el usuario interviene o la galería sale de pantalla.
5. **Selector de las seis casas.** Las chinchetas muestran la letra en lugar del número y se agregó el conmutador Plano / Axonométrica.
6. **Contacto.** Se quitó el teléfono a la vista y el QR. Queda el WhatsApp flotante, según lo acordado.
7. **Medición.** Cada click de WhatsApp, el enlace al mapa y el envío del formulario empujan un evento a `dataLayer`, listo para conectar a Google Tag Manager, GA4 o Meta sin tocar el código.

## Contradicciones detectadas

1. **La captura de referencia corresponde a otro proyecto.** Sus números (4237 m² de predio, 500 m² de lote, 215 m² de casa, 1000 m² de áreas comunes) no son de Neibor. Se usaron los de Neibor.
2. **El rango de lotes.** La anotación dice "entre 500 y 750 m²", pero la Casa R mide 756 m² según la planilla. Según los planos el rango real es de 502 a 790 m², que es lo que figura en el sitio.
3. **Superficie cubierta.** La referencia decía 215 m² y la anotación la corregía a 225 m². Los planos por casa dan entre 158 y 172 m² cubiertos, y entre 224 y 241 m² sumando la semicubierta. El sitio usa los planos.
4. **Ingresos.** La planimetría mostraba un acceso por Paraguay y las prestaciones hablan de dos ingresos. El texto se corrigió a dos.
5. **Intermediarios.** El texto anterior decía que no había intermediarios entre quien compra y quien construye. Con Calsina comercializando eso dejó de ser cierto y se reescribió.

## Pendiente

1. Valores y forma de pago por casa.
2. Estado de disponibilidad por unidad.
3. Confirmar qué letra corresponde a cada lote sobre el plano. Hoy se dedujo de la orientación de fondo declarada.
4. Logotipos de GRAB, Autónomo y Calsina en vectorial, para reemplazar los tipográficos del banner.
5. Números de WhatsApp diferenciados de GRAB y de Calsina, si más adelante se quieren botones separados.
6. Coordenadas exactas del predio. El enlace a Google Maps hoy abre una búsqueda sobre la esquina de Ecuador y Guido.
7. Fecha de entrega, plazo de obra, fiduciaria o escribanía interviniente.
8. Identificador de Google Tag Manager o GA4 para que los eventos empiecen a registrarse.

---

# Segunda ronda: renders nuevos y reordenado

## Renders

Entraron veinte imágenes nuevas del desarrollo, con su variante móvil: los dos
ingresos al barrio, la fachada frontal y la posterior, la losa sobre la cochera,
el ingreso a la vivienda, el comedor, la cocina, el living, la galería, el
dormitorio principal, el baño y la planta de la casa. Reemplazaron a todo el set
anterior.

**Las piletas que aparecen en los renders son ambientación.** Ninguna casa la
incluye. Se borró toda mención de pileta del sitio.

**Los planos de las seis casas son distintos entre sí.** El botón "Ver el plano
de la casa" abre el de cada unidad.

## Estructura

La página pasó de quince bloques a ocho:

```
Hero → Amenidades → Galería → Las seis casas → El proyecto → Dónde → Quién → Contacto
```

1. **Hero.** Vista aérea del barrio a sangre, con veladuras arriba y abajo para
   que el titular se lea sobre la foto.
2. **Amenidades.** Subió a segundo lugar y se rehizo con la grilla centrada de
   ícono y texto sobre fondo claro: tres columnas en desktop, dos en tablet,
   una en móvil.
3. **Galería.** Subió a tercer lugar, antes del bloque comercial.
4. **Las seis casas.** Cuarto lugar. Abre directamente con el conmutador
   Plano / Axonométrica, el plano con las chinchetas y la ficha por unidad. Se
   quitaron el titular, el párrafo introductorio y la foto de frentes.
5. **El proyecto.** Siete secciones anteriores (las cifras, la manzana, el
   concepto, la banda de la calle interna, la arquitectura, la casa y el fondo)
   se fundieron en una sola. Entra a sangre con la placa de marca, sigue con la
   bajada y las cifras, y desarrolla diez puntos en una secuencia anclada al
   scroll: la foto queda fija y cambia con el punto que se está leyendo. Cierra
   con la planta y el programa de la casa.

Se eliminó la bisagra que separaba el proyecto de la parte comercial y se
quitaron los índices numerados de sección.

## Cómo funciona la secuencia anclada

Gana el punto cuyo centro queda más cerca de la línea de lectura. La línea se
calcula desde la posición fija de la foto: en dos columnas es su centro
vertical, y apilada en móvil cae por debajo de la foto. Se mide cuadro a cuadro
y sólo mientras la secuencia está en pantalla, así no saltea puntos ni queda
colgada al entrar o salir de un salto.

Para agregar o sacar un punto hay que tocar dos lugares de `_cuerpo.html` y
mantenerlos en el mismo orden: el `<img data-arq="N">` dentro de `.arq__marco`
y el `<li data-arq-item="N">` dentro de `.arq__lista`. El resto se acomoda solo.

## Ficha técnica dentro del detalle de la casa

La memoria descriptiva pasó de "El proyecto" a la sección de las seis casas,
que es donde se toma la decisión de compra, y se abre en una ventana sobre la
página en lugar de quedar desplegada dentro de ella.

Se dispara desde la fila "Ficha técnica" de la tabla de la unidad. La ventana
usa el elemento `dialog` del navegador, así que trae gratis el velo, la
retención del foco y el cierre con escape. También cierra con el botón de la
esquina y con un clic sobre el velo, y al cerrarse devuelve el foco a la fila
desde donde se abrió.

La esquina superior izquierda baja a 30 grados, la misma arista del isotipo que
usa la placa de marca. En teléfono ocupa la pantalla entera.

No se bloquea el scroll de fondo con `overflow:hidden` porque eso corría la
página quince píxeles cada vez que se abría. En su lugar, la rueda y el
deslizamiento sobre el velo se frenan en el propio evento.

Es una sola memoria para las seis casas, porque el material entregado no
distingue especificaciones por unidad. Lo aclara una nota al pie de la ventana.
Si más adelante alguna casa cambia de terminación, hay que separar el contenido
por unidad y alimentarlo desde el array `CASAS`.

## Visor de planos

El botón "Ver el plano de la casa" abría el JPG en otra pestaña. Ahora abre una
ventana con el mismo tratamiento que la ficha técnica.

Adentro, el plano de la casa elegida queda pegado a la izquierda, con su
epígrafe, el enlace para abrirlo en tamaño completo y las cuatro superficies de
esa unidad. A la derecha pasa una tira de trece miniaturas: el propio plano, la
planta ambientada, la implantación de la manzana, la axonométrica y nueve
renders de la casa terminada. Al tocar una, la imagen pasa al marco grande.

El visor sigue a la casa elegida: cambian el rótulo, el plano, la miniatura del
plano y las superficies. Cada vez que la ventana se abre vuelve al plano de la
casa, para que nunca arranque mostrando un render suelto.

Una nota dentro de la ventana aclara que el plano es el de esa casa y que las
demás imágenes son del proyecto, que es el mismo para las seis unidades. El
material entregado no distingue renders por unidad y no se inventó ninguno.

Las dos ventanas comparten la misma función `ventana()` en `js/site.js`: velo,
retención del foco, cierre con escape, con el botón, con un clic afuera, vuelta
del foco al disparador y freno de la rueda sobre el velo.

## Optimización de carga

**AVIF con respaldo JPEG.** Las cincuenta y cuatro imágenes del sitio se
reconvirtieron a AVIF. El mismo juego de fotos pasó de 11,6 MB a 4,65 MB, un
60 por ciento menos, sin diferencia visible. Cada `<img>` quedó dentro de un
`<picture>` que ofrece primero el AVIF y deja el JPEG para los navegadores
viejos, así que cada visitante baja un solo archivo.

**Cada hueco recibe el tamaño que le corresponde.** La secuencia anclada usa la
versión de 1000 px, porque su marco nunca pasa de 670. Las miniaturas de la
ventana de planos usan una nueva de 560 px. El visor grande usa la de 1000 en
lugar del original, y el enlace "abrir en tamaño completo" sigue dando el
archivo entero.

**Primera pantalla.** El hero arranca con `fetchpriority="high"`, sin carga
diferida y con dos `preload` en el `<head>`, uno para móvil y otro para
escritorio. Todo lo demás es diferido. La primera carga quedó en 435 KB en
escritorio y 189 KB en teléfono, hoja de estilos y JavaScript incluidos.

**Las miniaturas de la ventana** viven dentro de un `dialog` cerrado, donde la
carga diferida del navegador no llega a dispararse. Se sueltan la primera vez
que la ventana se abre.

**Limpieza.** Se borraron las veintiséis imágenes del set anterior que ya no
usaba nadie, unos 9,6 MB, y la imagen de Open Graph, que todavía apuntaba al
hero viejo, pasó a la aérea actual.

## Botones en la ficha y red para las imágenes

**Las filas Plano y Ficha técnica** tenían texto subrayado. Pasaron a botones de
contorno, del mismo nivel secundario que el resto del sistema, con la flecha y
el radio de siempre, en una medida ajustada a la altura de una fila de tabla.
Siguen siendo dos niveles de botón: sólido para la conversión, contorno para
todo lo demás.

**Red de seguridad de las imágenes.** Dentro de un `<picture>`, si la fuente
elegida no llega el navegador no prueba con la siguiente: deja el hueco vacío
para siempre. Eso explica los dos huecos que aparecieron durante el despliegue,
cuando el HTML nuevo ya estaba publicado y algunos AVIF todavía no habían
llegado a todos los servidores. Ahora el JavaScript escucha el error en captura,
tira las `<source>` y vuelve a pedir el JPEG del propio `<img>`, así que basta
con que quede un formato en pie para que la imagen aparezca.

## Planos nuevos, aérea en el concepto y proyecto plegable

**Los seis planos se rehicieron desde los PDF del desarrollo.** Los anteriores
eran una versión chica y sin rótulos. Los nuevos van a 3000 px y traen el
nombre y la medida de cada ambiente: dormitorios, vestidor, baños, quincho,
cocina, estar comedor, ingreso, servicio y estacionamiento. En el visor se
sirve la versión de 1600 px y el enlace de tamaño completo da el original.

Los PDF venían de canto, con un `/Rotate` que dejaba el dibujo y la leyenda
vertical, y con márgenes blancos grandes. Se enderezaron y se recortaron al
contenido.

**Las superficies de los seis planos coinciden una por una** con las que ya
tenía el sitio: 711, 557, 550, 502, 595 y 790 m² de terreno. No hubo nada que
corregir.

Los planos rotulan las unidades **N1 a N6** mientras el sitio las identifica por
letra. La correspondencia es O=N1, R=N2, B=N3, I=N4, E=N5, N=N6. Queda anotada
en `js/site.js` por si más adelante se unifica el criterio.

**La banda del concepto** pasó de la calle interna a la vista aérea del barrio,
encuadrada sobre las casas.

**El detalle del proyecto se pliega.** La sección muestra la aérea, la bajada y
las tres cifras, y el resto se abre con un botón. Cerrada mide 1382 px en
escritorio contra los 5406 de antes, así que quien no quiere el detalle llega
a la ubicación cuatro pantallas antes. Al abrirla, la secuencia anclada sigue
recorriendo sus diez puntos en orden.

## Las chinchetas abren la ventana, y el naranja para abrir material

**Tocar una chincheta sobre el plano** ahora hace dos cosas: cambia la ficha de
la casa y abre la ventana con su plano, sus superficies y los renders. Al
cerrarla el foco vuelve a la chincheta que se tocó. En teléfono el área táctil
crece a 46 px sin que cambie el dibujo.

Las seis letras de abajo siguen cambiando sólo la ficha. Así queda una forma de
comparar superficies entre casas sin abrir y cerrar la ventana cada vez.

**Los botones Ver el plano y Ver la ficha técnica pasan al naranja de marca.**
En contorno no se leían como pulsables. El relleno usa el `#af5d00` del
brandbook con texto blanco puro, que da 4.79:1 de contraste y pasa AA; con el
papel de marca habría dado 4.28 y no llegaba, y por eso el texto es blanco y no
color papel.

Esto agrega un tercer papel al sistema de botones, que antes tenía dos. Quedan
así, uno por intención: sólido tinta para convertir, naranja para abrir
material, contorno para navegar. Las chinchetas se tiñen del mismo naranja al
pasar por encima, para que se lea que abren lo mismo que el botón.
