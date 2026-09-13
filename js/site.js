/* ============================================================
   NEIBOR · Seis Casas
   Interacciones. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  var WA = '5493517570326';                 // Lucas Bonzano, según Brandbook V.26
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Las seis casas ----------------------------------------
     Coordenadas en % sobre la imagen de implantación (implantacion-ingresos.jpg).
     Lectura orientativa del plano de proyecto: ajustar con la
     implantación comercial definitiva antes de publicar.
  ------------------------------------------------------------------- */
  var CASAS = [
    { n:'Casa 01', x:59.6, y:27.1, frente:'Ecuador',    ubic:'Vértice norte de la manzana',     estado:'Consultar' },
    { n:'Casa 02', x:56.8, y:37.6, frente:'Guido',      ubic:'Frente este, sobre el arbolado',  estado:'Consultar' },
    { n:'Casa 03', x:57.5, y:48.2, frente:'Guido',      ubic:'Frente este, centro de manzana',  estado:'Consultar' },
    { n:'Casa 04', x:57.5, y:63.5, frente:'Guido',      ubic:'Frente este, hacia Paraguay',     estado:'Consultar' },
    { n:'Casa 05', x:30.9, y:55.3, frente:'Montevideo', ubic:'Frente oeste, sobre la diagonal', estado:'Consultar' },
    { n:'Casa 06', x:25.2, y:67.1, frente:'Montevideo', ubic:'Vértice sur, junto al ingreso',   estado:'Consultar' }
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
  }

  /* ---------- 3. La manzana: velo que descubre el plano ---------- */
  var plano = $('#plano-manzana');
  if (plano) {
    if (reduce || !('IntersectionObserver' in window)) {
      plano.classList.add('revelado');
    } else {
      var obsPlano = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) { plano.classList.add('revelado'); obsPlano.disconnect(); }
        });
      }, { threshold: 0.35 });
      obsPlano.observe(plano);
    }
  }

  /* ---------- 4. Cifras que suben ---------- */
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

  /* ---------- 5. Arquitectura: el scroll controla la imagen ---------- */
  var arq = $('#arq');
  if (arq) {
    var items = $$('.arq__item', arq);
    var imgs = $$('.arq__marco img', arq);
    var activo = 0;
    var obsA = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = parseInt(e.target.getAttribute('data-arq-item'), 10);
        if (i === activo) return;
        activo = i;
        items.forEach(function (it, k) { it.classList.toggle('activo', k === i); });
        imgs.forEach(function (im, k) { im.classList.toggle('viva', k === i); });
      });
    }, { rootMargin: '-20% 0px -64% 0px', threshold: 0 });
    items.forEach(function (it) { obsA.observe(it); });
  }

  /* ---------- 6. Las seis casas: chinchetas sobre el plano ---------- */
  var impl = $('#implantacion');
  if (impl) {
    CASAS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chincheta';
      b.style.left = c.x + '%';
      b.style.top = c.y + '%';
      b.textContent = String(i + 1).padStart(2, '0');
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.setAttribute('aria-label', c.n + ', frente a ' + c.frente);
      b.setAttribute('data-casa', i);
      impl.appendChild(b);
    });


    var nombre = $('#ficha-nombre'), estado = $('#ficha-estado'),
        frente = $('#ficha-frente'), ubic = $('#ficha-ubic');

    function elegir(i) {
      var c = CASAS[i];
      if (!c) return;
      nombre.textContent = c.n;
      estado.textContent = c.estado;
      frente.textContent = c.frente;
      ubic.textContent = c.ubic;
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

  /* ---------- 7. WhatsApp con mensaje según el lugar del clic ---------- */
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

  /* ---------- 8. Formulario: arma el mensaje y abre el canal ----------
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

  /* ---------- 9. Navegación interna suave con cabecera fija ---------- */
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
