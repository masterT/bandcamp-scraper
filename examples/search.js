var bandcamp = require('../lib/index');

bandcamp.search({
  query: 'Coeur de pirate',
  page: 1
}, function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});