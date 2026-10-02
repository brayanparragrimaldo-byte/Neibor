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

1. **Hero.** Vista aérea apaisada del barrio a sangre, con veladuras arriba y
   abajo para que el titular se lea sobre la foto, y la banda de cifras del
   predio abajo.
2. **Atributos principales.** Subió a segundo lugar y se rehizo con la grilla
   centrada de ícono y texto sobre fondo claro: cuatro columnas en desktop,
   tres y dos al bajar, una en móvil.
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

## El hero pasa a la aérea apaisada y la banda se vuelve ficha

**La foto.** Entró `AEREA - SLIDE 01 APAISADA`, de 1672 por 941, en lugar de la
aérea cuadrada. En móvil no se sirve la misma apaisada reducida, porque recortada
a vertical dejaría las casas fuera de cuadro: va un recorte propio de 760 por 941
sacado del original a resolución plena y centrado en la manzana, así el teléfono
ve las sierras arriba y las casas abajo. Los dos `preload` del `<head>` y la
imagen de Open Graph apuntan a la nueva, que además es 16:9 y encaja mejor en las
tarjetas sociales que la anterior.

La aérea vieja sigue en el repositorio porque la usa la banda de "El barrio del
futuro se parece al de antes", dentro de la secuencia del proyecto.

**El titular.** "Menos casas. Más comunidad." pasó a "El valor de estar cerca."
y el apunte de la derecha, que decía "Seis casas / Una manzana", quedó en
"6 casas". Como el titular bajó a un solo renglón, los dos se colocaron
explícitamente en la misma fila de la grilla para que compartan línea de base;
antes el apunte caía en una fila implícita debajo.

**La cabecera.** Se quitó el botón "Ver las seis casas" de arriba. Queda un solo
botón, el que convierte, y la misma acción sigue disponible en la banda del hero
y en el menú, en "Las seis".

**La banda.** La frase única dejó lugar a las cinco cifras del predio: 4.237 m²
de predio verde, 6 casas, 500 m² de lote, 215 m² por casa y 1.000 m² de áreas
comunes. Cada una lleva un ícono propio, la cifra en peso liviano y el rótulo en
versalitas; las tres del medio suman una línea de apoyo y las dos de los extremos
quedan sin ella, que es lo que evita que las cinco celdas se lean iguales.

Cinco columnas con filete entre medio en desktop, tres y dos en tablet, y lista
con filete arriba en teléfono. Los botones cierran la banda sobre una línea, en
vez de competir con las cifras por el mismo renglón. La banda pasó de 164 a 284
píxeles de alto en desktop, que es el costo de llevar cinco datos donde había una
oración.

**Los íconos.** Son cinco nuevos y forman una familia aparte de la de amenidades.
Aquellos son objetos; estos son marcas de planta, que es como el proyecto se
dibuja a sí mismo: el perímetro de la manzana con el corte de 30 grados de la
marca y las copas adentro, las seis huellas de las casas, el lote con la huella y
su acotación, la planta con los ambientes, y el arbolado suelto de las áreas
comunes. El primer dibujo de este último, un camino en diagonal entre copas, se
descartó porque a tamaño chico se leía como un signo de porcentaje, y el segundo,
con el camino horizontal, como una cara.

**Las cifras no cierran con la ficha técnica.** El lote de "entre 450 y 550 m²"
contra los 502 a 790 del legajo, los 215 m² por casa contra los 224 a 241, y los
4.237 m² de predio contra los 3.705 que suman los seis lotes. Quedaron los dos
juegos de números donde corresponde, sin corregir ninguno por cuenta propia, y la
diferencia está anotada en el README para que el desarrollo defina cuál vale.

## La banda se queda sin botones y los atributos pasan a cuatro columnas

**Los dos botones de abajo de la banda salieron.** La banda queda en las cinco
cifras y nada más, y con eso vuelve a 185 píxeles de alto en desktop, casi los
164 que medía con la frase única. Conviene saber que la primera pantalla queda
con una sola llamada a la acción, "Consultar" en la cabecera, que es fija y
acompaña todo el scroll. Las otras siguen en su lugar: la ficha de cada casa, el
bloque de ubicación y el formulario de contacto.

**La sección pasó a llamarse "Atributos principales".** Reemplaza al rótulo "Lo
que trae el barrio" más el titular "Todo lo que no se ve desde la vereda", que
eran dos líneas. Quedó un solo `<h2>` con el estilo de título del resto de las
secciones, para no perder jerarquía dentro de la página.

**La grilla pasó de flex a `grid-template-columns: repeat(4, minmax(0,1fr))`.**
Ni el ícono ni el texto cambiaron de medida: lo único que se tocó es la cantidad
de columnas y el gap. Son diez atributos, así que la tercera fila queda con dos
sueltos, y van a las columnas del medio con `grid-column` para que la fila cierre
centrada:

```
cuatro columnas   4 + 4 + 2, los dos últimos en las columnas 2 y 3
tres columnas     3 + 3 + 3 + 1, el último en la columna 2
dos columnas      cinco filas parejas
una columna       uno abajo del otro
```

Si alguna vez se agrega o se saca un atributo hay que revisar esas dos reglas de
`:nth-child`, porque están escritas para diez.

## Fuera la sección "El proyecto"

Se quitó entera a pedido: el titular "El barrio del futuro se parece al de antes",
la secuencia anclada al scroll de diez puntos con sus diez renders, la planta de
la casa y la lista "Qué entra en cada casa". La página pasó de ocho secciones a
siete y de unos 11.500 a 7.782 píxeles de alto en desktop.

Con la sección se fueron también las piezas que existían sólo para ella: el
enlace "El proyecto" del menú, los bloques 4 y 5 del JavaScript (el plegado y el
motor de la secuencia) y veintitrés clases de CSS, entre ellas `.arq`, `.proy`,
`.banda`, `.placa`, `.desplegar`, `.programa` y `.cifras`. Los bloques numerados
de la hoja de estilos quedaron renumerados en orden, porque la quita dejó huecos.

**Lo que hubo que arreglar.** Esa sección era la única oscura entre "Las seis
casas" y "Dónde", que son las dos claras. Al sacarla quedaban una pegada a la
otra sobre el mismo papel, sin corte visible. "Dónde" lleva ahora la clase
`seccion--corte`, un filete de un píxel que marca el límite sin tocar el fondo.

**Las imágenes quedaron en `img/`.** Veinticuatro archivos, unos 6 MB, ya no los
pide nadie: los diez renders de la secuencia, la planta, la aérea cuadrada, la
peatonal y el logotipo en tinta. No se borraron para que `git revert` del commit
que saca la sección la devuelva completa. GitHub Pages sólo sirve lo que el
navegador pide, así que no pesan en la carga de nadie.

## La ubicación se queda sin titular y sin las dos imágenes de arriba

Salieron el titular "Sentirse lejos, aun estando cerca.", el plano del sector
("El trazado del sector") y la vista aérea del barrio ("El barrio hoy"). La
sección queda con el párrafo del entorno, las cuatro referencias, el enlace a
Google Maps, las coordenadas y la foto de Villa Allende con las sierras. Pasó de
unos 1.900 a 918 píxeles de alto en desktop.

El titular se fue de la vista, no del documento: en su lugar quedó un
`<h2 class="titulo-oculto">Dónde queda</h2>`, que ningún ojo ve y todo lector de
pantalla anuncia. Sin él la sección se salía del esquema de encabezados y el
enlace "Dónde" del menú llevaba a un bloque sin nombre. La utilidad
`.titulo-oculto` es nueva y sirve para cualquier otro caso igual.

Con el titular fuera, `.ubic` perdió su `margin-top`: el aire de arriba ya lo pone
el padding de la sección y sumar los dos dejaba un hueco de más.

**Un error que apareció al mirar de cerca.** La medida de la flecha vivía sólo en
`.btn .flecha`. El enlace al mapa no es un botón, así que su SVG no tenía con qué
dimensionarse y se estiraba hasta ocupar el ancho disponible, partiendo el enlace
en tres renglones. Ya estaba así en la versión publicada. La regla pasó a
`.flecha` a secas y el enlace volvió a un renglón de 29 píxeles.

## La ubicación pasa a ser una lista de tiempos

Vuelve el titular, ahora "Vivir cerca de todo.", en el mismo estilo que el resto
de las secciones, así que el `titulo-oculto` que lo reemplazaba ya no hace falta.

Salió el párrafo del entorno ("La manzana está dentro del trazado consolidado de
Villa Allende Golf...") y las cuatro referencias cambiaron de contenido: de
ubicaciones relativas sin medida ("A pocas cuadras", "Al oeste") a tiempos
concretos que entregó el desarrollo.

```
Villa Allende Golf          1 min
Centro de Villa Allende     5 min
Aeropuerto                 10 min
Córdoba capital            25 min
```

Los minutos se dibujan como las cifras de la banda del hero: número en peso
liviano con el interletrado cerrado y la unidad chica al lado. Las dos listas de
números de la página quedan emparentadas a propósito. Las filas pasaron de
`.95rem` a `1.25rem` de aire porque el dato creció y pedía más espacio.

**Dos pendientes se cerraron de una vez.** El "Pendiente" que estaba en la fila
de Córdoba capital y la nota al pie que decía "Pendiente: distancias y tiempos
verificados a puntos de interés". La nota se fue entera: decía que las
referencias salían de la planimetría de proyecto, y estos tiempos no salen de
ahí. Quedan seis etiquetas de pendiente en la página, de ocho que había.

## La galería pasa a pantalla completa y la foto abre en una ventana

Las diapositivas pasaron de `clamp(460px, 84svh, 900px)` a `100svh`: cada render
ocupa una pantalla entera, como el hero.

**Que se puede pasar, ahora se ve.** Las flechas estaban escondidas abajo de 640
píxeles, así que en el teléfono no había ningún control a la vista: sólo quedaba
descubrir el gesto. Ahora se ven en todos los tamaños y al lado va un contador
"01 / 11", que dice cuántas son sin tener que recorrerlas. La barra de tramos de
abajo ya mostraba el paso automático y quedó igual, cinco segundos por imagen.

**La foto abre entera.** Cada imagen es un botón que abre `#v-foto`, una ventana a
pantalla completa sobre fondo oscuro donde la imagen entra con `contain`, sin
recorte, con su pie, el contador y flechas para seguir mirando sin volver a la
tira. Al cerrar, la tira queda en la imagen que se estaba mirando y el foco va a
esa misma.

Tres detalles que costaron más de lo que parecían:

- **Un arrastre no tiene que abrir la ventana.** Se mide cuánto se movió el dedo
  entre `pointerdown` y el clic: más de 10 píxeles y no abre. La guarda se saltea
  cuando `e.detail` vale 0, que es el clic que manda el teclado, porque ahí no hay
  arrastre que medir y si no se saltea el Enter deja de funcionar.
- **Devolver el foco arrastraba la tira.** Al cerrar, `focus()` sobre un botón
  corrido de pantalla lo trae a la vista, y eso deshacía el `ir()` de la línea
  anterior: la tira volvía a la primera imagen. Va con `preventScroll: true` y
  apuntando al botón de la imagen donde se quedó, no al de donde se entró.
- **El oyente de scroll peleaba con el movimiento pedido por código.** Mientras
  corre un `scrollTo` llegan posiciones de paso y el redondeo las tomaba como
  destino. Se descartan por 700 milisegundos, y el primer toque en la tira vuelve
  a darle la palabra al dedo.

**El formato no alcanza para el teléfono.** Los once renders son 16:9. Para llenar
una pantalla parada habría que recortar hasta dejar un 26 por ciento del ancho.
Abajo de 760 píxeles la imagen entra entera, de borde a borde, con el pie y los
controles sobre el fondo oscuro, y la diapositiva se acorta a `clamp(460px, 74svh,
660px)` para que no quede nadando. Lo que falta para que llene la pantalla está
anotado en el README, en "Lo que falta para que la galería llene el teléfono".

**De paso, `build.py`.** La regeneración de `index.html` dejó de ser un comando
suelto y pasó a un archivo del repositorio, que además le pone a la hoja de
estilos y al script un sello del contenido. Sin eso, el navegador de quien ya
visitó la página puede quedarse con un JavaScript viejo contra un CSS nuevo, que
es exactamente lo que pasó mientras se probaba esto.

## "Quién lo hace" queda en el banner de marcas y el contacto al pie

**Fuera la textura.** La sección tenía la trama de módulos del brandbook al 5 por
ciento sobre el verde oscuro. Salió el `div.trama` y salió su regla del CSS, que
no se usaba en ningún otro lado.

**El fondo pasa a salvia**, el neutro del manual, en lugar del verde oscuro. La
página queda papel, papel, salvia, tinta: la sección funciona como escalón hacia
el contacto y de paso se separa sola de la ubicación, sin filete.

**Salió el titular** "Tres firmas detrás de seis casas." con su párrafo, y
salieron los tres pasos de compra con la nota de condiciones. Como en la
ubicación, el titular se va de la vista y no del documento: queda un
`titulo-oculto` para que la sección siga teniendo encabezado y el enlace del menú
lleve a un bloque con nombre.

**Queda el banner de marcas** con las tres firmas y su papel. Los datos de
contacto que habían entrado al pie se sacaron en la misma tanda: seguían estando
completos en la sección de contacto, dos bloques más abajo, y repetirlos aflojaba
el banner. Sin QR.

Al quedar sólo el banner la sección bajó a 368 píxeles y se volvió más corta que
el rótulo vertical "Respaldo", que arranca en el borde del contenido y se
derramaba 44 píxeles sobre la sección de abajo. Arriba de 900 píxeles de ancho la
sección lleva un piso de `clamp(470px, 54svh, 580px)` y centra su contenido: el
rótulo entra con holgura y las tres firmas quedan con cuerpo de banda.

Dos cosas de contraste que hubo que mirar al cambiar el fondo:

- El rol de cada marca estaba al 50 por ciento de opacidad. Sobre salvia eso da
  3,8:1 y no llega. Pasó a 75 por ciento, que da 5,3. No es decoración: ese
  renglón dice qué hace cada firma.
- El naranja de texto del pendiente da 3,76:1 sobre salvia. En esta sección baja
  a `#7a4100`, un paso más oscuro del mismo tono, que da 4,65.

**Un pendiente se quedó sin lugar.** El de fiduciaria, plazo de obra y permisos
estaba en la nota de las condiciones de reserva, que se fue. Sigue en la lista del
README, pero ya no tiene etiqueta en la página: si esos datos llegan, hay que
volver a abrirles un lugar.

## Entra el logotipo de Calsina y se acorta el texto del contacto

**El texto del contacto** perdió el cierre "y hablás con Lucas": queda "Dejá tus
datos y te escribimos con valores, forma de pago y disponibilidad actualizada. Si
preferís, escribís directo por WhatsApp." El punto final lo puse yo, que en el
texto entregado no estaba y el resto de los párrafos de la página lo llevan.

**El logotipo de Calsina reemplaza al nombre compuesto.** Las tres firmas pasaron
a compartir un alto de ranura, `clamp(54px, 6.2vw, 88px)`: adentro va el logotipo
o el nombre, y así el banner aguanta el período en que falten los otros dos. El
pendiente ahora nombra sólo a GRAB y Autónomo.

**El archivo venía dibujado sobre blanco.** Tiene canal alfa, pero todos sus
píxeles son opacos y el fondo es blanco sólido: sobre la salvia de la sección se
veía un recuadro blanco alrededor del logotipo. Se le quitó el fondo deshaciendo
la composición: si C es lo que se ve, K la tinta real y a su opacidad, entonces
C = K*a + 255*(1-a); tomando a = 1 - min(R,G,B)/255 se despeja K sin tocarle el
tono a la tinta. Volviendo a componer el resultado sobre blanco se recupera el
original con 0,87 de diferencia media sobre 255 y 9 en el peor píxel, así que no
hay pérdida visible. De paso el archivo bajó de 94 a 59 kB, porque un fondo
transparente comprime mejor que uno blanco.

La cuenta quedó en `fondo-a-alfa.py`, por si los otros dos logotipos llegan igual.

**No hay AVIF de este logotipo.** `sips` le tira el canal alfa al convertirlo y lo
deja con fondo blanco, que es justo el problema que se acababa de resolver. Va
sólo en PNG, a 640 píxeles, que es el doble de los 272 a los que se muestra.

## Dos galerías, el orden nuevo y el titular del contacto

**La página pasa a ocho secciones.** Entra una galería del barrio entre el hero y
los atributos, y la galería que ya estaba queda después de los atributos con los
renders de la casa:

```
Hero → Galería: el barrio → Atributos principales → Galería: la casa
     → Las seis casas → Dónde → Quién → Contacto
```

Las dos no quedaron pegadas a propósito. Entre medio van los atributos, que
dicen con palabras lo que las imágenes muestran sin texto, y así ninguna de las
dos tiras se lee como la continuación de la otra.

**La galería del barrio** lleva las seis imágenes de `SLIDE 02`: los dos
ingresos, la calle interna de día y al atardecer, y el frente de la manzana desde
afuera en dos encuadres.

**La galería de la casa** reemplaza sus once renders por los doce de `SLIDE 04`,
en orden de recorrido: el frente, la casa al atardecer, el ingreso, el comedor,
la cocina, el living en dos luces, la galería desde adentro y desde el jardín, el
dormitorio principal y el baño en dos encuadres.

Los epígrafes y los textos alternativos salen de mirar cada imagen, no del nombre
del archivo: donde el archivo dice "Ingreso Principal 02" la imagen es la calle
interna con la gente caminando, y eso es lo que dice el epígrafe.

**Las miniaturas del visor de planos también pasaron a los renders nuevos.** No
lo pidieron, pero dejar los viejos ahí mostraba dos generaciones del mismo
ambiente a dos clics de distancia. Son las mismas nueve posiciones, con las
imágenes equivalentes del juego nuevo.

**El componente de galería ahora admite varias instancias.** Antes la tira, la
barra, el contador y las flechas se buscaban por identificador, así que no podía
haber dos. Ahora cada `<section class="galeria" data-galeria>` se arma sola a
partir de sus `[data-pista]`, `[data-barra]`, `[data-cuenta]`, `[data-ant]` y
`[data-sig]`, y la ventana de la foto ampliada es una sola, compartida, que
guarda de cuál galería vino.

**Un rótulo nuevo abajo a la derecha** dice "El barrio" o "La casa" al lado del
contador. Con dos tiras iguales separadas por una sección, sin eso no se sabe en
cuál de las dos se está. El menú de la cabecera pasó a nombrarlas igual.

**El titular del contacto** pasa a decir "Contacto" solo. Con eso, el rótulo
vertical del margen izquierdo decía exactamente la misma palabra que el titular,
así que se quitó de esa sección. En las demás sigue, porque ahí nombra algo que
el titular no dice.

**Se borraron los sesenta y seis archivos `r-*`** de los renders viejos, 10,3 MB
que ya no usaba nadie. Siguen en el historial de git.

## Las imágenes que no abrían fuera de Safari

Se revisó el reporte de que en Safari cargaban y en los demás navegadores no.

El sitio publicado estaba sano al momento de revisarlo: las 78 imágenes AVIF que
había abrían bien en Chromium, ningún archivo referenciado faltaba y la red de
seguridad que atrapa una fuente caída funcionaba. Pero al generar las dieciocho
imágenes nuevas aparecieron **dos archivos AVIF que Safari abre y Chromium
rechaza**, con el mismo origen, la misma orden de conversión y los mismos
encabezados que los que sí abren. Es un defecto intermitente de `sips`.

Eso explica el reporte. Hasta el 30/09 la página no tenía respaldo: dentro de un
`<picture>`, cuando la fuente elegida falla el navegador no prueba con la
siguiente, deja el hueco vacío. Safari abría esos archivos y mostraba la página
entera; los demás mostraban huecos. Desde el 30/09 el JavaScript atrapa el error
y pide el JPEG, así que el hueco no vuelve a quedar aunque un archivo salga malo.

Los dos archivos se volvieron a generar y ahora abren. Se verificaron **las 126
imágenes AVIF del sitio, una por una, en Chromium**: ninguna falla. Esa
verificación queda documentada en el README como paso obligatorio antes de
publicar imágenes nuevas.

Queda una cosa para el lado de quien reportó: si todavía se ven huecos, es caché.
Pages manda `cache-control: max-age=600` y conviene recargar forzando antes de
buscar otra explicación.

## La red de seguridad llegaba tarde

Siguieron faltando imágenes en Chrome después del arreglo anterior. La causa no
era el archivo: era **cuándo corría la red que atrapa el error**.

Estaba en `js/site.js`, al final del `<body>`. Tres imágenes de la página no
esperan a nadie: la del hero, que además va con `fetchpriority="high"` y dos
`preload` en el `<head>`, y la primera de cada galería. Esas empiezan a cargar
mientras el navegador lee el documento, y si fallan, su error ocurre **antes de
que exista el script del final**. Nadie las rescataba. Las de más abajo sí,
porque fallan cuando el script ya está.

De ahí que el síntoma fuera "no se ven las imágenes" y no "falta una imagen":
faltaban exactamente la portada y la primera de cada tira, que es casi todo lo
que se ve sin desplazarse.

Se comprobó con una prueba controlada: una copia de la página con los tres AVIF
que no esperan apuntando a archivos inexistentes.

| | hero | primera del barrio | primera de la casa |
|---|---|---|---|
| Red al pie, como estaba | hueco | hueco | rescatada |
| Red en el `<head>`, ahora | rescatada | rescatada | rescatada |

La red pasó a un `<script>` dentro del `<head>`, antes de que empiece a cargar
nada. Además de escuchar el error en captura, ahora barre todas las imágenes al
terminar de leer el documento, al terminar de cargar y una vez más a los cuatro
segundos, por si algún error no llegó a dispararse. `build.py` conserva el
`<head>` tal cual, así que sobrevive a cada reconstrucción.

## Una página para revisar esto sin adivinar

`diagnostico.html` prueba todas las imágenes del sitio en el navegador donde se
abra y dice cuáles fallan y por qué: si el servidor no las tiene, que significa
página vieja guardada en caché, o si llegan enteras y el decodificador las
rechaza, que significa archivo defectuoso. Muestra además el navegador, si
entiende AVIF y la fecha de publicación de la página que está viendo, para saber
si lo que el navegador tiene guardado es lo mismo que está publicado.

Lleva `noindex`, no está enlazada desde el sitio y trae un botón que copia el
informe entero.

## El maquetado deja de depender de funciones de CSS recientes

Chrome de escritorio seguía sin mostrar las imágenes, y Chrome de celular sí las
muestra. Como es el mismo motor, el formato de los archivos queda descartado: lo
que cambia entre los dos no es el navegador, es el ancho, y con el ancho cambian
las reglas de CSS que se aplican.

Debajo de 760 píxeles la galería usa un juego de reglas propio, con la imagen en
`height:auto`. Arriba de 760 usaba otro, y ese otro tenía dos puntos frágiles:

**La altura colgaba de una cadena de porcentajes.** La foto medía `height:100%`
de un `<picture>` que medía `height:100%` de un `<button>` que medía `height:100%`
de la diapositiva. Un porcentaje de alto sólo funciona si el padre tiene una
altura ya resuelta, y un `<button>` no siempre se la pasa a lo que lleva adentro.
Cuando la cadena se corta, la imagen carga perfecto y se dibuja con cero de alto:
la peor falla posible, porque no deja rastro en ningún lado. Ahora la foto se
estira con `position:absolute; inset:0`, que llena el marco sin pedirle la altura
a nadie. Lo mismo en el hero.

**La altura de la pantalla se pedía sólo en `svh`.** Esa unidad existe desde
Chrome 108, de fines de 2022. Un navegador que no la entiende descarta la
declaración entera y la sección se queda sin alto. Ahora cada una de las trece
medidas en `svh` lleva delante la misma medida en `vh`, que existe desde siempre:
el navegador moderno usa la segunda y el viejo se queda con la primera.

**El plano de implantación vivía de `aspect-ratio`.** Sus capas son absolutas, así
que sin esa propiedad el marco mide cero y el plano desaparece sin dejar rastro.
Se le agregó un respaldo con `@supports` y relleno porcentual.

Ninguno de estos cambios se nota en un navegador moderno. Comprobado a 1440 y a
375 píxeles: las imágenes se dibujan con el mismo tamaño que antes y nada quedó
en cero.

## La página de revisión ahora mide, no sólo descarga

`diagnostico.html` abre la página real en un marco escondido del mismo ancho que
la ventana, le saca la carga diferida a todas las imágenes y **mide con qué
tamaño se dibujan**. Eso separa las dos fallas que hasta ahora se confundían:

- la imagen no llega (archivo defectuoso o página vieja en caché),
- la imagen llega y se dibuja con cero de alto (maquetado).

Además informa qué funciones de CSS entiende el navegador (`svh`,
`aspect-ratio`, `object-fit`, `inset`, `clip-path`, `backdrop-filter`, `:has()`),
el navegador y su versión, y la fecha de publicación de lo que está viendo, para
saber si coincide con lo que está en el servidor.

## Lo que dijo la revision hecha en el Chrome que falla

Corrida en Chrome 152 sobre macOS, ventana de 1910 x 964:

```
Entiende AVIF: si
CSS: svh, aspect-ratio, object-fit, inset, clip-path, backdrop-filter, :has()  todas si
Imagen del hero:        dibujada 1895 x 964 px, archivo 1672 px de ancho
1a del barrio:          dibujada 1895 x 964 px, archivo 1672 px de ancho
1a de la casa:          dibujada 1895 x 964 px, archivo 1672 px de ancho
Plano de implantacion:  dibujada  626 x 686 px, archivo  730 px de ancho
Archivos probados: 107, fallan: 0
```

**La pagina publicada funciona en ese mismo navegador.** Los archivos llegan, el
navegador los entiende y las imagenes se dibujan a tamano completo. Eso descarta
el formato, el maquetado y la version del navegador.

Queda entonces algo entre el navegador y lo que muestra en la pestana normal: la
copia guardada, o una extension que modifica la pagina. La revision carga la
pagina en un marco con una direccion distinta cada vez, asi que nunca pasa por lo
guardado, y por eso ahi se ve bien.

Dos cambios en `diagnostico.html` para cerrar eso:

**Compara la copia guardada con la publicada.** Pide la pagina dos veces, una
forzando la red y otra forzando lo guardado, y avisa si no coinciden. Si no
coinciden, lo que se ve en la pestana normal es vieja.

**Muestra la pagina en vivo, a la vista.** Al final hay un marco con la pagina
publicada, cargada de nuevo sin pasar por nada guardado, en ese mismo navegador.
Si ahi se ven las imagenes y en la pestana normal no, el problema es la copia
guardada o una extension, y no el sitio.

Los dos arreglos anteriores, la red de seguridad en el `<head>` y los respaldos
de CSS, siguen valiendo: eran fragilidad real. Pero no eran la causa de lo que se
estaba viendo.

## Las que se ven y las que no: qué tienen de distinto

Las dos imágenes que sí aparecen son el plano de implantación y la foto aérea de
Villa Allende. Las que faltan son las de pantalla completa: el hero y las dos
galerías. Puestas una al lado de la otra, la diferencia es de dónde sacan el alto.

| | De dónde saca el alto | Puede quedarse en cero |
|---|---|---|
| Foto aérea (`.fig--4x5`) | `aspect-ratio` del contenedor | no |
| Plano (`.implantacion`) | `aspect-ratio`, y la regla de base es `height:auto` | no |
| Hero y galerías | `height:100%` del contenedor, que mide `100svh` | sí |

Las dos primeras tienen el alto garantizado por su propia forma. Las de pantalla
completa dependían enteras de que el contenedor tuviera un alto resuelto.

Ahora la foto de pantalla completa lleva **un piso propio**: `min-height:560px`
en el hero y `min-height:540px` en las diapositivas de galería, sobre la imagen
misma y no sobre el contenedor. Pase lo que pase con la cadena de alturas, la
imagen no puede medir cero. En el teléfono el piso se anula, porque ahí la foto
entra entera y mide lo que mide.

## Medir la página de verdad, no una copia

`diagnostico.html` mide la página dentro de un marco, y un marco puede
comportarse distinto del documento principal. Agregando `?revisar=1` a la
dirección de la página normal, **la página se mide a sí misma** y muestra el
resultado encima, en un panel: cada archivo, si abre y con qué tamaño se dibuja.

```
https://brayanparragrimaldo-byte.github.io/Neibor/?revisar=1
```

Alcanza con una captura de ese panel para saber qué está pasando en el navegador
donde falla. El panel sólo aparece con ese parámetro: la página normal no lo
lleva.

## La causa real: AVIF que declaran su medida y no traen imagen

Las capturas de la página mostraron lo que faltaba saber: **el maquetado estaba
perfecto**. El hero ocupaba toda la pantalla, los títulos, el contador 03 / 06,
la barra de progreso con sus doce tramos y los epígrafes, todo en su lugar. Lo
único que no había eran los píxeles de las fotos.

Eso no es ni carga ni maquetado, y explica por qué todas las comprobaciones
anteriores daban bien: **yo verificaba con `naturalWidth`, que sale de la
cabecera del archivo, no de los píxeles.** Un AVIF puede declarar 1672 de ancho
y no traer imagen adentro. El navegador dispara `load`, el ancho es correcto, la
red de seguridad no tiene de qué enterarse, y en pantalla queda el fondo.

Dibujando cada archivo en un lienzo y leyendo los píxeles, el resultado fue
inmediato:

```
hero-aerea-ancha.avif         1672 px   0% de pixeles opacos   VACIA
ext-ingreso-principal.avif    1672 px   0%                     VACIA
casa-frente.avif              1672 px   0%                     VACIA
implantacion-ingresos.avif     730 px   100%                   bien
ubicacion-aerea-sierras.avif   984 px   100%                   bien
```

Dieciocho archivos vacíos, todos de 1671 píxeles o más. Las dos imágenes que sí
se veían eran justo las chicas, y en el teléfono se ve todo porque ahí se sirven
las versiones de 1000 píxeles.

### La regla

Probando anchos: 1664 funciona, 1672 no. Pero `casa-living-2` seguía vacía a
1600, a 1536, a 1440 y a 1280. La diferencia es que su original mide 1671 de
ancho, impar, y arrastra la altura a impar en cada reducción. Forzada a
1600 x 900 funciona.

```
hasta 1000 px de ancho   cualquier medida sirve
arriba de 1000 px        ancho y alto tienen que ser pares
```

Con esa regla aparecieron cuatro archivos más que estaban vacíos sin que nadie
lo supiera: los dos logotipos grandes, sin uso, y las versiones medianas de los
planos de las casas O y R, que sí se usan y las arma el JavaScript a partir de
la letra, por lo que no figuraban como referencia en el HTML.

### Qué se hizo

**Se regeneraron las dieciocho grandes a 1600 px**, con las dos medidas pares.
`casa-living-2` y `casa-cocina-t` hubo que forzarlas con
`--resampleHeightWidth`. Los planos O y R, a 1600 x 1054 y 1600 x 880.

**Se borraron once AVIF rotos que no usaba nadie**: los dos logotipos grandes,
los seis planos de 3000 px y cuatro imágenes de la sección que se quitó.

**Se verificaron los ochenta AVIF del sitio dibujándolos uno por uno.** Ninguno
vacío.

**La página ahora se defiende sola de esto.** Como `onerror` nunca se entera, el
guión del `<head>` dibuja en un lienzo de ocho por ocho cada imagen AVIF al
terminar de cargar; si sale transparente entera, tira las `<source>` y pide el
JPEG. Comprobado apuntando el hero a un archivo vacío a propósito: la página lo
detecta y pasa al JPEG sola, que llega con el 100 por ciento de los píxeles.

**`diagnostico.html` ahora prueba los píxeles** y no la cabecera, así que puede
distinguir "no llega", "llega y no abre" y "abre y está vacía".

## Entra "Atributos principales de cada casa"

Nueva sección después de la galería de la casa, con los diez atributos de la
vivienda. La página pasa a nueve secciones.

**El dibujo no repite el de los atributos del barrio.** Aquella va en cuatro
columnas con ícono grande, título y bajada, porque son conceptos que hay que
explicar. Esta va en dos columnas de filas con filete y el ícono chico al lado
del texto, porque son etiquetas cortas que se leen de un vistazo. Con el mismo
dibujo, la página tendría dos grillas de íconos casi iguales a dos secciones de
distancia. El filete es el mismo de la lista de tiempos de "Dónde".

Las columnas se llenan de arriba hacia abajo y no de izquierda a derecha
(`grid-auto-flow: column` sobre cinco filas), así la secuencia del listado
original se mantiene al recorrer cada columna. En el teléfono queda una sola
columna de diez.

**Ocho de los diez íconos ya existían.** Los había dibujado para una sección que
después se quitó y quedaron sin uso: `i-suite`, `i-cama`, `i-ducha`, `i-sofa`,
`i-lavadero`, `i-parrilla`, `i-deposito` y `i-radiador`.

**Dos se hicieron ahora.** `i-cochera` es un auto bajo una losa con los apoyos
llegando al piso: el auto suelto ya lo usa "Estacionamiento de cortesía" en los
atributos del barrio y repetirlo confundiría las dos cosas. `i-ventana` se
rehízo: el cruce de cuatro paños que tenía no decía nada de vidrio doble, y
ahora es un marco dentro de otro, con las esquinas casi rectas para que no
parezca una tecla de luz.

**El texto se pasó a la voz de la página.** El original venía en caja de título
y con abreviaturas ("1 Dorm. c/ Vestidor y Baño En Suite"), y el resto de la
página escribe en redonda y sin abreviar: la ficha de cada casa ya dice
"3, uno en suite con vestidor". Se mantuvieron las palabras y las barras; se
cambió la caja y se desarmaron las abreviaturas.

| Original | En la página |
|---|---|
| Cochera doble | Cochera doble |
| 1 Dorm. c/ Vestidor y Baño En Suite | 1 dormitorio con vestidor y baño en suite |
| 2 Dormitorios Secundarios | 2 dormitorios secundarios |
| 2 Baños / 1 Toilette | 2 baños / 1 toilette |
| Cocina/ Comedor / Living | Cocina / comedor / living |
| Lavadero / Tender | Lavadero / tender |
| Galería c/Asador | Galería con asador |
| Espacio de guardado / Depósito | Espacio de guardado / depósito |
| Calefacción central | Calefacción central |
| Aberturas de vidrio doble | Aberturas de vidrio doble |

"Las seis casas" lleva ahora `seccion--corte`, el filete que separa dos secciones
claras seguidas, porque la nueva queda justo encima y las dos van sobre papel.

## Los atributos de cada casa pasan a la grilla de los del barrio

A pedido: la sección nueva usa ahora el mismo dibujo que "Atributos
principales". Cuatro columnas, ícono grande centrado arriba, título debajo, y
los dos últimos corridos a las columnas del medio para que la tercera fila
cierre centrada. Los diez íconos son los mismos que ya tenía.

La única diferencia es que acá no hay bajada: son etiquetas, no conceptos que
haya que explicar, y no se inventó texto para llenar el hueco. Eso lo cubre el
modificador `.amen--solo`, que hace dos cosas:

- achica el aire entre filas, que estaba calculado para items con párrafo;
- le da al título una medida donde cortar, que antes se la daba el párrafo.
  Con `26ch` los dos títulos largos caen en dos renglones; con menos, en tres.

Comprobado a 1440, 1024 y 375 píxeles: la sección nueva y la del barrio pasan
por los mismos saltos de columna, con el mismo ícono de 43 píxeles y el mismo
reacomodo de los dos últimos.

Se quitó el bloque `.prog` de la hoja de estilos, que era el de la lista con
filete y ya no lo usa nadie.

## Se corrigen las cifras de lote y de superficie por casa

El desarrollo pasó valores nuevos para dos de las cinco cifras de la banda del
hero:

| | Antes | Ahora |
|---|---|---|
| Lotes, cifra grande | 500 m² | 550 m² |
| Lotes, rango | entre 450 y 550 m² | entre 500 y 750 m² |
| Por casa | 215 m² | 225 m² |

Las otras tres quedan igual: 4.237 m² de predio verde, 6 casas y 1.000 m² de
áreas comunes.

**Acercan la banda a la ficha de obra.** La superficie por casa ya cierra: 225 es
exactamente el piso del rango de la ficha, que va de 224 a 241 m² entre cubierta
y semicubierta. Antes decía 215 y no cerraba con ninguna.

**Quedan dos cosas sin cerrar, anotadas y no corregidas por cuenta propia:**

El rango de lotes no alcanza a cubrirlos a todos. Los seis miden 502, 550, 557,
595, 711 y 790 m². Entre 500 y 750 entran cinco; el más grande queda 40 m² arriba
del techo declarado.

Y aparece una diferencia dentro de la propia página: la banda del hero dice
"entre 500 y 750 m²" y el atributo "Patios propios extensos" dice "entre 502 y
790 m² de terreno por casa", que es lo que sale de la ficha. Dos frases de la
misma página que no coinciden se ven mucho más que una diferencia con un
documento interno. Hay que elegir cuál vale.

---

## Entra el logotipo de Autónomo

En "Quién lo hace" la firma del medio dejó de ser un nombre escrito con la
tipografía de la página y pasó a ser el logotipo real, que llegó en PNG con
transparencia.

| | Antes | Ahora |
|---|---|---|
| Firma del medio | texto "Autónomo" en Host Grotesk | `img/logo-autonomo-m.png`, 504 x 207 |
| Pendiente al pie | "logotipos de GRAB y Autónomo en vectorial" | "logotipo de GRAB" |

**Qué se le hizo al archivo.** Venía en 2000 x 1125 con el logotipo ocupando
1096 x 450 en el centro y el resto transparente. Se recortó al ras de la tinta
y se bajó a 207 px de alto, la misma altura que el de Calsina, para que los dos
queden del mismo tamaño óptico dentro de la ranura de `.marca__firma`. A 88 px
de alto, que es lo máximo que usa la ranura, el archivo todavía rinde 2,35x, así
que se ve nítido en pantallas de densidad doble.

**Por qué queda en PNG y no en AVIF.** Igual que el de Calsina: `sips` le tira el
canal alfa al pasarlo a AVIF y lo devuelve con fondo blanco, que sobre la salvia
de esa sección sería un recuadro.

**Contraste.** La tinta del logotipo es `#353331` y el fondo de la sección es
`#c3c5bb`. Da 7,1:1, bastante arriba del mínimo de 4,5:1.

**Una advertencia para más adelante.** Ese gris oscuro sobre la tinta de la
página (`#131e10`) queda casi invisible. Si alguna vez el logotipo tiene que ir
sobre fondo oscuro, hay que pedir la versión en negativo. Hoy sólo aparece sobre
salvia, así que no hace falta.

**Sigue pendiente la versión vectorial**, tanto de este como del de GRAB. Lo que
hay alcanza para la pantalla y no alcanza para imprimir.

---

## Se podan tres cosas de "Las seis"

A pedido del desarrollo, sin reemplazo:

| Qué | Dónde estaba |
|---|---|
| Conmutador Plano / Axonométrica | arriba del plano de implantación |
| Línea "Valor: Pendiente" | última fila de la ficha de cada casa |
| Aviso al pie de la sección | "Superficies tomadas de los planos... Pendiente: valores y estado de disponibilidad por unidad" |

Al irse el conmutador se fue también la capa de la axonométrica, el bloque 7 de
`js/site.js` y las reglas `.vistas` y `.implantacion.axo` del CSS. El plano queda
solo, que es lo que había antes de que existiera el conmutador. Las chinchetas y
el selector de letra siguen funcionando igual.

**Lo que esto saca de la vista.** El aviso era el único lugar donde la página
decía de dónde salen las superficies y que la posición de cada letra sobre el
plano es una deducción, no un dato confirmado. Y con la línea de valor se fue el
último recordatorio de que los precios no están. El botón "Pedir valores y forma
de pago" sigue ahí, así que la vía de consulta no se perdió.
