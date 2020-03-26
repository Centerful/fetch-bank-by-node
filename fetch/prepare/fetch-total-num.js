const parser = require('../html-parse')
const fetchs = require('../fetch-html')
const banks = require('../../data/banks')

async function main () {
  let count = 0
  for (const prop in banks) {
    count += await fetch_sum(banks[prop])
    console.log(count)
  }
  console.log('最终：' + count)
}
async function fetch_sum (bank) {
  try {
    let html = await fetchs.fetch_html(`http://www.5cm.cn${bank.url}`)
    let $ = parser.parser(html)
    let str = $($('ul.pagination').children()[0]).find('a').text()
    if (!str || str === '') {
      let a = parser.parse_banks($, 'x', 'x')
      return a ? a.length : 0
    }

    return parseInt(str.substring(1).substring(0, str.substring(1).length - 1))
  } catch(e) {
    console.error(`错误：http://www.5cm.cn${bank.url}`)
    console.error(e)
    return 0
  }
}


main();