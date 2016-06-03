var bandcamp = require('../lib/index');

bandcamp.getAlbumInfo("http://joshwhelchel.com/album/oblitus", function(error, products) {
  if (error) {
    console.log(error);
  } else {
    console.log(products);
  }
});