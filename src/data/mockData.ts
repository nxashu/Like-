import { Song } from '../types.ts';

export interface PlaylistCard {
  id: string;
  title: string;
  subtitle: string;
  coverGradient: string;
  badge?: string;
  icon?: string;
  tracksCount?: number;
}

export interface MoodCategory {
  id: string;
  name: string;
  gradient: string;
  image?: string;
}

export interface ArtistProfile {
  id: string;
  name: string;
  subscribers: string;
  views: string;
  signatureStyle?: string;
  headerImage: string;
  popularTracks: Song[];
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  { id: 'commute', name: 'Commute', gradient: 'from-rose-500 to-amber-500' },
  { id: 'party', name: 'Party', gradient: 'from-purple-600 to-yellow-400' },
  { id: 'kpop', name: 'K-Pop', gradient: 'from-blue-600 to-indigo-400' },
  { id: 'family', name: 'Family', gradient: 'from-teal-500 to-emerald-400' },
  { id: '1990s', name: '1990s', gradient: 'from-amber-500 to-lime-500' },
  { id: 'chill', name: 'Chill', gradient: 'from-red-500 to-orange-400' },
  { id: 'energize', name: 'Energize', gradient: 'from-fuchsia-600 to-purple-500' },
  { id: 'feelgood', name: 'Feel good', gradient: 'from-pink-500 to-rose-400' },
];

export const MIX_PLAYLISTS: PlaylistCard[] = [
  {
    id: 'replay-mix',
    title: 'Replay Mix',
    subtitle: 'Revealed Recordings, Lo-fi, Synthwave',
    coverGradient: 'from-indigo-600 via-purple-600 to-pink-500',
    badge: 'Replay',
    tracksCount: 25,
  },
  {
    id: 'my-supermix',
    title: 'My Supermix',
    subtitle: 'The Weeknd, JENNIE, Daft Punk, Joji',
    coverGradient: 'from-rose-600 via-orange-500 to-amber-400',
    badge: 'Supermix',
    tracksCount: 50,
  },
  {
    id: 'discover-mix',
    title: 'Discover Mix',
    subtitle: 'Fresh weekly releases tailored for you',
    coverGradient: 'from-blue-700 via-sky-600 to-teal-400',
    badge: 'Discover',
    tracksCount: 30,
  },
  {
    id: 'liked-music',
    title: 'Liked Music',
    subtitle: 'Auto playlist · Your YouTube Favorites',
    coverGradient: 'from-purple-700 via-indigo-600 to-violet-500',
    badge: 'Liked',
    icon: 'heart',
    tracksCount: 88,
  },
  {
    id: 'mix-1',
    title: 'My Mix 1',
    subtitle: 'Chill R&B & Neo-Soul Sessions',
    coverGradient: 'from-emerald-700 via-teal-600 to-cyan-500',
    badge: '01',
    tracksCount: 25,
  },
  {
    id: 'mix-2',
    title: 'My Mix 2',
    subtitle: 'Upbeat Electro & French Touch',
    coverGradient: 'from-fuchsia-700 via-pink-600 to-rose-400',
    badge: '02',
    tracksCount: 25,
  },
  {
    id: 'mix-3',
    title: 'My Mix 3',
    subtitle: 'Ambient Night Drives & Cyberpunk',
    coverGradient: 'from-cyan-700 via-blue-600 to-indigo-800',
    badge: '03',
    tracksCount: 25,
  },
  {
    id: 'mix-4',
    title: 'My Mix 4',
    subtitle: 'K-Pop High Energy & Dance Pop',
    coverGradient: 'from-violet-600 via-purple-500 to-pink-500',
    badge: '04',
    tracksCount: 25,
  },
];

export const TOP_ARTISTS: ArtistProfile[] = [
  {
    id: 'jennie',
    name: 'JENNIE',
    subscribers: '18.3M subscribers',
    views: '3,436,406,926 views',
    signatureStyle: 'Jennie',
    headerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    popularTracks: [
      {
        id: 'yt-fallen-angel',
        title: 'FALLEN ANGEL',
        artist: 'JENNIE',
        album: 'Fallen Angel (Digital EP)',
        year: '2026',
        genre: 'K-Pop / R&B',
        duration: 219,
        quality: 'Master · 24-bit / 96 kHz',
        accentColor: '#ec4899',
        secondaryColor: '#f43f5e',
        coverStyle: {
          type: 'neon',
          baseGradient: 'from-pink-950 to-black',
          accentGlow: 'rgba(236, 72, 153, 0.4)',
        },
        audioTrackId: 'neon',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        views: '45M views',
        lyrics: [
          {
            id: 'fa-1',
            startTime: 4.0,
            endTime: 8.5,
            text: '돌아보지 말고 떠나가라',
            romanization: 'dolaboji mal go tteo na ga ra',
            translation: "Don't look back, just walk away",
            words: [
              { text: '돌아보지', startTime: 4.0, endTime: 5.2 },
              { text: '말고', startTime: 5.3, endTime: 6.2 },
              { text: '떠나가라', startTime: 6.4, endTime: 8.5 },
            ],
          },
          {
            id: 'fa-2',
            startTime: 9.0,
            endTime: 14.0,
            text: '또 나를 찾지 말고 살아가라',
            romanization: 'tto na reul chat ji mal go sal a ga ra',
            translation: "Live on without looking for me again",
            words: [
              { text: '또', startTime: 9.0, endTime: 9.8 },
              { text: '나를', startTime: 10.0, endTime: 10.8 },
              { text: '찾지', startTime: 11.0, endTime: 11.8 },
              { text: '말고', startTime: 12.0, endTime: 12.8 },
              { text: '살아가라', startTime: 13.0, endTime: 14.0 },
            ],
          },
          {
            id: 'fa-3',
            startTime: 14.8,
            endTime: 20.0,
            text: '너를 사랑했기에 후회 없기에',
            romanization: 'neo reul sa rang haet gi e hu hoe eop gi e',
            translation: 'Because I loved you, having no regrets',
            words: [
              { text: '너를', startTime: 14.8, endTime: 15.8 },
              { text: '사랑했기에', startTime: 16.0, endTime: 17.8 },
              { text: '후회', startTime: 18.0, endTime: 18.9 },
              { text: '없기에', startTime: 19.0, endTime: 20.0 },
            ],
          },
          {
            id: 'fa-4',
            startTime: 20.8,
            endTime: 26.5,
            text: '좋았던 기억만 가져가라',
            romanization: 'jo at deon gi eok man ga jyeo ga ra',
            translation: 'Take only the cherished memories with you',
            words: [
              { text: '좋았던', startTime: 20.8, endTime: 22.0 },
              { text: '기억만', startTime: 22.2, endTime: 23.8 },
              { text: '가져가라', startTime: 24.0, endTime: 26.5 },
            ],
          },
        ],
      },
      {
        id: 'yt-one-of-the-girls',
        title: 'One Of The Girls',
        artist: 'The Weeknd, JENNIE, Lily-Rose Depp',
        album: 'The Idol Vol. 1',
        year: '2023',
        genre: 'R&B / Soul',
        duration: 244,
        quality: 'Lossless · 24-bit / 48 kHz',
        accentColor: '#f43f5e',
        secondaryColor: '#881337',
        coverStyle: {
          type: 'monolith',
          baseGradient: 'from-rose-950 to-black',
          accentGlow: 'rgba(244, 63, 94, 0.4)',
        },
        audioTrackId: 'youtube',
        youtubeVideoId: 'f1r0XZLNlGQ',
        thumbnailUrl: 'https://img.youtube.com/vi/f1r0XZLNlGQ/hqdefault.jpg',
        views: '1.2B views',
        lyrics: [],
      },
      {
        id: 'yt-mantra',
        title: 'Mantra',
        artist: 'JENNIE',
        album: 'Mantra Single',
        year: '2024',
        genre: 'Pop / Dance',
        duration: 136,
        quality: 'Hi-Res · 24-bit / 96 kHz',
        accentColor: '#e11d48',
        secondaryColor: '#be123c',
        coverStyle: {
          type: 'neon',
          baseGradient: 'from-rose-950 to-black',
          accentGlow: 'rgba(225, 29, 72, 0.4)',
        },
        audioTrackId: 'youtube',
        youtubeVideoId: 'bZd_1t5R9dM',
        thumbnailUrl: 'https://img.youtube.com/vi/bZd_1t5R9dM/hqdefault.jpg',
        views: '180M views',
        lyrics: [],
      },
    ],
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    subscribers: '35.4M subscribers',
    views: '24,800,000,000 views',
    headerImage: 'https://img.youtube.com/vi/Rif-RTvmmss/maxresdefault.jpg',
    popularTracks: [],
  },
  {
    id: 'daft-punk',
    name: 'Daft Punk',
    subscribers: '6.2M subscribers',
    views: '4,500,000,000 views',
    headerImage: 'https://img.youtube.com/vi/5NV6Rdv1a3I/maxresdefault.jpg',
    popularTracks: [],
  },
];
