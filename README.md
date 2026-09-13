# Neibor · Seis Casas

Landing de conversión del proyecto Neibor, seis casas sobre una manzana de Villa Allende Golf, Córdoba, Argentina. Desarrolla GRAB.

Sitio estático, sin dependencias ni proceso de build. Se sirve tal cual desde GitHub Pages o desde cualquier hosting.

```
index.html        página completa
_cuerpo.html      el cuerpo sin <head>, fuente desde la que se genera index.html
css/site.css      sistema visual completo
js/site.js        interacciones
img/              imágenes optimizadas y logotipo con transparencia
favicon.svg       isotipo vectorial
.nojekyll         evita que Pages procese el sitio con Jekyll
DIAGNOSTICO.md    análisis del material, faltantes y criterios de diseño
```

## Probarla en local

```bash
python3 -m http.server 8080
```

## Dónde se cambia cada cosa

**Las seis casas.** Array `CASAS` al inicio de `js/site.js`. Cada entrada tiene `x` e `y` en porcentaje sobre `img/implantacion-ingresos.jpg`, más el frente, la ubicación y el estado. Las posiciones son una lectura del plano de proyecto: hay que ajustarlas contra la implantación comercial definitiva. Para agregar superficie, dormitorios o valor, sumar la clave al objeto y el `<dd>` correspondiente en `_cuerpo.html`.

**WhatsApp.** Constante `WA` en `js/site.js`. Cada CTA lleva su propio mensaje en el atributo `data-wa`, así el asesor sabe desde qué sección escribieron.

**Formulario.** Hoy arma el mensaje y abre WhatsApp o el correo. Para conectar un CRM, reemplazar el cuerpo del `submit` por el `fetch` al endpoint y dejar WhatsApp como alternativa.

**Datos pendientes.** Buscar `class="pendiente"` en `_cuerpo.html`. Cada uno marca un dato que no estaba en el material entregado. Al completarlo, se borra la etiqueta.

**Regenerar `index.html`** después de editar `_cuerpo.html`: el archivo es el `<head>` de `index.html` más el cuerpo más el `<script>` final.

## Decisiones que conviene conocer antes de tocar

- **El ángulo de 30 grados** de los recortes de imagen sale de la arista del isotipo, que sale de la forma del lote. Si se cambia, se pierde la relación con la marca. Las clases `corte-ti` y `corte-td` traen el polígono ya calculado para cada relación de aspecto.
- **Dos niveles de botón, nunca tres.** Sólido para la acción de conversión, contorno para todo lo demás.
- **El naranja de marca no se usa en botones.** Sobre papel da 4.28:1 de contraste, por debajo del mínimo para texto chico. Queda reservado para titulares grandes, la chincheta activa y las etiquetas de pendiente, que es además el uso que le da el manual.
- **`prefers-reduced-motion`** desactiva barridos, contadores y desplazamientos. Todo el contenido queda accesible.
- **Tipografía:** Host Grotesk desde Google Fonts, la misma del manual de marca.

## Pendiente antes de considerarla terminada

1. Confirmar GRAB o GRAP.
2. Confirmar que el WhatsApp del manual es el canal comercial oficial.
3. Completar las etiquetas de pendiente o quitar los bloques que las contienen.
4. Ajustar las coordenadas de las seis chinchetas con la implantación comercial.
5. Agregar el texto legal de tratamiento de datos en el formulario.
6. Definir si se publica la variante de terminaciones de cocina.
7. Poner la URL absoluta del sitio en `og:image` para que el preview funcione al compartir el link.
