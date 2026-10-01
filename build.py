#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arma index.html a partir de _cuerpo.html.

El <head> vive en index.html y se conserva tal cual. El cuerpo se toma
entero de _cuerpo.html. A la hoja de estilos y al script se les pone un
sello corto del contenido, para que el navegador de quien ya visito la
pagina no mezcle un CSS viejo con un JS nuevo.

    python3 build.py
"""
import hashlib
import io
import os
import re

R = os.path.dirname(os.path.abspath(__file__))


def sello(rel):
    with open(os.path.join(R, rel), 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]


def main():
    head = io.open(os.path.join(R, 'index.html'), encoding='utf-8').read().split('<body>')[0]
    cuerpo = io.open(os.path.join(R, '_cuerpo.html'), encoding='utf-8').read()

    head = re.sub(r'(href="css/site\.css)(\?v=[0-9a-f]+)?"',
                  r'\1?v=%s"' % sello('css/site.css'), head)

    salida = (head + '<body>\n' + cuerpo +
              '\n<script src="js/site.js?v=%s"></script>\n</body>\n</html>\n' % sello('js/site.js'))
    io.open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(salida)
    print('index.html armado')


if __name__ == '__main__':
    main()
