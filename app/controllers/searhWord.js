exports.sentence = (x) => {
  let withOutCharacter;
  if (x == undefined || x.length === 0) return withOutCharacter = '[sticker]';
  if (x.indexOf('!') === 0) return x;
  withOutCharacter = x.replace(/[^a-zA-Z0-9 ]/g, '')
  let words = withOutCharacter.toLowerCase().split(' ');
  let newWord;
  words.forEach((e) => {
    const wordSplit = e.split('');
    const uniqueLetter = [...new Set(wordSplit.map((x) => x))];
    const wordJoin = uniqueLetter.join('');
    if (wordJoin == 'hola' || wordJoin == 'holis' || wordJoin == 'holas') {
      newWord = 'hola'
    }
  });
  return (newWord != undefined) ? newWord : x
};
