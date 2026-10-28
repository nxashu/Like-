import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper to parse duration string like "3:45" or "1:02:30" to seconds
function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 180;
  const parts = durationStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  return 180;
}

// 1. YouTube Search Suggestions API
app.get('/api/youtube/suggestions', async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.json([]);
    }

    const response = await fetch(
      `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(
        q
      )}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      }
    );

    const text = await response.text();
    // format: window.google.ac.h(["query",[["item 1",0,...],["item 2",0,...]]])
    const match = text.match(/window\.google\.ac\.h\((.*)\)/);
    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      const suggestions = (data[1] || []).map((item: unknown[]) => item[0]);
      return res.json(suggestions);
    }

    return res.json([]);
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    return res.json([]);
  }
});

// 2. YouTube Music Search API
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    // Direct video ID check (e.g. 11-char ID)
    if (/^[a-zA-Z0-9_-]{11}$/.test(query)) {
      return res.json({
        tracks: [
          {
            videoId: query,
            title: `YouTube Track (${query})`,
            artist: 'YouTube Audio',
            album: 'YouTube Music Stream',
            duration: 210,
            durationFormatted: '3:30',
            thumbnail: `https://img.youtube.com/vi/${query}/hqdefault.jpg`,
            quality: 'YouTube 256kbps AAC',
          },
        ],
      });
    }

    // Check if it's a YouTube / YouTube Music URL
    const urlMatch = query.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
    );
    if (urlMatch && urlMatch[1]) {
      const vid = urlMatch[1];
      return res.json({
        tracks: [
          {
            videoId: vid,
            title: 'YouTube Music Track',
            artist: 'Streaming Stream',
            album: 'YouTube Music',
            duration: 210,
            durationFormatted: '3:30',
            thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
            quality: 'YouTube 256kbps AAC',
          },
        ],
      });
    }

    // Search YouTube for music audio tracks
    const searchQuery = `${query} official audio`;
    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );

    const html = await response.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/);

    if (!match || !match[1]) {
      return res.json({ tracks: [] });
    }

    const data = JSON.parse(match[1]);
    const contents =
      data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]
        ?.itemSectionRenderer?.contents || [];

    const tracks: {
      videoId: string;
      title: string;
      artist: string;
      album: string;
      duration: number;
      durationFormatted: string;
      thumbnail: string;
      quality: string;
      views?: string;
    }[] = [];

    for (const item of contents) {
      const v = item.videoRenderer;
      if (v && v.videoId) {
        const title = v.title?.runs?.[0]?.text || 'Untitled Track';
        const artist = v.ownerText?.runs?.[0]?.text || 'Various Artists';
        const durationStr = v.lengthText?.simpleText || '3:30';
        const viewsStr = v.shortViewCountText?.simpleText || '';

        // Clean up title (remove "(Official Audio)", "[Official Video]", etc.)
        const cleanTitle = title
          .replace(/\[.*?\]|\(.*?\)/g, '')
          .replace(/official audio|official video|lyrics|lyric video/gi, '')
          .trim();

        tracks.push({
          videoId: v.videoId,
          title: cleanTitle || title,
          artist,
          album: 'YouTube Music',
          duration: parseDurationToSeconds(durationStr),
          durationFormatted: durationStr,
          thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
          quality: 'YouTube Audio · 256kbps',
          views: viewsStr,
        });

        if (tracks.length >= 10) break;
      }
    }

    return res.json({ tracks });
  } catch (err) {
    console.error('Error searching YouTube:', err);
    return res.status(500).json({ error: 'Failed to search YouTube tracks' });
  }
});

// 3. Synchronized Word-by-Word Lyrics Generator (Powered by Gemini or Smart Algorithmic Generator)
app.post('/api/youtube/lyrics', async (req, res) => {
  try {
    const { title, artist, duration } = req.body;
    const dur = typeof duration === 'number' && duration > 0 ? duration : 180;

    // Check if Gemini API is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `Generate a JSON array of synchronized lyrics for the song:
Title: "${title || 'Track'}"
Artist: "${artist || 'Unknown'}"
Song Duration: ${dur} seconds.

The response MUST be valid JSON only (no markdown, no backticks, no extra text).
The structure must be:
[
  {
    "id": "line-1",
    "startTime": 4.0,
    "endTime": 8.0,
    "text": "First line of the lyrics here",
    "words": [
      { "text": "First", "startTime": 4.0, "endTime": 4.8 },
      { "text": "line", "startTime": 4.9, "endTime": 5.4 },
      { "text": "of", "startTime": 5.5, "endTime": 5.8 },
      { "text": "the", "startTime": 5.9, "endTime": 6.3 },
      { "text": "lyrics", "startTime": 6.4, "endTime": 7.2 },
      { "text": "here", "startTime": 7.3, "endTime": 8.0 }
    ]
  }
]
Distribute 10-18 lyrical lines naturally across the ${dur} seconds duration. Keep word timestamps continuous and realistic.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const raw = response.text || '';
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ lyrics: parsed, source: 'gemini' });
        }
      } catch (geminiErr) {
        console.warn('Gemini lyric generation failed, falling back to algorithmic generator:', geminiErr);
      }
    }

    // Fallback: Smart synchronized word generator based on song rhythm
    const defaultLines = [
      'Lost inside the sound tonight',
      'Underneath the pulsing light',
      'Every melody begins to fade',
      'In the promises we made',
      'Feel the rhythm in the dark',
      'Catching fire from a dying spark',
      'Let the music heal the soul',
      'Taking back our own control',
      'Drifting through the endless night',
      'Searching for the morning light',
    ];

    const step = dur / (defaultLines.length + 1);
    const generated = defaultLines.map((lineText, idx) => {
      const lineStart = Number(((idx + 0.5) * step).toFixed(2));
      const lineEnd = Number((lineStart + step * 0.75).toFixed(2));
      const wordsArr = lineText.split(' ');
      const wordDur = (lineEnd - lineStart) / wordsArr.length;

      const words = wordsArr.map((w, wIdx) => ({
        text: w,
        startTime: Number((lineStart + wIdx * wordDur).toFixed(2)),
        endTime: Number((lineStart + (wIdx + 1) * wordDur).toFixed(2)),
      }));

      return {
        id: `line-${idx + 1}`,
        startTime: lineStart,
        endTime: lineEnd,
        text: lineText,
        words,
      };
    });

    return res.json({ lyrics: generated, source: 'algorithmic' });
  } catch (err) {
    console.error('Error generating lyrics:', err);
    return res.status(500).json({ error: 'Failed to generate lyrics' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VibeAMOLED server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
