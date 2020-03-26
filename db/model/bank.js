const { Sequelize } = require('sequelize')
const { db } = require('../config/db')
const { v4 } = require('uuid')
const uuidv4 = v4

// 银行表模型
const Bank = db.define('todo', {
  id: {
    type: Sequelize.UUID,
    defaultValue: () => uuidv4().toUpperCase().replace(/-/g, ''),
    primaryKey: true
  },
  bnkTpCd: {
    type: Sequelize.STRING(4)
  },
  bnkTpName: {
    type: Sequelize.STRING(128)
  },
  bnkPrvn: {
    type: Sequelize.STRING(50)
  },
  bnkPrvnCd: {
    type: Sequelize.STRING(6)
  },
  bnkCity: {
    type: Sequelize.STRING(50)
  },
  bnkCityCd: {
    type: Sequelize.STRING(6)
  },
  brchName: {
    type: Sequelize.STRING(128)
  },
  cInterbankId: {
    type: Sequelize.STRING(40)
  },
  validStatus: {
    type: Sequelize.STRING(1)
  },
  updatedTime: {
    type: Sequelize.DATE
  },
  updatorId: {
    type: Sequelize.STRING(40)
  },
  creatorId: {
    type: Sequelize.STRING(40)
  },
  createTime: {
    type: Sequelize.DATE
  },
  phoneNo: {
    type: Sequelize.STRING(500)
  },
  zipCd: {
    type: Sequelize.STRING(500)
  },
  accOpnBrchAddr: {
    type: Sequelize.STRING(500)
  }
})

// 强制同步表结构
Bank.sync({
  force: false,
})

module.exports = Bank