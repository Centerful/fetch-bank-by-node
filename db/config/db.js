const {Sequelize} = require('sequelize')
const {
  db_name,
  host,
  port,
  user,
  password
} = require('./config').database

/**
 * 创建数据连接
 */
const db = new Sequelize(db_name, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {
  //   // create_time && update_time
  //   create_time: 'create_time',
  //   update_time: 'updated_time',
    timestamps: false,
    freezeTableName: true,
  //   // delete_time
  //   paranoid: true,
    // createdAt: null,
    // updatedAt: null,
  //   // deletedAt: 'deleted_at',
    // 把驼峰命名转换为下划线
    underscored: true,
  //   scopes: {
  //     bh: {
  //       attributes: {
  //         exclude: ['password', 'updated_at', 'deleted_at', 'created_at']
  //       }
  //     },
  //     iv: {
  //       attributes: {
  //         exclude: ['content', 'password', 'updated_at', 'deleted_at']
  //       }
  //     }
  //   }
  }
})



// Testing 测试连接是否可用
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


module.exports = {
  db, Sequelize
}



// 三种特殊情况：广州 - 澳门 - 5810， 深圳 - 香港 - 5840，海口 - 东方 - 6410
