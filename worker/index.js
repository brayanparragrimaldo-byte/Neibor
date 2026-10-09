/* ============================================================
   NEIBOR · Reparto de consultas entre GRAB y Calsina
   ============================================================
   El sitio son archivos sueltos y Cloudflare los sirve sin pasar por
   aca. Si una peticion llega a este codigo es porque no habia ningun
   archivo con ese nombre, asi que lo que no reconozcamos se responde
   404, igual que antes de que este Worker existiera.
   ============================================================ */

/* El orden del reparto. Con dos entradas alternadas da mitad y mitad.
   Para repartir distinto se cambia esta lista y nada mas: siete para
   GRAB y tres para Calsina, por ejemplo, seria una lista de diez. */
const RUEDA = ['grab', 'calsina'];

const NUMEROS = {
  grab: '5493517570326',
  calsina: '5493518644742'
};

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

export default {
  async fetch(peticion, entorno) {
    const url = new URL(peticion.url);

    /* Pedir turno. Va por POST a proposito: asi ni un buscador ni una
       precarga del navegador gastan turnos con solo mirar. */
    if (url.pathname === '/api/turno' && peticion.method === 'POST') {
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

    /* El conteo, para mostrarle a cada empresa cuantas le tocaron. Solo
       responde si en el panel de Cloudflare se cargo la variable
       CLAVE_REPARTO y la peticion trae esa misma clave. Mientras no
       exista la variable, esta direccion no existe. */
    if (url.pathname === '/api/reparto') {
      const clave = entorno.CLAVE_REPARTO;
      if (!clave || url.searchParams.get('clave') !== clave) return noExiste();
      const obj = entorno.TURNO.get(entorno.TURNO.idFromName('reparto'));
      const r = await obj.fetch('https://turno/leer');
      return responder(await r.json());
    }

    return noExiste();
  }
};

/* El contador. Es uno solo para todo el sitio, asi que atiende de a una
   consulta por vez y no hay forma de que dos personas se lleven el
   mismo turno. */
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
