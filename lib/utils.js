var cheerio     = require('cheerio'),
    diacritics  = require('diacritics'),
    url         = require('url'),
    slug        = require('slug'),
    linez       = require('linez');

linez.configure({
  newlines: ['\n', '\r\n', '\r']
});

var removeMultipleSpace = function (text) {
  return text.replace(/\s{2,}/g, ' ');
}

var removeNewLine = function(text) {
  text = linez(text).lines.map(function(line) {
    return line.text.trim();
  }).join(' ');
  return removeMultipleSpace(text);
}

var parseSearchResults = function(body) {
  var results = [],
      $ = cheerio.load(body);

  var resultItems = $(".result-items li");
  for (var i = 0; i < resultItems.length; i++) {
    var result = {
      image: '',
      tags: []
    },
    $resultItem = $(resultItems[i]);
    // general info
    result.type = $resultItem.find('.itemtype').text().trim().toLowerCase();
    result.name = $resultItem.find('.heading').text().trim();
    result.link = $resultItem.find('.itemurl').text().trim();
    if ($resultItem.find('.art img').length > 0) {
      result.image = $resultItem.find('.art img').attr('src');
    }
    if ($resultItem.find('.tags').length > 0) {
      var tags = $resultItem.find('.tags').text().replace('tags:', '').replace(/\s/g, '');
      result.tags = tags.length > 1 ? tags.split(',') : [];
    }

    // specific info
    switch(result.type) {
      case "artist":
        result.genre = removeMultipleSpace($resultItem.find('.genre').text().replace('genre:', '')).trim();
        result.from = removeMultipleSpace($resultItem.find('.subhead').text()).trim();
        break;
      case "album":
        // TODO parse into a Date
        result.releaseDate = $resultItem.find('.released').text().replace('released ', '').trim();
        result.artist = $resultItem.find('.subhead').text().replace('by ', '').trim();
        var lengthInfo = $resultItem.find('.length').text().trim().split(',');
        if (lengthInfo.length == 2) {
          result.numTracks = parseInt(lengthInfo[0].replace(' tracks', ''));
          result.numMinutes = parseInt(lengthInfo[1].replace(' minutes', ''));
        }
        break;
      case "track":
        // TODO parse into a Date
        result.releaseDate = $resultItem.find('.released').text().replace('released ', '').trim();
        var albumInfo = $resultItem.find('.subhead').text().trim().split(' by ');
        if (albumInfo.length > 0) {
          result.album = removeNewLine(albumInfo[0].replace(/from/, ''))
          albumInfo.shift();
          result.artist = removeNewLine(albumInfo.join(' by '))
        }
        break;
      case "fan":
        result.genre = removeNewLine($resultItem.find('.genre').text().replace('genre:', ''));
        break;
    }
    results.push(result);
  };

  return results;
}

var findAlbumURLs = function(body, artistURL) {
  var results = [],
    $ = cheerio.load(body);

  // option 1. the artist has many albums
  var links;
  if ( $("span.indexpage_list_cell").length > 0 ) {
    links = $("span.indexpage_list_cell").find('a');
  } else if ( $(".music-grid li").length > 0) {
    links = $(".music-grid li").find('a');
  }
  if (typeof links != "undefined") {
    for (var i = 0; i < links.length; i++) {
      var href = $(links[i]).attr('href');
      // only keep relative path (don't get out of bandcamp.com)
      if (! /https?:\/\//i.exec(href)) {
        var albumURL = url.resolve(artistURL, href);
        if (results.indexOf(albumURL) == -1) {
          results.push(albumURL);
        }
      }
    };
  } // option 2. the artist has only one album and its on the artist page
  else {
    links = $("#discography ul li").find('a');
    if (typeof links != "undefined") {
      for (var i = 0; i < links.length; i++) {
        var href = $(links[i]).attr('href');
        // only keep relative path (don't get out of bandcamp.com)
        if (! /https?:\/\//i.exec(href)) {
          var albumURL = url.resolve(artistURL, href);
          if (results.indexOf(albumURL) == -1) {
            results.push(albumURL);
          }
        }
      };
    } else {
      var formatText = $('.buyItem').first().find('.buyItemPackageTitle').text().trim();
      var format = formatText.replace('Digital ', '').toLowerCase();
      var albumTitle = $('#name-section .trackTitle').text().trim().toLowerCase();
      if (albumTitle.length > 0 && format.length > 0) {
        var albumSlug = slug(albumTitle);
        var albumURL = url.resolve(artistURL, '/' + format + '/' + albumSlug);
        results.push(albumURL);
      }
    }
  }

  return results;
}


var trRE = /var TralbumData = ({[\s\S]*is_band_member: (true|false|null)\s+});/;
var urlCleanupRE = /url:\s"([^"]+)"(?:\s+\+\s+)?"([^"]+)",/g;
var cleanupCommentRE = /\s?(\/\/\s[^\n]+)/g;
var jsonifyKeyRE = /\s\s([a-zA-Z\_]+)\s?\:\s([^,]+)(,|\s)/g;
var parseTralbumData = function(html) {
  var match = trRE.exec(html);
  if (match) {
    match = match[1].replace(cleanupCommentRE, '');
    match = match.replace(urlCleanupRE, '"url": "$1$2",');
    match = match.replace(jsonifyKeyRE, '"$1": $2$3');
    return JSON.parse(match);
  }
  return 'none';
};


var parseAlbumInfo = function(body, albumURL) {
  var results = [],
  $ = cheerio.load(body);
  var trData = parseTralbumData($.html());

  // general info
  var artist = $("#name-section span").text().trim();
  var title = $("#name-section .trackTitle").text().trim();
  var genericImage = $("#tralbumArt img").attr("src").replace(/_\d{1,3}\./, "_2."); // use small version
  var tracks = [];

  var trackRows = $('table#track_table tr.track_row_view');
  for (var i = 0; i < trackRows.length; i++) {
    var $tr = $(trackRows[i]);
    var trackResult = {
      name: $("span[itemprop=name]", $tr).text().trim(),
      link: $("a[itemprop=url]", $tr).attr("href").trim(),
      duration: $("meta[itemprop=duration]").attr("content").trim(),
    };
    tracks.push(trackResult);
  }

  console.log(JSON.stringify(trData));

  return {
    title: title,
    artist: artist,
    image: genericImage,
    tracks: tracks,
    raw: trData,
  };
}

var parseAlbumProducts = function(body, albumURL) {
  var results = [],
  $ = cheerio.load(body);

  // general info
  var artist = $("#name-section span").text().trim();
  var title = $("#name-section .trackTitle").text().trim();
  var genericImage = $("#tralbumArt img").attr("src").replace(/_\d{1,3}\./, "_2."); // use small version

  var items = $('.buyItem');
  for (var i = 0; i < items.length; i++) {
    var $item = $(items[i]);
    var result = {
      link: albumURL,
      priceInCents: 0,
      nameYourPrice: false,
      orMore: false,
      soldOut: false,
      format: 'Other',
      numRemaining: null
    };

    // images
    // TODO find why map func. is fucked up
    var specificImages = [];
    var popupImageGallery = $item.find('.popupImageGallery img');
    for (var j = 0; j < popupImageGallery.length; j++) {
      specificImages.push($(popupImageGallery[j]).attr('src'));
    };
    if (specificImages.length > 0) {
      result.images = specificImages;
    } else {
      result.images = [ genericImage ];
    }

    // first digital ones are a little different
    var format = $item.find('.buyItemPackageTitle').text().trim();
    if (format == "Digital Track" || format == "Digital Album") {
      result.format = format;
      result.name = title;
    } else {
      var name = $item.find('.buyItemPackageTitle').text().trim();
      if (name.length == 0) {
        name = $item.find('.hd.lowHeadroom').text().trim();
      }
      result.name = removeNewLine(name);
      var format = $item.find('.merchtype').text().trim();
      if (format.length > 0) {
        result.format = format;
      }
    }
    result.description = removeNewLine($item.find('.bd').text().trim());

    // real price
      var priceElem = $item.find('.ft span.base-text-color');
      if (priceElem.length > 0) {
        var matches = priceElem.text().match(/(\d+)(\.|\,)*(\d{0,2})*/);
        if (Array.isArray(matches) && matches.length == 4) {
          var priceInCentsText = matches[1];
          priceInCentsText += matches[3] !== undefined ? matches[3] : "00";
          result.priceInCents = parseFloat(priceInCentsText);
        }
        var priceExtraElem = $item.find('.ft span.secondaryText');
        // currency
        if (priceExtraElem[0] != undefined) {
          result.currency = $(priceExtraElem[0]).text().trim();
        }
        // or more ?
        if (priceExtraElem[1] != undefined) {
          if( $(priceExtraElem[1]).text().trim() == "or more") {
            result.orMore = true;
          }
        }
      } else {
        // name your price
        var priceExtraText = $item.find('.ft span.secondaryText').text().trim();
        if (priceExtraText == "name your price") {
          result.priceInCents = 0;
          result.nameYourPrice = true;
        }
      }

      // remaining
      var remainingText = $item.find('.notable.end').text().replace(/\D/g, '');
      if (remainingText.length > 0) {
        result.numRemaining = parseInt(remainingText);
      } else {
        // sold out ?
        var soldOutText = $item.find('.notable').text().trim();
        if (soldOutText == "Sold Out") {
          result.soldOut = true;
        }
      }

      // tracks


    results.push(result);
  }
  return results;
}

module.exports.parseSearchResults = parseSearchResults;
module.exports.findAlbumURLs = findAlbumURLs;
module.exports.parseAlbumProducts = parseAlbumProducts;
module.exports.parseAlbumInfo = parseAlbumInfo;