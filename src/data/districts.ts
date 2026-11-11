import { District } from '../types/dictionary';

export const KERALA_DISTRICTS: District[] = [
  {
    id: 'kasaragod',
    nameEn: 'Kasaragod',
    nameMl: 'കാസർഗോഡ്',
    region: 'North Malabar',
    headquarters: 'Kasaragod',
    description: 'The northernmost district known for seven languages including Tulu, Beary, and distinctive Malayalam dialects.',
    knownForDialect: 'Distinctive Malabar-Tulu inflections, unique vocabulary for everyday verbs and kinship.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: '#059669',
    mapCoordinates: { x: 58, y: 35, width: 75, height: 42 }
  },
  {
    id: 'kannur',
    nameEn: 'Kannur',
    nameMl: 'കണ്ണൂർ',
    region: 'North Malabar',
    headquarters: 'Kannur',
    description: 'Land of Theyyam and looms. Famous for colorful, rhythmic colloquialisms and fast-paced intonation.',
    knownForDialect: 'Popular for words like "Poru", distinctive greetings, and melodic questions.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    accentColor: '#0d9488',
    mapCoordinates: { x: 75, y: 72, width: 85, height: 45 }
  },
  {
    id: 'wayanad',
    nameEn: 'Wayanad',
    nameMl: 'വയനാട്',
    region: 'North Malabar',
    headquarters: 'Kalpetta',
    description: 'Lush misty hill district with indigenous linguistic heritages and coffee plantation culture.',
    knownForDialect: 'Influence of indigenous tribal dialects, Kurichiya, and high-range farming terms.',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
    accentColor: '#16a34a',
    mapCoordinates: { x: 135, y: 92, width: 85, height: 45 }
  },
  {
    id: 'kozhikode',
    nameEn: 'Kozhikode',
    nameMl: 'കോഴിക്കോട്',
    region: 'South Malabar',
    headquarters: 'Kozhikode',
    description: 'The culinary and literary capital, renowned for affectionate hospitality and musical Malabar cadence.',
    knownForDialect: 'Affectionate terms like "Bajaar", "Mone", rich Mappila Malayalam heritage and food slang.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentColor: '#d97706',
    mapCoordinates: { x: 105, y: 130, width: 90, height: 48 }
  },
  {
    id: 'malappuram',
    nameEn: 'Malappuram',
    nameMl: 'മലപ്പുറം',
    region: 'South Malabar',
    headquarters: 'Malappuram',
    description: 'The football heartland of Kerala with deeply rooted historic expressions and vibrant community slang.',
    knownForDialect: 'Classic Eranad dialect, rich expressive adjectives, and rapid conversational rhythm.',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
    accentColor: '#65a30d',
    mapCoordinates: { x: 130, y: 172, width: 95, height: 48 }
  },
  {
    id: 'palakkad',
    nameEn: 'Palakkad',
    nameMl: 'പാലക്കാട്',
    region: 'South Malabar',
    headquarters: 'Palakkad',
    description: 'The Granary of Kerala and the gateway of the Western Ghats with deep Valluvanadan and Tamil heritage.',
    knownForDialect: 'Pure Valluvanadan Malayalam traditions, Tamil loan-phrases, and agricultural idioms.',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accentColor: '#ca8a04',
    mapCoordinates: { x: 175, y: 215, width: 100, height: 50 }
  },
  {
    id: 'thrissur',
    nameEn: 'Thrissur',
    nameMl: 'തൃശ്ശൂർ',
    region: 'Central',
    headquarters: 'Thrissur',
    description: 'The cultural capital of Kerala, home to Thrissur Pooram and instantly recognizable humorous lingo.',
    knownForDialect: 'Legendary "Gadee", elongated question endings ("keto?"), and animated storytelling terms.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    accentColor: '#ea580c',
    mapCoordinates: { x: 155, y: 260, width: 90, height: 46 }
  },
  {
    id: 'ernakulam',
    nameEn: 'Ernakulam',
    nameMl: 'എറണാകുളം',
    region: 'Central',
    headquarters: 'Kakkanad',
    description: 'Commercial hub encompassing Kochi. Melting pot of port culture, Mattancherry Portuguese-Malayalam, and youth trends.',
    knownForDialect: 'Kochi street slang, urban abbreviations, port words, and fast modern colloquialisms.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    accentColor: '#0891b2',
    mapCoordinates: { x: 170, y: 305, width: 92, height: 48 }
  },
  {
    id: 'idukki',
    nameEn: 'Idukki',
    nameMl: 'ഇടുക്കി',
    region: 'Central',
    headquarters: 'Painavu',
    description: 'Rugged mountainous cardamom and tea plantation country with settler expressions from across Kerala.',
    knownForDialect: 'High-range plantation phrases, settler fusion from Kottayam/Travancore and Tamil Nadu borders.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    accentColor: '#047857',
    mapCoordinates: { x: 230, y: 320, width: 105, height: 58 }
  },
  {
    id: 'kottayam',
    nameEn: 'Kottayam',
    nameMl: 'കോട്ടയം',
    region: 'Travancore',
    headquarters: 'Kottayam',
    description: 'Land of letters, lakes, and latex. The cradle of modern Malayalam printing and polished Central Travancore slang.',
    knownForDialect: 'Affectionate "Kochu", nasal tone nuances, Christian rubber estate colloquialisms.',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
    accentColor: '#78716c',
    mapCoordinates: { x: 195, y: 365, width: 85, height: 46 }
  },
  {
    id: 'alappuzha',
    nameEn: 'Alappuzha',
    nameMl: 'ആലപ്പുഴ',
    region: 'Travancore',
    headquarters: 'Alappuzha',
    description: 'Venice of the East. Legendary backwaters, boat races, and unique paddy farmers/fishermen dialect.',
    knownForDialect: 'Kuttanad boat culture terminology, coir and inland lake fishing vernacular.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    accentColor: '#2563eb',
    mapCoordinates: { x: 165, y: 385, width: 75, height: 48 }
  },
  {
    id: 'pathanamthitta',
    nameEn: 'Pathanamthitta',
    nameMl: 'പത്തനംതിട്ട',
    region: 'Travancore',
    headquarters: 'Pathanamthitta',
    description: 'Pilgrim capital of Kerala, surrounded by sacred rivers, forests, and non-resident diaspora ties.',
    knownForDialect: 'Slightly formal Travancore speech, agrarian idioms, and distinct temple festival vocabularies.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    accentColor: '#e11d48',
    mapCoordinates: { x: 215, y: 418, width: 90, height: 46 }
  },
  {
    id: 'kollam',
    nameEn: 'Kollam',
    nameMl: 'കൊല്ലം',
    region: 'Travancore',
    headquarters: 'Kollam',
    description: 'Historic sea port and cashew capital. Known for quick-witted, assertive, and rhythmic colloquial banter.',
    knownForDialect: 'Energetic cadence, sea-trade slang, and transitions between Central and Southern Travancore.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
    accentColor: '#7c3aed',
    mapCoordinates: { x: 200, y: 462, width: 88, height: 46 }
  },
  {
    id: 'thiruvananthapuram',
    nameEn: 'Thiruvananthapuram',
    nameMl: 'തിരുവനന്തപുരം',
    region: 'Travancore',
    headquarters: 'Thiruvananthapuram',
    description: 'Capital city with a legendary "Thekkan" dialect famous for "Entharu", "Pillecha", and unique royal-era terms.',
    knownForDialect: 'Iconic South Kerala vocabulary: "Entharu" (what), "Koppu", "Myilu", with warm colloquial charm.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    accentColor: '#b45309',
    mapCoordinates: { x: 220, y: 512, width: 92, height: 50 }
  }
];

export const REGIONS: { id: District['region']; labelMl: string; labelEn: string; color: string }[] = [
  { id: 'North Malabar', labelMl: 'വടക്കൻ മലബാർ', labelEn: 'North Malabar (Kasaragod, Kannur, Wayanad)', color: 'from-emerald-700 to-teal-800' },
  { id: 'South Malabar', labelMl: 'തെക്കൻ മലബാർ', labelEn: 'South Malabar (Kozhikode, Malappuram, Palakkad)', color: 'from-amber-700 to-yellow-800' },
  { id: 'Central', labelMl: 'മധ്യകേരളം', labelEn: 'Central Kerala (Thrissur, Ernakulam, Idukki)', color: 'from-cyan-800 to-emerald-800' },
  { id: 'Travancore', labelMl: 'തിരുവിതാംകൂർ', labelEn: 'Travancore (Kottayam, Alappuzha, Pathanamthitta, Kollam, TVM)', color: 'from-amber-800 to-red-800' }
];

export const CATEGORIES: { id: District['region'] | string; label: string; icon: string }[] = [
  { id: 'All', label: 'എല്ലാം (All)', icon: '🌟' },
  { id: 'Slang', label: 'നാടൻ പ്രയോഗം (Slang)', icon: '⚡' },
  { id: 'Daily Life', label: 'ദൈനംദിനം (Daily Life)', icon: '☕' },
  { id: 'Emotion', label: 'വികാരം (Emotion)', icon: '💭' },
  { id: 'Greeting', label: 'അഭിസംബോധന (Greeting)', icon: '🤝' },
  { id: 'Food', label: 'ഭക്ഷണം (Food)', icon: '🍛' },
  { id: 'Relationship', label: 'ബന്ധങ്ങൾ (Relationship)', icon: '👨‍👩‍👧' },
  { id: 'Humor', label: 'തമാശ (Humor)', icon: '😄' },
  { id: 'Expression', label: 'ഭാവങ്ങൾ (Expression)', icon: '✨' },
];

// Authentic linguistic starter package (only loaded when the user explicitly clicks "Load Verified Authentic Starter Pack")
// strictly genuine documented Malayalam colloquial words from reputable linguistic sources
export const AUTHENTIC_LINGUISTIC_SAMPLE: Omit<import('../types/dictionary').WordEntry, 'id' | 'createdAt'>[] = [
  {
    wordMl: 'പോറ്',
    wordManglish: 'Poru',
    englishMeaning: 'Friend, buddy, close companion',
    malayalamMeaning: 'കൂട്ടുകാരൻ, ചങ്ങാതി',
    districtId: 'kannur',
    otherDistricts: ['kasaragod'],
    explanationMl: 'കണ്ണൂർ, വടക്കൻ മലബാർ ഭാഗങ്ങളിൽ അതിയായ സൗഹൃദത്തോടെ കൂട്ടുകാരെ വിളിക്കുന്ന അതിപ്രശസ്തമായ നാടൻ വാക്ക്.',
    exampleSentenceMl: 'ഏയ് പോറേ, നീ ഇന്നലെ എങ്ങോട്ടാ പോയത്?',
    exampleSentenceEn: 'Hey buddy, where did you go yesterday?',
    category: 'Relationship',
    status: 'approved',
    submittedBy: {
      name: 'കണ്ണൂർ ഭാഷാ സഹായി',
      district: 'Kannur',
      isVerifiedSpeaker: true
    },
    likesCount: 24,
    isWordOfTheDay: true
  },
  {
    wordMl: 'ബേജാറ്',
    wordManglish: 'Bejaar / Bajaar',
    englishMeaning: 'Worry, anxiety, restless confusion',
    malayalamMeaning: 'വിഷമം, വേവലാതി, ആകാംക്ഷ',
    districtId: 'kozhikode',
    otherDistricts: ['malappuram', 'kannur'],
    explanationMl: 'കോഴിക്കോട്ടെ സംസാരത്തിൽ സ്ഥിരമായി കേൾക്കുന്ന പ്രയോഗം. മനസ്സിൽ അമിത ആശങ്കയോ സങ്കടമോ തോന്നുമ്പോൾ ഉപയോഗിക്കുന്നു.',
    exampleSentenceMl: 'അതിനൊന്നും അത്ര ബേജാറാവേണ്ട കാര്യമില്ല, എല്ലാം ശരിയാകും!',
    exampleSentenceEn: "No need to worry so much about it, everything will be alright!",
    category: 'Emotion',
    status: 'approved',
    submittedBy: {
      name: 'കോഴിക്കോടൻ നാട്ടുഭാഷ',
      district: 'Kozhikode',
      isVerifiedSpeaker: true
    },
    likesCount: 19
  },
  {
    wordMl: 'ഗഡീ',
    wordManglish: 'Gadi / Gadee',
    englishMeaning: 'Pal, fellow, guy, comrade',
    malayalamMeaning: 'സുഹൃത്ത്, ആള്, കക്ഷി',
    districtId: 'thrissur',
    otherDistricts: ['palakkad'],
    explanationMl: 'തൃശ്ശൂർക്കാരുടെ ട്രേഡ്‌മാർക്ക് സംബോധന. അടുപ്പമുള്ള സുഹൃത്തിനെയും പരിചയക്കാരെയും സ്നേഹത്തോടെ വിളിക്കുന്നത്.',
    exampleSentenceMl: 'നമ്മടെ ഗഡീടെ കല്യാണം അടുത്ത ആഴ്ചയാണ് കേട്ടോ!',
    exampleSentenceEn: "Our pal's wedding is next week, you hear?",
    category: 'Greeting',
    status: 'approved',
    submittedBy: {
      name: 'തൃശ്ശൂർക്കാരൻ കൂട്ടായ്മ',
      district: 'Thrissur',
      isVerifiedSpeaker: true
    },
    likesCount: 31
  },
  {
    wordMl: 'എന്തര്',
    wordManglish: 'Entharu',
    englishMeaning: 'What? / What is the matter?',
    malayalamMeaning: 'എന്താണ്? എന്തുപറ്റി?',
    districtId: 'thiruvananthapuram',
    otherDistricts: ['kollam'],
    explanationMl: 'തിരുവനന്തപുരം തെക്കൻ ഭാഷാ ശൈലിയിലെ ഏറ്റവും തിരിച്ചറിയപ്പെടുന്ന വാക്ക്. ചോദ്യങ്ങളിലെ സ്വതസിദ്ധമായ ആകർഷണം.',
    exampleSentenceMl: 'എന്തര് അണ്ണാ, രാവിലെ തന്നെ ഇങ്ങോട്ട് എറങ്ങിയത്?',
    exampleSentenceEn: "What brother, headed out so early in the morning?",
    category: 'Daily Life',
    status: 'approved',
    submittedBy: {
      name: 'അനന്തപുരി ഭാഷാ വേദി',
      district: 'Thiruvananthapuram',
      isVerifiedSpeaker: true
    },
    likesCount: 28
  },
  {
    wordMl: 'കൊച്ച്',
    wordManglish: 'Kochu',
    englishMeaning: 'Child, youngster, little one (affectionate)',
    malayalamMeaning: 'കുട്ടി, പൈതൽ',
    districtId: 'kottayam',
    otherDistricts: ['ernakulam', 'alappuzha', 'idukki'],
    explanationMl: 'മധ്യതിരുവിതാംകൂറിലും കോട്ടയത്തും കുട്ടികളെയും ചെറുപ്പക്കാരെയും സ്നേഹത്തോടെ വിശേഷിപ്പിക്കുന്ന സുന്ദരമായ ശൈലി.',
    exampleSentenceMl: 'ആ കൊച്ച് നല്ല സാമർത്ഥ്യത്തോടെ സംസാരിക്കുന്നുണ്ട്.',
    exampleSentenceEn: 'That child speaks with great wit and clarity.',
    category: 'Relationship',
    status: 'approved',
    submittedBy: {
      name: 'കോട്ടയം നാട്ടറിവ്',
      district: 'Kottayam',
      isVerifiedSpeaker: true
    },
    likesCount: 15
  }
];

// District comparisons: "Same Meaning, Different Naadu"
export const SAMPLE_COMPARISONS: import('../types/dictionary').DialectComparison[] = [
  {
    id: 'cmp-friend',
    conceptEn: 'Friend / Buddy',
    conceptMl: 'സുഹൃത്ത് / ചങ്ങാതി',
    description: 'How different corners of Kerala affectionately address or refer to a close friend.',
    entries: [
      { districtId: 'kannur', termMl: 'പോറ്', termManglish: 'Poru', nuance: 'Deep affectionate North Malabar brotherhood' },
      { districtId: 'thrissur', termMl: 'ഗഡീ', termManglish: 'Gadee', nuance: 'Classic Thrissur camaraderie' },
      { districtId: 'kozhikode', termMl: 'ചങ്ങാതി / കൂട്ടുകാരൻ', termManglish: 'Changaathi', nuance: 'Heartfelt warm Malabari tone' },
      { districtId: 'thiruvananthapuram', termMl: 'അളിയൻ / പിള്ളേച്ചൻ', termManglish: 'Aliyan / Pillecha', nuance: 'Quintessential Southern kinship term' },
      { districtId: 'ernakulam', termMl: 'ബ്രോ / അളിയാ', termManglish: 'Bro / Aliya', nuance: 'Urban Kochi informal address' }
    ]
  },
  {
    id: 'cmp-child',
    conceptEn: 'Child / Kid',
    conceptMl: 'കുട്ടി / പൈതൽ',
    description: 'The varied tender words used to refer to a child or young person across regions.',
    entries: [
      { districtId: 'kottayam', termMl: 'കൊച്ച്', termManglish: 'Kochu', nuance: 'Universal tender term in Central Travancore' },
      { districtId: 'malappuram', termMl: 'കുട്ടി / കുഞ്ഞാപ്പു', termManglish: 'Kunjappu', nuance: 'Sweet Eranad familial address' },
      { districtId: 'thiruvananthapuram', termMl: 'പിള്ളേര് / മോനു', termManglish: 'Pilleru', nuance: 'Southern colloquial plural/singular' },
      { districtId: 'kasaragod', termMl: 'പോറൻ', termManglish: 'Poran', nuance: 'Young boy in Kasaragod / North Malabar' },
      { districtId: 'palakkad', termMl: 'കുഞ്ഞ്', termManglish: 'Kunjju', nuance: 'Valluvanadan soft inflection' }
    ]
  },
  {
    id: 'cmp-trouble',
    conceptEn: 'Trouble / Hassle',
    conceptMl: 'ശല്യം / ബുദ്ധിമുട്ട്',
    description: 'Expressions describing a chaotic, bothersome, or complicated situation.',
    entries: [
      { districtId: 'kozhikode', termMl: 'വയ്യാവേലി', termManglish: 'Vayyaaveli', nuance: 'Unnecessary bother brought upon oneself' },
      { districtId: 'thiruvananthapuram', termMl: 'കോപ്പ് / പുകിൽ', termManglish: 'Pukilu / Koppu', nuance: 'Ruckus, major unexpected drama' },
      { districtId: 'thrissur', termMl: 'കട്ടപ്പുക', termManglish: 'Kattappuka', nuance: 'Complete disaster or stuck predicament' },
      { districtId: 'kannur', termMl: 'കുടുക്ക്', termManglish: 'Kudukku', nuance: 'A knot or trap of problems' }
    ]
  }
];

export const DAILY_PROVERBS = [
  { ml: "പല തുള്ളി പെരുവെള്ളം", en: "Many drops make a mighty flood.", district: "Universal Kerala" },
  { ml: "നാടോടുമ്പോൾ നടുവേ ഓടണം", en: "When the village runs, run along the middle.", district: "Universal Kerala" },
  { ml: "വിത്ത് ഗുണം പത്ത് ഗുണം", en: "The seed's quality determines ten times the yield.", district: "Valluvanad" },
  { ml: "അണ്ണാൻ മൂത്താലും മരംകേറ്റം മറക്കുമോ?", en: "Even if a squirrel grows old, does it forget how to climb trees?", district: "Central Kerala" },
  { ml: "ആഴമറിയാതെ കാൽ നീട്ടരുത്", en: "Do not dip your foot before knowing the water's depth.", district: "Kuttanad" }
];
