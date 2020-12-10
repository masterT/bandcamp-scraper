const bandcamp = require('../lib/index')

const labelUrl = 'https://randsrecords.bandcamp.com'
bandcamp.getArtistUrls(labelUrl, function (error, artistsUrls) {
  if (error) {
    console.log(error)
  } else {
    console.log(artistsUrls)
  }
})

/*
[
  'https://paulwhite.bandcamp.com/?label=999120622&tab=artists',
  'https://spacedimensioncontroller.bandcamp.com/?label=999120622&tab=artists',
  'https://lone.bandcamp.com/?label=999120622&tab=artists',
  'https://djrum.bandcamp.com/?label=999120622&tab=artists',
  'https://sportinglife.bandcamp.com/?label=999120622&tab=artists',
  'https://maghreban.bandcamp.com/?label=999120622&tab=artists',
  'https://lakker.bandcamp.com/?label=999120622&tab=artists',
  'https://paulatemple.bandcamp.com/?label=999120622&tab=artists',
  'https://talaboman.bandcamp.com/?label=999120622&tab=artists',
  'https://benjamindamage.bandcamp.com/?label=999120622&tab=artists',
  'https://tessela.bandcamp.com/?label=999120622&tab=artists',
  'https://blondes.bandcamp.com/?label=999120622&tab=artists',
  'https://michelemininni.bandcamp.com/?label=999120622&tab=artists',
  'https://alexsmoke.bandcamp.com/?label=999120622&tab=artists',
  'https://unknownarchetype.bandcamp.com/?label=999120622&tab=artists',
  'https://adakaleh.bandcamp.com/?label=999120622&tab=artists',
  'https://slackk.bandcamp.com/?label=999120622&tab=artists',
  'https://moire.bandcamp.com/?label=999120622&tab=artists',
  'https://blawan.bandcamp.com/?label=999120622&tab=artists',
  'https://teengirlfantasy.bandcamp.com/?label=999120622&tab=artists',
  'https://secondstoreyappleblim.bandcamp.com/?label=999120622&tab=artists',
  'https://primitiveworld.bandcamp.com/?label=999120622&tab=artists',
  'https://nonkeen.bandcamp.com/?label=999120622&tab=artists',
  'https://bluedaisy.bandcamp.com/?label=999120622&tab=artists',
  'https://yaksound.bandcamp.com/?label=999120622&tab=artists',
  'https://struction.bandcamp.com/?label=999120622&tab=artists',
  'https://lostsoulsofsaturn.bandcamp.com/?label=999120622&tab=artists',
  'https://afriqua.bandcamp.com/?label=999120622&tab=artists',
  'https://untoldhemlock.bandcamp.com/?label=999120622&tab=artists',
  'https://acidmondays.bandcamp.com/?label=999120622&tab=artists',
  'https://airhead.bandcamp.com/?label=999120622&tab=artists',
  'https://music.maartenvandervleuten.com/?label=999120622&tab=artists',
  'https://taleofus.bandcamp.com/?label=999120622&tab=artists',
  'https://karimsahraoui.bandcamp.com/?label=999120622&tab=artists',
  'https://nicolasjaar.bandcamp.com/?label=999120622&tab=artists',
  'https://marielito.bandcamp.com/?label=999120622&tab=artists',
  'https://hermetics.bandcamp.com/?label=999120622&tab=artists',
  'https://gabriels.bandcamp.com/?label=999120622&tab=artists',
  'https://shcaa.bandcamp.com/?label=999120622&tab=artists',
  'https://benhayes.bandcamp.com/?label=999120622&tab=artists',
  'https://6siss.bandcamp.com/?label=999120622&tab=artists',
  'https://more-time.bandcamp.com/?label=999120622&tab=artists',
  'https://bartaub.bandcamp.com/?label=999120622&tab=artists',
  'https://egyptianhiphop.bandcamp.com/?label=999120622&tab=artists',
  'https://yansima.bandcamp.com/?label=999120622&tab=artists',
  'https://futurebeatalliance.bandcamp.com/?label=999120622&tab=artists',
  'https://architecturalrecs.bandcamp.com/?label=999120622&tab=artists',
  'https://sunelectric.bandcamp.com/?label=999120622&tab=artists',
  'https://robertleiner.bandcamp.com/?label=999120622&tab=artists',
  'https://tournesol-apollo.bandcamp.com/?label=999120622&tab=artists',
  'https://joeybeltram-rs.bandcamp.com/?label=999120622&tab=artists',
  'https://kenishii.bandcamp.com/?label=999120622&tab=artists',
  'https://specialrequest187.bandcamp.com/?label=999120622&tab=artists'
]
*/
