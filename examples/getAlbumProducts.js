var bandcamp = require('../lib/index');

var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
bandcamp.getAlbumProducts(albumUrl, function(error, albumProducts) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumProducts);
  }
});
