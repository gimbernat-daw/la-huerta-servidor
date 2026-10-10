var carrito = [];
var cuponActivo = null;

function cargarCarrito() {
  try {
    var guardado = localStorage.getItem(CONFIG.claveAlmacenamiento);
    if (guardado) {
      carrito = JSON.parse(guardado);
    }
  } catch (e) {
    carrito = [];
  }
  return carrito;
}

function guardarCarrito() {
  try {
    localStorage.setItem(CONFIG.claveAlmacenamiento, JSON.stringify(carrito));
  } catch (e) {
    console.log("No se ha podido guardar la cesta");
  }
}

function buscarLinea(idProducto) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == idProducto) {
      return carrito[i];
    }
  }
  return null;
}

/**
 * Añade una unidad de un producto a la cesta.
 *
 * @param {number} idProducto - Id del producto en el catálogo.
 * @returns {boolean} false si no hay stock o se supera el límite.
 */
function anadirAlCarrito(idProducto) {
  var producto = buscarProductoPorId(idProducto);
  if (producto == null || producto.stock == 0) {
    return false;
  }

  var linea = buscarLinea(idProducto);
  var limite = Math.min(producto.stock, CONFIG.maxUnidadesPorProducto);

  if (linea == null) {
    carrito.push({ id: producto.id, cantidad: 1 });
  } else if (linea.cantidad < limite) {
    linea.cantidad = linea.cantidad + 1;
  } else {
    return false;
  }

  guardarCarrito();
  return true;
}

function restarDelCarrito(idProducto) {
  var linea = buscarLinea(idProducto);
  if (linea == null) {
    return;
  }

  linea.cantidad = linea.cantidad - 1;
  if (linea.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }

  guardarCarrito();
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(function (linea) {
    return linea.id != idProducto;
  });
  guardarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  cuponActivo = null;
  guardarCarrito();
}

function calcularSubtotal(lineas) {
  var subtotal = 0;
  for (var i = 0; i < lineas.length; i++) {
    var producto = buscarProductoPorId(lineas[i].id);
    if (producto != null) {
      subtotal = subtotal + producto.precio * lineas[i].cantidad;
    }
  }
  return redondear(subtotal);
}

/**
 * Activa un cupón ya comprobado por la API, o lo quita si es null.
 *
 * @param {object|null} cupon - { codigo, tipo, valor } o null.
 */
function aplicarCupon(cupon) {
  cuponActivo = cupon;
}

function calcularDescuento(subtotal, cupon) {
  if (cupon == null) {
    return 0;
  }

  var descuento = 0;

  if (cupon.tipo == "porcentaje") {
    descuento = subtotal * cupon.valor / 100;
  } else {
    descuento = cupon.valor;
  }

  if (descuento > subtotal) {
    descuento = subtotal;
  }

  return redondear(descuento);
}

function calcularEnvio(importe) {
  if (importe == 0) {
    return 0;
  }
  if (importe >= CONFIG.envioGratisDesde) {
    return 0;
  }
  return CONFIG.costeEnvio;
}

function calcularIvaIncluido(importe) {
  return redondear(importe - importe / (1 + CONFIG.iva));
}

function redondear(numero) {
  return Math.round(numero * 100) / 100;
}

function calcularTotales() {
  var subtotal = calcularSubtotal(carrito);
  var descuento = calcularDescuento(subtotal, cuponActivo);
  var base = redondear(subtotal - descuento);
  var envio = calcularEnvio(base);
  var total = redondear(base + envio);

  return {
    subtotal: subtotal,
    descuento: descuento,
    envio: envio,
    iva: calcularIvaIncluido(total),
    total: total
  };
}
