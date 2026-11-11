export type Region = 'North Malabar' | 'South Malabar' | 'Central' | 'Travancore';

export interface District {
  id: string;
  nameEn: string;
  nameMl: string;
  region: Region;
  headquarters: string;
  description: string;
  knownForDialect: string;
  badgeColor: string;
  accentColor: string;
  // SVG coordinates for Kerala Map representation
  mapCoordinates: { x: number; y: number; width: number; height: number };
}

export type WordCategory = 
  | 'Slang' 
  | 'Daily Life' 
  | 'Emotion' 
  | 'Food' 
  | 'Greeting' 
  | 'Relationship' 
  | 'Humor' 
  | 'Expression' 
  | 'Culture';

export interface WordEntry {
  id: string;
  wordMl: string;               // Word in Malayalam script (e.g. പോറ്)
  wordManglish: string;         // Transliteration in English (e.g. poru)
  englishMeaning: string;       // Meaning in English
  malayalamMeaning: string;     // Meaning in standard Malayalam
  districtId: string;           // Primary district ID
  otherDistricts?: string[];    // Additional districts sharing this word
  explanationMl?: string;       // Detailed cultural context / nuance
  exampleSentenceMl: string;    // Colloquial example sentence
  exampleSentenceEn?: string;   // English translation of example sentence
  category: WordCategory;
  
  // Audio pronunciation metadata
  audioDataUrl?: string;        // Base64 or Blob Data URL
  audioSpeakerName?: string;    // Name of native speaker
  audioSpeakerLocation?: string;// Village / Taluk of native speaker
  audioDurationSeconds?: number;
  
  // Status and moderation
  status: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  
  // Contributor info
  submittedBy: {
    name: string;
    email?: string;
    district?: string;
    isVerifiedSpeaker?: boolean;
  };
  
  likesCount: number;
  createdAt: string;            // ISO timestamp
  isWordOfTheDay?: boolean;
}

export interface DialectComparison {
  id: string;
  conceptEn: string;
  conceptMl: string;
  description: string;
  entries: {
    districtId: string;
    termMl: string;
    termManglish: string;
    nuance: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'contributor' | 'verified_speaker' | 'admin';
  district?: string;
  favorites: string[];          // List of word IDs
}
