exports.generateSearchUrl = function (params) {
  if (!params || typeof params != 'object') {
    throw new Error('Expect params to be an object.');
  }
  // required
  if (!params.hasOwnProperty('query') || typeof params.query != 'string') {
    throw new Error('Expect params to have string property named query.');
  }
  // optional
  if (params.hasOwnProperty('page') && typeof params.page != 'number') {
    throw new Error('Expect params named page to be type number.');
  }
  params = {
    q: params.query,
    page: params.page || 1
  };
  return "https://bandcamp.com/search?" + Object.keys(params).map(function(name) {
    return name + "=" + encodeURIComponent(params[name]);
  }).join("&");
};
