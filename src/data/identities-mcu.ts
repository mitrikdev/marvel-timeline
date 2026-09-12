/** Screen identities for existing MCU-derived character IDs; see docs/sources-identities-mcu.md. */
export const mcuCharacterIdentities: Record<
  string,
  { name: string; realName?: string; aliases?: string[] }
> = {
  'tony-stark': {
    name: 'Iron Man',
    realName: 'Tony Stark',
  },
  'steve-rogers': {
    name: 'Captain America',
    realName: 'Steve Rogers',
  },
  'sam-wilson': {
    name: 'Captain America',
    realName: 'Sam Wilson',
    aliases: ['Falcon'],
  },
  'natasha-romanoff': {
    name: 'Black Widow',
    realName: 'Natasha Romanoff',
  },
  'clint-barton': {
    name: 'Hawkeye',
    realName: 'Clint Barton',
    aliases: ['Ronin'],
  },
  'bucky-barnes': {
    name: 'Winter Soldier',
    realName: 'Bucky Barnes',
  },
  'james-rhodes': {
    name: 'War Machine',
    realName: 'James Rhodes',
    aliases: ['Rhodey', 'Iron Patriot'],
  },
  'carol-danvers': {
    name: 'Captain Marvel',
    realName: 'Carol Danvers',
    aliases: ['Vers'],
  },
  'wanda-maximoff': {
    name: 'Scarlet Witch',
    realName: 'Wanda Maximoff',
  },
  'stephen-strange': {
    name: 'Doctor Strange',
    realName: 'Stephen Strange',
    aliases: ['Dr. Strange'],
  },
  'scott-lang': {
    name: 'Ant-Man',
    realName: 'Scott Lang',
    aliases: ['Giant-Man'],
  },
  'hank-pym': {
    name: 'Ant-Man',
    realName: 'Hank Pym',
  },
  'hope-van-dyne': {
    name: 'Wasp',
    realName: 'Hope van Dyne',
    aliases: ['The Wasp'],
  },
  'janet-van-dyne': {
    name: 'Wasp',
    realName: 'Janet van Dyne',
    aliases: ['The Wasp'],
  },
  'peter-quill': {
    name: 'Star-Lord',
    realName: 'Peter Quill',
    aliases: ['Starlord'],
  },
  't-challa': {
    name: 'Black Panther',
    realName: "T'Challa",
  },
  shuri: {
    name: 'Black Panther',
    realName: 'Shuri',
  },
  'jane-foster': {
    name: 'Mighty Thor',
    realName: 'Jane Foster',
  },
  'kamala-khan': {
    name: 'Ms. Marvel',
    realName: 'Kamala Khan',
    aliases: ['Ms Marvel'],
  },
  'kate-bishop': {
    name: 'Hawkeye',
    realName: 'Kate Bishop',
  },
  'riri-williams': {
    name: 'Ironheart',
    realName: 'Riri Williams',
  },
  'peggy-carter': {
    name: 'Captain Carter',
    realName: 'Peggy Carter',
    aliases: ['Agent Carter'],
  },
  'blackagar-boltagon': {
    name: 'Black Bolt',
    realName: 'Blackagar Boltagon',
  },
  eros: {
    name: 'Starfox',
    realName: 'Eros',
  },
  'sharon-carter': {
    name: 'Agent 13',
    realName: 'Sharon Carter',
  },
  'bob-reynolds': {
    name: 'Sentry',
    realName: 'Robert Reynolds',
    aliases: ['Bob', 'Bob Reynolds', 'Void', 'The Void'],
  },
  'joaquin-torres': {
    name: 'Falcon',
    realName: 'Joaquin Torres',
  },
  'shalla-bal': {
    name: 'Silver Surfer',
    realName: 'Shalla-Bal',
  },
  'antonia-dreykov': {
    name: 'Taskmaster',
    realName: 'Antonia Dreykov',
  },
  'ava-starr': {
    name: 'Ghost',
    realName: 'Ava Starr',
  },
  'john-walker': {
    name: 'U.S. Agent',
    realName: 'John Walker',
    aliases: ['US Agent', 'Captain America'],
  },
  'alexei-shostakov': {
    name: 'Red Guardian',
    realName: 'Alexei Shostakov',
  },
  'yelena-belova': {
    name: 'Black Widow',
    realName: 'Yelena Belova',
  },
  'obadiah-stane': {
    name: 'Iron Monger',
    realName: 'Obadiah Stane',
  },
  'ivan-vanko': {
    name: 'Whiplash',
    realName: 'Ivan Vanko',
  },
  'johann-schmidt': {
    name: 'Red Skull',
    realName: 'Johann Schmidt',
  },
  'emil-blonsky': {
    name: 'Abomination',
    realName: 'Emil Blonsky',
  },
  'darren-cross': {
    name: 'Yellowjacket',
    realName: 'Darren Cross',
    aliases: ['M.O.D.O.K.', 'MODOK'],
  },
  'brock-rumlow': {
    name: 'Crossbones',
    realName: 'Brock Rumlow',
  },
  'herman-schultz': {
    name: 'Shocker',
    realName: 'Herman Schultz',
  },
  'quentin-beck': {
    name: 'Mysterio',
    realName: 'Quentin Beck',
  },
  'erik-killmonger': {
    name: 'Killmonger',
    realName: 'Erik Stevens',
    aliases: ['Erik Killmonger'],
  },
  'helmut-zemo': {
    name: 'Baron Zemo',
    realName: 'Helmut Zemo',
  },
  'karl-mordo': {
    name: 'Baron Mordo',
    realName: 'Karl Mordo',
  },
  'taneleer-tivan': {
    name: 'Collector',
    realName: 'Taneleer Tivan',
    aliases: ['The Collector'],
  },
  'samuel-sterns': {
    name: 'Leader',
    realName: 'Samuel Sterns',
    aliases: ['The Leader'],
  },
  'thaddeus-ross': {
    name: 'Red Hulk',
    realName: 'Thaddeus Ross',
    aliases: ['Thunderbolt Ross'],
  },
  'seth-voelker': {
    name: 'Sidewinder',
    realName: 'Seth Voelker',
  },
  'adrian-toomes': {
    name: 'Vulture',
    realName: 'Adrian Toomes',
  },
  'mar-vell': {
    name: 'Mar-Vell',
    aliases: ['Wendy Lawson', 'Dr. Wendy Lawson'],
  },
  'michelle-jones-watson': {
    name: 'MJ',
    realName: 'Michelle Jones-Watson',
  },
  'monica-rambeau': {
    name: 'Monica Rambeau',
    aliases: ['Captain Monica Rambeau'],
  },
  gorr: {
    name: 'Gorr',
    aliases: ['Gorr the God Butcher', 'God Butcher'],
  },
  ronan: {
    name: 'Ronan',
    aliases: ['Ronan the Accuser'],
  },
  kang: {
    name: 'Kang',
    aliases: ['Kang the Conqueror'],
  },
  skurge: {
    name: 'Skurge',
    aliases: ['Executioner'],
  },
};

/** Principal antagonists and rivals; redeemed members retain their established navigation teams. */
export const mcuVillainIds: string[] = [
  'adrian-toomes',
  'aldrich-killian',
  'alexander-pierce',
  'arnim-zola',
  'attuma',
  'ayesha',
  'brock-rumlow',
  'cassandra-nova',
  'dar-benn',
  'darren-cross',
  'dormammu',
  'dreykov',
  'ego',
  'emil-blonsky',
  'erik-killmonger',
  'galactus',
  'gorr',
  'grandmaster',
  'hela',
  'helmut-zemo',
  'herman-schultz',
  'high-evolutionary',
  'ivan-vanko',
  'johann-schmidt',
  'justin-hammer',
  'kaecilius',
  'kang',
  'karl-mordo',
  'korath',
  'kro',
  'mac-gargan',
  'malekith',
  'minn-erva',
  'mr-paradox',
  'namor',
  'namora',
  'obadiah-stane',
  'quentin-beck',
  'ronan',
  'samuel-sterns',
  'seth-voelker',
  'sonny-burch',
  'supreme-intelligence',
  'surtur',
  'thaddeus-ross',
  'thanos',
  'ultron',
  'ulysses-klaue',
  'valentina-allegra-de-fontaine',
  'wolfgang-von-strucker',
  'xu-wenwu',
  'yon-rogg',
];
