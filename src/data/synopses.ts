export type FilmSynopsis = {
  text: string;
  sourceUrl: string;
};

// Original, spoiler-light editorial summaries. Research notes: docs/sources-synopses.md.
export const filmSynopses: Record<string, FilmSynopsis> = {
  'iron-man': {
    text: 'After captivity forces him to invent an armored escape suit, industrialist Tony Stark returns home with a new purpose. He develops the technology into Iron Man and investigates a conspiracy that threatens far more than his company.',
    sourceUrl: 'https://watch.afi.com/movie/iron-man',
  },
  'the-incredible-hulk': {
    text: 'Bruce Banner searches for a way to stop transforming into the Hulk while evading a military campaign to capture him. A dangerous new opponent forces him to reconsider whether the power he fears could also protect others.',
    sourceUrl:
      'https://www.marvel.com/articles/movies/the-incredible-hulk-disney-plus-now-streaming?linkId=220223832',
  },
  'iron-man-2': {
    text: 'With his identity public, Tony Stark faces demands to surrender his armor while its power source threatens his health. An inventor seeking revenge and a rival weapons manufacturer complicate his efforts to remain Iron Man.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Iron_Man_2',
  },
  thor: {
    text: 'Banished to Earth after a reckless confrontation, Thor loses the powers that once defined him. As his brother Loki schemes in Asgard, the proud prince must learn what it means to deserve the throne.',
    sourceUrl: 'https://www.marvel.com/movies/thor?scrlybrkr=69dff19b',
  },
  'captain-america-the-first-avenger': {
    text: 'Steve Rogers volunteers for an experiment that transforms him into Captain America. Alongside Peggy Carter and Bucky Barnes, he takes the fight to HYDRA, whose leader Red Skull commands a threat beyond conventional warfare.',
    sourceUrl:
      'https://ir.paramount.com/news-releases/news-release-details/it-opens-anywhere-else-world-marvels-captain-america-first',
  },
  'the-avengers': {
    text: 'Loki brings a threat too large for any single hero to contain. Nick Fury recruits Iron Man, Captain America, Thor, Hulk, Black Widow and Hawkeye, whose clashing personalities make becoming a team their first challenge.',
    sourceUrl: 'https://d23.com/a-to-z/avengers-marvels-the-film/',
  },
  'iron-man-3': {
    text: "An attack shatters Tony Stark's familiar world and sends him searching for the people behind it. With his usual advantages stripped away, he must trust his ingenuity while trying to protect those closest to him.",
    sourceUrl: 'https://movies.disney.com/marvels-iron-man-3',
  },
  'thor-the-dark-world': {
    text: 'Malekith and an ancient enemy return with a plan to engulf the cosmos in darkness. To protect the people he loves, Thor considers a dangerous alliance with Loki, whose help comes with little reason for trust.',
    sourceUrl: 'https://d23.com/a-to-z/thor-the-dark-world-film/',
  },
  'captain-america-the-winter-soldier': {
    text: 'Still adjusting to modern life, Steve Rogers uncovers a conspiracy reaching deep into the organization he serves. Black Widow and a new ally help him investigate while a relentless assassin known as the Winter Soldier pursues them.',
    sourceUrl: 'https://movies.disney.com/captain-america-the-winter-soldier',
  },
  'guardians-of-the-galaxy': {
    text: 'Stealing a mysterious orb puts space adventurer Peter Quill in the path of the ruthless Ronan. Quill joins four unlikely companions, whose uneasy alliance may be the only thing standing between the galaxy and catastrophe.',
    sourceUrl: 'https://movies.disney.com/marvels-guardians-of-the-galaxy',
  },
  'avengers-age-of-ultron': {
    text: "Tony Stark's attempt to protect the world produces Ultron, an artificial intelligence with a lethal interpretation of peace. The Avengers must regroup to confront their creation before its campaign puts humanity's survival at risk.",
    sourceUrl: 'https://movies.disney.com/marvels-avengers-age-of-ultron',
  },
  'ant-man': {
    text: "Thief Scott Lang gets an unexpected chance to become a hero when Hank Pym recruits him to protect a remarkable suit. Mastering its unusual abilities becomes essential to keeping Pym's invention out of dangerous hands.",
    sourceUrl: 'https://movies.disney.com/ant-man',
  },
  'captain-america-civil-war': {
    text: 'Public concern over the damage left by superhero battles sparks demands for oversight of the Avengers. Steve Rogers and Tony Stark take opposing positions, turning a political dispute into a deeply personal conflict among former allies.',
    sourceUrl: 'https://movies.disney.com/captain-america-civil-war',
  },
  'doctor-strange': {
    text: "A renowned surgeon's search for healing takes Stephen Strange to Kamar-Taj, where he encounters a world beyond conventional medicine. Learning its mystical arts draws him into a struggle against forces threatening reality itself.",
    sourceUrl: 'https://movies.disney.com/doctor-strange',
  },
  'guardians-of-the-galaxy-vol-2': {
    text: 'Peter Quill and the Guardians continue their adventures through space as the mystery of his family begins to unfold. The search for his origins brings new discoveries and tests the bonds that hold the team together.',
    sourceUrl: 'https://movies.disney.com/guardians-of-the-galaxy-vol-2',
  },
  'spider-man-homecoming': {
    text: 'Back home after fighting beside the Avengers, Peter Parker struggles to balance school with proving himself to mentor Tony Stark. The arrival of the Vulture turns his ambitions into a dangerous test of responsibility.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermanhomecoming',
  },
  'thor-ragnarok': {
    text: 'Thor is stranded without his hammer on a distant planet, where a gladiator arena reunites him with Hulk. He must find a way home before Hela brings destruction to Asgard and its people.',
    sourceUrl: 'https://movies.disney.com/thor-ragnarok',
  },
  'black-panther': {
    text: "T'Challa returns to Wakanda to take his father's place as king. A dangerous challenger tests his leadership and forces him to confront what protecting his technologically advanced nation means for the wider world.",
    sourceUrl: 'https://movies.disney.com/black-panther',
  },
  'avengers-infinity-war': {
    text: 'Thanos threatens the universe on a scale the Avengers have never faced. Heroes from Earth and beyond enter a desperate struggle to stop him, risking their lives and everything they have built together.',
    sourceUrl: 'https://movies.disney.com/avengers-infinity-war',
  },
  'ant-man-and-the-wasp': {
    text: 'Scott Lang is trying to reconcile fatherhood with being Ant-Man when Hope van Dyne and Hank Pym bring him an urgent mission. Fighting beside the Wasp, he helps uncover secrets rooted in their past.',
    sourceUrl: 'https://movies.disney.com/ant-man-and-the-wasp',
  },
  'captain-marvel': {
    text: 'An interstellar conflict reaches Earth in the 1990s, placing Carol Danvers and a handful of allies in its path. Her journey through the crisis reveals the potential of powers that could change the balance of the war.',
    sourceUrl: 'https://movies.disney.com/captain-marvel',
  },
  'avengers-endgame': {
    text: "In the aftermath of Thanos' devastating victory, the surviving Avengers face a universe marked by loss. Despite their fractured ranks, they gather for another attempt to confront the consequences and reclaim hope for the future.",
    sourceUrl: 'https://movies.disney.com/avengers-endgame',
  },
  'spider-man-far-from-home': {
    text: 'Peter Parker hopes a school trip across Europe will offer a break from superhero duties. Nick Fury has other plans, drawing him into an investigation of elemental attacks alongside a mysterious new hero called Mysterio.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermanfarfromhome',
  },
  'black-widow': {
    text: 'Natasha Romanoff becomes the target of a conspiracy connected to her life before the Avengers. Surviving it means facing the history she tried to leave behind and the damaged relationships that still bind her to it.',
    sourceUrl: 'https://movies.disney.com/black-widow',
  },
  'shang-chi-and-the-legend-of-the-ten-rings': {
    text: "Shang-Chi must face a past he can no longer avoid when his father's ambitions put the world in danger. His journey combines a family reckoning with a discovery of the extraordinary power within his own heritage.",
    sourceUrl: 'https://movies.disney.com/shang-chi-and-the-legend-of-the-ten-rings',
  },
  eternals: {
    text: "Immortal protectors who have lived quietly among humanity for thousands of years must reunite when the Deviants return. Their long, shared history becomes the foundation for confronting an enemy tied to humankind's distant past.",
    sourceUrl: 'https://movies.disney.com/eternals',
  },
  'spider-man-no-way-home': {
    text: 'With his identity exposed, Peter Parker asks Doctor Strange to help restore his private life. The spell instead opens a breach between universes, bringing dangerous visitors into his world and putting everyone he loves at risk.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermannowayhome',
  },
  'doctor-strange-in-the-multiverse-of-madness': {
    text: 'Doctor Strange journeys through alternate realities with new and familiar mystical allies as a mysterious adversary emerges. Encounters with other versions of himself challenge his certainty about the choices that make him a hero.',
    sourceUrl:
      'https://d23.com/meet-the-characters-of-doctor-strange-in-the-multiverse-of-madness/',
  },
  'thor-love-and-thunder': {
    text: "Thor's attempt to find peace is interrupted by Gorr, a killer targeting the gods. He reunites with Jane Foster, now wielding Mjolnir, and joins Valkyrie and Korg to uncover the motive behind Gorr's campaign.",
    sourceUrl: 'https://movies.disney.com/thor-love-and-thunder',
  },
  'black-panther-wakanda-forever': {
    text: "As Wakanda mourns T'Challa, Shuri, Queen Ramonda and their allies work to protect the kingdom from outside pressure. Their search for a future unfolds alongside the emergence of Namor and a hidden civilization beneath the sea.",
    sourceUrl: 'https://movies.disney.com/black-panther-wakanda-forever',
  },
  'ant-man-and-the-wasp-quantumania': {
    text: 'Scott Lang, Hope van Dyne and their family venture into the Quantum Realm, discovering a world filled with unfamiliar life. Their exploration brings them into contact with Kang and challenges the limits of their experience.',
    sourceUrl: 'https://movies.disney.com/ant-man-and-the-wasp-quantumania',
  },
  'guardians-of-the-galaxy-vol-3': {
    text: "Still struggling with Gamora's absence, Peter Quill must bring the Guardians together for a mission to protect one of their own. The danger threatens both the wider universe and the future of their unusual family.",
    sourceUrl: 'https://movies.disney.com/guardians-of-the-galaxy-vol-3',
  },
  'the-marvels': {
    text: "Investigating a mysterious wormhole entangles Carol Danvers' powers with those of Kamala Khan and Monica Rambeau. The unlikely partners must learn to coordinate their abilities while confronting a Kree threat and the consequences of Carol's earlier actions.",
    sourceUrl: 'https://movies.disney.com/the-marvels',
  },
  'deadpool-and-wolverine': {
    text: 'Wade Wilson has left his mercenary identity behind for an unfulfilling civilian routine. When his entire world faces destruction, he returns as Deadpool and tries to enlist an unwilling Wolverine to help save it.',
    sourceUrl:
      'https://press.disney.co.uk/news/deadpool-&-wolverine-arrives-on-digital-from-1st-october',
  },
  'captain-america-brave-new-world': {
    text: 'A meeting with President Thaddeus Ross draws Sam Wilson into an international crisis. As Captain America, Sam must trace a conspiracy to its hidden architect before the unfolding scheme puts the world in danger.',
    sourceUrl: 'https://movies.disney.com/captain-america-brave-new-world',
  },
  thunderbolts: {
    text: 'Yelena Belova and a group of troubled operatives become targets of Valentina Allegra de Fontaine. Their fight to survive forces them into an uneasy alliance, testing whether they can face their pasts and become a team.',
    sourceUrl: 'https://movies.disney.com/thunderbolts',
  },
  'the-fantastic-four-first-steps': {
    text: 'In a futuristic world shaped by the 1960s, the Fantastic Four balance family life with protecting Earth. The arrival of Silver Surfer and the planet-devouring Galactus presents a threat that tests both their powers and their bond.',
    sourceUrl: 'https://movies.disney.com/the-fantastic-four-first-steps',
  },
  'spider-man-brand-new-day': {
    text: 'Peter Parker devotes himself to protecting a city that has forgotten him while his old friends build lives without him. Mounting pressure triggers an unpredictable transformation as an unseen enemy threatens New York and the people he loves.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermanbrandnewday',
  },
  'spider-man': {
    text: 'A spider bite gives teenager Peter Parker remarkable abilities, but personal tragedy changes how he chooses to use them. As he becomes Spider-Man, a dangerous new adversary called the Green Goblin threatens New York.',
    sourceUrl: 'https://www.sonypictures.com/movies/spiderman',
  },
  'spider-man-2': {
    text: "Peter Parker struggles to maintain his studies, relationships and responsibilities as Spider-Man. When scientist Otto Octavius becomes the dangerous Doctor Octopus, the pressure on Peter's two lives grows harder to contain.",
    sourceUrl: 'https://www.sonypictures.com/movies/spiderman2',
  },
  'spider-man-3': {
    text: 'An alien organism gives Peter Parker a powerful new black suit while feeding his worst impulses. With his relationship under strain and several enemies closing in, Spider-Man must also confront the darkness changing him from within.',
    sourceUrl: 'https://www.sonypictures.com/movies/spiderman3',
  },
  'the-amazing-spider-man': {
    text: "Peter Parker follows clues about his missing parents to Oscorp and scientist Curt Connors. As he navigates a relationship with Gwen Stacy, his emerging life as Spider-Man becomes entangled with Connors' dangerous transformation.",
    sourceUrl:
      'https://www.sonypictures.com/corp/press_releases/2012/02_12/02062012_spiderman.html',
  },
  'the-amazing-spider-man-2': {
    text: "Peter Parker embraces life as Spider-Man while trying to keep his future with Gwen Stacy intact. Electro's arrival and Harry Osborn's return draw him toward a network of threats linked to Oscorp.",
    sourceUrl: 'https://www.sonypictures.com/movies/theamazingspiderman2',
  },
  venom: {
    text: 'With his career and relationship in ruins, Eddie Brock becomes the host of an alien organism that grants him frightening abilities. Their volatile partnership is tested when a stronger symbiote emerges as an enemy.',
    sourceUrl: 'https://www.sonypictures.com/movies/venom',
  },
  'venom-let-there-be-carnage': {
    text: "Eddie Brock's uneasy arrangement with Venom begins to fray as he investigates imprisoned killer Cletus Kasady. When Kasady gains a symbiote of his own, Eddie and Venom face an adversary whose violence matches his new power.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Venom:_Let_There_Be_Carnage',
  },
  morbius: {
    text: 'Doctor Michael Morbius risks an experimental treatment to overcome the blood disorder threatening his life. Its apparent success unleashes disturbing new abilities and appetites, leaving him struggling to control the consequences of his attempted cure.',
    sourceUrl: 'https://www.sonypictures.com/movies/morbius',
  },
  'madame-web': {
    text: 'Manhattan paramedic Cassandra Webb begins experiencing visions of the future and discovers she can alter what happens next. Connections to her own past draw her toward three young women whose lives and extraordinary futures are in danger.',
    sourceUrl: 'https://www.sonypictures.com/movies/madameweb',
  },
  'venom-the-last-dance': {
    text: 'Eddie Brock and Venom flee pursuers from both the human and alien worlds. As their enemies close in, the pair must confront a choice that threatens to end their unlikely partnership.',
    sourceUrl: 'https://www.sonypictures.com/movies/venomthelastdance',
  },
  'kraven-the-hunter': {
    text: "Kraven's turbulent relationship with his ruthless father, Nikolai Kravinoff, drives him toward revenge. The violence that follows shapes his transformation into a formidable hunter whose reputation inspires fear far beyond his own family.",
    sourceUrl: 'https://www.sonypictures.com/movies/kraventhehunter',
  },
  'spider-man-into-the-spider-verse': {
    text: 'Brooklyn teenager Miles Morales discovers that becoming Spider-Man does not mean following a single path. His introduction to a universe of other heroes wearing the mask opens a new world of possibilities.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermanintothespiderverse',
  },
  'spider-man-across-the-spider-verse': {
    text: 'Reuniting with Gwen Stacy takes Miles Morales into a vast community of Spider-People guarding the multiverse. When their response to a new threat conflicts with his own convictions, Miles must decide how to protect those he loves.',
    sourceUrl: 'https://www.sonypictures.com/movies/spidermanacrossthespiderverse',
  },
  'x-men': {
    text: "The X-Men use their extraordinary abilities to protect people who fear and distrust mutants. Their struggle for acceptance becomes a fight for humanity's future when a rival mutant faction pursues a dangerous agenda.",
    sourceUrl: 'https://www.disneyplus.com/browse/entity-e9f59c82-de76-4a18-a849-192532ff9b2d',
  },
  x2: {
    text: 'When an anti-mutant operative captures Professor Xavier and attacks his school, the surviving X-Men become fugitives. Joined by Nightcrawler, they form an uneasy alliance with Magneto to rescue their friends and stop a devastating plan.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/x2',
  },
  'x-men-the-last-stand': {
    text: "A treatment that can remove mutant powers divides the mutant community and intensifies Magneto's conflict with humanity. Meanwhile, Jean Grey returns with frightening new power, confronting the X-Men with a threat from within their own family.",
    sourceUrl: 'https://en.wikipedia.org/wiki/X-Men:_The_Last_Stand',
  },
  'x-men-origins-wolverine': {
    text: 'Before joining the X-Men, Logan is drawn into the Weapon X program. His violent past and troubled bond with Victor Creed shape the painful transformation that turns him into Wolverine.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/x-men-origins-wolverine',
  },
  'x-men-first-class': {
    text: 'Young Charles Xavier and Erik Lehnsherr recruit a team of mutants to stop Sebastian Shaw from provoking nuclear war. Their shared mission tests a growing friendship as their sharply different visions for mutantkind begin to emerge.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/x-men-first-class',
  },
  'the-wolverine': {
    text: 'Logan travels to Japan, where unfamiliar enemies push him into a struggle that challenges his strength and sense of purpose. Suddenly vulnerable, he must confront both deadly opponents and the emotional burden of his seemingly endless life.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/the-wolverine',
  },
  'x-men-days-of-future-past': {
    text: 'With mutant survival at stake, the X-Men fight across two eras. Their future depends on reaching their younger counterparts and changing a pivotal event before history leads the world toward catastrophe.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/x-men-days-of-future-past',
  },
  deadpool: {
    text: 'A brutal experiment gives mercenary Wade Wilson extraordinary healing abilities and leaves his life in ruins. Adopting the name Deadpool, he combines lethal skills with relentless wisecracks while pursuing the man responsible.',
    sourceUrl: 'https://www.disneyplus.com/browse/entity-17854bdb-0121-4327-80a0-699fdecd1aaa',
  },
  'x-men-apocalypse': {
    text: 'An ancient mutant awakens and recruits powerful followers, including Magneto, to destroy the existing world and rule its replacement. Raven and Professor Xavier must prepare a young generation of X-Men to resist his overwhelming power.',
    sourceUrl: 'https://family.20thcenturystudios.com/movies/x-men-apocalypse',
  },
  logan: {
    text: 'An aging Logan keeps a low profile near the Mexican border while caring for an increasingly ill Charles Xavier. The arrival of a young mutant pursued by dangerous forces draws him back into the life he hoped to escape.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/logan',
  },
  'deadpool-2': {
    text: 'Deadpool assembles a mismatched group of mutant allies to protect a boy with dangerous powers. Standing in their way is Cable, a heavily armed cyborg who has traveled through time to hunt the child.',
    sourceUrl: 'https://www.disneyplus.com/browse/entity-27e84e56-31d3-4813-91ba-602cb52890f1',
  },
  'dark-phoenix': {
    text: 'A rescue mission in space exposes Jean Grey to a force that dramatically amplifies her abilities. As her control deteriorates, the X-Men must confront an escalating threat embodied by someone they love and trust.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/dark-phoenix',
  },
  'the-new-mutants': {
    text: 'Five young mutants are confined to a secret facility that claims it can treat their dangerous abilities. As they question the purpose of their captivity, their struggle to understand their powers becomes a fight for survival.',
    sourceUrl: 'https://www.20thcenturystudios.com/movies/the-new-mutants',
  },
  'fantastic-four-2005': {
    text: 'A disaster in space leaves four people with extraordinary abilities and complicated new lives. While learning to function as a family and a team, they face a dangerous former benefactor transformed into Doctor Doom.',
    sourceUrl: 'https://www.disneyplus.com/browse/entity-d6592baa-0dc6-4549-a0cb-3b93a3b0e260',
  },
  'fantastic-four-rise-of-the-silver-surfer': {
    text: "Reed Richards and Sue Storm's wedding plans are disrupted by the arrival of the mysterious Silver Surfer. With Earth facing destruction, the Fantastic Four must investigate his mission while navigating an uneasy partnership with Doctor Doom.",
    sourceUrl:
      'https://family.20thcenturystudios.com/movies/fantastic-four-rise-of-the-silver-surfer',
  },
  'fantastic-four-2015': {
    text: 'An experiment involving another dimension leaves four young people with unsettling new abilities and a colleague stranded beyond their reach. When that colleague returns as a threat, they must overcome their divisions and learn to act together.',
    sourceUrl: 'https://family.20thcenturystudios.com/movies/fantastic-four',
  },
  blade: {
    text: 'Blade, a vampire hunter who shares the blood of his enemies, wages a hidden war alongside his mentor Whistler. After rescuing a doctor, he confronts Deacon Frost, an ambitious vampire whose plans threaten humanity.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Blade_(1998_film)',
  },
  'blade-ii': {
    text: 'A new breed of bloodthirsty creatures begins preying on vampires and humans alike. To prevent the outbreak from spreading, Blade reluctantly joins an elite vampire unit originally trained to destroy him.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Blade_II',
  },
  'blade-trinity': {
    text: 'Framed for murder and pursued by federal agents, Blade joins vampire hunters Abigail Whistler and Hannibal King. Together, they face a vampire faction that has awakened Dracula in hopes of overcoming its ancient weaknesses.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Blade:_Trinity',
  },
  daredevil: {
    text: 'Blind attorney Matt Murdock uses his heightened senses to fight crime after dark as Daredevil. His relationship with Elektra draws him into a deadly confrontation with the crime lord Kingpin and the assassin Bullseye.',
    sourceUrl: 'https://www.disneyplus.com/browse/entity-3a33d136-e4c1-4d07-bc6b-f9bb179e86d8',
  },
  elektra: {
    text: 'Restored to life and isolated from others, Elektra works as an assassin until a father and daughter draw her into their struggle against the Hand. Their plight forces her to reconsider the path she has chosen.',
    sourceUrl: 'https://www.newregency.com/mobile/international-sales/movies/elektra',
  },
  'hulk-2003': {
    text: 'A laboratory accident unleashes a creature of extraordinary strength, turning scientific research into a terrifying crisis. As the world mobilizes against the Hulk, the destructive power of this transformation threatens everyone drawn into its path.',
    sourceUrl: 'https://www.universalpicturesathome.com/movies/the-hulk',
  },
  'the-punisher-2004': {
    text: "After crime boss Howard Saint orders the murder of his family, former FBI agent Frank Castle survives and returns seeking revenge. With the authorities unwilling to help, he begins dismantling Saint's criminal empire on his own terms.",
    sourceUrl: 'https://en.wikipedia.org/wiki/The_Punisher_(2004_film)',
  },
  'punisher-war-zone': {
    text: "Frank Castle's campaign against organized crime leaves mobster Billy Russoti disfigured and an undercover agent dead. As Russoti returns as Jigsaw, Castle must confront the consequences of his violence and protect the agent's surviving family.",
    sourceUrl: 'https://en.wikipedia.org/wiki/Punisher:_War_Zone',
  },
  'ghost-rider': {
    text: 'Stunt rider Johnny Blaze pays for a youthful bargain with the devil by becoming a supernatural bounty hunter. A chance to reclaim his life arrives alongside Blackheart, whose ambitions threaten to bring hell to Earth.',
    sourceUrl: 'https://www.sonypictures.com/movies/ghostrider',
  },
  'ghost-rider-spirit-of-vengeance': {
    text: 'Hiding in Europe from the curse that turns him into Ghost Rider, Johnny Blaze is recruited to protect a boy from the devil. Embracing the power he fears may offer his only chance at freedom.',
    sourceUrl: 'https://www.sonypictures.com/movies/ghostriderspiritofvengeance',
  },
};
