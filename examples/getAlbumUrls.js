var bandcamp = require('../lib/index');

var artistUrl = 'http://musique.coeurdepirate.com/';
bandcamp.getAlbumUrls(artistUrl, function(error, albumUrls) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumUrls);
  }
});

/*
[ 'http://musique.coeurdepirate.com/album/roses',
  'http://musique.coeurdepirate.com/album/carry-on-2',
  'http://musique.coeurdepirate.com/album/oublie-moi-carry-on',
  'http://musique.coeurdepirate.com/album/child-of-light',
  'http://musique.coeurdepirate.com/album/trauma',
  'http://musique.coeurdepirate.com/album/blonde',
  'http://musique.coeurdepirate.com/album/coeur-de-pirate',
  'http://musique.coeurdepirate.com/album/comme-des-enfants-version-originale-et-remix-par-le-matos' ]
*/
