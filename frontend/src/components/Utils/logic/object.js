export default function isEmpty(obj) {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
}

export function deepClone(obj) {
  if (obj) {
    try {
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
      return window.structuredClone(obj);
    // If a browser doesn't support the function, use JSON to deep clone the passed object
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  }
  return null;
}
