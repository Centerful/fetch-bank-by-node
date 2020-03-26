const Bank = require('./model/bank')

const def_bank = {
  validStatus: '1',
  updatedTime: new Date(),
  updatorId: 'JZ',
  creatorId: 'JZ',
  createTime: new Date(),
  remark: 'fetch from www.5cm.cn/bank/'
}


const bank_service = {
  insert: async (bank) => {
    let result = await Bank.create({...def_bank, ...bank});
    console.log(result.cInterbankId)
  },
  insert_list: async (banks) => {
    let result = await Bank.bulkCreate(banks.map(n => { return {...def_bank, ...n} }));
    console.log(JSON.stringify(result.reduce((str, n) => `${str}, ${n.cInterbankId}`, '')))
  }
}
// bank_service.insert({
//   bnkTpCd: '104',
//   bnkTpName: '建设银行',
//   bnkPrvn: '广东省',
//   bnkPrvnCd: '4400',
//   bnkCity: '广州市',
//   bnkCityCd: '4400',
//   brchName: 'xxx支行',
//   cInterbankId: '123556789123',
// })

// bank_service.insert({
//   bnkTpCd: '104',
//   bnkTpName: '建设银行',
//   bnkPrvn: '广东省',
//   bnkPrvnCd: '4400',
//   bnkCity: '广州市',
//   bnkCityCd: '4400',
//   brchName: 'xxx支行',
//   cInterbankId: '123556789123',
// })

// Testing
// bank_service.insert_list([{
//   bnkTpCd: '104',
//   bnkTpName: '建设银行',
//   bnkPrvn: '广东省',
//   bnkPrvnCd: '4400',
//   bnkCity: '广州市',
//   bnkCityCd: '4400',
//   brchName: 'xxx支行',
//   cInterbankId: '123556789123',
// },{
//   bnkTpCd: '105',
//   bnkTpName: '中国工商银行',
//   bnkPrvn: '广东省',
//   bnkPrvnCd: '4400',
//   bnkCity: '广州市',
//   bnkCityCd: '4400',
//   brchName: 'xxx支行',
//   cInterbankId: '123656789123',
// }])

module.exports = bank_service
/*
Bank.create({
  bnkTpCd: '103',
  bnkTpName: '中国银行',
  bnkPrvn: '广东省',
  bnkPrvnCd: '4400',
  bnkCity: '广州市',
  bnkCityCd: '4400',
  brchName: 'xxx支行',
  cInterbankId: '123456789123',
  validStatus: '1',
  updatedTime: new Date(),
  updatorId: 'JZ',
  creatorId: 'JZ',
  createTime: new Date(),
  remark: 'fetch insert',
}).then(domain => {
  console.log(`插入的对象:${JSON.stringify(domain)}`)
}).catch((err) => {
  console.log(err)
})
 */