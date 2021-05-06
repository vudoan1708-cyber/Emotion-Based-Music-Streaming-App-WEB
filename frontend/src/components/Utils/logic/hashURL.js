export default function hashURL(URL, which) {
  const splittedString = URL.split('=');

  if (splittedString[which] === undefined) {
    return '';
  }
  const result = splittedString[which].includes('&')
    ? splittedString[which].split('&')[0]
    : splittedString[which];
  return result;
}
