import DOMPurify from "dompurify";

interface SanitizeOptions {
  trim?: boolean;
}

export function sanitizeInput(value: string, options: SanitizeOptions = {}): string {
  const { trim = true } = options;
  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  return trim ? sanitized.trim() : sanitized;
}
