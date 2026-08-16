# FUTURE_FEATURES.md

**Features designed for future phases but NOT implemented in V1.**

## 📚 Architecture Compatibility

This document outlines features planned for future phases.

**Important:** These are NOT implemented now. The architecture is designed to support them later without forcing rewrites.

---

## Planned Future Features

### Phase 8: Recommendation History

**What:** Track which recommendations users have viewed, saved, and worn.

**Why:** 
- Understand user preferences
- Prevent repetition
- Build personalization

**Data Model:**
```typescript
interface IRecommendationHistory {
  userId: ObjectId;
  eventRequest: string;
  itemIds: ObjectId[];  // Wardrobe items shown
  score: number;
  shownAt: Date;
  selectedByUser?: boolean;
  wornByUser?: boolean;
  feedback?: string;
}
```

**UI:**
- History page showing past recommendations
- View details of each recommendation
- Mark as worn
- Filter by date, event type

**Impact:**
- Enable novelty scoring
- Track recommendation quality
- Personalization foundation

---

### Phase 8+: User Feedback

**What:** Users can rate, like, dislike, or save recommendations.

**Why:**
- Improve recommendations over time
- Learn user preferences
- Gamification

**Actions:**
- ❤️ Like recommendation
- 👎 Dislike recommendation
- 💾 Save recommendation
- 👕 Mark as worn
- ❌ "Never suggest this item"

**Data Model:**
```typescript
interface IRecommendationFeedback {
  userId: ObjectId;
  recommendationId: ObjectId;
  action: 'like' | 'dislike' | 'save' | 'worn' | 'never_suggest';
  createdAt: Date;
}
```

---

### Phase 8+: Personalization Learning

**What:** System learns from user behavior to improve recommendations.

**Why:**
- Better tailored recommendations
- Reduced irrelevant suggestions
- Improved user satisfaction

**Learning Points:**
- Colors user frequently wears
- Styles user prefers
- Events user attends most
- Jewelry-outfit associations
- Seasonal preferences
- Time-of-day preferences

**Implementation:**
- NOT machine learning initially
- Simple preference aggregation
- Rule-based scoring adjustments
- Could graduate to ML later

**Example:**
```
User has worn gold jewelry in 80% of recommendations
→ Boost gold jewelry score by +5 points
```

---

### Phase 9+: RAG (Retrieval-Augmented Generation)

**What:** Semantic search across wardrobe and recommendation history.

**Why:**
- Answer queries like "Show me outfits similar to my cousin's wedding"
- Semantic wardrobe search
- Improve recommendations with context

**Use Cases:**
1. "I want something similar to what I wore at my cousin's wedding"
2. "Show me outfits that work with this necklace"
3. "What jewellery usually pairs with my blue tops?"
4. "Find all my elegant traditional outfits"

**Architecture:**
```
User Query
    ↓
AI converts to embedding vector
    ↓
MongoDB vector search
    ↓
Retrieve similar items
    ↓
Rerank with recommendations
    ↓
Return results
```

**Not Required:**
- Separate vector database
- MongoDB Atlas Vector Search can handle it
- Only needed if semantic relevance matters

---

### Phase 9+: Vector Search Integration

**What:** Use embeddings to find semantically similar items.

**Why:**
- Find "similar" items beyond exact matches
- Better color/style matching
- Wardrobe clustering

**Use Cases:**
- Find items similar to a favorite piece
- Cluster items by style
- Identify gaps in wardrobe

**Implementation Options:**
1. **MongoDB Vector Search** (recommended)
   - Built into MongoDB Atlas
   - No external database needed
   - Costs extra ($0.10/hour)

2. **Separate Vector DB** (advanced)
   - Pinecone, Milvus, Weaviate
   - Overkill for Phase 1-8
   - Consider only if necessary

---

### Phase 9+: AI Image Recognition

**What:** Automatically extract metadata from uploaded images.

**Why:**
- Users don't need to manually enter colors, material, style
- Metadata automatically populated
- Faster onboarding

**Flow:**
```
User uploads image
    ↓
Backend → AI Vision (Claude, GPT-4V)
    ↓
AI analyzes image
    ↓
AI returns metadata:
- category
- colors
- material
- pattern
- style tags
- formality
    ↓
User confirms/edits metadata
    ↓
Item created
```

**AI Capabilities:**
- Detect clothing type (top, pants, dress)
- Identify colors and patterns
- Infer material (silk, cotton, denim)
- Estimate formality level
- Suggest style tags (elegant, casual, traditional)

---

### Phase 9+: Outfit Visualization

**What:** Generate mock-up images of recommended outfits.

**Why:**
- Users see how items look together
- More engaging UI
- Helps decision-making

**Flow:**
```
Selected Outfit
(top, pants, jewelry, sandals)
    ↓
Extract wardrobe item images
    ↓
Backend → AI Image Model (DALL-E, Midjourney)
    ↓
AI generates outfit visualization
    ↓
Display alongside actual photos
    ↓
User sees both real items and visualization
```

**Important Caveat:**
- Generated image is illustrative
- Real wardrobe photos are source of truth
- Never replace actual photos with AI-generated

---

### Phase 9+: Weather Integration

**What:** Consider weather in recommendations.

**Why:**
- Suggest weather-appropriate clothing
- Rain → indoor-friendly shoes
- Summer → breathable fabrics
- Cold → warm layers

**Flow:**
```
User event request:
"Engagement next Saturday"
    ↓
If user provides location or date
    ↓
Fetch weather forecast
    ↓
Adjust recommendation scoring:
- Hot weather → breathable, light colors
- Cold → warm, darker colors
- Rain → appropriate footwear
```

**Data Model:**
```typescript
interface EventRequest {
  weather?: {
    temperature?: number;
    condition?: string;  // sunny, rainy, cloudy
    rainProbability?: number;
  };
  location?: string;
  date?: Date;
}
```

---

### Phase 9+: Calendar Integration

**What:** Connect to user's calendar to understand events.

**Why:**
- Automatic event detection
- Context-aware recommendations
- Historical event data

**Integration:**
- Google Calendar API
- Outlook Calendar API
- Apple Calendar

**Example:**
```
User asks: "What should I wear tomorrow?"
    ↓
Backend checks calendar
    ↓
Finds: "Conference at 2pm, dinner at 7pm"
    ↓
Recommends outfit that works for both
```

---

### Phase 9+: Outfit Visualization by User Photo

**What:** Users upload their photo, system shows how they'd look in the outfit.

**Why:**
- Most realistic preview
- Build confidence in recommendation
- Account for skin tone, hair color

**Flow:**
```
User uploads selfie
    ↓
System extracts face/complexion
    ↓
AI generates outfit visualization with user's appearance
    ↓
User sees realistic preview
```

**Technology:**
- Face detection (AWS Rekognition, Google Vision)
- Generative AI (DALL-E, Midjourney, Stable Diffusion)

**Privacy Considerations:**
- Store user photos securely
- Allow deletion anytime
- Clear data retention policy

---

### Phase 9+: Style Profile Building

**What:** Comprehensive user style profile built over time.

**Why:**
- Better personalization
- Identify user's unique style
- Preference learning

**Profile Components:**
```typescript
interface UserStyleProfile {
  favoriteColors: { [color: string]: number };  // score
  frequentStyles: { [style: string]: number };
  avoidedItems: ObjectId[];
  preferredBrands: string[];
  preferredMaterials: string[];
  seasonalPreferences: { [season: string]: string[] };
  eventTypePreferences: { [eventType: string]: string[] };
  colorCombinations: Array<{ colors: string[]; score: number }>;
  itemAssociations: Map<ObjectId, ObjectId[]>;  // item → compatible items
}
```

**Building Process:**
- Analyze user's past recommendations
- Track user's feedback
- Learn from worn items
- Identify patterns

---

### Phase 9+: Smart Recommendations

**What:** Recommendations that improve based on time and context.

**Why:**
- Different occasions need different logic
- Weekend vs. workday
- Morning vs. evening
- Seasonal changes

**Enhancements:**
```typescript
// Seasonal scoring adjustments
if (season === 'summer') {
  lightColor.score += 10;
  winterMaterial.score -= 10;
}

// Time-based adjustments
if (timeOfDay === 'evening') {
  formalityRequired += 1;
}

// Weather adjustments
if (weather.rainProbability > 0.7) {
  waterproofFootwear.score += 15;
}

// Historical patterns
if (user.woreOutfit(top, pant) < 7daysAgo) {
  noveltyScore -= 25;
}
```

---

### Phase 9+: Community Features

**What:** Share outfits with friends, see what others wore.

**Why:**
- Social engagement
- Get inspiration
- Reduce fashion anxiety

**Features:**
- Share outfit on social media
- View friends' recommendations
- Public style profiles
- Outfit ratings/reviews

**Privacy:**
- Opt-in sharing
- Granular permissions
- No data sold

---

## Design for Future Extensibility

### Current Architecture Supports

- ✅ Additional metadata fields (colors, material, etc.)
- ✅ New recommendation factors (weather, calendar)
- ✅ AI provider switching (Gemini, Grok, Ollama)
- ✅ Embedding integration (vector search)
- ✅ New categories (swimwear, sportswear)
- ✅ User feedback collection
- ✅ Historical tracking
- ✅ Personalization weights

### Will NOT Require Major Rewrites

- RAG implementation (add embeddings layer)
- AI image recognition (use same AI abstraction)
- Weather integration (extend EventRequest)
- Calendar sync (hook into existing event parsing)
- Visualization (extend recommendation response)
- Community (new collection + views)

---

## Why NOT Implement Now?

1. **Scope:** MVP should focus on core feature
2. **Complexity:** Additional features need Phase 1-7 foundation
3. **Cost:** Some features have API costs
4. **Privacy:** Storage and processing of user data needs careful consideration
5. **Testing:** Each feature requires proper testing
6. **Maintenance:** More code = more to maintain

**Better Approach:**
1. Complete Phase 1-7 (core functionality)
2. Get user feedback
3. Decide which Phase 8+ features matter most
4. Implement based on user needs

---

## Resource Impact

### Storage
- Embeddings: ~1KB per item
- User photos: 1-5MB each (if stored)
- History: Minimal (just references)

### Compute
- Vector search: 10-100ms queries
- Image recognition: 1-5 seconds
- Visualization: 5-30 seconds

### Cost (Rough Estimates)
- Vector search: $0.10-1.00/hour
- Image recognition: $0.01-0.50 per image
- Visualization: $0.10-1.00 per image
- Weather API: Free tier available
- Calendar API: Free

---

## Evaluation Criteria for Phase 8+

When deciding which features to implement next:

1. **User Value:** How much do users want this?
2. **Effort:** How long to implement correctly?
3. **Maintenance:** Will this create ongoing support burden?
4. **Cost:** API costs, infrastructure costs
5. **Privacy:** Does this require additional data privacy measures?
6. **Uniqueness:** Does this differentiate from competitors?

---

**Document Status:** Phase 1 - Vision and planning  
**Implementation:** Phases 8-9+
