/**
 * Tiny async helper. Each "API" function returns a Promise that resolves
 * after a short delay, mimicking a real HTTP call. Swap these for fetch()
 * to your backend when ready.
 */
export function delay(ms = 120) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function ok(value, ms) {
  await delay(ms);
  // Deep clone so consumers can't mutate the in-memory store by reference.
  return JSON.parse(JSON.stringify(value));
}
