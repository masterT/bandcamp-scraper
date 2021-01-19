const bandcamp = require('../lib/index')

const artistUrl = 'http://musique.coeurdepirate.com/'
bandcamp.getArtistInfo(artistUrl, function (error, albumUrls) {
  if (error) {
    console.log(error)
  } else {
    console.log(albumUrls)
  }
})

/* eslint-disable no-irregular-whitespace */
/*
{
  name: 'Cœur de pirate',
  location: 'Montréal, Québec',
  description: 'Cœur de Pirate is the solo project of singer Béatrice Martin. She has ' +
    'been playing piano since age 3 and released her \n                        ' +
    'acclaimed debut album in 2008. After touring extensively, she was ' +
    'nominated for and won several awards in Canada and France.Label: Dare To ' +
    'Care Records management@daretocarerecords.com \n                        ' +
    '... more',
  coverImage: 'https://f4.bcbits.com/img/0021821004_10.jpg',
  albums: [
    {
      url: 'http://musique.coeurdepirate.com//track/tes-belle',
      coverImage: 'https://f4.bcbits.com/img/a0774650359_7.jpg',
      title: "T'es belle"
    },
    {
      url: 'http://musique.coeurdepirate.com//track/ne-mappelle-pas',
      coverImage: 'https://f4.bcbits.com/img/a2603960871_7.jpg',
      title: "Ne m'appelle pas"
    },
    {
      url: 'http://musique.coeurdepirate.com//album/en-cas-de-temp-te-ce-jardin-sera-ferm',
      coverImage: 'https://f4.bcbits.com/img/a0248413645_7.jpg',
      title: 'en cas de tempête, ce jardin sera fermé.'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/somnambule',
      coverImage: 'https://f4.bcbits.com/img/a1903816474_7.jpg',
      title: 'Somnambule'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/pr-monition-2',
      coverImage: 'https://f4.bcbits.com/img/a2454271957_7.jpg',
      title: 'Prémonition'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/chansons-tristes-pour-no-l',
      coverImage: 'https://f4.bcbits.com/img/a2476670277_7.jpg',
      title: 'Chansons tristes pour Noël'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/roses',
      coverImage: 'https://f4.bcbits.com/img/a3347055233_7.jpg',
      title: 'Roses'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/carry-on-2',
      coverImage: 'https://f4.bcbits.com/img/a4277887982_7.jpg',
      title: 'Carry On'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/oublie-moi-carry-on',
      coverImage: 'https://f4.bcbits.com/img/a0891943451_7.jpg',
      title: 'Oublie​-​moi (Carry On)'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/child-of-light',
      coverImage: 'https://f4.bcbits.com/img/a3984758353_7.jpg',
      title: 'Child of Light'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/trauma',
      coverImage: 'https://f4.bcbits.com/img/a3799110102_7.jpg',
      title: 'Trauma'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/blonde',
      coverImage: 'https://f4.bcbits.com/img/a1328452291_7.jpg',
      title: 'Blonde'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/comme-des-enfants-version-originale-et-remix-par-le-matos',
      coverImage: 'https://f4.bcbits.com/img/a1250129776_7.jpg',
      title: 'Comme des enfants (Version originale et remix par Le Matos)'
    },
    {
      url: 'http://musique.coeurdepirate.com//album/coeur-de-pirate',
      coverImage: 'https://f4.bcbits.com/img/a2201751482_7.jpg',
      title: 'Coeur de pirate'
    }
  ],
  shows: [
    {
      date: 'Mar 06',
      venue: "L'AVAN.C",
      venueUrl: 'https://www.songkick.com/concerts/39735361-coeur-de-pirate-at-lavanc?utm_source=1471&utm_medium=partner',
      location: 'Clermont-Ferrand, France'
    },
    {
      date: 'Mar 07',
      venue: 'LE ROCKSTORE',
      venueUrl: 'https://www.songkick.com/concerts/39678474-coeur-de-pirate-at-le-rockstore?utm_source=1471&utm_medium=partner',
      location: 'Montpellier, France'
    },
    {
      date: 'Mar 10',
      venue: 'Le Studio',
      venueUrl: 'https://www.songkick.com/concerts/39735365-coeur-de-pirate-at-le-studio?utm_source=1471&utm_medium=partner',
      location: 'Caen, France'
    },
    {
      date: 'Mar 11',
      venue: 'La Carrière',
      venueUrl: 'https://www.songkick.com/concerts/39678663-coeur-de-pirate-at-la-carriere?utm_source=1471&utm_medium=partner',
      location: 'Nantes, France'
    },
    {
      date: 'Mar 13',
      venue: 'Theatre Henri Martel',
      venueUrl: 'https://www.songkick.com/concerts/39736979-coeur-de-pirate-at-theatre-henri-martel?utm_source=1471&utm_medium=partner',
      location: 'Sin-le-Noble, France'
    },
    {
      date: 'Mar 14',
      venue: 'Théâtre Sébastopol',
      venueUrl: 'https://www.songkick.com/concerts/39613757-coeur-de-pirate-at-theatre-sebastopol?utm_source=1471&utm_medium=partner',
      location: 'Lille, France'
    },
    {
      date: 'Mar 16',
      venue: 'Espace Culturel Dollfus & Noack',
      venueUrl: 'https://www.songkick.com/concerts/39621438-coeur-de-pirate-at-espace-culturel-dollfus-and-noack?utm_source=1471&utm_medium=partner',
      location: 'Sausheim, France'
    },
    {
      date: 'Mar 17',
      venue: 'Palais Des Congrès - Salle Emile Girardin',
      venueUrl: 'https://www.songkick.com/concerts/39627888-coeur-de-pirate-at-palais-des-congres-salle-emile-girardin?utm_source=1471&utm_medium=partner',
      location: 'Vittel, France'
    },
    {
      date: 'Mar 19',
      venue: 'Trianon Transatlantique',
      venueUrl: 'https://www.songkick.com/concerts/39735367-coeur-de-pirate-at-trianon-transatlantique?utm_source=1471&utm_medium=partner',
      location: 'Sotteville-Les-Rouen, France'
    },
    {
      date: 'Mar 20',
      venue: 'Le 3e Volume Du Minotaure',
      venueUrl: 'https://www.songkick.com/concerts/39735368-coeur-de-pirate-at-le-3e-volume-du-minotaure?utm_source=1471&utm_medium=partner',
      location: 'Vendôme, France'
    },
    {
      date: 'Mar 23',
      venue: 'Radiant Bellevue',
      venueUrl: 'https://www.songkick.com/concerts/39636728-coeur-de-pirate-at-radiant-bellevue?utm_source=1471&utm_medium=partner',
      location: 'CALUIRE ET CUIRE, France'
    },
    {
      date: 'Mar 24',
      venue: 'La Mac - Relais Culturel de Bischwiller',
      venueUrl: 'https://www.songkick.com/concerts/39735369-coeur-de-pirate-at-la-mac-relais-culturel-de-bischwiller?utm_source=1471&utm_medium=partner',
      location: 'Haguenau, France'
    },
    {
      date: 'Mar 26',
      venue: 'Le Rocher de Palmer',
      venueUrl: 'https://www.songkick.com/concerts/39735371-coeur-de-pirate-at-le-rocher-de-palmer?utm_source=1471&utm_medium=partner',
      location: 'Cenon, France'
    },
    {
      date: 'Mar 27',
      venue: 'Centre de Développement Culturel',
      venueUrl: 'https://www.songkick.com/festivals/434838-voix-de-femmes/id/39735372-festival-voix-de-femmes-2021?utm_source=1471&utm_medium=partner',
      location: 'Saint-Martin de Crau, France'
    },
    {
      date: 'Mar 30',
      venue: "Théàtre du Casino d'Enghien",
      venueUrl: 'https://www.songkick.com/concerts/39679951-coeur-de-pirate-at-theatre-du-casino-denghien?utm_source=1471&utm_medium=partner',
      location: 'Enghien Les Bains, France'
    },
    {
      date: 'Mar 31',
      venue: 'Théâtre André Malraux',
      venueUrl: 'http://www.songkick.com/concerts/39628657-coeur-de-pirate-at-theatre-andre-malraux?utm_source=1471&utm_medium=partner',
      location: 'Rueil-Malmaison, France'
    },
    {
      date: 'Apr 02',
      venue: 'Royal Circus (Cirque Royal/Koninklijk Circus)',
      venueUrl: 'https://www.songkick.com/concerts/39623355-coeur-de-pirate-at-royal-circus?utm_source=1471&utm_medium=partner',
      location: 'Brussels, Belgium'
    },
    {
      date: 'Apr 03',
      venue: 'Den Atelier',
      venueUrl: 'https://www.songkick.com/concerts/39682782-coeur-de-pirate-at-den-atelier?utm_source=1471&utm_medium=partner',
      location: 'Luxembourg, Luxembourg'
    },
    {
      date: 'Apr 06',
      venue: 'La Cigale',
      venueUrl: 'https://www.songkick.com/concerts/39682681-coeur-de-pirate-at-la-cigale?utm_source=1471&utm_medium=partner',
      location: 'Paris, France'
    },
    {
      date: 'Apr 07',
      venue: 'La Cigale',
      venueUrl: 'https://www.songkick.com/concerts/39682682-coeur-de-pirate-at-la-cigale?utm_source=1471&utm_medium=partner',
      location: 'Paris, France'
    },
    {
      date: 'Apr 24',
      venue: 'Théâtre du Palais Municipal',
      venueUrl: 'https://www.songkick.com/concerts/39735385-coeur-de-pirate-at-theatre-du-palais-municipal?utm_source=1471&utm_medium=partner',
      location: 'La Baie, QC'
    },
    {
      date: 'May 07',
      venue: 'Le Zénith de St-Eustache',
      venueUrl: 'https://www.songkick.com/concerts/39735378-coeur-de-pirate-at-le-zenith-de-steustache?utm_source=1471&utm_medium=partner',
      location: 'Saint-Eustache, QC'
    },
    {
      date: 'May 14',
      venue: 'Town Hall',
      venueUrl: 'https://www.songkick.com/concerts/39602595-coeur-de-pirate-at-town-hall?utm_source=1471&utm_medium=partner',
      location: 'New York (NYC), NY'
    },
    {
      date: 'May 15',
      venue: 'Berklee Performance Center',
      venueUrl: 'https://www.songkick.com/concerts/39667534-coeur-de-pirate-at-berklee-performance-center?utm_source=1471&utm_medium=partner',
      location: 'Boston, MA'
    },
    {
      date: 'Sep 23',
      venue: 'Salle Desjardins-Telus',
      venueUrl: 'https://www.songkick.com/concerts/39572737-coeur-de-pirate-at-salle-desjardinstelus?utm_source=1471&utm_medium=partner',
      location: 'Rimouski, QC'
    },
    {
      date: 'Sep 24',
      venue: 'Salle Alphonse-Desjardins',
      venueUrl: 'https://www.songkick.com/concerts/39597295-coeur-de-pirate-at-salle-alphonsedesjardins?utm_source=1471&utm_medium=partner',
      location: 'Rivière-du-Loup, QC'
    },
    {
      date: 'Sep 25',
      venue: 'Salle Edwin Belanger',
      venueUrl: 'https://www.songkick.com/concerts/39667532-coeur-de-pirate-at-salle-edwin-belanger?utm_source=1471&utm_medium=partner',
      location: 'Montmagny, QC'
    },
    {
      date: 'Oct 02',
      venue: 'Salle André-Mathieu',
      venueUrl: 'https://www.songkick.com/concerts/39688458-coeur-de-pirate-at-salle-andremathieu?utm_source=1471&utm_medium=partner',
      location: 'Laval, QC'
    },
    {
      date: 'Oct 05',
      venue: 'Konzerthaus',
      venueUrl: 'https://www.songkick.com/concerts/39554891-coeur-de-pirate-at-konzerthaus?utm_source=1471&utm_medium=partner',
      location: 'Vienna, Austria'
    },
    {
      date: 'Oct 06',
      venue: 'Palác Akropolis',
      venueUrl: 'https://www.songkick.com/concerts/39641479-coeur-de-pirate-at-palac-akropolis?utm_source=1471&utm_medium=partner',
      location: 'Prague, Czech Republic'
    },
    {
      date: 'Oct 08',
      venue: 'Passionskirche Kreuzberg',
      venueUrl: 'https://www.songkick.com/concerts/39554868-coeur-de-pirate-at-passionskirche-kreuzberg?utm_source=1471&utm_medium=partner',
      location: 'Berlin, Germany'
    },
    {
      date: 'Oct 09',
      venue: 'Zorlu PSM',
      venueUrl: 'https://www.songkick.com/concerts/39667544-coeur-de-pirate-at-zorlu-psm?utm_source=1471&utm_medium=partner',
      location: 'Istanbul, Turkey'
    },
    {
      date: 'Oct 11',
      venue: 'Paradiso',
      venueUrl: 'https://www.songkick.com/concerts/39554853-coeur-de-pirate-at-paradiso?utm_source=1471&utm_medium=partner',
      location: 'Amsterdam, Netherlands'
    },
    {
      date: 'Oct 12',
      venue: 'Lafayette',
      venueUrl: 'http://www.songkick.com/concerts/39636334-coeur-de-pirate-at-lafayette?utm_source=1471&utm_medium=partner',
      location: 'London, UK'
    },
    {
      date: 'Oct 15',
      venue: 'Théâtre du Vieux Terrebonne',
      venueUrl: 'https://www.songkick.com/concerts/39592687-coeur-de-pirate-at-theatre-du-vieux-terrebonne?utm_source=1471&utm_medium=partner',
      location: 'Terrebonne, QC'
    },
    {
      date: 'Oct 20',
      venue: "L'Étoile Banque Nationale",
      venueUrl: 'https://www.songkick.com/concerts/39628868-coeur-de-pirate-at-letoile-banque-nationale?utm_source=1471&utm_medium=partner',
      location: 'Brossard, QC'
    },
    {
      date: 'Oct 23',
      venue: 'Théâtre Lionel-Groulx',
      venueUrl: 'https://www.songkick.com/concerts/39565215-coeur-de-pirate-at-theatre-lionelgroulx?utm_source=1471&utm_medium=partner',
      location: 'Sainte-Thérèse, QC'
    },
    {
      date: 'Oct 26',
      venue: 'Algonquin Commons Theatre',
      venueUrl: 'https://www.songkick.com/concerts/39212567-coeur-de-pirate-at-algonquin-commons-theatre?utm_source=1471&utm_medium=partner',
      location: 'Ottawa, ON'
    },
    {
      date: 'Oct 28',
      venue: 'Aeolian Hall',
      venueUrl: 'https://www.songkick.com/concerts/39735382-coeur-de-pirate-at-aeolian-hall?utm_source=1471&utm_medium=partner',
      location: 'London, ON'
    },
    {
      date: 'Oct 29',
      venue: 'The Danforth Music Hall',
      venueUrl: 'https://www.songkick.com/concerts/39707037-coeur-de-pirate-at-danforth-music-hall?utm_source=1471&utm_medium=partner',
      location: 'Toronto, ON'
    }
  ],
  bandLinks: [
    { name: 'coeurdepirate.com', url: 'http://www.coeurdepirate.com' },
    {
      name: 'Facebook',
      url: 'http://www.facebook.com/coeurdepirate.officiel'
    },
    { name: 'Twitter', url: 'http://twitter.com/#!/beatricepirate' },
    { name: 'Tumblr', url: 'http://beatriceisaunicorn.tumblr.com/' }
  ]
}
*/
/* eslint-enable no-irregular-whitespace */
