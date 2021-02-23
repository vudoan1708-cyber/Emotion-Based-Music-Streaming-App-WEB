export default function hashURL(URL, which) {
  const splittedString = URL.split('=');
  const result = splittedString[splittedString.length - which];
  return result;
}
