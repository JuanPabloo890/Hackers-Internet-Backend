// functions.cjs
module.exports = {
  checkResponse: function (requestParams, response, context, ee, next) {
    if (response.statusCode !== 200) {
      console.error(`Error: ${response.statusCode}`);
    }
    return next(); // Call the next middleware in the chain
  }
};
