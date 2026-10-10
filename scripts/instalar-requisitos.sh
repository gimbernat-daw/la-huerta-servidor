#!/usr/bin/env bash
#
# La Huerta · instalación de requisitos
#
# Instala lo mínimo para que la API funcione: el módulo de entornos
# virtuales de Python y las dependencias de requirements.txt.
#
# NO instala ni configura el servidor web, el servicio de systemd ni el
# cortafuegos. Eso es parte de vuestro trabajo en las sesiones.
#
# Uso, desde la carpeta del repositorio:
#   bash scripts/instalar-requisitos.sh

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API="$RAIZ/api"

echo "==> 1/3 · Instalando python3-venv (te pedirá la contraseña)"
sudo apt-get update -qq
sudo apt-get install -y -qq python3-venv

echo "==> 2/3 · Creando el entorno virtual en api/.venv"
python3 -m venv "$API/.venv"

echo "==> 3/3 · Instalando las dependencias de la API"
"$API/.venv/bin/pip" install --quiet -r "$API/requirements.txt"

echo
echo "Listo. Versiones instaladas:"
"$API/.venv/bin/pip" list 2>/dev/null | grep -Ei "^(fastapi|uvicorn) "
echo
echo "Para arrancar la API a mano:"
echo "  cd $API"
echo "  .venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000"
echo
echo "Y para comprobarla, desde otra terminal:"
echo "  curl http://127.0.0.1:8000/api/salud"
