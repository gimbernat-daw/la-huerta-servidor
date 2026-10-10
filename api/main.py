"""API de La Huerta.

Sirve el catálogo de productos y comprueba los cupones de descuento.
Los datos se leen de productos.json y cupones.json en cada petición:
si editas uno de esos ficheros, la API devuelve el cambio al momento,
sin reiniciar nada.

Todas las rutas empiezan por /api, para que el servidor web pueda
reenviarle las peticiones de /api sin cambiar la ruta.
"""

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException

CARPETA = Path(__file__).resolve().parent

app = FastAPI(
    title="La Huerta · API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)


def leer_json(nombre):
    """Lee uno de los ficheros de datos que están junto a este programa."""
    with open(CARPETA / nombre, encoding="utf-8") as fichero:
        return json.load(fichero)


@app.get("/api/salud")
def salud():
    """Comprobación rápida de que la API está en marcha."""
    return {"estado": "ok"}


@app.get("/api/productos")
def listar_productos():
    """Devuelve el catálogo completo."""
    return leer_json("productos.json")


@app.get("/api/productos/{id_producto}")
def obtener_producto(id_producto: int):
    """Devuelve un producto por su id, o 404 si no existe."""
    for producto in leer_json("productos.json"):
        if producto["id"] == id_producto:
            return producto
    raise HTTPException(status_code=404, detail="Producto no encontrado")


@app.get("/api/cupones/{codigo}")
def comprobar_cupon(codigo: str):
    """Devuelve el descuento de un cupón, o 404 si el código no es válido.

    No hay una ruta que liste todos los cupones: así nadie puede
    descubrir los códigos mirando la API.
    """
    cupones = leer_json("cupones.json")
    limpio = codigo.strip().upper()
    if limpio not in cupones:
        raise HTTPException(status_code=404, detail="Cupón no válido")
    return {"codigo": limpio, **cupones[limpio]}
