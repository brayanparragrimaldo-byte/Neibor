# Cambios aplicados desde "Mock up web - v1"

Presentación de 9 diapositivas con las correcciones del desarrollo. Esto es lo que se incorporó y lo que quedó pendiente.

## Datos nuevos que entraron al sitio

**Las seis casas.** La planilla de la diapositiva 8 reemplazó todos los campos que estaban marcados como pendientes. Las unidades no se numeran: se identifican por letra, y en orden deletrean el nombre del barrio.

| Casa | Orientación del fondo | Terreno propio | Cubierta |
|---|---|---|---|
| N | Noreste | 660 m² | 225 m² |
| E | Este | 515 m² | 225 m² |
| I | Este | 500 m² | 225 m² |
| B | Sudeste | 544 m² | 225 m² |
| O | Noroeste | 525 m² | 225 m² |
| R | Noroeste | 756 m² | 225 m² |

Suman 3.500 m² de lotes privados y 1.350 m² cubiertos.

**Programa de la casa.** Cochera doble, dormitorio principal con vestidor y baño en suite, dos dormitorios secundarios, dos baños y un toilette, cocina comedor y living integrados, lavadero con tender, galería con asador, espacio de guardado, calefacción central y aberturas de vidrio doble.

**Memoria técnica completa.** Fundación, estructura, terminaciones exteriores e interiores, equipamiento sanitario, instalaciones sanitaria y eléctrica, carpintería de aluminio, equipamiento fijo y climatización. Va dentro de un desplegable para no cargar la página.

**Prestaciones del barrio.** Las diez de la captura: estacionamiento de cortesía, parquización, seguridad y cámaras, control de acceso inteligente, servicios subterráneos, expensas eficientes, ubicación, casas de una planta, patios propios y dos ingresos.

**Las tres firmas.** GRAB desarrolla y comercializa, Autónomo hace el proyecto, Calsina Hnos. comercializa.

## Cambios de estructura

1. **Hero.** Pasó a imagen aérea a sangre con el titular "Menos casas. Más comunidad." en peso liviano, según la indicación de que el titular no debe competir con la imagen.
2. **Nueva sección .01, el proyecto en números.** Tres cifras grandes con el criterio de la captura de referencia, más enlace a Google Maps.
3. **Nueva sección .07, lo que trae el barrio.** Grilla de íconos de línea dibujados a medida, sin imagen.
4. **Nueva galería a pantalla completa.** Seis ambientes, avance manual con flechas o deslizando, avance automático cada cinco segundos con barra de progreso, y pausa cuando el usuario interviene o la galería sale de pantalla.
5. **Selector de las seis casas.** Las chinchetas muestran la letra en lugar del número y se agregó el conmutador Plano / Axonométrica.
6. **Contacto.** Se quitó el teléfono a la vista y el QR. Queda el WhatsApp flotante, según lo acordado.
7. **Medición.** Cada click de WhatsApp, el enlace al mapa y el envío del formulario empujan un evento a `dataLayer`, listo para conectar a Google Tag Manager, GA4 o Meta sin tocar el código.

## Contradicciones detectadas

1. **La captura de referencia no es de Neibor.** Sus números (4237 m² de predio, 500 m² de lote, 215 m² de casa, 1000 m² de áreas comunes) corresponden a otro proyecto. Se usaron los de Neibor.
2. **El rango de lotes.** La anotación dice "entre 500 y 750 m²", pero la Casa R mide 756 m² según la planilla. En el sitio figura "500 a 756 m²", que es lo que dicen los datos.
3. **Superficie cubierta.** La referencia decía 215 m² y la anotación la corrige a 225 m². Se usó 225, que además coincide con la planilla de las seis casas.
4. **Ingresos.** La planimetría mostraba un acceso por Paraguay y las prestaciones hablan de dos ingresos. El texto se corrigió a dos.
5. **Intermediarios.** El texto anterior decía que no había intermediarios entre quien compra y quien construye. Con Calsina comercializando eso dejó de ser cierto y se reescribió.

## Pendiente

1. Valores y forma de pago por casa.
2. Estado de disponibilidad por unidad.
3. Confirmar qué letra corresponde a cada lote sobre el plano. Hoy se dedujo de la orientación de fondo declarada.
4. Logotipos de GRAB, Autónomo y Calsina en vectorial, para reemplazar los tipográficos del banner.
5. Números de WhatsApp diferenciados de GRAB y de Calsina, si más adelante se quieren botones separados.
6. Plano de planta de la unidad, para el botón que hoy alterna entre plano de implantación y axonométrica.
7. Coordenadas exactas del predio. El enlace a Google Maps hoy abre una búsqueda sobre la esquina de Ecuador y Guido.
8. Imagen aérea del proyecto en alta resolución para el hero. La actual es una foto aérea de Villa Allende.
9. Fecha de entrega, plazo de obra, fiduciaria o escribanía interviniente.
10. Identificador de Google Tag Manager o GA4 para que los eventos empiecen a registrarse.
