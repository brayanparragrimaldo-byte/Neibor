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

**Memoria técnica completa.** Fundación, estructura, terminaciones exteriores e interiores, equipamiento sanitario, instalaciones sanitaria y eléctrica, carpintería de aluminio, equipamiento fijo y climatización. Va dentro de un desplegable para no cargar la página.

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
   con la planta, el programa de la casa y la memoria técnica plegada.

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
