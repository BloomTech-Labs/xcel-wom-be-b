const alpha = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'a',
  'C',
  'c',
  'D',
  'd',
  'E',
  'e',
  'G',
  'g',
  'H',
  'h',
  'J',
  'j',
  'K',
  'k',
  'L',
  'M',
  'm',
  'P',
  'p',
  'Q',
  'R',
  'r',
  'S',
  's',
  'T',
  't',
  'U',
  'u',
  'W',
  'w',
  'X',
  'x',
  'Y',
  'y',
  'Z',
  'z',
];

const genCode = (length) => {
  let code = '';
  for (let x = 1; x <= length; x++) {
    code += alpha[Math.floor(Math.random() * (alpha.length - 1))];
  }
  return code;
};

module.exports = genCode;
