function validarNombre(nombre) {
  var limpio = nombre.trim();
  if (limpio.length < 3) {
    return "Escribe tu nombre y apellidos.";
  }
  if (limpio.indexOf(" ") == -1) {
    return "Falta al menos un apellido.";
  }
  return "";
}

function validarEmail(email) {
  var patron = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!patron.test(email.trim())) {
    return "El correo electrónico no es válido.";
  }
  return "";
}

function validarTelefono(telefono) {
  var limpio = telefono.replace(/[\s-]/g, "");
  if (limpio.indexOf("+34") == 0) {
    limpio = limpio.substring(3);
  }
  if (!/^[6789]\d{8}$/.test(limpio)) {
    return "El teléfono debe tener 9 cifras y empezar por 6, 7, 8 o 9.";
  }
  return "";
}

function validarCodigoPostal(cp) {
  var limpio = cp.trim();
  if (!/^\d{5}$/.test(limpio)) {
    return "El código postal debe tener 5 cifras.";
  }
  var provincia = parseInt(limpio.substring(0, 2), 10);
  if (provincia < 1 || provincia > 52) {
    return "El código postal no corresponde a ninguna provincia.";
  }
  return "";
}

function validarMensaje(mensaje) {
  var limpio = mensaje.trim();
  if (limpio.length > 0 && limpio.length < 10) {
    return "Si escribes un mensaje, que tenga al menos 10 caracteres.";
  }
  if (limpio.length > 500) {
    return "El mensaje no puede superar los 500 caracteres.";
  }
  return "";
}

function validarFormulario(datos) {
  var errores = {
    nombre: validarNombre(datos.nombre),
    email: validarEmail(datos.email),
    telefono: validarTelefono(datos.telefono),
    cp: validarCodigoPostal(datos.cp),
    mensaje: validarMensaje(datos.mensaje)
  };

  var valido = true;
  for (var campo in errores) {
    if (errores[campo] != "") {
      valido = false;
    }
  }

  return { valido: valido, errores: errores };
}
