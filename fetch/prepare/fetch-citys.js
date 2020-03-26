const parser = require('../html-parse')
const fetchs = require('../fetch-html')


async function main () {
  let html = await fetchs.fetch_html('http://www.5cm.cn/bank')
  let $ = parser.parser(html)
  let prov_list = $('div.row > div.col-md-8').find('h5').toArray()
  let obj = {}
  for (const prov of prov_list) {
    let city_list = $(prov).next().find('li > a').toArray();
    city_list.reduce((o, c) => {
      if (o[$(c).attr('href')]) return o
      o[$(c).attr('href')] = {
        url: $(c).attr('href'),
        city: $(c).text().trim(),
        prov: $(prov).text().trim()
      }
      return o
    }, obj)
  }
  console.log(obj)
}

main();