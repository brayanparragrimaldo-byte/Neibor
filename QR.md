# Seguimiento de los dos códigos QR

Dos carteles con un código cada uno. Los dos llevan a la misma página. Lo que
se quiere saber es cuál de los dos trae más gente y, sobre todo, cuál trae
gente que después consulta.

Este archivo no se publica en el sitio (está en `.assetsignore`) pero sí está
en el repositorio de GitHub, que hoy es público. Por eso acá no hay ninguna
clave escrita.

---

## 1. Qué se imprime

| Código | Lo que lleva adentro | Archivos |
|---|---|---|
| QR 1 | `https://neiborcasas.com/q/1` | `qr/neibor-qr-1.svg` y `qr/neibor-qr-1.png` |
| QR 2 | `https://neiborcasas.com/q/2` | `qr/neibor-qr-2.svg` y `qr/neibor-qr-2.png` |

El SVG es vectorial: sirve para cualquier tamaño, desde una etiqueta hasta una
chapa de obra. El PNG mide 1184 px y es para pantalla o para quien pida un
archivo de mapa de bits.

Los dos son versión 3 con corrección de errores nivel Q: aguantan hasta un 25%
del código tapado, rayado o con un logo encima y se siguen leyendo. Vienen con
el margen blanco de cuatro módulos que pide la norma. **Ese margen es parte del
código**: si el diseño lo recorta, los lectores fallan.

Medida mínima recomendada en impresión: 2,5 cm de lado para que se lea desde
30 cm, y 1 cm de lado por cada metro de distancia de lectura. Un cartel que se
mira desde tres metros quiere un código de 3 cm o más.

**Los dos códigos se parecen pero no son iguales.** Conviene anotar cuál es
cuál en el reverso de cada pieza antes de mandarla a imprimir, porque si se
mezclan los datos quedan cruzados y no hay forma de darse cuenta después.

Para regenerarlos o para cambiar una dirección:

```
python3 qr/generar.py
```

El programa no usa librerías de afuera. Está escrito contra la norma ISO 18004
y se verificó de dos maneras: el dibujo sale idéntico módulo por módulo al de
un codificador de referencia, y los cuatro archivos se leen con un
decodificador independiente.

---

## 2. Qué pasa cuando alguien escanea

1. El teléfono abre `neiborcasas.com/q/1`.
2. El Worker anota el escaneo y contesta en el acto con una redirección a:
   `https://neiborcasas.com/?utm_source=qr&utm_medium=offline&utm_campaign=campana_qr&utm_content=qr_1&ev=...`
3. La persona ve la página. Un paso, sin pantallas intermedias, sin esperar a
   que la base conteste: el registro se escribe por detrás.
4. Cuando la página termina de cargar, avisa al servidor. Esa es la
   **llegada**.
5. Si después toca un botón de WhatsApp, avisa de nuevo. Esa es la
   **consulta**.

`ev` es el identificador del escaneo. Es lo que permite separar las tres cosas
y lo que evita contar de más: el servidor marca una fila que ya existe, así
que recargar la página, compartir la dirección o volver mañana no suma nada.

Por qué una dirección corta y no la larga con todas las etiquetas adentro:

- El código impreso queda chico y se lee de más lejos.
- El destino se puede cambiar sin volver a imprimir. Si mañana conviene que el
  QR 2 caiga en la sección de las casas en lugar de la portada, se edita
  `QRS` en `worker/index.js` y listo.
- El escaneo queda contado aunque la persona cierre antes de que cargue la
  página.

---

## 3. Qué se guarda

Base `neibor-qr` en Cloudflare D1, tabla `qr_eventos`. Una fila por escaneo.

| Columna | Qué es |
|---|---|
| `ev` | Identificador único del escaneo |
| `creado` | Fecha y hora en UTC |
| `dia` | La misma fecha en hora de Córdoba, para agrupar por día |
| `qr` | `qr_1` o `qr_2` |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | Las etiquetas que viajaron |
| `destino` | La dirección completa a la que se mandó |
| `pais`, `ciudad` | Aproximados, los da Cloudflare |
| `clase` | `movil`, `escritorio` o `bot` |
| `llego`, `llego_en` | Si la página llegó a cargar, y cuándo |
| `consulta`, `consulta_en` | Si tocó un botón de WhatsApp, y cuándo |

**No se guarda la dirección IP ni el nombre del navegador.** De cada escaneo
quedan la fecha, cuál de los dos códigos fue, de dónde venía más o menos, y si
era teléfono o computadora.

Los robots y las vistas previas de enlaces se marcan como `clase = 'bot'` y
quedan afuera de los números del tablero. Siguen guardados: si un día los
escaneos se disparan conviene poder mirar si eran personas.

---

## 4. Cómo se miran los resultados

### El tablero

`https://neiborcasas.com/api/qr?clave=LACLAVE`

Muestra los dos códigos uno al lado del otro: escaneos, reparto en porcentaje,
llegadas, porcentaje de llegada, consultas y tasa de conversión. Abajo, la
evolución por día y los últimos veinte escaneos.

La clave se carga una sola vez en el panel de Cloudflare:

> Workers y Pages → **neibor** → Settings → Variables and Secrets → Add →
> Type: **Secret** → Name: **CLAVE_PANEL** → Deploy

Mientras la variable no exista, esas direcciones devuelven 404 y nadie puede
entrar. La misma clave abre `/api/reparto`, que es el conteo del reparto de
consultas entre GRAB y Calsina.

Es una puerta simple, no una contraseña fuerte: quien tenga el enlace entra.
Adentro hay cuentas de escaneos, no datos de personas. Si el enlace se filtra,
se cambia la variable en el panel y el anterior deja de servir.

### En una planilla de Google

En una hoja nueva, celda A1:

```
=IMPORTDATA("https://neiborcasas.com/api/qr.csv?clave=LACLAVE&vista=dia")
```

Trae una fila por día y por código con escaneos, llegadas y consultas. La
planilla se actualiza sola más o menos cada hora. Desde ahí salen los gráficos
y las tablas dinámicas sin tocar nada más.

Para el detalle escaneo por escaneo, `&vista=evento` en lugar de `&vista=dia`.
Esa vista trae las últimas cinco mil filas, que es hasta donde Google importa
cómodo.

El enlace lleva la clave adentro. La planilla tiene que quedar privada o
compartida sólo con quien corresponda.

### Desde Cloudflare, sin clave ni enlaces

Panel de Cloudflare → Storage and Databases → D1 → **neibor-qr** → Console.
Ahí se escribe SQL contra la base y se exporta. Por ejemplo:

```sql
SELECT qr,
       COUNT(*)        AS escaneos,
       SUM(llego)      AS llegadas,
       SUM(consulta)   AS consultas
FROM qr_eventos
WHERE clase <> 'bot'
GROUP BY qr;
```

---

## 5. Lo que cuesta

Nada. El Worker, D1 y el almacenamiento entran en el plan gratuito de
Cloudflare. El límite libre de D1 es de cien mil filas escritas por día; un
cartel no se acerca ni de lejos. Si un día se pasara, D1 deja de escribir hasta
la medianoche UTC y el sitio sigue funcionando igual: la redirección no depende
de la base.

---

## 6. Para cambiar algo

Todo está en `worker/index.js`, arriba de todo:

- **Agregar un QR 3**: una línea más en `QRS` y correr `qr/generar.py` con la
  nueva entrada en `CODIGOS`.
- **Mandar un código a otra parte de la página**: cambiar `destino` en `QRS`,
  por ejemplo `'/#casas'`.
- **Cambiar el nombre de la campaña**: `CAMPANA`.

Después de cualquier cambio: `python3 build.py`, commit y push. Cloudflare
despliega solo y queda en vivo en menos de un minuto.
