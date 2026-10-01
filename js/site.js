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
  /* Los planos por casa (PDF del desarrollo, septiembre 2026) rotulan las
     unidades N1 a N6. La correspondencia con las letras del sitio es
     O=N1, R=N2, B=N3, I=N4, E=N5, N=N6, y las superficies de cada plano
     coinciden una por una con las de esta tabla.
     Planilla del desarrollo (mock up v1, slide 8).
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

  /* Una ventana sobre la página. El elemento dialog ya trae el velo, la
     retención del foco y el cierre con escape; acá se suman el cierre por
     clic afuera, la vuelta del foco al disparador y el freno de la rueda.
     Bloquear el scroll con overflow correría el ancho quince píxeles. */
  function ventana(dlg, disparador, alAbrir) {
    if (!dlg || !disparador) return null;
    var ultimo = disparador;
    function abrir(desde) {
      ultimo = (desde && desde.focus) ? desde : disparador;
      if (alAbrir) alAbrir();
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }
    function cerrar() {
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    }
    function frenar(e) {
      if (!(e.target.closest && e.target.closest('.modal__cuerpo'))) e.preventDefault();
    }
    disparador.addEventListener('click', function () { abrir(disparador); });
    $$('[data-cerrar]', dlg).forEach(function (b) { b.addEventListener('click', cerrar); });
    dlg.addEventListener('click', function (e) {
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right ||
          e.clientY < r.top || e.clientY > r.bottom) cerrar();
    });
    dlg.addEventListener('close', function () { (ultimo || disparador).focus(); });
    dlg.addEventListener('wheel', frenar, { passive: false });
    dlg.addEventListener('touchmove', frenar, { passive: false });
    return { abrir: abrir, cerrar: cerrar };
  }

  /* ---------- Red de seguridad de las imágenes ----------
     Dentro de un <picture>, si la fuente elegida no llega el navegador
     no prueba con la siguiente: deja el hueco vacío para siempre. Acá se
     tiran las <source> y se vuelve a pedir el JPEG del propio <img>.
     Los errores de <img> no burbujean, así que se escucha en captura. */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.getAttribute('data-rescatada')) return;
    var pic = img.parentElement;
    if (!pic || pic.tagName !== 'PICTURE') return;
    img.setAttribute('data-rescatada', '1');
    var fuentes = pic.querySelectorAll('source');
    for (var i = 0; i < fuentes.length; i++) pic.removeChild(fuentes[i]);
    var src = img.getAttribute('src');
    img.removeAttribute('srcset');
    img.setAttribute('src', src + (src.indexOf('?') < 0 ? '?r' : '&r'));
  }, true);

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

  /* ---------- 4. Las seis casas: chinchetas, ficha y visor ---------- */
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
      b.setAttribute('aria-label', c.n + ', terreno de ' + c.terreno + '. Ver el plano y las imágenes');
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('data-casa', i);
      impl.appendChild(b);
    });

    var nombre = $('#ficha-nombre'), estado = $('#ficha-estado'),
        orient = $('#ficha-orient'), terreno = $('#ficha-terreno'), cub = $('#ficha-cub'),
        semi = $('#ficha-semi'), total = $('#ficha-total');

    /* ---- Visor: la miniatura elegida pasa al marco grande ---- */
    var visor = $('#visor-img'), visorAvif = $('#visor-avif'),
        visorPie = $('#visor-pie'), visorFull = $('#visor-full'),
        miniPlano = $('#mini-plano'), rotuloPlanos = $('#planos-rotulo'),
        vTerreno = $('#visor-terreno'), vCub = $('#visor-cub'),
        vSemi = $('#visor-semi'), vTotal = $('#visor-total'),
        minis = $$('.mini');

    function mostrar(b) {
      if (!b || !visor) return;
      var foto = $('img', b);
      var full = b.getAttribute('data-full');                 // el original, para el enlace
      var medio = full.replace(/\.jpg$/, '-m.jpg');            // el marco nunca pasa de 660 px
      /* El <source> va primero: si se cambia sólo el src, el picture
         sigue mostrando lo que ya había resuelto. */
      if (visorAvif) visorAvif.setAttribute('srcset', medio.replace(/\.jpg$/, '.avif'));
      visor.src = medio;
      visor.alt = foto ? foto.alt : '';
      visorPie.textContent = b.getAttribute('data-pie');
      visorFull.setAttribute('href', full);
      minis.forEach(function (m) {
        if (m === b) m.setAttribute('aria-current', 'true');
        else m.removeAttribute('aria-current');
      });
    }
    minis.forEach(function (b) {
      b.addEventListener('click', function () { mostrar(b); });
    });

    /* Las miniaturas viven dentro de una ventana cerrada, donde la carga
       diferida del navegador no llega a dispararse. Se sueltan la primera
       vez que se abre, así no pesan mientras nadie las mira. */
    var minisSueltas = false;
    function soltarMinis() {
      if (minisSueltas) return;
      minisSueltas = true;
      $$('.mini img').forEach(function (i) { i.loading = 'eager'; });
    }

    /* Las dos ventanas. La de planos siempre abre en el plano de la casa. */
    ventana($('#ficha-tecnica'), $('#abrir-ficha-tecnica'));
    var vPlanos = ventana($('#planos'), $('#ficha-plano'), function () {
      soltarMinis();
      mostrar(miniPlano);
    });

    function elegir(i) {
      var c = CASAS[i];
      if (!c) return;
      var letra = c.letra.toLowerCase();
      nombre.textContent = c.n;
      estado.textContent = c.estado;
      orient.textContent = c.orient;
      terreno.textContent = c.terreno;
      cub.textContent = c.cub;
      semi.textContent = c.semi;
      total.textContent = c.total;

      /* El visor sigue a la casa elegida y vuelve siempre a su plano. */
      if (miniPlano) {
        var foto = $('img', miniPlano);
        miniPlano.setAttribute('data-full', 'img/plano-casa-' + letra + '.jpg');
        miniPlano.setAttribute('data-pie', 'El plano de la ' + c.n);
        if (foto) {
          foto.src = 'img/plano-casa-' + letra + '-m.jpg';
          foto.alt = 'Plano de la ' + c.n + ' sobre su lote, con las superficies al pie.';
        }
        if (rotuloPlanos) rotuloPlanos.textContent = c.n;
        if (vTerreno) {
          vTerreno.textContent = c.terreno;
          vCub.textContent = c.cub;
          vSemi.textContent = c.semi;
          vTotal.textContent = c.total;
        }
        mostrar(miniPlano);
      }

      $$('[data-casa]').forEach(function (b) {
        b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-casa'), 10) === i ? 'true' : 'false');
      });
    }

    document.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-casa]') : null;
      if (!b) return;
      elegir(parseInt(b.getAttribute('data-casa'), 10));
      /* Desde el plano, la chincheta abre la ventana con todo el material de
         esa casa. Las letras de abajo sólo cambian la ficha, para poder
         comparar superficies sin abrir y cerrar. */
      if (vPlanos && b.classList.contains('chincheta')) vPlanos.abrir(b);
    });
  }

  /* ---------- 5. WhatsApp con mensaje según el lugar del clic ---------- */
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

  /* ---------- 6. Formulario: arma el mensaje y abre el canal ----------
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

  /* ---------- 7. Plano o axonométrica ---------- */
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

  /* ---------- 8. Las galerías a pantalla completa ----------
     Son dos tiras con el mismo mecanismo: pasan solas cada cinco segundos
     y también a mano. El contador y las flechas están para que las dos
     cosas se entiendan sin leer nada. */
  var vFoto = $('#v-foto');
  var fImg = $('#foto-img'), fAvif = $('#foto-avif');
  var fPie = $('#foto-pie'), fCuenta = $('#foto-cuenta');
  var enTira = null, enFoto = 0, volverA = null;

  function dos(n) { return n < 10 ? '0' + n : String(n); }

  /* --- La foto entera, en su ventana --------------------------------
     Una sola ventana para las dos galerías: guarda de cuál vino y se
     mueve dentro de esa. Acá la imagen entra completa y sin recorte,
     que es lo contrario de lo que hace la tira. */
  function pintarFoto(i) {
    if (!enTira) return;
    var slides = enTira.slides;
    enFoto = (i + slides.length) % slides.length;
    var im = $('img', slides[enFoto]);
    var pie = $('figcaption', slides[enFoto]);
    var full = im.getAttribute('src');
    /* El <source> va primero: cambiando sólo el src, el picture sigue
       mostrando lo que ya había resuelto. */
    if (fAvif) fAvif.setAttribute('srcset', full.replace(/\.jpg$/, '.avif'));
    fImg.src = full;
    fImg.alt = im.alt;
    fPie.textContent = pie ? pie.textContent : '';
    fCuenta.textContent = dos(enFoto + 1) + ' / ' + dos(slides.length);
  }
  function cerrarFoto() {
    if (vFoto.close) vFoto.close(); else vFoto.removeAttribute('open');
  }

  function armarGaleria(raiz) {
    var pista = $('[data-pista]', raiz);
    var barra = $('[data-barra]', raiz);
    if (!pista || !barra) return;
    var slides = $$('.galeria__slide', pista);
    var cuenta = $('[data-cuenta]', raiz);
    var actual = 0, reloj = null, moviendo = 0, x0 = 0, y0 = 0;
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
      if (cuenta) cuenta.textContent = dos(i + 1) + ' / ' + dos(slides.length);
    }
    function ir(i, suave) {
      actual = (i + slides.length) % slides.length;
      moviendo = Date.now();
      pista.scrollTo({ left: slides[actual].offsetLeft, behavior: suave === false || reduce ? 'auto' : 'smooth' });
      marcar(actual);
    }
    function detener() { if (reloj) { clearInterval(reloj); reloj = null; } }
    function arrancar() {
      if (reduce || (vFoto && vFoto.open)) return;
      detener();
      reloj = setInterval(function () { ir(actual + 1); }, DURACION);
    }

    var tira = { slides: slides, ir: ir, arrancar: arrancar, detener: detener,
                 abridores: $$('.galeria__abrir', pista) };

    $('[data-ant]', raiz).addEventListener('click', function () { ir(actual - 1); arrancar(); });
    $('[data-sig]', raiz).addEventListener('click', function () { ir(actual + 1); arrancar(); });
    /* Un arrastre para pasar de imagen no tiene que abrir nada: sólo
       cuenta como clic si el dedo o el mouse no se corrieron. */
    pista.addEventListener('pointerdown', function (e) {
      detener(); moviendo = 0; x0 = e.clientX; y0 = e.clientY;
    });
    pista.addEventListener('mouseenter', detener);
    pista.addEventListener('mouseleave', arrancar);
    pista.addEventListener('scroll', function () {
      /* Mientras corre un movimiento pedido por código llegan posiciones de
         paso que pelean contra el destino. Se descartan por un momento, y el
         primer toque en la tira vuelve a darle la palabra al dedo. */
      if (Date.now() - moviendo < 700) return;
      var i = Math.round(pista.scrollLeft / pista.clientWidth);
      if (i !== actual && slides[i]) { actual = i; marcar(actual); }
    }, { passive: true });

    if (vFoto) {
      tira.abridores.forEach(function (b, i) {
        b.addEventListener('click', function (e) {
          /* e.detail vale 0 cuando el clic vino del teclado: ahí no hay
             arrastre que medir y la guarda no corresponde. */
          if (e.detail !== 0 &&
              (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10)) return;
          detener();
          enTira = tira;
          volverA = b;
          pintarFoto(i);
          if (vFoto.showModal) vFoto.showModal(); else vFoto.setAttribute('open', '');
        });
      });
    }

    /* sólo corre mientras esa galería está en pantalla */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { e.isIntersecting ? arrancar() : detener(); });
      }, { threshold: 0.4 }).observe(pista);
    } else { arrancar(); }
    marcar(0);
  }

  $$('[data-galeria]').forEach(armarGaleria);

  if (vFoto && fImg) {
    $$('[data-cerrar]', vFoto).forEach(function (b) { b.addEventListener('click', cerrarFoto); });
    $('#foto-ant').addEventListener('click', function () { pintarFoto(enFoto - 1); });
    $('#foto-sig').addEventListener('click', function () { pintarFoto(enFoto + 1); });

    vFoto.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); pintarFoto(enFoto - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); pintarFoto(enFoto + 1); }
    });
    /* La ventana ocupa toda la pantalla, así que el rectángulo no sirve
       para saber si el clic fue afuera: se mira si cayó en el fondo. */
    vFoto.addEventListener('click', function (e) { if (e.target === vFoto) cerrarFoto(); });
    vFoto.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    /* Sobre el fondo se frena el desplazamiento, sobre la foto no: ahí
       el gesto es el de agrandar con dos dedos, que en el teléfono es
       lo único que hace a esta ventana más útil que la tira. */
    vFoto.addEventListener('touchmove', function (e) {
      if (!(e.target.closest && e.target.closest('.foto'))) e.preventDefault();
    }, { passive: false });
    /* Al cerrar, la tira queda en la imagen que se estaba mirando y el
       foco vuelve a esa misma, no a la de donde se entró. Va con
       preventScroll porque enfocar algo corrido de pantalla la arrastra
       de vuelta, y eso deshacía el movimiento de la línea de arriba. */
    vFoto.addEventListener('close', function () {
      if (!enTira) return;
      enTira.ir(enFoto, false);
      var destino = enTira.abridores[enFoto] || volverA;
      if (destino) { try { destino.focus({ preventScroll: true }); } catch (e) { destino.focus(); } }
      enTira.arrancar();
    });
  }

  /* ---------- 9. Medición de clicks ----------
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

  /* ---------- 10. Navegación interna suave con cabecera fija ---------- */
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
