/* eslint-disable no-param-reassign */
export function randomCharacters(max) {
  let text = '';

  // a list of characters that can be chosen
  const char = 'abcdefghijklmnopqrstuvwxyz';

  // get random characters from the string
  for (let i = 0; i < max; i += 1) {
    text += char.charAt(Math.floor(Math.random() * char.length));
  }

  return text;
}

export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}
