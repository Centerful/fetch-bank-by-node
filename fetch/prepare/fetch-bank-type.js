const parser = require('../html-parse')

function main () {
  let banks = parser.parse_bank_types(parser.parser(parser.load_local_test_file()))
  console.log(banks)
}

main();