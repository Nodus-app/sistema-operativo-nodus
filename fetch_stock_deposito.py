"""
Consulta la API de stock por ubicación de 611 Logística (Esteban/Giroscop) del
lado del servidor —no del navegador— porque esa API no manda headers CORS y el
fetch desde deposito-3d.html siempre queda bloqueado por el navegador.

Este script corre en un GitHub Action programado (ver
.github/workflows/actualizar_stock_deposito.yml) y guarda el resultado filtrado
(solo tipoUbicacion=ESTIBA, que es lo que usa la animación 3D) en
stock-deposito.json, que la página lee same-origin sin problema de CORS.

Si la API devuelve el error de límite de tiempo ("No ha transcurrido..."), se
deja el archivo anterior tal cual en vez de pisarlo con datos vacíos.
"""
import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

API_URL = 'https://apineuroscien04.com/ApiGiroscop/webresources/Inventario/StockPorUbicacion01/B1,0GKa0AxvYx'
OUT_PATH = 'stock-deposito.json'

req = urllib.request.Request(API_URL, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.load(resp)
except Exception as e:
    print(f'ERROR al consultar la API: {e}')
    sys.exit(1)

filas = [f for f in data.get('stockPorUbicacion', []) if f.get('tipoUbicacion') == 'ESTIBA']
api_status = data.get('error')

if not filas and api_status not in (None, 'Ok'):
    print(f"API sin datos ({api_status}) — se conserva stock-deposito.json existente")
    sys.exit(0)

tz_ar = timezone(timedelta(hours=-3))
salida = {
    'actualizado': datetime.now(tz_ar).strftime('%Y-%m-%dT%H:%M:%S%z'),
    'apiStatus': api_status,
    'stockPorUbicacion': filas,
}
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(salida, f, ensure_ascii=False)

print(f"Guardadas {len(filas)} filas ESTIBA en {OUT_PATH}")
