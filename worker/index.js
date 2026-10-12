/* ============================================================
   NEIBOR · Worker
   ============================================================
   Dos cosas viven aca:

   1. El reparto de consultas entre GRAB y Calsina.
   2. El seguimiento de los codigos QR impresos.

   El sitio son archivos sueltos y Cloudflare los sirve sin pasar por
   aca. Si una peticion llega a este codigo es porque no habia ningun
   archivo con ese nombre, asi que lo que no reconozcamos se responde
   404, igual que antes de que este Worker existiera.
   ============================================================ */

const SITIO = 'https://neiborcasas.com';

/* El orden del reparto. Con dos entradas alternadas da mitad y mitad.
   Para repartir distinto se cambia esta lista y nada mas: siete para
   GRAB y tres para Calsina, por ejemplo, seria una lista de diez. */
const RUEDA = ['grab', 'calsina'];

const NUMEROS = {
  grab: '5493517570326',
  calsina: '5493518644742'
};

/* ---------- Los codigos QR ----------------------------------------
   Lo impreso es la direccion corta: neiborcasas.com/q/1. Eso no cambia
   nunca. El destino y las etiquetas si se pueden cambiar desde aca sin
   volver a imprimir nada, que es la razon de pasar por un redirector en
   lugar de poner la direccion larga dentro del codigo.
------------------------------------------------------------------- */
const QRS = {
  '1': { id: 'qr_1', destino: '/' },
  '2': { id: 'qr_2', destino: '/' }
};

/* Las etiquetas que viajan en la direccion de destino. utm_content es lo
   que distingue un codigo del otro; las otras tres son iguales en los dos
   porque la campana es la misma. */
const CAMPANA = {
  utm_source: 'qr',
  utm_medium: 'offline',
  utm_campaign: 'campana_qr'
};

/* Cordoba esta tres horas atras de UTC y no mueve el reloj en verano, asi
   que la fecha local sale de restar tres horas. Importa para agrupar por
   dia: un escaneo de las diez de la noche es de ese dia y no del siguiente. */
function diaLocal(fecha) {
  return new Date(fecha.getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/* Lo que no es una persona con un telefono o una computadora. No se cuenta
   en los numeros de arriba del tablero, pero queda guardado: si un dia los
   escaneos se disparan conviene poder ver que eran robots. */
const ROBOTS = /bot|crawl|spider|slurp|preview|facebookexternal|whatsapp|telegram|twitter|linkedin|discord|embed|curl|wget|python|headless|lighthouse|pagespeed|monitor|pingdom|uptime|validator/i;

function clasificar(agente) {
  if (!agente) return 'bot';
  if (ROBOTS.test(agente)) return 'bot';
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(agente)) return 'movil';
  return 'escritorio';
}

function responder(datos, estado) {
  return new Response(JSON.stringify(datos), {
    status: estado || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      /* Sin esto el borde podria guardar una respuesta y darle el mismo
         turno a todo el mundo, que es lo contrario de repartir. */
      'Cache-Control': 'no-store'
    }
  });
}

function noExiste() {
  return new Response('No encontrado', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

/* Una sola clave abre el conteo del reparto y el tablero de los QR. Se
   carga en el panel de Cloudflare como variable secreta. Mientras no
   exista, esas direcciones no existen. No protege datos personales:
   adentro hay cuentas de escaneos, no gente. */
function claveOk(entorno, url) {
  const clave = entorno.CLAVE_PANEL || entorno.CLAVE_REPARTO;
  return !!clave && url.searchParams.get('clave') === clave;
}

/* ---------- Guardar un escaneo ------------------------------------
   Devuelve una promesa. Quien la llama la manda a waitUntil y no la
   espera: la persona tiene que salir rumbo a la pagina ahora, no cuando
   la base conteste.
------------------------------------------------------------------- */
function guardarEscaneo(entorno, datos) {
  return entorno.QR.prepare(
    'INSERT INTO qr_eventos (ev, creado, dia, qr, utm_source, utm_medium,' +
    ' utm_campaign, utm_content, destino, pais, ciudad, clase)' +
    ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    datos.ev, datos.creado, datos.dia, datos.qr,
    CAMPANA.utm_source, CAMPANA.utm_medium, CAMPANA.utm_campaign, datos.qr,
    datos.destino, datos.pais, datos.ciudad, datos.clase
  ).run();
}

/* ---------- Texto a CSV ------------------------------------------- */
function celda(valor) {
  let s = valor === null || valor === undefined ? '' : String(valor);
  /* Una celda que arranca con = o con + la planilla la toma por formula.
     Hoy nada de lo que guardamos puede empezar asi, pero el dia que se
     agregue un campo que venga de afuera esto ya esta puesto. */
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function aCSV(columnas, filas) {
  const lineas = [columnas.join(',')];
  for (const f of filas) lineas.push(columnas.map((c) => celda(f[c])).join(','));
  return lineas.join('\r\n') + '\r\n';
}

function csvRespuesta(texto, nombre) {
  return new Response(texto, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="' + nombre + '"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}

/* ---------- El tablero -------------------------------------------- */
function h(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pct(parte, total) {
  if (!total) return '0%';
  return (Math.round((parte / total) * 1000) / 10).toFixed(1).replace('.0', '') + '%';
}

function tablero(datos, clave) {
  const c = encodeURIComponent(clave);
  const porQr = datos.porQr;
  const total = porQr.reduce((a, f) => a + f.escaneos, 0);
  const nombre = { qr_1: 'QR 1', qr_2: 'QR 2' };

  let filas = '';
  for (const f of porQr) {
    filas +=
      '<tr><td class="q">' + h(nombre[f.qr] || f.qr) + '</td>' +
      '<td class="n">' + f.escaneos + '</td>' +
      '<td class="n">' + pct(f.escaneos, total) + '</td>' +
      '<td class="n">' + f.llegadas + '</td>' +
      '<td class="n">' + pct(f.llegadas, f.escaneos) + '</td>' +
      '<td class="n">' + f.consultas + '</td>' +
      '<td class="n destaca">' + pct(f.consultas, f.escaneos) + '</td></tr>';
  }
  if (!filas) filas = '<tr><td colspan="7" class="vacio">Todavia no hay escaneos.</td></tr>';

  let barras = '';
  for (const f of porQr) {
    const ancho = total ? (f.escaneos / total) * 100 : 0;
    barras +=
      '<div class="barra"><span class="barra__rotulo">' + h(nombre[f.qr] || f.qr) + '</span>' +
      '<span class="barra__via"><i style="width:' + ancho.toFixed(1) + '%"></i></span>' +
      '<span class="barra__dato">' + pct(f.escaneos, total) + '</span></div>';
  }

  let dias = '';
  for (const d of datos.porDia) {
    dias +=
      '<tr><td class="q">' + h(d.dia) + '</td>' +
      '<td class="n">' + d.q1 + '</td><td class="n sub">' + d.l1 + '</td>' +
      '<td class="n">' + d.q2 + '</td><td class="n sub">' + d.l2 + '</td></tr>';
  }
  if (!dias) dias = '<tr><td colspan="5" class="vacio">Sin dias cargados.</td></tr>';

  let ultimos = '';
  for (const u of datos.ultimos) {
    ultimos +=
      '<tr><td class="q">' + h(u.creado.replace('T', ' ').slice(0, 16)) + '</td>' +
      '<td>' + h(nombre[u.qr] || u.qr) + '</td>' +
      '<td>' + h(u.clase) + '</td>' +
      '<td>' + h([u.ciudad, u.pais].filter(Boolean).join(', ')) + '</td>' +
      '<td>' + (u.llego ? 'si' : 'no') + '</td>' +
      '<td>' + (u.consulta ? 'si' : 'no') + '</td></tr>';
  }
  if (!ultimos) ultimos = '<tr><td colspan="6" class="vacio">Sin registros.</td></tr>';

  const formula = '=IMPORTDATA("' + SITIO + '/api/qr.csv?clave=' + clave + '&vista=dia")';

  return '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex, nofollow">' +
    '<title>Neibor · QR</title><style>' +
    ':root{--tinta:#131e10;--verde:#26332d;--salvia:#c3c5bb;--papel:#eef4ed;--tierra:#af5d00}' +
    '*{box-sizing:border-box}' +
    'body{margin:0;padding:2.5rem 1.25rem 5rem;background:var(--papel);color:var(--tinta);' +
    'font:400 16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;' +
    '-webkit-font-smoothing:antialiased}' +
    '.hoja{max-width:980px;margin:0 auto}' +
    'h1{margin:0;font-size:clamp(1.5rem,4vw,2.1rem);font-weight:600;letter-spacing:-.02em}' +
    '.sello{display:block;font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;' +
    'opacity:.5;font-weight:600;margin-bottom:.6rem}' +
    'h2{margin:3.2rem 0 1rem;font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;' +
    'opacity:.55;font-weight:600}' +
    'p{margin:.6rem 0 0;max-width:62ch}' +
    '.flojo{opacity:.6;font-size:.9rem}' +
    'table{width:100%;border-collapse:collapse;margin-top:.4rem;font-variant-numeric:tabular-nums}' +
    'th,td{text-align:left;padding:.7rem .6rem;border-bottom:1px solid rgba(19,30,16,.12)}' +
    'th{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;opacity:.5;font-weight:600;' +
    'border-bottom:1px solid rgba(19,30,16,.3)}' +
    'td.n,th.n{text-align:right}td.q{font-weight:500}' +
    'td.sub{opacity:.5;font-size:.9rem}' +
    'td.destaca{font-weight:600;color:var(--tierra)}' +
    'td.vacio{opacity:.5;text-align:center;padding:2rem}' +
    '.barra{display:grid;grid-template-columns:4.5rem 1fr 3.5rem;align-items:center;gap:.9rem;' +
    'margin:.55rem 0;font-variant-numeric:tabular-nums}' +
    '.barra__rotulo{font-weight:500}' +
    '.barra__via{height:12px;background:rgba(19,30,16,.1);display:block;overflow:hidden}' +
    '.barra__via i{display:block;height:100%;background:var(--verde);min-width:2px}' +
    '.barra__dato{text-align:right;font-weight:500}' +
    'code{display:block;background:#fff;border:1px solid rgba(19,30,16,.15);padding:.8rem .9rem;' +
    'margin-top:.7rem;font:400 13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;' +
    'word-break:break-all}' +
    '.enlaces{margin-top:.8rem;display:flex;flex-wrap:wrap;gap:.6rem}' +
    '.enlaces a{display:inline-block;padding:.6rem 1rem;background:var(--tinta);color:var(--papel);' +
    'text-decoration:none;font-size:.9rem;font-weight:500}' +
    '.pie{margin-top:4rem;padding-top:1.2rem;border-top:1px solid rgba(19,30,16,.15);' +
    'font-size:.85rem;opacity:.6}' +
    '@media(max-width:620px){th,td{padding:.6rem .35rem;font-size:.9rem}' +
    '.barra{grid-template-columns:3.4rem 1fr 3rem;gap:.6rem}}' +
    '</style></head><body><div class="hoja">' +
    '<span class="sello">Neibor</span><h1>Rendimiento de los dos QR</h1>' +
    '<p class="flojo">Cuentas al ' + h(new Date().toISOString().slice(0, 16).replace('T', ' ')) +
    ' UTC. Los dias se agrupan en hora de Cordoba. Los robots y las vistas previas de ' +
    'enlaces quedan afuera de estos numeros: ' + datos.robots + ' descartados.</p>' +

    '<h2>Comparacion</h2><table><thead><tr><th>Codigo</th><th class="n">Escaneos</th>' +
    '<th class="n">Reparto</th><th class="n">Llegadas</th><th class="n">% llega</th>' +
    '<th class="n">Consultas</th><th class="n">Conversion</th></tr></thead><tbody>' +
    filas + '</tbody></table>' +
    '<p class="flojo">Escaneo: alguien abrio la direccion del codigo. Llegada: la pagina ' +
    'cargo de verdad en su telefono. Consulta: toco un boton de WhatsApp. La conversion ' +
    'es consultas sobre escaneos.</p>' +

    '<h2>Reparto de escaneos</h2>' + barras +

    '<h2>Por dia</h2><table><thead><tr><th>Dia</th><th class="n">QR 1</th>' +
    '<th class="n">llega</th><th class="n">QR 2</th><th class="n">llega</th>' +
    '</tr></thead><tbody>' + dias + '</tbody></table>' +

    '<h2>Ultimos escaneos</h2><table><thead><tr><th>Fecha UTC</th><th>Codigo</th>' +
    '<th>Equipo</th><th>Donde</th><th>Llego</th><th>Consulto</th>' +
    '</tr></thead><tbody>' + ultimos + '</tbody></table>' +

    '<h2>Llevarlo a una planilla</h2>' +
    '<p>En una hoja de Google, celda A1. La planilla se actualiza sola cada una hora ' +
    'aproximadamente.</p><code>' + h(formula) + '</code>' +
    '<div class="enlaces">' +
    '<a href="/api/qr.csv?clave=' + c + '&amp;vista=dia">Bajar CSV por dia</a>' +
    '<a href="/api/qr.csv?clave=' + c + '&amp;vista=evento">Bajar CSV de escaneos</a>' +
    '</div>' +

    '<p class="pie">neiborcasas.com/q/1 y neiborcasas.com/q/2 son las direcciones ' +
    'impresas. No se guarda ninguna direccion IP ni el nombre del navegador: de cada ' +
    'escaneo quedan la fecha, cual de los dos codigos fue, pais y ciudad aproximados, ' +
    'y si era telefono o computadora.</p>' +
    '</div></body></html>';
}

/* ---------- Las consultas del tablero ----------------------------- */
async function leerDatos(entorno) {
  const r = await entorno.QR.batch([
    entorno.QR.prepare(
      'SELECT qr, COUNT(*) AS escaneos, SUM(llego) AS llegadas,' +
      ' SUM(consulta) AS consultas FROM qr_eventos' +
      " WHERE clase <> 'bot' GROUP BY qr ORDER BY qr"
    ),
    entorno.QR.prepare(
      'SELECT dia,' +
      " SUM(CASE WHEN qr='qr_1' THEN 1 ELSE 0 END) AS q1," +
      " SUM(CASE WHEN qr='qr_2' THEN 1 ELSE 0 END) AS q2," +
      " SUM(CASE WHEN qr='qr_1' THEN llego ELSE 0 END) AS l1," +
      " SUM(CASE WHEN qr='qr_2' THEN llego ELSE 0 END) AS l2" +
      " FROM qr_eventos WHERE clase <> 'bot'" +
      ' GROUP BY dia ORDER BY dia DESC LIMIT 60'
    ),
    entorno.QR.prepare(
      'SELECT creado, qr, clase, pais, ciudad, llego, consulta FROM qr_eventos' +
      ' ORDER BY creado DESC LIMIT 20'
    ),
    entorno.QR.prepare(
      "SELECT COUNT(*) AS robots FROM qr_eventos WHERE clase = 'bot'"
    )
  ]);
  return {
    porQr: r[0].results || [],
    porDia: r[1].results || [],
    ultimos: r[2].results || [],
    robots: (r[3].results && r[3].results[0] && r[3].results[0].robots) || 0
  };
}

export default {
  async fetch(peticion, entorno, contexto) {
    const url = new URL(peticion.url);
    const ruta = url.pathname;

    /* ---------- El redirector de los QR --------------------------
       Lo primero del archivo a proposito: es lo unico que una persona
       de carne y hueso toca de todo esto, y tiene que salir rapido.
    ------------------------------------------------------------- */
    const qrRuta = /^\/q\/([0-9]{1,3})\/?$/i.exec(ruta);
    if (qrRuta) {
      const qr = QRS[qrRuta[1]];
      if (!qr) return noExiste();

      const ev = crypto.randomUUID();
      const destino = new URL(SITIO + qr.destino);
      destino.searchParams.set('utm_source', CAMPANA.utm_source);
      destino.searchParams.set('utm_medium', CAMPANA.utm_medium);
      destino.searchParams.set('utm_campaign', CAMPANA.utm_campaign);
      destino.searchParams.set('utm_content', qr.id);
      /* El identificador del escaneo viaja hasta la pagina. Ella lo
         devuelve cuando termina de cargar y asi se separa el escaneo de
         la visita de verdad. Tambien es lo que evita contar dos veces lo
         mismo: la fila ya existe y solo se marca. */
      destino.searchParams.set('ev', ev);

      const ahora = new Date();
      const geo = peticion.cf || {};
      if (entorno.QR) {
        contexto.waitUntil(
          guardarEscaneo(entorno, {
            ev: ev,
            creado: ahora.toISOString(),
            dia: diaLocal(ahora),
            qr: qr.id,
            destino: destino.toString(),
            pais: geo.country || null,
            ciudad: geo.city || null,
            clase: clasificar(peticion.headers.get('user-agent'))
          }).catch(() => { /* el escaneo se pierde, la persona llega igual */ })
        );
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: destino.toString(),
          /* Sin esto el navegador o el borde guardarian el redireccion y
             los escaneos siguientes no se contarian. Es el error clasico
             de este patron, y por eso no es 301. */
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      });
    }

    /* ---------- La pagina avisa que cargo, y que hubo consulta ---- */
    if (ruta === '/api/qr/evento' && peticion.method === 'POST') {
      if (!entorno.QR) return responder({ error: 'sin base' }, 503);
      let cuerpo = null;
      try { cuerpo = await peticion.json(); } catch (e) { cuerpo = null; }
      const ev = cuerpo && typeof cuerpo.ev === 'string' ? cuerpo.ev : '';
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(ev)) {
        return responder({ error: 'ev' }, 400);
      }
      /* Dos nombres fijos, ninguno sale del cuerpo de la peticion. */
      const campo = cuerpo.tipo === 'consulta' ? 'consulta' : 'llego';
      try {
        const r = await entorno.QR.prepare(
          'UPDATE qr_eventos SET ' + campo + ' = 1, ' + campo + '_en = ?' +
          ' WHERE ev = ? AND ' + campo + ' = 0'
        ).bind(new Date().toISOString(), ev).run();
        return responder({ ok: true, cambio: (r.meta && r.meta.changes) || 0 });
      } catch (e) {
        return responder({ error: 'base' }, 503);
      }
    }

    /* ---------- El tablero de los QR ----------------------------- */
    if (ruta === '/api/qr') {
      if (!claveOk(entorno, url)) return noExiste();
      if (!entorno.QR) return responder({ error: 'sin base' }, 503);
      const datos = await leerDatos(entorno);
      return new Response(tablero(datos, url.searchParams.get('clave')), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
          'Referrer-Policy': 'no-referrer',
          /* La pagina no pide nada de afuera: ni imagenes, ni letras, ni
             javascript. Solo necesita sus propios estilos en linea. */
          'Content-Security-Policy':
            "default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"
        }
      });
    }

    /* ---------- Los mismos datos en CSV -------------------------- */
    if (ruta === '/api/qr.csv') {
      if (!claveOk(entorno, url)) return noExiste();
      if (!entorno.QR) return responder({ error: 'sin base' }, 503);
      const vista = url.searchParams.get('vista') === 'evento' ? 'evento' : 'dia';

      if (vista === 'dia') {
        const r = await entorno.QR.prepare(
          'SELECT dia, qr, COUNT(*) AS escaneos, SUM(llego) AS llegadas,' +
          ' SUM(consulta) AS consultas FROM qr_eventos' +
          " WHERE clase <> 'bot' GROUP BY dia, qr ORDER BY dia, qr"
        ).all();
        return csvRespuesta(
          aCSV(['dia', 'qr', 'escaneos', 'llegadas', 'consultas'], r.results || []),
          'neibor-qr-por-dia.csv'
        );
      }

      /* Google Sheets corta las importaciones grandes, asi que la vista de
         escaneos sueltos viene con las ultimas cinco mil filas. Para todo
         el historico esta la consola SQL de D1 en el panel. */
      const r = await entorno.QR.prepare(
        'SELECT ev, creado, dia, qr, utm_source, utm_medium, utm_campaign,' +
        ' utm_content, destino, pais, ciudad, clase, llego, llego_en,' +
        ' consulta, consulta_en FROM qr_eventos ORDER BY creado DESC LIMIT 5000'
      ).all();
      return csvRespuesta(
        aCSV(['ev', 'creado', 'dia', 'qr', 'utm_source', 'utm_medium',
              'utm_campaign', 'utm_content', 'destino', 'pais', 'ciudad',
              'clase', 'llego', 'llego_en', 'consulta', 'consulta_en'],
             r.results || []),
        'neibor-qr-escaneos.csv'
      );
    }

    /* ---------- El reparto entre GRAB y Calsina ------------------
       Pedir turno. Va por POST a proposito: asi ni un buscador ni una
       precarga del navegador gastan turnos con solo mirar.
    ------------------------------------------------------------- */
    if (ruta === '/api/turno' && peticion.method === 'POST') {
      try {
        const obj = entorno.TURNO.get(entorno.TURNO.idFromName('reparto'));
        const r = await obj.fetch('https://turno/pedir', { method: 'POST' });
        const d = await r.json();
        return responder({ quien: d.quien, num: NUMEROS[d.quien] });
      } catch (e) {
        /* Si el contador falla, que la pagina no se quede sin enlace:
           ella tiene su propio sorteo de respaldo. */
        return responder({ error: 'sin turno' }, 503);
      }
    }

    /* El conteo, para mostrarle a cada empresa cuantas le tocaron. */
    if (ruta === '/api/reparto') {
      if (!claveOk(entorno, url)) return noExiste();
      const obj = entorno.TURNO.get(entorno.TURNO.idFromName('reparto'));
      const r = await obj.fetch('https://turno/leer');
      return responder(await r.json());
    }

    return noExiste();
  }
};

/* El contador del reparto. Es uno solo para todo el sitio, asi que
   atiende de a una consulta por vez y no hay forma de que dos personas se
   lleven el mismo turno. */
export class Turno {
  constructor(ctx) {
    this.ctx = ctx;
    this.total = 0;
    this.conteo = {};
    /* Se lee lo guardado antes de atender nada. */
    ctx.blockConcurrencyWhile(async () => {
      this.total = (await ctx.storage.get('total')) || 0;
      this.conteo = (await ctx.storage.get('conteo')) || {};
    });
  }

  async fetch(peticion) {
    if (new URL(peticion.url).pathname === '/leer') {
      return Response.json({ total: this.total, conteo: this.conteo });
    }
    const quien = RUEDA[this.total % RUEDA.length];
    this.total += 1;
    this.conteo[quien] = (this.conteo[quien] || 0) + 1;
    /* La cuenta se lleva en memoria y se guarda enseguida. Cloudflare no
       entrega la respuesta hasta que la escritura termino, asi que un
       turno entregado es un turno guardado. */
    this.ctx.storage.put('total', this.total);
    this.ctx.storage.put('conteo', this.conteo);
    return Response.json({ quien });
  }
}
