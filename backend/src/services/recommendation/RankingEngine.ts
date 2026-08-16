import { EventRequest } from '../ai/AIProvider';

export type RecommendationCandidate = {
  items: any[];
  score: number;
  reasons: string[];
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const scoreOutfit = (items: any[], request: EventRequest): number => {
  if (!items.length) return 0;

  let score = 0;
  const preferredColors = (request.colors || []).map((color) => color.toLowerCase());

  const categories = items.map((item) => item.category);
  const hasTop = categories.some((category) => ['top', 'shirt', 'frock'].includes(category));
  const hasBottom = categories.some((category) => ['pant'].includes(category));
  const hasFootwear = categories.some((category) => ['sandal', 'heel', 'flat'].includes(category));
  const hasAccessory = categories.some((category) => ['earring', 'necklace', 'bracelet', 'chain'].includes(category));

  if (hasTop) score += 18;
  if (hasBottom) score += 18;
  if (hasFootwear) score += 12;
  if (hasAccessory) score += 10;

  const formalityScore = items.reduce((total, item) => total + (item.formality || 3), 0) / items.length;
  score += (formalityScore / 5) * 20;

  const colorMatch = items.reduce((total, item) => {
    const matches = (item.colors || []).filter((color: string) => preferredColors.includes(color.toLowerCase()));
    return total + matches.length;
  }, 0);
  score += clamp(colorMatch * 8, 0, 25);

  const eventFit = items.some((item) => {
    const tags = [...(item.occasionTags || []), ...(item.styleTags || [])].map((tag) => tag.toLowerCase());
    return tags.includes(request.eventType.toLowerCase()) || tags.includes((request.style || '').toLowerCase());
  }) ? 15 : 0;
  score += eventFit;

  score += clamp((items.length / 5) * 10, 0, 12);

  return clamp(score, 0, 100);
};

export const generateCandidates = (items: any[], request: EventRequest): RecommendationCandidate[] => {
  const tops = items.filter((item) => ['top', 'shirt', 'frock'].includes(item.category));
  const bottoms = items.filter((item) => item.category === 'pant');
  const footwear = items.filter((item) => ['sandal', 'heel', 'flat'].includes(item.category));
  const accessories = items.filter((item) => ['earring', 'necklace', 'bracelet', 'chain'].includes(item.category));

  const candidates: RecommendationCandidate[] = [];

  for (const top of tops.slice(0, 5)) {
    const bottom = bottoms[0] || null;
    const shoe = footwear[0] || null;
    const accessory = accessories[0] || null;
    const outfit = [top, bottom, shoe, accessory].filter(Boolean);
    if (!outfit.length) continue;

    const score = scoreOutfit(outfit, request);
    const reasons = [
      `Matches ${request.eventType} styling`,
      `Uses ${top.colors?.join(', ') || 'core wardrobe colors'}`,
    ];

    candidates.push({ items: outfit, score, reasons });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 5);
};
