const parser = require('../html-parse')
const fetchs = require('../fetch-html')

async function main () {
  let html = await fetchs.fetch_html('http://www.5cm.cn/bank')
  let $ = parser.parser(html)
  // 获得省市区域所在的dom节点 col-md-8 > div.well
  let prov_list = $('div.row > div.col-md-8').find('h5');

  // 获得需要遍历的城市信息
  let areas = []
  for (let i = 0; i < prov_list.length; i++) {
    const node = prov_list[i];
    let prov = node.firstChild.data // 江苏
    let citys = $(node).next().find('li')
    let arr = []
    for (let i = 0; i < citys.length; i++) {
      const n = citys[i];
      areas.push({
        prov: prov,
        city: n.firstChild.firstChild.data,
        url: 'http://www.5cm.cn' + n.firstChild.attribs.href, // /bank/nanjing/
        code: ''
      })
    }
  }
  JSON.stringify(areas.map(n => {return { prov: n.prov+'省', city: n.city+'市', code: n.code}}).reduce((obj, n) => {  obj[n.code] = { ...n}; return obj;}, {}))
  // 遍历城市
  for (let i = 0; i < areas.length; i++) {
    const city = areas[i];
    html = await fetchs.fetch_html(city.url)
    let bank_info = parser.parse_banks_only_first(parser.parser(html))
    if (!bank_info) city.code = 'none'
    city.code = bank_info.prov_city_code
    console.log(city)
  }
  console.log(areas)
  let json = JSON.stringify(areas.map(n => {return { prov: n.prov+'省', city: n.city+'市', code: n.code}}).reduce((obj, n) => {  obj[n.code] = { ...n}; return obj;}, {}))
  console.log(json)
}

main();