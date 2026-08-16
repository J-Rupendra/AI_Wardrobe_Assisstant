# AI.md

**AI provider abstraction and integration guide.**

## 📚 Table of Contents

- [Overview](#overview)
- [Provider Abstraction](#provider-abstraction)
- [Supported Providers](#supported-providers)
- [Configuration](#configuration)
- [Usage](#usage)
- [Security](#security)

---

## Overview

### Phase 1 Status

AI provider abstraction is NOT implemented in Phase 1. This is Phase 5 work.

This document outlines the planned architecture.

### Design Principle

The recommendation engine must work independently of the AI provider.

If we switch from Gemini to Grok, the backend recommendation logic should NOT change.

```
Controller → RecommendationService → AIService → AIProvider → Gemini/Grok/Ollama
                                                   (Abstraction)
```

---

## Provider Abstraction

### Interface

All AI providers implement this interface:

```typescript
// backend/src/services/ai/AIProvider.ts

interface IAIProvider {
  /**
   * Parse natural language event request into structured data
   */
  parseEventRequest(message: string): Promise<ParsedEventRequest>;

  /**
   * Generate explanation for a recommendation
   */
  explainRecommendation?(outfit: Outfit[]): Promise<string>;

  /**
   * Rerank recommendations based on user preferences
   */
  rerankRecommendations?(outfits: Outfit[]): Promise<Outfit[]>;
}

interface ParsedEventRequest {
  eventType: string;           // engagement, wedding, party, casual, etc.
  formality: number;           // 1-5 scale
  preferredStyle: string[];    // elegant, casual, traditional, etc.
  avoidStyle?: string[];
  preferredColors?: string[];
  avoidColors?: string[];
  timeOfDay?: string;          // morning, afternoon, evening, night
  weather?: string;
  notes?: string;
}
```

### Provider Implementations

#### GeminiProvider

```typescript
// backend/src/services/ai/providers/GeminiProvider.ts

class GeminiProvider implements IAIProvider {
  constructor(apiKey: string) { }

  async parseEventRequest(message: string): Promise<ParsedEventRequest> {
    // Use Gemini API to parse
    // Return structured data
  }
}
```

**Configuration:**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
```

**API Key:** Get from https://aistudio.google.com/app/apikey

#### GrokProvider

```typescript
// backend/src/services/ai/providers/GrokProvider.ts

class GrokProvider implements IAIProvider {
  constructor(apiKey: string) { }

  async parseEventRequest(message: string): Promise<ParsedEventRequest> {
    // Use Grok API to parse
    // Return structured data
  }
}
```

**Configuration:**
```bash
AI_PROVIDER=grok
GROK_API_KEY=your-api-key
```

**API Key:** Get from https://console.x.ai/

#### OllamaProvider

```typescript
// backend/src/services/ai/providers/OllamaProvider.ts

class OllamaProvider implements IAIProvider {
  constructor(baseUrl: string) { }

  async parseEventRequest(message: string): Promise<ParsedEventRequest> {
    // Use local Ollama model
    // Return structured data
  }
}
```

**Configuration:**
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

**Setup:** Install from https://ollama.ai

---

## Supported Providers

### Production Providers

| Provider | Cost | Setup | Latency | Best For |
|----------|------|-------|---------|----------|
| Gemini | Free tier available | API key | 2-5s | Quick start, free tier |
| Grok | Paid | API key | 2-5s | Twitter integration, recent events |
| Ollama | Free | Local setup | 5-30s | Privacy, offline, no API cost |

### Provider Comparison

**Gemini (Google)**
- Free tier: 60 requests/minute
- Good model quality
- Text-only in free tier
- Best for: Development

**Grok (xAI)**
- Paid API
- Strong reasoning
- Real-time web access
- Best for: Weather-aware recommendations

**Ollama (Local)**
- Free, offline
- Privacy guaranteed
- No API costs
- Best for: Privacy-first deployments

---

## Configuration

### .env Setup

```bash
# Choose one provider
AI_PROVIDER=gemini          # or grok, ollama

# Gemini
GEMINI_API_KEY=sk-...

# Grok
GROK_API_KEY=xai-...

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral       # or llama2, etc.
```

### Runtime Selection

The backend automatically selects the provider based on `AI_PROVIDER`:

```typescript
// backend/src/config/env.ts

const config = {
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  grokApiKey: process.env.GROK_API_KEY || '',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
};
```

---

## Usage

### In Backend Services

```typescript
// backend/src/services/ai/AIService.ts

class AIService {
  private aiProvider: IAIProvider;

  constructor(aiProvider: IAIProvider) {
    this.aiProvider = aiProvider;
  }

  async parseEventRequest(message: string): Promise<EventRequest> {
    // AI provider does the parsing
    const parsed = await this.aiProvider.parseEventRequest(message);
    
    // Backend validates the output
    const validated = ParsedEventRequestSchema.parse(parsed);
    
    return validated;
  }

  async explainRecommendation(outfit: Outfit[]): Promise<string> {
    // Optional: Get explanation from AI
    if (this.aiProvider.explainRecommendation) {
      return await this.aiProvider.explainRecommendation(outfit);
    }
    
    // Fallback: Generate basic explanation
    return generateBasicExplanation(outfit);
  }
}
```

### Initialization

```typescript
// backend/src/app.ts

import AIService from './services/ai/AIService';
import { createAIProvider } from './services/ai/AIProviderFactory';

const aiProvider = createAIProvider(config);
const aiService = new AIService(aiProvider);

// Pass through dependency injection
app.use((req, res, next) => {
  req.aiService = aiService;
  next();
});
```

---

## Security

### Phase 5+ Considerations

1. **Never expose API keys to frontend**
   - All AI calls happen on backend
   - Frontend never gets GEMINI_API_KEY, GROK_API_KEY

2. **Validate AI output**
   - Never trust raw AI responses
   - Use Zod to validate output schema
   - Verify item IDs belong to user

3. **Handle timeouts**
   - AI calls can timeout
   - Have fallback recommendations
   - User should never see errors from AI

4. **Rate limiting**
   - Limit AI calls per user (Phase 6+)
   - Cache responses where appropriate

5. **Cost control**
   - Monitor API usage
   - Implement quotas if needed
   - Alert on unusual activity

---

## Example: Switching Providers

### Scenario: Gemini → Grok

**Current (.env):**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=sk-...
```

**New (.env):**
```bash
AI_PROVIDER=grok
GROK_API_KEY=xai-...
```

**Code changes required:** NONE! 🎉

The backend automatically uses GrokProvider without any logic changes.

---

## Testing (Phase 5+)

### Unit Test Example

```typescript
// backend/src/services/ai/__tests__/AIService.test.ts

describe('AIService', () => {
  it('should parse engagement event request', async () => {
    const aiService = new AIService(new MockAIProvider());
    
    const result = await aiService.parseEventRequest(
      "I have my friend's engagement next Saturday. I want something classy and traditional."
    );
    
    expect(result.eventType).toBe('engagement');
    expect(result.formality).toBeGreaterThanOrEqual(3);
    expect(result.preferredStyle).toContain('traditional');
  });

  it('should validate AI output', async () => {
    const aiService = new AIService(new MockAIProvider());
    
    // Even if AI returns invalid data, validation should catch it
    expect(() => {
      const invalid = { eventType: 123 };  // Invalid type
      ParsedEventRequestSchema.parse(invalid);
    }).toThrow();
  });
});
```

---

## Common Issues

### "GEMINI_API_KEY not set"
- Check .env file
- Restart backend after changing .env
- Verify key format (no spaces)

### "Connection refused" (Ollama)
- Ensure Ollama is running: `ollama serve`
- Check OLLAMA_BASE_URL is correct

### "Invalid API key"
- Generate new key from provider console
- Update .env
- Restart backend

---

## Future Enhancements (Not Phase 5)

1. **Provider Failover**
   - If Gemini fails, try Grok
   - Graceful degradation

2. **Prompt Optimization**
   - A/B test different prompts
   - Fine-tune for better results

3. **Caching**
   - Cache parsed requests
   - Reduce API calls

4. **Feedback Loop**
   - User feedback improves prompts
   - Machine learning integration

---

**Document Status:** Phase 1 - Foundation, Phase 5 outline  
**Implementation Phase:** Phase 5
