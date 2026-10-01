# -*- coding: utf-8 -*-
"""Pasa un logotipo dibujado sobre blanco a fondo transparente.

El archivo que llego de Calsina tiene canal alfa pero todos sus pixeles
opacos: el fondo es blanco solido. Sobre la salvia de la seccion eso se ve
como un recuadro blanco alrededor del logotipo.

La cuenta es la inversa de componer sobre blanco. Si C es lo que se ve,
K la tinta real y a su opacidad, entonces C = K*a + 255*(1-a). Tomando
a = 1 - min(R,G,B)/255 se despeja K y se recupera la tinta sin tocarle el
tono: el verde del isotipo sigue siendo ese verde y el negro sigue negro.
"""
import struct, sys, zlib

ENTRADA = sys.argv[1]
SALIDA = sys.argv[2]

d = open(ENTRADA, 'rb').read()
assert d[:8] == b'\x89PNG\r\n\x1a\n'

trozos, i = [], 8
while i < len(d):
    ln = struct.unpack('>I', d[i:i+4])[0]
    tipo = d[i+4:i+8]
    trozos.append((tipo, d[i+8:i+8+ln]))
    i += 12 + ln

cab = dict(trozos)[b'IHDR']
w, h, prof, color, comp, filt, entre = struct.unpack('>IIBBBBB', cab)
assert (prof, color, entre) == (8, 6, 0), (prof, color, entre)

crudo = zlib.decompress(b''.join(c for t, c in trozos if t == b'IDAT'))
paso, linea = 4, w * 4
sal = bytearray(h * linea)

def paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    return a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)

# 1. deshacer los filtros de cada linea
pos = 0
for y in range(h):
    f = crudo[pos]; pos += 1
    fila = bytearray(crudo[pos:pos + linea]); pos += linea
    base = y * linea
    for x in range(linea):
        a = sal[base + x - paso] if x >= paso else 0   # ya reconstruido
        b = sal[base - linea + x] if y else 0
        c = sal[base - linea + x - paso] if (y and x >= paso) else 0
        v = fila[x]
        if f == 1: v += a
        elif f == 2: v += b
        elif f == 3: v += (a + b) // 2
        elif f == 4: v += paeth(a, b, c)
        sal[base + x] = v & 0xFF

# 2. despejar la tinta y el alfa
tocados = 0
for p in range(0, len(sal), 4):
    r, g, b = sal[p], sal[p+1], sal[p+2]
    m = r if r < g else g
    if b < m: m = b
    a = 255 - m
    if a < 6:                       # ruido casi blanco: se va entero
        sal[p] = sal[p+1] = sal[p+2] = sal[p+3] = 0
        tocados += 1
        continue
    if a == 255:
        sal[p+3] = 255
        continue
    k = 255 - a                     # lo que aporta el blanco
    for c in range(3):
        v = (sal[p+c] - k) * 255 // a
        sal[p+c] = 0 if v < 0 else (255 if v > 255 else v)
    sal[p+3] = a
    tocados += 1

# 3. volver a escribir, sin filtro y sin los trozos de metadatos
nuevo = bytearray()
for y in range(h):
    nuevo.append(0)
    nuevo += sal[y*linea:(y+1)*linea]
idat = zlib.compress(bytes(nuevo), 9)

def trozo(tipo, datos):
    return (struct.pack('>I', len(datos)) + tipo + datos +
            struct.pack('>I', zlib.crc32(tipo + datos) & 0xFFFFFFFF))

open(SALIDA, 'wb').write(b'\x89PNG\r\n\x1a\n' + trozo(b'IHDR', cab) +
                         trozo(b'IDAT', idat) + trozo(b'IEND', b''))
print('%s: %d de %d pixeles con alfa nuevo' % (SALIDA, tocados, w * h))
