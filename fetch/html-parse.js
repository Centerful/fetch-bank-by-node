const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const banks = require('../data/banks')
const areas = require('../data/areas')

const parser = {

  /**
   * 根据html页面返回dom树对象
   * @param {String} html html页面
   */
  parser: function (html) {
    // 将html转为obj
    let $ = cheerio.load(html, { decodeEntities: false })
    return $
  },

  load_local_test_file: function (file_path = "../data/bank.html") {
    return fs.readFileSync(path.join(__dirname, file_path), 'utf-8')
  },

  /**
   * 根据dom树，解析返回银行类型编码对象
   * @Deprecated
   * @param {*} $ 
   */
  parse_bank_types: function ($) {
    let arr = $('html').find('.col-md-4 > .well > ul > li').toArray()
    let banks = {}
    for (let i of arr) {
      banks[i.firstChild.attribs.href.replace('/bank/', '').replace('/', '')] = {
        url: i.firstChild.attribs.href,
        name: i.firstChild.children[0].data
      }
    }
    delete banks['313B'] // 删除北京银行
    delete banks['313S'] // 删除上海银行
    return banks
  },

  /**
   * 解析当前页面表格中的银行信息
   * @param {Dom} $ dom树节点
   */
  parse_banks: function ($, prov, city) {
    // 获得当前页面表格中的银行信息
    let bank_infos = $('html').find('table.table > tbody').children()
    // 判断是否本页是否存在数据，如果不存在则结束当前银行的循环
    if (bank_infos.length < 2) {
      console.log("当前页面没有银行信息");
      return;
    }
    // 保存银行信息结构
    let arr = []
    // 跳过第一行fetch银行数据
    for (let i = 1; i < bank_infos.length; i++) {
      let tds = $(bank_infos[i]).find('td');
      arr.push({
        cnaps: tds[0].firstChild.data, // 联行号
        bank_name: tds[1].firstChild.firstChild.data, // 支行名称
        phone: tds[2].firstChild ? tds[2].firstChild.data : null, // 电话
        postcode: tds[3].firstChild ? tds[3].firstChild.data : null, // 邮编
        address: tds[4].firstChild ? tds[4].firstChild.data : null, // 支行地址
        swift_code_url: (tds[5].firstChild.attribs ? 'http://www.5cm.cn' + tds[5].firstChild.attribs.href : null), // swiftcode
        bank_type_code: tds[0].firstChild.data.substring(0, 3), // 银行大行行号
        bank_type_name: banks[tds[0].firstChild.data.substring(0, 3)].name || null, // 银行大行名称
        prov_city_code: tds[0].firstChild.data.substring(3, 7), // 省市地区代码
        // prov_name: areas[tds[0].firstChild.data.substring(3, 7)] ? areas[tds[0].firstChild.data.substring(3, 7)].prov : null, // 省份名称
        // city_name: areas[tds[0].firstChild.data.substring(3, 7)] ? areas[tds[0].firstChild.data.substring(3, 7)].city : null, // 城市名称
        prov_name: prov,
        city_name: city
      })
    }
    return arr
  },
  parse_banks_only_first: function ($) {
    // 获得当前页面表格中的银行信息
    let bank_infos = $('html').find('table.table > tbody').children()
    // 判断是否本页是否存在数据，如果不存在则结束当前银行的循环
    if (bank_infos.length < 2) {
      console.log("当前页面没有银行信息");
      return;
    }
    
    let tds = $(bank_infos[1]).find('td');
    return {
      cnaps: tds[0].firstChild.data, // 联行号
      bank_name: tds[1].firstChild.firstChild.data, // 支行名称
      phone: tds[2].firstChild.data, // 电话
      postcode: tds[3].firstChild.data, // 邮编
      address: tds[4].firstChild.data, // 支行地址
      swift_code_url: (tds[5].firstChild.attribs ? 'http://www.5cm.cn' + tds[5].firstChild.attribs.href : null), // swiftcode
      bank_type_code: tds[0].firstChild.data.substring(0, 3), // 银行大行行号
      bank_type_name: banks[tds[0].firstChild.data.substring(0, 3)].name || null, // 银行大行名称
      prov_city_code: tds[0].firstChild.data.substring(3, 7), // 省市地区代码
      prov_name: areas[tds[0].firstChild.data.substring(3, 7)] ? areas[tds[0].firstChild.data.substring(3, 7)].prov : null, // 省份名称
      city_name: areas[tds[0].firstChild.data.substring(3, 7)] ? areas[tds[0].firstChild.data.substring(3, 7)].city : null, // 城市名称
    }
  }
}

// console.log(Parser.parse_banks(Parser.parser(Parser.load_local_test_file())))

module.exports = parser