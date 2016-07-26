var bandcamp = require('../lib/index');

var params = {
  query: 'Coeur de pirate',
  page: 1
};

bandcamp.search(params, function(error, searchResults) {
  if (error) {
    console.log(error);
  } else {
    console.log(searchResults);
  }
});
