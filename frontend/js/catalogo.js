function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Convierte una cantidad en un texto de precio con su moneda.
 *
 * @param {number} cantidad - Importe a formatear.
 * @returns {string} El importe formateado, por ejemplo "2,20 €".
 */
function formatearPrecio(cantidad) {
  return cantidad.toLocaleString(CONFIG.idioma, {
    style: "currency",
    currency: CONFIG.moneda
  });
}

/**
 * Filtra una lista de productos por texto de búsqueda y categoría.
 *
 * @param {Array} productos - Lista de productos del catálogo.
 * @param {string} texto - Lo escrito en el buscador (puede estar vacío).
 * @param {string} categoria - Categoría elegida, o "todas".
 * @returns {Array} Los productos que cumplen las dos condiciones.
 */
function filtrarProductos(productos, texto, categoria) {
  var buscado = quitarAcentos(texto.trim().toLowerCase());
  var resultado = [];

  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    var nombre = quitarAcentos(p.nombre.toLowerCase());
    var coincideTexto = buscado == "" || nombre.includes(buscado);
    var coincideCategoria = categoria == "todas" || p.categoria == categoria;

    if (coincideTexto && coincideCategoria) {
      resultado.push(p);
    }
  }

  return resultado;
}

function ordenarProductos(productos, criterio) {
  var copia = productos.slice();
  var temporal = 0;

  if (criterio == "precio-asc") {
    copia.sort(function (a, b) { return a.precio - b.precio; });
  } else if (criterio == "precio-desc") {
    copia.sort(function (a, b) { return b.precio - a.precio; });
  } else {
    copia.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
  }

  return copia;
}

function buscarProductoPorId(id) {
  for (var i = 0; i < PRODUCTOS.length; i++) {
    if (PRODUCTOS[i].id == id) {
      return PRODUCTOS[i];
    }
  }
  return null;
}

function crearTarjetaProducto(producto) {
  var tarjeta = document.createElement("article");
  tarjeta.className = "producto";

  var icono = document.createElement("span");
  icono.className = "icono";
  icono.textContent = producto.icono;

  var etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = producto.categoria;

  var titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  var precio = document.createElement("span");
  precio.className = "precio";
  precio.textContent = formatearPrecio(producto.precio) + " / " + producto.unidad;

  var boton = document.createElement("button");
  boton.textContent = "Añadir";
  boton.dataset.id = producto.id;

  tarjeta.appendChild(icono);
  tarjeta.appendChild(etiqueta);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(precio);

  if (producto.stock == 0) {
    var agotado = document.createElement("span");
    agotado.className = "agotado";
    agotado.textContent = "Agotado";
    tarjeta.appendChild(agotado);
    boton.disabled = true;
  }

  tarjeta.appendChild(boton);
  return tarjeta;
}

function pintarCatalogo(productos, contenedor, contador) {
  contenedor.innerHTML = "";

  for (var i = 0; i < productos.length; i++) {
    contenedor.appendChild(crearTarjetaProducto(productos[i]));
  }

  if (productos.length == 1) {
    contador.textContent = "1 producto";
  } else {
    contador.textContent = productos.length + " productos";
  }
}
