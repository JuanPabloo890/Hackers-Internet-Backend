module.exports = {
  checkResponse: function (requestParams, response, context, ee, next) {
    console.log(`Request to ${requestParams.url} returned status code: ${response.statusCode}`);

    // Log response body for debugging (optional)
    console.log(response.body);

    if (response.statusCode !== 200) {
      console.error(`Error: ${response.statusCode}`);
    }
    return next(); // Call the next middleware in the chain
  }
};
