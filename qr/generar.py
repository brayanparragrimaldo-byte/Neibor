#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera los codigos QR de Neibor en SVG y en PNG.

    python3 qr/generar.py

No usa librerias de afuera: solo zlib y struct, que vienen con Python. El
codificador es el de la norma ISO 18004 en modo byte, con nivel de
correccion Q (recupera hasta el 25% del codigo tapado o rayado, que es lo
que conviene en un cartel a la intemperie).

Para cambiar una direccion se edita CODIGOS y se vuelve a correr. Si la
cadena crece, la version del QR sube sola a la mas chica que la aguante.
"""

import os
import struct
import zlib

TINTA = (0x13, 0x1E, 0x10)
PAPEL = (0xEE, 0xF4, 0xED)
QUIETO = 4          # modulos de margen que pide la norma
NIVEL = 'Q'

CODIGOS = [
    ('neibor-qr-1', 'https://neiborcasas.com/q/1'),
    ('neibor-qr-2', 'https://neiborcasas.com/q/2'),
]


# ---------------------------------------------------------------- GF(256)
# El cuerpo finito sobre el que corre la correccion de errores de Reed
# Solomon. El polinomio 0x11D es el que fija la norma.
EXP = [0] * 512
LOG = [0] * 256
_x = 1
for _i in range(255):
    EXP[_i] = _x
    LOG[_x] = _i
    _x <<= 1
    if _x & 0x100:
        _x ^= 0x11D
for _i in range(255, 512):
    EXP[_i] = EXP[_i - 255]


def _mul(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP[LOG[a] + LOG[b]]


def _poly_mul(a, b):
    r = [0] * (len(a) + len(b) - 1)
    for i, ai in enumerate(a):
        if not ai:
            continue
        for j, bj in enumerate(b):
            if bj:
                r[i + j] ^= _mul(ai, bj)
    return r


def _generador(n):
    g = [1]
    for i in range(n):
        g = _poly_mul(g, [1, EXP[i]])
    return g


def _resto_rs(datos, n):
    """Los n bytes de correccion de un bloque de datos."""
    g = _generador(n)
    r = list(datos) + [0] * n
    for i in range(len(datos)):
        c = r[i]
        if c:
            lc = LOG[c]
            for j in range(1, len(g)):
                if g[j]:
                    r[i + j] ^= EXP[LOG[g[j]] + lc]
    return r[len(datos):]


# -------------------------------------------------- tablas de la norma
# (version, nivel) -> (bytes de correccion por bloque, [(bloques, bytes de
# datos por bloque), ...]). Solo estan las versiones chicas, que son las
# que necesita una direccion corta.
BLOQUES = {
    (1, 'Q'): (13, [(1, 13)]),
    (2, 'Q'): (22, [(1, 22)]),
    (3, 'Q'): (18, [(2, 17)]),
    (4, 'Q'): (26, [(2, 24)]),
    (5, 'Q'): (18, [(2, 15), (2, 16)]),
    (6, 'Q'): (24, [(4, 19)]),
    (1, 'H'): (17, [(1, 9)]),
    (2, 'H'): (28, [(1, 16)]),
    (3, 'H'): (22, [(2, 13)]),
    (4, 'H'): (16, [(4, 9)]),
    (5, 'H'): (22, [(2, 11), (2, 12)]),
    (6, 'H'): (28, [(4, 15)]),
}

# Centros de los patrones de alineacion por version.
ALINEACION = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34]}

# Bits sueltos de relleno al final del area de datos.
SOBRANTE = {1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7}

# Indicador del nivel de correccion dentro de la informacion de formato.
NIVEL_BITS = {'L': 0b01, 'M': 0b00, 'Q': 0b11, 'H': 0b10}


def _capacidad(version, nivel):
    ec, grupos = BLOQUES[(version, nivel)]
    datos = sum(b * d for b, d in grupos)
    return datos - 2          # 4 bits de modo + 8 de longitud = 2 bytes


def _elegir_version(largo, nivel):
    for v in range(1, 7):
        if (v, nivel) in BLOQUES and _capacidad(v, nivel) >= largo:
            return v
    raise ValueError('la cadena no entra en las versiones soportadas')


# ---------------------------------------------------------------- bits
def _bits_datos(texto, version, nivel):
    bytes_ = texto.encode('utf-8')
    ec, grupos = BLOQUES[(version, nivel)]
    total_datos = sum(b * d for b, d in grupos)

    bits = []

    def meter(valor, n):
        for i in range(n - 1, -1, -1):
            bits.append((valor >> i) & 1)

    meter(0b0100, 4)              # modo byte
    meter(len(bytes_), 8)         # longitud, 8 bits para version 1 a 9
    for b in bytes_:
        meter(b, 8)

    # Terminador de hasta cuatro ceros y relleno hasta cerrar el byte.
    hueco = total_datos * 8 - len(bits)
    meter(0, min(4, hueco))
    while len(bits) % 8:
        bits.append(0)

    # Los bytes que faltan se completan alternando estos dos, que es lo
    # que manda la norma para que el relleno no forme figuras.
    relleno = [0xEC, 0x11]
    i = 0
    while len(bits) < total_datos * 8:
        meter(relleno[i % 2], 8)
        i += 1

    palabras = [int(''.join(str(b) for b in bits[i:i + 8]), 2)
                for i in range(0, len(bits), 8)]

    # Se corta en bloques, cada bloque recibe su correccion, y despues se
    # entrelaza todo: asi una mancha en el carton rompe un byte de cada
    # bloque en lugar de un bloque entero.
    datos_bloques = []
    ec_bloques = []
    pos = 0
    for cantidad, largo in grupos:
        for _ in range(cantidad):
            bloque = palabras[pos:pos + largo]
            pos += largo
            datos_bloques.append(bloque)
            ec_bloques.append(_resto_rs(bloque, ec))

    salida = []
    for i in range(max(len(b) for b in datos_bloques)):
        for b in datos_bloques:
            if i < len(b):
                salida.append(b[i])
    for i in range(ec):
        for b in ec_bloques:
            salida.append(b[i])

    finales = []
    for palabra in salida:
        for i in range(7, -1, -1):
            finales.append((palabra >> i) & 1)
    finales += [0] * SOBRANTE[version]
    return finales


# ------------------------------------------------------------- matriz
def _formato(nivel, mascara):
    datos = (NIVEL_BITS[nivel] << 3) | mascara
    v = datos << 10
    while v.bit_length() >= 11:
        v ^= 0x537 << (v.bit_length() - 11)
    return ((datos << 10) | v) ^ 0x5412


def _armar(version, bits_datos, nivel, mascara):
    size = version * 4 + 17
    m = [[0] * size for _ in range(size)]
    fijo = [[False] * size for _ in range(size)]

    def finder(f, c):
        for df in range(-1, 8):
            for dc in range(-1, 8):
                ff, cc = f + df, c + dc
                if not (0 <= ff < size and 0 <= cc < size):
                    continue
                borde = max(abs(df - 3), abs(dc - 3))
                m[ff][cc] = 1 if borde in (0, 1, 3) else 0
                fijo[ff][cc] = True

    finder(0, 0)
    finder(0, size - 7)
    finder(size - 7, 0)

    # Patrones de sincronismo: la fila y la columna 6, alternadas, entre los
    # dos separadores. Van antes de reservar las zonas del formato porque
    # (6,8) y (8,6) caen adentro de esas zonas y aun asi son sincronismo.
    for i in range(8, size - 8):
        m[6][i] = 1 if i % 2 == 0 else 0
        fijo[6][i] = True
        m[i][6] = 1 if i % 2 == 0 else 0
        fijo[i][6] = True

    # Las zonas reservadas: los tres bloques de nueve modulos de las
    # esquinas guardan buscador, separador, formato y el modulo oscuro.
    for f in range(9):
        for c in range(9):
            fijo[f][c] = True
    for f in range(9):
        for c in range(size - 8, size):
            fijo[f][c] = True
    for f in range(size - 8, size):
        for c in range(9):
            fijo[f][c] = True

    # Patrones de alineacion, salvo los que caen sobre un buscador.
    centros = ALINEACION[version]
    for f in centros:
        for c in centros:
            if (f, c) in ((centros[0], centros[0]),
                          (centros[0], centros[-1]),
                          (centros[-1], centros[0])) and len(centros) > 1:
                continue
            for df in range(-2, 3):
                for dc in range(-2, 3):
                    borde = max(abs(df), abs(dc))
                    m[f + df][c + dc] = 1 if borde in (0, 2) else 0
                    fijo[f + df][c + dc] = True

    # El modulo que siempre va oscuro.
    m[size - 8][8] = 1

    # Los datos entran en zigzag desde abajo a la derecha, en columnas de
    # dos, salteando la columna de sincronismo.
    i = 0
    col = size - 1
    subiendo = True
    while col > 0:
        if col == 6:
            col -= 1
        filas = range(size - 1, -1, -1) if subiendo else range(size)
        for f in filas:
            for dc in (0, 1):
                c = col - dc
                if fijo[f][c]:
                    continue
                bit = bits_datos[i] if i < len(bits_datos) else 0
                i += 1
                m[f][c] = bit
        subiendo = not subiendo
        col -= 2

    # La mascara se aplica solo sobre los datos.
    cond = [
        lambda f, c: (f + c) % 2 == 0,
        lambda f, c: f % 2 == 0,
        lambda f, c: c % 3 == 0,
        lambda f, c: (f + c) % 3 == 0,
        lambda f, c: (f // 2 + c // 3) % 2 == 0,
        lambda f, c: (f * c) % 2 + (f * c) % 3 == 0,
        lambda f, c: ((f * c) % 2 + (f * c) % 3) % 2 == 0,
        lambda f, c: ((f + c) % 2 + (f * c) % 3) % 2 == 0,
    ][mascara]
    for f in range(size):
        for c in range(size):
            if not fijo[f][c] and cond(f, c):
                m[f][c] ^= 1

    # La informacion de formato, dos veces por si una copia se arruina.
    # Los quince bits salen con el mas significativo primero: el primero de
    # la tira va en (8,0) y el ultimo en (0,8). Al reves no lo lee nadie.
    bits = _formato(nivel, mascara)
    tira = [(bits >> (14 - p)) & 1 for p in range(15)]
    lugares = ([(8, c) for c in range(6)] + [(8, 7), (8, 8), (7, 8)] +
               [(f, 8) for f in range(5, -1, -1)])
    for p, (f, c) in enumerate(lugares):
        m[f][c] = tira[p]
    for p in range(7):
        m[size - 1 - p][8] = tira[p]
    for p in range(7, 15):
        m[8][size - 15 + p] = tira[p]

    return m


def _penalidad(m):
    """Las cuatro reglas de la norma. Gana la mascara con menos puntos."""
    size = len(m)
    p = 0

    # 1. Tiras de cinco o mas modulos del mismo color.
    for linea in list(m) + [[m[f][c] for f in range(size)] for c in range(size)]:
        corrida = 1
        for i in range(1, size):
            if linea[i] == linea[i - 1]:
                corrida += 1
            else:
                if corrida >= 5:
                    p += 3 + corrida - 5
                corrida = 1
        if corrida >= 5:
            p += 3 + corrida - 5

    # 2. Cuadrados de dos por dos de un solo color.
    for f in range(size - 1):
        for c in range(size - 1):
            v = m[f][c]
            if m[f][c + 1] == v and m[f + 1][c] == v and m[f + 1][c + 1] == v:
                p += 3

    # 3. La figura que imita un buscador.
    figura = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]
    inversa = list(reversed(figura))
    for linea in list(m) + [[m[f][c] for f in range(size)] for c in range(size)]:
        for i in range(size - 10):
            tramo = linea[i:i + 11]
            if tramo == figura or tramo == inversa:
                p += 40

    # 4. Desequilibrio entre oscuro y claro.
    oscuros = sum(sum(f) for f in m)
    porcentaje = oscuros * 100.0 / (size * size)
    p += 10 * int(abs(porcentaje - 50) / 5)
    return p


def codificar(texto, nivel=NIVEL):
    version = _elegir_version(len(texto.encode('utf-8')), nivel)
    bits = _bits_datos(texto, version, nivel)
    mejor, mejor_p = None, None
    for mascara in range(8):
        m = _armar(version, bits, nivel, mascara)
        p = _penalidad(m)
        if mejor_p is None or p < mejor_p:
            mejor, mejor_p = m, p
    return mejor, version


# ------------------------------------------------------------- salidas
def a_svg(m, ruta):
    size = len(m)
    lado = size + QUIETO * 2
    trazo = []
    for f in range(size):
        c = 0
        while c < size:
            if m[f][c]:
                largo = 1
                while c + largo < size and m[f][c + largo]:
                    largo += 1
                trazo.append('M%d %dh%dv1h-%dz' %
                             (c + QUIETO, f + QUIETO, largo, largo))
                c += largo
            else:
                c += 1
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
        'width="%d" height="%d" shape-rendering="crispEdges">'
        '<rect width="%d" height="%d" fill="#%02x%02x%02x"/>'
        '<path d="%s" fill="#%02x%02x%02x"/></svg>'
    ) % (lado, lado, lado * 8, lado * 8, lado, lado, PAPEL[0], PAPEL[1],
         PAPEL[2], ''.join(trazo), TINTA[0], TINTA[1], TINTA[2])
    with open(ruta, 'w', encoding='utf-8') as f:
        f.write(svg)
    return len(svg)


def a_png(m, ruta, objetivo=1200):
    size = len(m)
    lado = size + QUIETO * 2
    escala = max(1, int(round(objetivo / float(lado))))
    ancho = lado * escala
    fila_clara = bytes(PAPEL) * ancho

    filas = []
    for _ in range(QUIETO * escala):
        filas.append(fila_clara)
    for f in range(size):
        linea = bytearray(bytes(PAPEL) * QUIETO * escala)
        for c in range(size):
            linea += bytes(TINTA if m[f][c] else PAPEL) * escala
        linea += bytes(PAPEL) * QUIETO * escala
        for _ in range(escala):
            filas.append(bytes(linea))
    for _ in range(QUIETO * escala):
        filas.append(fila_clara)

    cruda = bytearray()
    for linea in filas:
        cruda.append(0)
        cruda += linea

    def trozo(tipo, datos):
        return (struct.pack('>I', len(datos)) + tipo + datos +
                struct.pack('>I', zlib.crc32(tipo + datos) & 0xFFFFFFFF))

    with open(ruta, 'wb') as salida:
        salida.write(b'\x89PNG\r\n\x1a\n')
        salida.write(trozo(b'IHDR', struct.pack('>IIBBBBB', ancho, ancho,
                                                8, 2, 0, 0, 0)))
        salida.write(trozo(b'IDAT', zlib.compress(bytes(cruda), 9)))
        salida.write(trozo(b'IEND', b''))
    return ancho


if __name__ == '__main__':
    aqui = os.path.dirname(os.path.abspath(__file__))
    for nombre, texto in CODIGOS:
        m, version = codificar(texto)
        svg = os.path.join(aqui, nombre + '.svg')
        png = os.path.join(aqui, nombre + '.png')
        bytes_svg = a_svg(m, svg)
        ancho = a_png(m, png)
        print('%-14s version %d-%s  %dx%d modulos  svg %d B  png %dpx %d B  %s'
              % (nombre, version, NIVEL, len(m), len(m), bytes_svg, ancho,
                 os.path.getsize(png), texto))
