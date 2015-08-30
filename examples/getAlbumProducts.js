var bandcamp = require('../lib/index');

bandcamp.getAlbumProducts("http://musique.coeurdepirate.com/album/blonde", function(error, products) {
  if (error) {
    console.log(error);
  } else {
    console.log(products);
  }
});