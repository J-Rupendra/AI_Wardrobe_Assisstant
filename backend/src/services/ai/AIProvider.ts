import axios from 'axios';
import config from '../../config/env';

export type EventRequest = {
  eventType: string;
  date?: string;
  venue?: string;
  mood?: string;
  style?: string;
  colors?: string[];
  occasion?: string;
  notes?: string;
};

export interface AIProvider {
  parseEventRequest(message: string): Promise<EventRequest>;
  explainRecommendation(outfit: any[]): Promise<string>;
}

const normalizeColor = (value: string): string => value.trim().toLowerCase();

const extractColors = (message: string): string[] => {
  const knownColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'gold', 'silver', 'beige', 'brown', 'navy', 'cream', 'grey'];
  const found = new Set<string>();
  const lower = message.toLowerCase();

  for (const color of knownColors) {
    if (lower.includes(color)) {
      found.add(color);
    }
  }

  return Array.from(found);
};

const extractEventType = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('wedding') || lower.includes('bridal')) return 'wedding';
  if (lower.includes('interview') || lower.includes('office')) return 'office';
  if (lower.includes('party') || lower.includes('cocktail')) return 'party';
  if (lower.includes('casual')) return 'casual';
  if (lower.includes('brunch')) return 'brunch';
  if (lower.includes('date') || lower.includes('dinner')) return 'date-night';
  return 'general';
};

const parseFallbackRequest = (message: string): EventRequest => ({
  eventType: extractEventType(message),
  mood: /formal|elegant|luxury/.test(message.toLowerCase()) ? 'formal' : 'comfortable',
  style: /minimal|classic|elegant|modern/.test(message.toLowerCase()) ? 'elegant' : 'casual',
  colors: extractColors(message),
  occasion: message.trim(),
  notes: message.trim(),
});

export class GeminiProvider implements AIProvider {
  async parseEventRequest(message: string): Promise<EventRequest> {
    if (!config.geminiApiKey) return parseFallbackRequest(message);

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: `Extract structured wardrobe request from this message: ${message}. Return JSON with eventType, mood, style, colors, venue, occasion, notes.` }] }],
        },
        { headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.geminiApiKey } }
      );

      const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          eventType: parsed.eventType || extractEventType(message),
          mood: parsed.mood,
          style: parsed.style,
          colors: (parsed.colors || extractColors(message)).map(normalizeColor),
          occasion: parsed.occasion || message,
          notes: parsed.notes || message,
        };
      }
    } catch (error) {
      console.warn('Gemini parse failed, using local fallback');
    }

    return parseFallbackRequest(message);
  }

  async explainRecommendation(outfit: any[]): Promise<string> {
    const names = outfit.map((item) => item.name).join(', ');
    return `This combination works because it balances ${outfit[0]?.category || 'wardrobe'} pieces with your event tone and keeps the look polished and easy to wear. The outfit includes ${names}.`;
  }
}

export class GrokProvider implements AIProvider {
  async parseEventRequest(message: string): Promise<EventRequest> {
    return parseFallbackRequest(message);
  }

  async explainRecommendation(outfit: any[]): Promise<string> {
    const names = outfit.map((item) => item.name).join(', ');
    return `The selected combination stays consistent with the event aesthetic while keeping the pieces practical and flattering. This outfit blends ${names}.`;
  }
}

export class OllamaProvider implements AIProvider {
  async parseEventRequest(message: string): Promise<EventRequest> {
    return parseFallbackRequest(message);
  }

  async explainRecommendation(outfit: any[]): Promise<string> {
    const names = outfit.map((item) => item.name).join(', ');
    return `This outfit pulls together a coherent look for the occasion and uses ${names} to create a balanced silhouette.`;
  }
}

export const createAIProvider = (): AIProvider => {
  switch (config.aiProvider) {
    case 'grok':
      return new GrokProvider();
    case 'ollama':
      return new OllamaProvider();
    case 'gemini':
    default:
      return new GeminiProvider();
  }
};
