import type { PlotPost, Pitch, WeeklyPrompt, LeaderboardEntry, UserProfile } from './types';

const HOUR = 3600_000;
const now = Date.now();

export const initialPosts: PlotPost[] = [
  {
    id: 'p1',
    movieTitle: 'Fall 2: Deadpoint',
    year: '2024',
    posterColor: 'from-orange-600 to-red-900',
    plotHole:
      'Two climbers stranded on a 2,000-foot TV tower manage to survive for DAYS without water, then one casually free-climbs down the rusted ladder with a broken leg while a drone conveniently flies their rescue signal to a highway patrol car that just happens to be passing through the empty desert.',
    rewrite:
      'After the first night, dehydration sets in hard. Becky hallucinates; Hunter tries to signal with her phone but the screen shatters on the metal. Their only hope: recharge the drone using the tower\'s residual broadcast capacitor — a risky hack that either sparks a fire or sends one final burst. The rescue isn\'t convenient; it\'s earned through sacrifice.',
    author: 'ScriptDoctor99',
    authorAvatar: 'SD',
    sobRating: 5,
    sobRatingCount: 320,
    userSobRating: null,
    votes: 1284,
    downvotes: 47,
    userVote: null,
    timeAgo: '4h ago',
    createdAt: now - 4 * HOUR,
    tags: ['Survival', 'Thriller', 'Sequel'],
    comments: [
      {
        id: 'pc1',
        author: 'ClimbCritic',
        authorAvatar: 'CC',
        text: 'The dehydration angle is brilliant. But wouldn\'t the drone capacitor hack feel too convenient?',
        timeAgo: '3h ago',
        createdAt: now - 3 * HOUR,
      },
      {
        id: 'pc2',
        author: 'ScriptDoctor99',
        authorAvatar: 'SD',
        text: 'Maybe if the hack fails the first time and someone has to climb back up to fix the connection. Raises the stakes.',
        timeAgo: '2h ago',
        createdAt: now - 2 * HOUR,
      },
    ],
  },
  {
    id: 'p2',
    movieTitle: 'The Flash',
    year: '2023',
    posterColor: 'from-yellow-500 to-red-800',
    plotHole:
      'Barry Allen travels back in time to save his mother, accidentally creating a wholly different universe — yet somehow EVERY other character from the original timeline still exists with their memories and costumes intact, just slightly recast. The multiverse rules are established and broken within the same scene.',
    rewrite:
      'Barry\'s time-trip fractures reality into a pocket universe where only HE remembers the original timeline. Everyone else — Batman, Supergirl, Zod — are native to THIS reality and have their own histories. Barry must convince strangers who\'ve never heard of him to risk their lives for a world they can\'t remember and he can\'t prove existed.',
    author: 'PlotTwistPam',
    authorAvatar: 'PT',
    sobRating: 4,
    sobRatingCount: 210,
    userSobRating: null,
    votes: 892,
    downvotes: 31,
    userVote: null,
    timeAgo: '7h ago',
    createdAt: now - 7 * HOUR,
    tags: ['Superhero', 'Sci-Fi', 'Time Travel'],
    comments: [
      {
        id: 'pc3',
        author: 'MultiverseMaven',
        authorAvatar: 'MM',
        text: 'Love the idea that Barry is the only one who remembers. That\'s real emotional stakes, not just spectacle.',
        timeAgo: '5h ago',
        createdAt: now - 5 * HOUR,
      },
    ],
  },
  {
    id: 'p3',
    movieTitle: 'Jurassic World: Dominion',
    year: '2022',
    posterColor: 'from-green-700 to-gray-900',
    plotHole:
      'Dinosaurs have escaped into the wild globally for four years, yet society continues functioning basically normally. A T-Rex roams the woods eating livestock and the government\'s grand solution is... a slightly bigger fence and a locust subplot that has nothing to do with dinosaurs.',
    rewrite:
      'Five years after the escape, coastal cities are evacuation zones. A dinosaur ecology has taken over the American South. The government contracts InGen\'s rival — BioCrisis International — to manage the threat, but their solution is genetic sterility bombs that also threaten the last pure-bred dinosaurs. The original cast must choose between two extinctions.',
    author: 'DinoDan',
    authorAvatar: 'DD',
    sobRating: 4,
    sobRatingCount: 180,
    userSobRating: null,
    votes: 671,
    downvotes: 22,
    userVote: null,
    timeAgo: '12h ago',
    createdAt: now - 12 * HOUR,
    tags: ['Action', 'Sci-Fi', 'Franchise'],
    comments: [],
  },
  {
    id: 'p4',
    movieTitle: 'Love Actually',
    year: '2003',
    posterColor: 'from-red-500 to-pink-900',
    plotHole:
      'Mark silently loves Juliet for years, films her wedding entirely through close-ups of her face, then shows up at her door with cue cards declaring his love. She kisses him. Her husband — Mark\'s best friend — is apparently fine with this and everyone goes back to being best friends.',
    rewrite:
      'Mark\'s confession creates a genuine rift. Peter (the husband) feels betrayed by both his best friend and his wife. Over the following months, the three of them have to navigate the fallout: Mark realizes his love was obsessive idealization, not connection. Peter and Juliet rebuild trust. Mark learns to let go and actually move on — a bittersweet ending that\'s honest about love.',
    author: 'RomComRipper',
    authorAvatar: 'RC',
    sobRating: 3,
    sobRatingCount: 95,
    userSobRating: null,
    votes: 445,
    downvotes: 15,
    userVote: null,
    timeAgo: '1d ago',
    createdAt: now - 24 * HOUR,
    tags: ['Romance', 'Comedy', 'Holiday'],
    comments: [],
  },
  {
    id: 'p5',
    movieTitle: 'Signs',
    year: '2002',
    posterColor: 'from-blue-600 to-gray-900',
    plotHole:
      'An advanced alien civilization capable of interstellar travel decides to invade Earth — a planet whose surface is 71% covered in a substance that is literally toxic to them. They don\'t wear suits, they don\'t bring weapons, and they apparently forgot to check the weather report.',
    rewrite:
      'The aliens aren\'t invaders — they\'re desperate refugees from a dying world, forced to harvest Earth\'s atmosphere despite the risk. They wear fragile containment suits that are breaking down. The "invasion" is a last-resort landing of a failing colony ship. Mel Gibson\'s crisis of faith mirrors theirs: both are trapped between hope and despair, and water becomes a metaphor for what sustains us all.',
    author: 'SciFiScribe',
    authorAvatar: 'SF',
    sobRating: 5,
    sobRatingCount: 280,
    userSobRating: null,
    votes: 1103,
    downvotes: 38,
    userVote: null,
    timeAgo: '2d ago',
    createdAt: now - 48 * HOUR,
    tags: ['Sci-Fi', 'Horror', 'Classic'],
    comments: [
      {
        id: 'pc4',
        author: 'WaterSigns',
        authorAvatar: 'WS',
        text: 'Refugees instead of invaders completely changes the tone. The containment suit idea is gold.',
        timeAgo: '1d ago',
        createdAt: now - 24 * HOUR,
      },
    ],
  },
];

export const userProfile: UserProfile = {
  displayName: 'Alex "The Fixer" Reyes',
  avatar: 'AR',
  title: 'Amateur Screenwriter',
  level: 3,
  totalSubmissions: 14,
  totalUpvotes: 387,
  contestsWon: 1,
  cinemaShelf: [],
};

export const userPosts: PlotPost[] = [
  {
    id: 'up1',
    movieTitle: 'Indiana Jones & the Dial of Destiny',
    year: '2023',
    posterColor: 'from-amber-700 to-yellow-900',
    plotHole:
      'Archimedes built a gear mechanism that somehow predicts a fissure in time exactly 2,000 years later, and Indy\'s goddaughter finds it by casually translating half a dial. The Romans chase them through a cave, the dial activates, and nobody questions why a 2,000-year-old artifact has a built-in seat belt for time travel.',
    rewrite:
      'The dial isn\'t a time machine — it\'s a resonance tuner. Archimedes discovered a temporal frequency and encoded it in the gears, but the fissure only opens once per millennia. Helena doesn\'t casually decode it; she sacrifices her academic reputation chasing it. The jump to 212 BC is a one-way trip, and Indy chooses to stay in the past, finally at peace with history.',
    author: 'Alex "The Fixer" Reyes',
    authorAvatar: 'AR',
    sobRating: 4,
    sobRatingCount: 67,
    userSobRating: null,
    votes: 234,
    downvotes: 9,
    userVote: null,
    timeAgo: '3d ago',
    createdAt: now - 72 * HOUR,
    tags: ['Adventure', 'Sci-Fi', 'Legacy Sequel'],
    comments: [],
  },
  {
    id: 'up2',
    movieTitle: 'Tenet',
    year: '2020',
    posterColor: 'from-gray-600 to-cinema-950',
    plotHole:
      'The entire plot hinges on "inverted entropy" objects moving backward through time, but characters freely walk through turnstiles, swap directions, and fight themselves with no biological consequences. The protagonist learns the entire plan in reverse but still makes decisions as if he understood it forward. Also, the world ends via a dead man\'s switch that nine people can disarm — by throwing pieces of an algorithm into the future.',
    rewrite:
      'Inversion is a symptom, not a tool. The algorithm didn\'t create time reversal — it fractured causality itself. Every time someone uses a turnstile, they lose a piece of linear memory. The protagonist doesn\'t "learn the plan in reverse" — he\'s slowly forgetting the future while gaining memories of a past he hasn\'t lived yet. The climax isn\'t a heist; it\'s him choosing which version of himself to become.',
    author: 'Alex "The Fixer" Reyes',
    authorAvatar: 'AR',
    sobRating: 5,
    sobRatingCount: 142,
    userSobRating: null,
    votes: 561,
    downvotes: 18,
    userVote: null,
    timeAgo: '1w ago',
    createdAt: now - 168 * HOUR,
    tags: ['Sci-Fi', 'Thriller', 'Mind-Bender'],
    comments: [],
  },
];

export const savedPosts: PlotPost[] = [
  {
    id: 'sp1',
    movieTitle: 'Signs',
    year: '2002',
    posterColor: 'from-blue-600 to-gray-900',
    plotHole:
      'An advanced alien civilization capable of interstellar travel decides to invade Earth — a planet whose surface is 71% covered in a substance that is literally toxic to them. They don\'t wear suits, they don\'t bring weapons, and they apparently forgot to check the weather report.',
    rewrite:
      'The aliens aren\'t invaders — they\'re desperate refugees from a dying world, forced to harvest Earth\'s atmosphere despite the risk. They wear fragile containment suits that are breaking down. The "invasion" is a last-resort landing of a failing colony ship. Mel Gibson\'s crisis of faith mirrors theirs: both are trapped between hope and despair, and water becomes a metaphor for what sustains us all.',
    author: 'SciFiScribe',
    authorAvatar: 'SF',
    sobRating: 5,
    sobRatingCount: 280,
    userSobRating: null,
    votes: 1103,
    downvotes: 38,
    userVote: null,
    timeAgo: '2d ago',
    createdAt: now - 48 * HOUR,
    tags: ['Sci-Fi', 'Horror', 'Classic'],
    comments: [],
  },
  {
    id: 'sp2',
    movieTitle: 'Fall 2: Deadpoint',
    year: '2024',
    posterColor: 'from-orange-600 to-red-900',
    plotHole:
      'Two climbers stranded on a 2,000-foot TV tower manage to survive for DAYS without water, then one casually free-climbs down the rusted ladder with a broken leg while a drone conveniently flies their rescue signal to a highway patrol car that just happens to be passing through the empty desert.',
    rewrite:
      'After the first night, dehydration sets in hard. Becky hallucinates; Hunter tries to signal with her phone but the screen shatters on the metal. Their only hope: recharge the drone using the tower\'s residual broadcast capacitor — a risky hack that either sparks a fire or sends one final burst. The rescue isn\'t convenient; it\'s earned through sacrifice.',
    author: 'ScriptDoctor99',
    authorAvatar: 'SD',
    sobRating: 5,
    sobRatingCount: 320,
    userSobRating: null,
    votes: 1284,
    downvotes: 47,
    userVote: null,
    timeAgo: '4h ago',
    createdAt: now - 4 * HOUR,
    tags: ['Survival', 'Thriller', 'Sequel'],
    comments: [],
  },
];

export const initialPitches: Pitch[] = [
  {
    id: 'pt1',
    title: 'The Last Projectionist',
    concept:
      'In a near-future where all cinema is AI-generated, a stubborn 70-year-old projectionist runs the last analog movie theater. When the city announces its demolition, he discovers the theater\'s ancient film reels contain hidden frames — a coded message from a filmmaker who disappeared 40 years ago.',
    author: 'CinemaGhost',
    authorAvatar: 'CG',
    votes: 342,
    downvotes: 12,
    userVote: null,
    timeAgo: '3h ago',
    tags: ['Drama', 'Mystery', 'Near-Future'],
    comments: [
      {
        id: 'c1',
        author: 'ReelWatcher',
        authorAvatar: 'RW',
        text: 'The hidden frames idea is incredible. What if each reel is a chapter and the audience has to physically splice them together to reveal the full message?',
        timeAgo: '2h ago',
      },
      {
        id: 'c2',
        author: 'FilmNoirFan',
        authorAvatar: 'FN',
        text: 'I\'d watch this in a heartbeat. The analog vs AI tension is so relevant right now.',
        timeAgo: '1h ago',
      },
    ],
  },
  {
    id: 'pt2',
    title: 'Cold Open',
    concept:
      'A crime thriller where every act begins as if it\'s a different genre — Act 1 is a rom-com, Act 2 is a horror film, Act 3 is a musical. The detective protagonist is the only person who notices the world keeps "shifting genres" and must solve the murder before the credits roll on reality itself.',
    author: 'GenreJumper',
    authorAvatar: 'GJ',
    votes: 287,
    downvotes: 8,
    userVote: null,
    timeAgo: '6h ago',
    tags: ['Thriller', 'Meta', 'Experimental'],
    comments: [
      {
        id: 'c3',
        author: 'PlotTwistPam',
        authorAvatar: 'PT',
        text: 'This is wild. The genre shifts could mirror the victim\'s fractured psyche — each genre is a version of how they experienced the night they died.',
        timeAgo: '4h ago',
      },
    ],
  },
  {
    id: 'pt3',
    title: 'The Extra',
    concept:
      'A background actor in a massive blockbuster keeps accidentally appearing in scenes he wasn\'t cast in. The director can\'t fire him because every take with him in it is mysteriously perfect. Turns out he\'s the protagonist of a different movie that\'s being filmed in the same studio and the two stories are bleeding into each other.',
    author: 'BackgroundBob',
    authorAvatar: 'BB',
    votes: 198,
    downvotes: 5,
    userVote: null,
    timeAgo: '10h ago',
    tags: ['Comedy', 'Meta', 'Satire'],
    comments: [],
  },
];

export const weeklyPrompts: WeeklyPrompt[] = [
  {
    id: 'wp1',
    movie: 'Armageddon (1998)',
    prompt: 'Recast the astronaut crew of Armageddon. Who do you send to save the world, and why?',
    description: 'The clock is ticking. A city-killer asteroid is 18 days from impact. Recast the drilling crew with today\'s actors and write the scene where mission control introduces them.',
    endsAt: now + 5 * 24 * HOUR,
    submissions: [],
    winnerId: null,
  },
  {
    id: 'wp2',
    movie: 'The Matrix (1999)',
    prompt: 'Rewrite the red pill / blue pill scene for the AI age. What does Morpheus offer Neo in 2026?',
    description: 'The simulation is real, but the context has changed. Reimagine the iconic choice scene for a world that already lives inside algorithms.',
    endsAt: now + 12 * 24 * HOUR,
    submissions: [],
    winnerId: null,
  },
  {
    id: 'wp3',
    movie: 'Pulp Fiction (1994)',
    prompt: 'Write the scene that was never filmed: what happened inside the briefcase?',
    description: 'Quentin left it open on purpose. Now it\'s your turn. Reveal what\'s inside the briefcase and write the moment Vincent and Jules see it.',
    endsAt: now + 19 * 24 * HOUR,
    submissions: [],
    winnerId: null,
  },
  {
    id: 'wp4',
    movie: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
    prompt: 'Rewrite the Council of Elrond — but the One Ring can only be destroyed by someone Sauron trusts.',
    description: 'The rules have changed. The Ring must be carried by someone who could get close to Sauron. Who volunteers, and how does the council react?',
    endsAt: now + 26 * 24 * HOUR,
    submissions: [],
    winnerId: null,
  },
];

function getWeekIndex(): number {
  const epoch = new Date('2026-11-01').getTime();
  const weekMs = 7 * 24 * 3600_000;
  return Math.floor((Date.now() - epoch) / weekMs);
}

export function getCurrentWeeklyPrompt(): WeeklyPrompt {
  const idx = getWeekIndex() % weeklyPrompts.length;
  return weeklyPrompts[idx];
}

export function getDaysRemainingInWeek(): number {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  return daysUntilSunday === 0 ? 7 : daysUntilSunday;
}

export const leaderboard: LeaderboardEntry[] = [
  {
    id: 'lb1',
    rank: 1,
    author: 'ScriptDoctor99',
    authorAvatar: 'SD',
    points: 8420,
    wins: 7,
    entries: 34,
    badge: 'Golden Reel',
  },
  {
    id: 'lb2',
    rank: 2,
    author: 'PlotTwistPam',
    authorAvatar: 'PT',
    points: 7890,
    wins: 5,
    entries: 41,
    badge: 'Silver Spool',
  },
  {
    id: 'lb3',
    rank: 3,
    author: 'SciFiScribe',
    authorAvatar: 'SF',
    points: 6750,
    wins: 4,
    entries: 28,
    badge: 'Silver Spool',
  },
  {
    id: 'lb4',
    rank: 4,
    author: 'CinemaGhost',
    authorAvatar: 'CG',
    points: 5210,
    wins: 3,
    entries: 22,
    badge: 'Bronze Frame',
  },
  {
    id: 'lb5',
    rank: 5,
    author: 'GenreJumper',
    authorAvatar: 'GJ',
    points: 4830,
    wins: 2,
    entries: 19,
    badge: 'Bronze Frame',
  },
  {
    id: 'lb6',
    rank: 6,
    author: 'RomComRipper',
    authorAvatar: 'RC',
    points: 3960,
    wins: 2,
    entries: 15,
    badge: 'Rising Star',
  },
  {
    id: 'lb7',
    rank: 7,
    author: 'DinoDan',
    authorAvatar: 'DD',
    points: 3420,
    wins: 1,
    entries: 12,
    badge: 'Rising Star',
  },
  {
    id: 'lb8',
    rank: 8,
    author: 'BackgroundBob',
    authorAvatar: 'BB',
    points: 2890,
    wins: 1,
    entries: 9,
    badge: 'Rising Star',
  },
];
