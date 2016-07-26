var bandcamp = require('../lib/index');

var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
bandcamp.getAlbumInfo(albumUrl, function(error, albumInfo) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumInfo);
  }
});
