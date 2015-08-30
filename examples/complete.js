var bandcamp = require('../lib/index');

var albumProductsFromArtistName = function(artistName, callback) {
  bandcamp.search({
    query: artistName
  }, function(error, results) {
    if (error) {
      callback(error, null);
    } else {
      // take the first type 'artist' result
      var artist;
      for (var i = 0; i < results.length; i++) {
        if (results[i].type == 'artist') {
          artist = results[i];
          break;
        }
      };
      // search album url
      if (artist) {
        console.log("Artist found!");
        console.log("Searching for albums URL...");
        bandcamp.getArtistAlbumURLs(artist.link, function(error, albumURLs) {
          if (error) {
            callback(error, null);
          } else {
            console.log(albumURLs);
            console.log("Searching for albums products...");
            // get album products
            for (var i = albumURLs.length - 1; i >= 0; i--) {
              bandcamp.getAlbumProducts(albumURLs[i], function(error, albumProducts) {
                if (error) {
                  callback(error, null);
                } else {
                  callback(null, albumProducts);
                }
              }.bind(this));
            };
          }
        });
      } else {
        callback("No such artist", null);
      }
    }
  });
};

albumProductsFromArtistName("Coeur de pirate", function(error, albumProducts) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumProducts);
  }
});