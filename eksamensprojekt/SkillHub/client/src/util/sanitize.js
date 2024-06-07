import DOMPurify from "dompurify";
import validator from "validator";

export function sanitizeHTML(str) {
  return DOMPurify.sanitize(str);
}

export function sanitizeEmail(email) {
  if (validator.isEmail(email)) {
    return validator.normalizeEmail(email);
  }
  throw new Error("Invalid email address");
}
