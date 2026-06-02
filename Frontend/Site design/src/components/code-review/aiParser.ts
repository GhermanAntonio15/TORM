export function parseAiJsonResponse(raw: string) {
  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}
