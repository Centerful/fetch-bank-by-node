// const fetchs = require('./fetch/fetch-html')
const parser = require('./fetch/html-parse')

// fetchs.fetch()
// let html = await fetchs.fetch_html('http://www.ccb.com/cn/OtherResource/bankroll/html/code_help.html')
// console.log(html)

// 解析html
let html = parser.load_local_test_file('../data/area2.html');
let $ = parser.parser(html)
let prov_city = {}
let provs = $('div.fall').find('div.addlist').find('h3')
for (let i = 0; i < provs.length; i++) {
  const prov = $(provs[i])
  let citys = prov.next().find('tr').toArray().filter((_, i) => i > 0)
  citys.reduce((pc, c) => {
    let str = $(c).find('td').text().trim().replace(/ |\n|\r|\t/g, '')
    if (pc[str.slice(0, 4)]) return pc
    pc[str.slice(0, 4)] = {
      prov: prov.text(),
      city: str.slice(4),
      code: str.slice(0, 4)
    }
    return pc
  }, prov_city)
}
console.log(prov_city)