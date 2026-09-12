import { characters } from './index';

export type CharacterGroup = {
  id: string;
  name: string;
  characterIds: string[];
};

// These are primary navigation homes across film continuities and team lineups.
// A character can have other affiliations; sharing a film is not a membership rule.
const coreGroups: CharacterGroup[] = [
  {
    id: 'avengers',
    name: 'Avengers & allies',
    characterIds: [
      'tony-stark',
      'steve-rogers',
      'natasha-romanoff',
      'bruce-banner',
      'clint-barton',
      'sam-wilson',
      'wanda-maximoff',
      'vision',
      'james-rhodes',
      'scott-lang',
      'hope-van-dyne',
      'hank-pym',
      'janet-van-dyne',
      'cassie-lang',
      'carol-danvers',
      'monica-rambeau',
      'kamala-khan',
      'pepper-potts',
      'happy-hogan',
      'kate-bishop',
      'joaquin-torres',
      'shang-chi',
    ],
  },
  {
    id: 'guardians',
    name: 'Guardians & allies',
    characterIds: [
      'peter-quill',
      'gamora',
      'drax',
      'rocket',
      'groot',
      'mantis',
      'nebula',
      'yondu-udonta',
      'kraglin-obfonteri',
      'cosmo',
      'adam-warlock',
    ],
  },
  {
    id: 'x-men',
    name: 'X-Men & allies',
    characterIds: [
      'logan',
      'charles-xavier',
      'jean-grey',
      'scott-summers',
      'ororo-munroe',
      'hank-mccoy',
      'kurt-wagner',
      'rogue',
      'bobby-drake',
      'kitty-pryde',
      'piotr-rasputin',
      'alex-summers',
      'sean-cassidy',
      'armando-munoz',
      'raven-darkholme',
      'pietro-maximoff',
      'jubilation-lee',
      'bishop',
      'clarice-ferguson',
      'james-proudstar',
      'roberto-da-costa',
      'moira-mactaggert',
      'laura-kinney',
      'wade-wilson',
      'nathan-summers',
      'neena-thurman',
      'negasonic-teenage-warhead',
      'yukio',
      'remy-lebeau',
    ],
  },
  {
    id: 'fantastic-four',
    name: 'Fantastic Four & allies',
    characterIds: ['reed-richards', 'sue-storm', 'johnny-storm', 'ben-grimm', 'h-e-r-b-i-e'],
  },
  {
    id: 'spider-verse',
    name: 'Spider-Verse & allies',
    characterIds: [
      'peter-parker',
      'miles-morales',
      'gwen-stacy',
      'miguel-o-hara',
      'jessica-drew',
      'hobie-brown',
      'pavitr-prabhakar',
      'peni-parker',
      'peter-porker',
      'cassandra-webb',
      'julia-cornwall',
      'anya-corazon',
      'mattie-franklin',
      'may-parker',
      'ben-parker',
      'mary-jane-watson',
      'michelle-jones-watson',
      'ned-leeds',
    ],
  },
  {
    id: 'wakanda',
    name: 'Wakanda & allies',
    characterIds: [
      't-challa',
      'shuri',
      'okoye',
      'nakia',
      'ramonda',
      'm-baku',
      'ayo',
      'aneka',
      'zuri',
      'everett-ross',
      'riri-williams',
    ],
  },
  {
    id: 'asgard',
    name: 'Asgard & allies',
    characterIds: [
      'thor',
      'loki',
      'odin',
      'frigga',
      'heimdall',
      'sif',
      'valkyrie',
      'jane-foster',
      'korg',
    ],
  },
  {
    id: 'mystic-arts',
    name: 'Mystic Arts & allies',
    characterIds: ['stephen-strange', 'wong', 'ancient-one', 'clea', 'america-chavez'],
  },
  {
    id: 'thunderbolts',
    name: 'Thunderbolts',
    // Includes the initial lineup and Bob, who joins the team in the film.
    // https://thewaltdisneycompany.com/news/bob-thunderbolts-lewis-pullman/
    characterIds: [
      'yelena-belova',
      'bucky-barnes',
      'alexei-shostakov',
      'ava-starr',
      'john-walker',
      'antonia-dreykov',
      'bob-reynolds',
    ],
  },
  {
    id: 'eternals',
    name: 'Eternals',
    characterIds: [
      'ajak',
      'sersi',
      'ikaris',
      'kingo',
      'sprite',
      'phastos',
      'makkari',
      'druig',
      'gilgamesh',
      'thena',
    ],
  },
  {
    id: 'shield',
    name: 'S.H.I.E.L.D.',
    characterIds: [
      'nick-fury',
      'maria-hill',
      'phil-coulson',
      'peggy-carter',
      'sharon-carter',
      'howard-stark',
    ],
  },
];

const primaryGroupByCharacter = new Map(
  coreGroups.flatMap((group) => group.characterIds.map((id) => [id, group.id] as const)),
);
const alphabeticCharacters = [...characters].sort((left, right) =>
  left.name.localeCompare(right.name) || left.id.localeCompare(right.id),
);

export const characterGroups: CharacterGroup[] = [
  ...coreGroups.map(({ id, name }) => ({
    id,
    name,
    characterIds: alphabeticCharacters
      .filter((character) => primaryGroupByCharacter.get(character.id) === id)
      .map((character) => character.id),
  })),
  {
    id: 'other-characters',
    name: 'Other characters',
    characterIds: alphabeticCharacters
      .filter((character) => !primaryGroupByCharacter.has(character.id))
      .map((character) => character.id),
  },
];