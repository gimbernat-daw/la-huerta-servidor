// Comunicación con la API de La Huerta.
// El catálogo y los cupones ya no están escritos en el JavaScript:
// se piden al servidor cada vez que se carga la página.

var PRODUCTOS = [];

/**
 * Pide una ruta de la API y devuelve su respuesta convertida a objeto.
 *
 * Si la respuesta no es correcta, el error lleva el código de estado.
 * También indica si el error viene de la propia API (responde en JSON)
 * o de otro sitio, por ejemplo el servidor web cuando la API no existe.
 *
 * @param {string} ruta - Ruta dentro de la API, por ejemplo "/productos".
 * @returns {Promise<any>} Los datos que devuelve la API.
 */
function pedirApi(ruta) {
  return fetch(CONFIG.urlApi + ruta).then(function (respuesta) {
    if (!respuesta.ok) {
      var tipo = respuesta.headers.get("Content-Type") || "";
      var error = new Error("HTTP " + respuesta.status);
      error.estado = respuesta.status;
      error.deLaApi = tipo.indexOf("application/json") != -1;
      throw error;
    }
    return respuesta.json();
  });
}

function cargarProductos() {
  return pedirApi("/productos");
}

/**
 * Comprueba un código de descuento.
 *
 * @param {string} codigo - Lo que ha escrito el usuario.
 * @returns {Promise<object|null>} El cupón, o null si el código no existe.
 */
function comprobarCupon(codigo) {
  return pedirApi("/cupones/" + encodeURIComponent(codigo)).catch(function (error) {
    // Un 404 de la API significa "ese cupón no existe".
    // Un 404 de cualquier otro sitio significa que la API no está.
    if (error.estado == 404 && error.deLaApi) {
      return null;
    }
    throw error;
  });
}
