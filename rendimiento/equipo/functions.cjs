// functions.cjs

// Función para generar IDs únicos de equipos
const generateUniqueId = (type) => {
  const prefix = type.toUpperCase();  // 'LAP'
  const randomPart = Math.random().toString(36).substr(2, 8).toUpperCase(); // '8D7031' (parte aleatoria)
  return `${prefix}${randomPart}`;
};

// Función para verificar la respuesta de las peticiones
const checkResponse = function (requestParams, response, context, ee, next) {
  console.log(`Request to ${requestParams.url} returned status code: ${response.statusCode}`);

  // Log response body for debugging (optional)
  console.log(response.body);

  if (response.statusCode !== 200) {
    console.error(`Error: ${response.statusCode}`);
  }
  return next(); // Llama al siguiente middleware en la cadena
};

module.exports = {
  generateUniqueId,
  checkResponse
};
