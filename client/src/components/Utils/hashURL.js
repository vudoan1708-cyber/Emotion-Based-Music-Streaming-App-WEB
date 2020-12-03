export default function hashURL() {
  const splittedString = window.location.search.split('=');
  const result = splittedString[splittedString.length - 1];

  return result;
}
