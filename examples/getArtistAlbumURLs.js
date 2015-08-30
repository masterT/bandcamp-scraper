var bandcamp = require('../lib/index');

bandcamp.getArtistAlbumURLs("http://musique.coeurdepirate.com/", function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});