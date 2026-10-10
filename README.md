# 🥕 La Huerta · versión servidor

La tienda de La Huerta, preparada para desplegarse en un servidor propio.

Es la misma aplicación que conocéis, con un cambio importante: **el catálogo y los cupones ya no están escritos en el JavaScript**. Ahora los sirve una API, un pequeño programa en Python que se ejecuta en el servidor. El navegador se los pide cada vez que carga la página.

## Qué hay en este repositorio

```text
la-huerta-servidor/
├── frontend/                 La web: lo que llega al navegador
│   ├── index.html            Catálogo y cesta
│   ├── contacto.html         Formulario de contacto
│   ├── css/estilos.css
│   └── js/
│       ├── api.js            Pide el catálogo y los cupones a la API
│       ├── app.js            Arranque y eventos de la página principal
│       ├── carrito.js        Cesta, descuentos y totales
│       ├── catalogo.js       Filtrado, ordenación y tarjetas de producto
│       ├── config.js         Configuración general
│       ├── contacto.js
│       └── validacion.js
├── api/                      La API: se ejecuta en el servidor
│   ├── main.py               El programa, hecho con FastAPI
│   ├── productos.json        El catálogo
│   ├── cupones.json          Los códigos de descuento
│   └── requirements.txt      Dependencias de Python
└── scripts/
    └── instalar-requisitos.sh
```

Las dos carpetas se despliegan de forma distinta, y entender por qué es parte del tema:

- **`frontend/`** son ficheros estáticos: HTML, CSS y JavaScript que se entregan tal cual. Los sirve un **servidor web**.
- **`api/`** es código que hay que **ejecutar**. Lo pone en marcha un **servidor de aplicaciones** (uvicorn).

## Requisitos

- Ubuntu Server 24.04 LTS (la máquina `huerta-server` de la Ficha 0).
- Python 3.12, que ya viene con el sistema.
- Conexión a internet para instalar las dependencias.

## Instalación

Desde la terminal del servidor:

```bash
sudo mkdir -p /var/www/la-huerta-servidor
sudo chown $USER:$USER /var/www/la-huerta-servidor
git clone https://github.com/gimbernat-daw/la-huerta-servidor.git /var/www/la-huerta-servidor
cd /var/www/la-huerta-servidor
bash scripts/instalar-requisitos.sh
```

**Por qué en `/var/www` y no en tu carpeta personal.** El servidor web se ejecuta con su propio usuario, que no puede entrar en `/home/alumno`. Si dejas la web ahí, no la podrá leer. `/var/www` es donde viven las webs en Linux. Las dos primeras órdenes crean la carpeta y te la asignan (`$USER` es tu usuario: en `huerta-server`, `alumno`), así que a partir de ahí trabajas sin `sudo`.

Y una ventaja: para actualizar la aplicación basta con un `git pull` en esa carpeta.

El script instala lo mínimo para que la API funcione: el módulo `python3-venv` del sistema, un entorno virtual en `api/.venv` y las dependencias de `requirements.txt`. **Nada más.**

> **Lo que no está hecho, a propósito.** El repositorio no instala ni configura el servidor web, ni deja la API funcionando como servicio, ni toca el cortafuegos. Todo eso lo haréis vosotros en las sesiones: es exactamente lo que se evalúa.

## Arrancar la API a mano

```bash
cd api
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
```

La API se queda escuchando en el puerto 8000 **solo dentro del servidor** (`127.0.0.1`): desde vuestro portátil no se llega a ella directamente. Para pararla, `Ctrl + C`.

Para comprobar que responde, desde otra terminal del servidor:

```bash
curl http://127.0.0.1:8000/api/salud
```

## Rutas de la API

| Método y ruta | Qué devuelve |
|---|---|
| `GET /api/salud` | `{"estado": "ok"}` si la API está en marcha |
| `GET /api/productos` | El catálogo completo |
| `GET /api/productos/{id}` | Un producto, o `404` si no existe |
| `GET /api/cupones/{codigo}` | El descuento de un cupón, o `404` si el código no es válido |
| `GET /api/docs` | Documentación interactiva de la API, generada por FastAPI |

No hay ninguna ruta que liste todos los cupones: así nadie puede descubrir los códigos consultando la API.

La API lee `productos.json` y `cupones.json` en cada petición. Si editáis uno de esos ficheros, el cambio se ve al momento, sin reiniciar nada.

## Si la API no responde

La web no se rompe: la página carga, la cesta funciona y, donde debería estar el catálogo, aparece un **mensaje de ERROR** indicando que la API no responde y con qué código. Si alguna vez lo veis, la pregunta es: ¿está arrancada la API? ¿Le llegan las peticiones?

## Cupones de ejemplo

| Código | Descuento |
|---|---|
| `HUERTA10` | 10 % |
| `PRIMERA5` | 5 € |

---

**La Huerta** · Proyecto de prácticas · CFGS DAW · Despliegue de aplicaciones web
