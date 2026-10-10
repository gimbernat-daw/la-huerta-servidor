var formulario = document.getElementById("form-contacto");
var resultado = document.getElementById("resultado");

function leerFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    cp: document.getElementById("cp").value,
    mensaje: document.getElementById("mensaje").value
  };
}

function mostrarErrores(errores) {
  for (var campo in errores) {
    document.getElementById("error-" + campo).textContent = errores[campo];
  }
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var comprobacion = validarFormulario(leerFormulario());
  mostrarErrores(comprobacion.errores);

  if (comprobacion.valido) {
    resultado.textContent = "¡Gracias! Te llamaremos para confirmar el reparto.";
    formulario.reset();
  } else {
    resultado.textContent = "Revisa los campos marcados.";
  }
});
