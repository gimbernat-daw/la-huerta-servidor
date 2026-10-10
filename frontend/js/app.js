var listaProductos = document.getElementById("lista-productos");
var contador = document.getElementById("contador");
var buscador = document.getElementById("buscador");
var selectorCategoria = document.getElementById("categoria");
var selectorOrden = document.getElementById("orden");
var lineasCarrito = document.getElementById("lineas-carrito");
var avisoVacio = document.getElementById("carrito-vacio");
var campoCupon = document.getElementById("cupon");
var mensajeCupon = document.getElementById("mensaje-cupon");

function actualizarCatalogo() {
  var filtrados = filtrarProductos(PRODUCTOS, buscador.value, selectorCategoria.value);
  var ordenados = ordenarProductos(filtrados, selectorOrden.value);
  pintarCatalogo(ordenados, listaProductos, contador);
}

function crearLineaCarrito(linea) {
  var producto = buscarProductoPorId(linea.id);
  if (producto == null) {
    // El catálogo no se ha cargado, o el producto ya no existe.
    return null;
  }
  var elemento = document.createElement("li");

  var texto = document.createElement("span");
  texto.textContent = linea.cantidad + " × " + producto.nombre;

  var controles = document.createElement("span");
  controles.className = "controles";

  var importe = document.createElement("span");
  importe.textContent = formatearPrecio(producto.precio * linea.cantidad);

  var menos = document.createElement("button");
  menos.textContent = "−";
  menos.dataset.accion = "restar";
  menos.dataset.id = linea.id;

  var mas = document.createElement("button");
  mas.textContent = "+";
  mas.dataset.accion = "sumar";
  mas.dataset.id = linea.id;

  controles.appendChild(importe);
  controles.appendChild(menos);
  controles.appendChild(mas);

  elemento.appendChild(texto);
  elemento.appendChild(controles);
  return elemento;
}

function actualizarCarrito() {
  lineasCarrito.innerHTML = "";

  var pintadas = 0;
  for (var i = 0; i < carrito.length; i++) {
    var elemento = crearLineaCarrito(carrito[i]);
    if (elemento != null) {
      lineasCarrito.appendChild(elemento);
      pintadas = pintadas + 1;
    }
  }

  avisoVacio.hidden = pintadas > 0;

  var totales = calcularTotales();
  document.getElementById("subtotal").textContent = formatearPrecio(totales.subtotal);
  document.getElementById("descuento").textContent = "−" + formatearPrecio(totales.descuento);
  document.getElementById("envio").textContent = formatearPrecio(totales.envio);
  document.getElementById("iva").textContent = formatearPrecio(totales.iva);
  document.getElementById("total").textContent = formatearPrecio(totales.total);
}

buscador.addEventListener("input", actualizarCatalogo);
selectorCategoria.addEventListener("change", actualizarCatalogo);
selectorOrden.addEventListener("change", actualizarCatalogo);

listaProductos.addEventListener("click", function (evento) {
  if (evento.target.tagName == "BUTTON") {
    anadirAlCarrito(Number(evento.target.dataset.id));
    actualizarCarrito();
  }
});

lineasCarrito.addEventListener("click", function (evento) {
  var id = Number(evento.target.dataset.id);
  if (evento.target.dataset.accion == "sumar") {
    anadirAlCarrito(id);
  }
  if (evento.target.dataset.accion == "restar") {
    restarDelCarrito(id);
  }
  actualizarCarrito();
});

document.getElementById("aplicar-cupon").addEventListener("click", function () {
  var codigo = campoCupon.value.trim().toUpperCase();
  if (codigo == "") {
    return;
  }

  mensajeCupon.textContent = "Comprobando el cupón...";
  comprobarCupon(codigo)
    .then(function (cupon) {
      aplicarCupon(cupon);
      mensajeCupon.textContent = cupon ? "Cupón aplicado." : "Ese código no existe.";
      actualizarCarrito();
    })
    .catch(function (error) {
      aplicarCupon(null);
      mensajeCupon.textContent = "ERROR: no se ha podido comprobar el cupón. La API no responde (" + error.message + ").";
      actualizarCarrito();
    });
});

document.getElementById("vaciar").addEventListener("click", function () {
  vaciarCarrito();
  campoCupon.value = "";
  mensajeCupon.textContent = "";
  actualizarCarrito();
});

function mostrarErrorCatalogo(error) {
  var detalle = error.estado ? error.message : "sin respuesta del servidor";
  listaProductos.innerHTML = "";

  var aviso = document.createElement("div");
  aviso.className = "error-api";

  var titulo = document.createElement("strong");
  titulo.textContent = "ERROR: no se ha podido cargar el catálogo.";

  var texto = document.createElement("p");
  texto.textContent = "La API no responde (" + detalle + ").";

  aviso.appendChild(titulo);
  aviso.appendChild(texto);
  listaProductos.appendChild(aviso);
  contador.textContent = "Catálogo no disponible";
}

cargarCarrito();
contador.textContent = "Cargando el catálogo...";
actualizarCarrito();

cargarProductos()
  .then(function (productos) {
    PRODUCTOS = productos;
    actualizarCatalogo();
    actualizarCarrito();
  })
  .catch(mostrarErrorCatalogo);
