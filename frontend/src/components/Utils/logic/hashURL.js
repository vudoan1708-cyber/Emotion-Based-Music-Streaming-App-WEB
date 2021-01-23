export default function hashURL(URL) {
  const splittedString = URL.split('=');
  const result = splittedString[splittedString.length - 1];
  return result;
}
