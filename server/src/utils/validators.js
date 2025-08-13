export function requireFields(obj, fields = []) {
  const missing = fields.filter((f) => !obj[f] || String(obj[f]).trim() === "");
  if (missing.length) {
    const err = new Error(`Missing required field(s): ${missing.join(", ")}`);
    err.statusCode = 400; err.expose = true; throw err;
  }
}

export function assertIn(value, list, fieldName) {
  if (!list.includes(value)) {
    const err = new Error(`${fieldName} must be one of: ${list.join(", ")}`);
    err.statusCode = 400; err.expose = true; throw err;
  }
}

export function assertUrlOptional(value, fieldName) {
  if (!value) return; // optional
  try { new URL(value); } catch {
    const err = new Error(`${fieldName} must be a valid URL`);
    err.statusCode = 400; err.expose = true; throw err;
  }
}