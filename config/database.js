const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  logging: false, // 生产环境设为 false
  define: {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    underscored: true // 使用下划线命名法 (createdAt -> created_at)
  }
})

module.exports = sequelize
