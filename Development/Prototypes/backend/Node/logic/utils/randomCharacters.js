module.exports = function randomCharacters(max) {
  let text = '';

    // a list of characters that can be chosen
    const char = 'abcdefghijklmnopqrstuvwxyz';

    // get random characters from the string
    for(let i = 0; i < max; i++) {
        text += char.charAt(Math.floor(Math.random() * char.length));
    }

    return text;
}
