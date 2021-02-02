const Companies = require('../api/company/companyModel');

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

const checkCode = async (code) => {
  const found = await Companies.findRoleByCode(code);
  if (found) {
    console.log(`Found ${code}`);
    console.log(found);
  } else {
    console.log(`No ${code}`);
  }
  return found;
};

const genCode = (length) => {
  let code = '';
  for (let x = 1; x <= length; x++) {
    code += alpha[Math.floor(Math.random() * (alpha.length - 1))];
  }
  if (checkCode(code)) {
    // if the code is in the DB, we need a new one
    return genCode(length);
  } else {
    // if it's not, we are good to go
    return code;
  }
};

module.exports = genCode;
