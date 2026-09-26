/* ============================================================
   NEIBOR · Seis Casas
   Interacciones. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  var WA = '5493517570326';                 // Lucas Bonzano, según Brandbook V.26
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.dataLayer = window.dataLayer || [];

  /* ---------- Las seis casas ----------------------------------------
     Coordenadas en % sobre la imagen de implantación (implantacion-ingresos.jpg).
     Lectura orientativa del plano de proyecto: ajustar con la
     implantación comercial definitiva antes de publicar.
  ------------------------------------------------------------------- */
  /* Planilla del desarrollo (mock up v1, slide 8).
     Las seis casas se identifican por letra y en orden deletrean NEIBOR.
     x / y son porcentajes sobre img/implantacion-ingresos.jpg; la posición
     de cada letra se dedujo de la orientación de fondo declarada. */
  /* Superficies tomadas de los planos por casa (septiembre 2026).
     Las seis se identifican por letra y en orden deletrean NEIBOR.
     x / y son porcentajes sobre img/implantacion-ingresos.jpg; la posición
     de cada letra se dedujo de la orientación de fondo declarada. */
  var CASAS = [
    { letra:'N', n:'Casa N', x:59.6, y:27.1, orient:'Noreste',  terreno:'711 m²', cub:'161 m²', semi:'67 m²', total:'228 m²', estado:'Consultar' },
    { letra:'E', n:'Casa E', x:56.8, y:37.6, orient:'Este',     terreno:'557 m²', cub:'161 m²', semi:'67 m²', total:'228 m²', estado:'Consultar' },
    { letra:'I', n:'Casa I', x:57.5, y:48.2, orient:'Este',     terreno:'550 m²', cub:'172 m²', semi:'69 m²', total:'241 m²', estado:'Consultar' },
    { letra:'B', n:'Casa B', x:57.5, y:63.5, orient:'Sudeste',  terreno:'502 m²', cub:'158 m²', semi:'66 m²', total:'224 m²', estado:'Consultar' },
    { letra:'O', n:'Casa O', x:30.9, y:55.3, orient:'Noroeste', terreno:'595 m²', cub:'161 m²', semi:'67 m²', total:'228 m²', estado:'Consultar' },
    { letra:'R', n:'Casa R', x:25.2, y:67.1, orient:'Noroeste', terreno:'790 m²', cub:'170 m²', semi:'66 m²', total:'236 m²', estado:'Consultar' }
  ];

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- 1. Cabecera que se contrae ---------- */
  var cab = $('#cabecera');
  var barra = $('#barra');
  var ultimo = 0;
  function alScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (cab) cab.classList.toggle('pegada', y > 80);
    if (barra) barra.classList.toggle('visible', y > window.innerHeight * 0.9);
    ultimo = y;
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  /* ---------- 2. Revelados al entrar en pantalla ---------- */
  var aRevelar = $$('.rev, .rev-izq, .rev-der');
  if (reduce || !('IntersectionObserver' in window)) {
    aRevelar.forEach(function (el) { el.classList.add('en'); });
  } else {
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('en'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    aRevelar.forEach(function (el) { obs.observe(el); });

    /* El hero entra siempre, sin esperar al observador: con el titular
       apoyado abajo, en pantallas altas nunca llegaba a cruzar el umbral. */
    var enHero = $$('.hero .rev, .hero .rev-izq, .hero .rev-der');
    setTimeout(function () {
      enHero.forEach(function (el) { el.classList.add('en'); obs.unobserve(el); });
    }, 120);
  }

  /* ---------- 3. Cifras que suben ---------- */
  var cifras = $$('[data-contar]');
  if (cifras.length && !reduce && 'IntersectionObserver' in window) {
    var obsC = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, fin = parseInt(el.getAttribute('data-contar'), 10), t0 = null;
        function paso(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 900, 1);
          el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
        obsC.unobserve(el);
      });
    }, { threshold: 0.6 });
    cifras.forEach(function (el) { obsC.observe(el); });
  }

  /* ---------- 4. El proyecto: el scroll controla la imagen ----------
     Gana el punto cuyo centro queda más cerca de la línea de lectura.
     Se mide cuadro a cuadro, y sólo mientras la secuencia está en
     pantalla, para que nunca salte puntos ni quede colgada. */
  var arq = $('#arq');
  if (arq) {
    var items = $$('.arq__item', arq);
    var imgs = $$('.arq__marco img', arq);
    var marco = $('.arq__marco', arq);
    var pegote = $('.arq__sticky', arq);
    var activo = -1, ultimo = null, corriendo = false;

    function pintar(i) {
      if (i === activo) return;
      activo = i;
      items.forEach(function (it, k) { it.classList.toggle('activo', k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle('viva', k === i); });
    }

    /* Apilado (móvil) la foto queda arriba y se lee debajo.
       En dos columnas se lee a la altura del centro de la foto. */
    function linea() {
      var alto = parseFloat(getComputedStyle(pegote).top) || 0;
      var fin = alto + marco.offsetHeight;
      return window.innerWidth <= 960
        ? fin + (window.innerHeight - fin) * 0.3
        : alto + marco.offsetHeight * 0.5;
    }

    function medir() {
      var pos = window.pageYOffset + 'x' + window.innerHeight;
      if (pos === ultimo) return;
      ultimo = pos;
      var y = linea(), mejor = 0, dist = Infinity;
      for (var k = 0; k < items.length; k++) {
        var r = items[k].getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - y);
        if (d < dist) { dist = d; mejor = k; }
      }
      pintar(mejor);
    }

    function bucle() {
      if (!corriendo) return;
      medir();
      requestAnimationFrame(bucle);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        var dentro = ents[0].isIntersecting;
        if (dentro && !corriendo) { corriendo = true; requestAnimationFrame(bucle); }
        else if (!dentro) { corriendo = false; }
      }, { rootMargin: '300px 0px 300px 0px' }).observe(arq);
    } else {
      corriendo = true;
      requestAnimationFrame(bucle);
    }
    window.addEventListener('resize', function () { ultimo = null; medir(); });
    medir();
  }

  /* ---------- 5. Las seis casas: chinchetas sobre el plano ---------- */
  var impl = $('#implantacion');
  if (impl) {
    CASAS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chincheta';
      b.style.left = c.x + '%';
      b.style.top = c.y + '%';
      b.textContent = c.letra;
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.setAttribute('aria-label', c.n + ', terreno de ' + c.terreno);
      b.setAttribute('data-casa', i);
      impl.appendChild(b);
    });


    var nombre = $('#ficha-nombre'), estado = $('#ficha-estado'),
        orient = $('#ficha-orient'), terreno = $('#ficha-terreno'), cub = $('#ficha-cub'),
        semi = $('#ficha-semi'), total = $('#ficha-total'), plano = $('#ficha-plano');

    function elegir(i) {
      var c = CASAS[i];
      if (!c) return;
      nombre.textContent = c.n;
      estado.textContent = c.estado;
      orient.textContent = c.orient;
      terreno.textContent = c.terreno;
      cub.textContent = c.cub;
      semi.textContent = c.semi;
      total.textContent = c.total;
      plano.setAttribute('href', 'img/plano-casa-' + c.letra.toLowerCase() + '.jpg');
      plano.textContent = 'Ver el plano de la ' + c.n;
      $$('[data-casa]').forEach(function (b) {
        b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-casa'), 10) === i ? 'true' : 'false');
      });
    }

    document.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-casa]') : null;
      if (!b) return;
      elegir(parseInt(b.getAttribute('data-casa'), 10));
    });
  }

  /* ---------- 6. WhatsApp con mensaje según el lugar del clic ---------- */
  function enlaceWA(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }
  $$('[data-wa]').forEach(function (a) {
    a.setAttribute('href', enlaceWA(a.getAttribute('data-wa')));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* Un CTA puede preseleccionar la intención del formulario */
  $$('[data-intencion]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('input[name="intencion"][value="' + a.getAttribute('data-intencion') + '"]');
      if (r) r.checked = true;
    });
  });

  /* ---------- 7. Formulario: arma el mensaje y abre el canal ----------
     No hay backend en esta versión. Para conectar un CRM, reemplazar
     armar() por un fetch al endpoint y mantener el fallback.
  ------------------------------------------------------------------- */
  var form = $('#form');
  if (form) {
    function valido() {
      var n = form.nombre.value.trim(), t = form.telefono.value.trim();
      if (!n || !t) {
        (!n ? form.nombre : form.telefono).focus();
        return false;
      }
      return true;
    }
    function armar() {
      var d = new FormData(form);
      var rotulos = {
        valores: 'valores y forma de pago',
        visita: 'coordinar una visita al terreno',
        plano: 'planos y superficies',
        inversion: 'información para invertir'
      };
      var partes = [
        'Hola, soy ' + d.get('nombre') + '.',
        'Quiero ' + (rotulos[d.get('intencion')] || 'información') + ' de Neibor.',
        'Teléfono: ' + d.get('telefono') + '.'
      ];
      if (d.get('email')) partes.push('Correo: ' + d.get('email') + '.');
      if (d.get('mensaje')) partes.push(d.get('mensaje'));
      return partes.join(' ');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valido()) return;
      window.open(enlaceWA(armar()), '_blank', 'noopener');
    });
    var porMail = $('#por-mail');
    if (porMail) porMail.addEventListener('click', function () {
      if (!valido()) return;
      window.location.href = 'mailto:info@grab.com?subject=' +
        encodeURIComponent('Consulta Neibor, seis casas') +
        '&body=' + encodeURIComponent(armar());
    });
  }

  /* ---------- 8. Plano o axonométrica ---------- */
  if (impl) {
    var capas = $$('.capa', impl);
    $$('[data-vista]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-vista');
        $$('[data-vista]').forEach(function (o) {
          o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
        });
        capas.forEach(function (c) {
          c.classList.toggle('viva', c.getAttribute('data-capa') === v);
        });
        /* Las chinchetas sólo tienen sentido sobre el plano */
        impl.classList.toggle('axo', v !== 'plano');
      });
    });
  }

  /* ---------- 9. Galería a pantalla completa ---------- */
  var pista = $('#galeria-pista');
  if (pista) {
    var slides = $$('.galeria__slide', pista);
    var barra = $('#galeria-barra');
    var actual = 0, reloj = null;
    var DURACION = 5000;

    slides.forEach(function () {
      var t = document.createElement('span');
      t.className = 'galeria__tramo';
      t.appendChild(document.createElement('i'));
      barra.appendChild(t);
    });
    var tramos = $$('.galeria__tramo', barra);

    function marcar(i) {
      tramos.forEach(function (t, k) {
        t.classList.toggle('vista', k < i);
        t.classList.remove('activo');
      });
      if (!reduce) {
        /* reiniciar la animación del tramo activo */
        var t = tramos[i];
        t.querySelector('i').style.width = '0';
        void t.offsetWidth;
        t.classList.add('activo');
      } else {
        tramos[i].classList.add('vista');
      }
    }
    function ir(i, suave) {
      actual = (i + slides.length) % slides.length;
      pista.scrollTo({ left: slides[actual].offsetLeft, behavior: suave === false || reduce ? 'auto' : 'smooth' });
      marcar(actual);
    }
    function arrancar() {
      if (reduce) return;
      detener();
      reloj = setInterval(function () { ir(actual + 1); }, DURACION);
    }
    function detener() { if (reloj) { clearInterval(reloj); reloj = null; } }

    $('#gal-ant').addEventListener('click', function () { ir(actual - 1); arrancar(); });
    $('#gal-sig').addEventListener('click', function () { ir(actual + 1); arrancar(); });
    pista.addEventListener('pointerdown', detener);
    pista.addEventListener('mouseenter', detener);
    pista.addEventListener('mouseleave', arrancar);
    pista.addEventListener('scroll', function () {
      var i = Math.round(pista.scrollLeft / pista.clientWidth);
      if (i !== actual && slides[i]) { actual = i; marcar(actual); }
    }, { passive: true });

    /* sólo corre mientras la galería está en pantalla */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { e.isIntersecting ? arrancar() : detener(); });
      }, { threshold: 0.4 }).observe(pista);
    } else { arrancar(); }
    marcar(0);
  }

  /* ---------- 10. Medición de clicks ----------
     Los eventos se empujan a dataLayer, que es lo que leen Google Tag
     Manager, GA4 o Meta. Cuando haya cuenta se conecta sin tocar esto. */
  function evento(nombre, datos) {
    window.dataLayer = window.dataLayer || [];
    var d = { event: nombre };
    for (var k in datos) { if (Object.prototype.hasOwnProperty.call(datos, k)) d[k] = datos[k]; }
    window.dataLayer.push(d);
  }
  function seccionDe(el) {
    var s = el.closest ? el.closest('section') : null;
    return (s && s.id) || 'sin-seccion';
  }
  document.addEventListener('click', function (e) {
    var wa = e.target.closest ? e.target.closest('[data-wa]') : null;
    if (wa) {
      evento('click_whatsapp', { marca: wa.getAttribute('data-marca') || 'grab', seccion: seccionDe(wa) });
      return;
    }
    var ev = e.target.closest ? e.target.closest('[data-evento]') : null;
    if (ev) evento(ev.getAttribute('data-evento'), { seccion: seccionDe(ev) });
  });
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'form') {
      var r = document.querySelector('input[name="intencion"]:checked');
      evento('envio_formulario', { intencion: r ? r.value : 'sin-dato' });
    }
  });

  /* ---------- 11. Navegación interna suave con cabecera fija ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var dest = document.querySelector(id);
    if (!dest) return;
    e.preventDefault();
    var off = (cab ? cab.offsetHeight : 0) + 12;
    var y = dest.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });

})();
