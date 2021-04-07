exports.sentence = (x) => {
  let withOutCharacter = x.replace(/[^a-zA-Z0-9 ]/g, '');
  let words = withOutCharacter.toLowerCase().split(' ');
  let newWord;
  words.forEach((e) => {
    if (e == 'hola' || e == 'holis') {
      return newWord = 'hola';
    } else if (
      (e == 'mi' && e != 'nombre' && e != 'es') ||
      e != 'soy' ||
      (e != 'me' && e != 'llamo')
    ) {
      if (
        e != 'mi' &&
        e != 'nombre' &&
        e != 'soy' &&
        e != 'me' &&
        e != 'llamo' &&
        e != 'es'
      ) {
        let name = e.charAt(0).toUpperCase() + e.slice(1)
        return newWord = name, 'nombre'
      }
    }
  });
  return newWord
};
