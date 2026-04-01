export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  level: number;
  points: number;
  lives: number;
  isVIP: boolean;
  isVerified: boolean;
  role: 'user' | 'admin';
  theme?: 'light' | 'dark';
  privacySettings?: {
    showLevel: boolean;
    showPoints: boolean;
    publicProfile: boolean;
  };
}

export interface Market {
  id: string;
  name: string;
  address: string;
  hours: string;
  status: 'open' | 'closed';
  image: string;
  location: { lat: number; lng: number };
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  description: string;
  rating: number;
  photo: string;
  available: boolean;
}

export interface Message {
  id: string;
  senderName: string;
  senderPhoto: string;
  lastMessage: string;
  timestamp: string;
  type: 'business' | 'freelance';
  unread?: number;
  active?: boolean;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SavedRoute {
  id: string;
  userId: string;
  type: 'bus' | 'metro';
  line: string;
  name: string;
  createdAt: string;
}

export interface TransportUnit {
  id: string;
  type: 'bus' | 'metro';
  line: string;
  lat: number;
  lng: number;
  heading: number;
  status: string;
  lastUpdate: string;
}
