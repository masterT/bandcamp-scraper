var bandcamp = require('../lib/index');

var artistUrl = 'http://musique.coeurdepirate.com/';
bandcamp.getAlbumUrls(artistUrl, function(error, albumUrls) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumUrls);
  }
});
