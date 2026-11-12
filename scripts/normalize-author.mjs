/**
 * Cleans the `Artist` text Commons returns into a plain author name. Commons
 * fills the field with boilerplate when the uploader left it blank; those
 * strings must never reach the site. Real names pass through untouched.
 */
export function normalizeAuthor(raw) {
  const text = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (!text || /^unknown author\b/i.test(text)) return "";
  const patterns = [
    /^no machine-readable author provided\.?\s+(.+?)\s+assumed\b.*$/i,
    /^the original uploader was\s+(.+?)\s+at wikimedia commons\b.*$/i,
    /^original \w+ by\s+(.+)$/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) return match[1].trim();
  }
  if (/^no machine-readable author provided/i.test(text)) return "";
  return text;
}
