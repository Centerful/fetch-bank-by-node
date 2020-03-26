const request = require('request')
const fs = require('fs')
const path = require('path')
const parser = require('./html-parse')
const citys = require('../data/citys')
const bank_service = require('../db/bank-curd')


const domain = 'http://www.5cm.cn'
let options = {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36'
  }
};

/**
 * 判断响应返回码与content-type是否是需要的
 * @param {Response} res http响应
 */
function verify_res(res) {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];
  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
  } else if (!/^text\/html; charset=utf-8/.test(contentType.toLowerCase())) {
    error = new Error(`无效的contentType，期望获得text/html; charset=utf-8 请求头，现在是： ${contentType}`);
  }
  // 抛出异常
  if (error) throw error
}

const fetchs = {
  /**
 * fetch html 返回页面内容
 * @param {String} url 网页路径
 */
  fetch_html: async function (url) {
    options.url = url
    return new Promise(function (resolve, reject) {
      request(options, function (error, res, body) {
        // 校验返回对象
        verify_res(res)
        // promise 处理
        resolve(body)
      });
    })
  },

  /**
   * fetch当前银行大类下银行信息，并将信息保存到数据库中
   * @param {String} bank_type_code 银行大行编码
   */
  collect_bank: async function (city) {
    // 当前银行url
    let url = domain + city.url
    // 页码
    let page = 0
    // 银行信息
    let bank_arr = []
    // 页面内容
    let html = ""
    do {
      // 页码+1
      page++
      // 页面下载
      try {
        html = await this.fetch_html(url + page)
      } catch (e) {
        this.fail_handle(e, url + page, `页面下载报错，路径：${url + page}`)
        continue
      }

      let bank_infos = []
      try {
        // 解析出银行信息
        bank_infos = parser.parse_banks(parser.parser(html), city.prov, city.city)
      } catch (e) {
        this.fail_handle(e, url + page,`页面解析失败`)
        continue
      }
      if (!bank_infos) {
        break;
      }
      // 输出到文本中
      // this.write_bank_file(bank_infos, bank_type_code, page)
      // 保存到数据库
      try {
        this.save_bank_infos(bank_infos)
      } catch(e) {
        this.fail_handle(e, url + page,`保存到数据库失败`)
        continue
      }
      console.log(`        页面：${url + page} --- 完成信息收集`)
    } while (true)
  },
  /**
   * 将银行信息插入到数据库
   * @param {Array} bank_infos 银行信息
   */
  save_bank_infos: function (bank_infos) {
    // 插入集合
    bank_service.insert_list(bank_infos.map(n => {
      // 对象字段映射
      return {
        bnkTpCd: n.bank_type_code,
        bnkTpName: n.bank_type_name,
        bnkPrvn: n.prov_name,
        bnkPrvnCd: n.prov_city_code,
        bnkCity: n.city_name,
        bnkCityCd: n.prov_city_code,
        brchName: n.bank_name,
        cInterbankId: n.cnaps,
        phoneNo: n.phone,
        zipCd: n.postcode,
        accOpnBrchAddr: n.address
      }
    }))
  },

  /**
   * 异常处理，将异常记录下来，后续继续重试
   * @param {Error} e 异常
   * @param {String} url 页面路径
   * @param {String} msg 异常消息
   */
  fail_handle: function (e, url, msg) {
    console.error(msg)
    console.error(e)
    this.write_err_file({
      url: url,
      msg: msg,
      err: e.message
    })
  },

  /**
   * @Deprecated 已废弃现在插入数据库
   * @param {Array} bank_infos 银行信息
   * @param {String} bank_type_code 大行行好
   * @param {String} page 页码
   */
  write_bank_file: function (bank_infos, bank_type_code, page) {
    try {
      let parent = {}
      let sub = {}
      sub[page] = bank_infos
      parent[bank_type_code] = sub
      fs.appendFileSync(path.join(__dirname, `../store/banks-${bank_type_code}.json`), (JSON.stringify(parent) + ',\n'))
    } catch (e) {
      // 记录异常信息
      throw e
    }
  },

  write_err_file: function (err) {
    try {
      fs.appendFileSync(path.join(__dirname, `../store/error-${bank_type_code}.json`), (JSON.stringify(err) + ',\n'))
    } catch (e) {
      throw e
    }
  },

  fetch: async function () {
    // 获得所有要查询的银行
    for (const city in citys) {
      await this.collect_bank(citys[city])
      console.log(`${citys[city].url} --- 完成信息收集`)
    }
  }
}

// write_bank_file({
//   name: "123",
//   age: 12,
//   sex: "男"
// }, 103, 1)

// write_err_file({
// url: `https://blog.csdn.net/qq_29813205/article/details/78764093`,
// msg: `页面下载报错，路径：https://blog.csdn.net/qq_29813205/article/details/78764093`,
// err: `点击我的`
// })

module.exports = fetchs

