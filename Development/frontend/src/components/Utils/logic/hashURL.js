export default function hashURL() {
  const splittedString = window.location.href.split('=');
  const result = splittedString[splittedString.length - 1];
  return result;
}
