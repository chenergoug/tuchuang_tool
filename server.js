const express = require('express')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const sequelize = require('./config/database')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000
// 中间件
app.use(helmet()) // 安全头
app.use(cors()) // 跨域
app.use(morgan('dev')) // 日志
app.use(express.json()) // 解析 JSON

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(process.env.SESSION_EXPIRE_TIME),
      httpOnly: true
    }
  })
)

// 路由
app.use('/api', routes)

// 数据库同步并启动服务器
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log(' 数据库连接成功')

    // 同步模型 (生产环境建议使用迁移工具)
    await sequelize.sync({ alter: true }) // alter: true 会自动更新表结构
    console.log('🔄 数据库表已同步')

    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口  http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(' 服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()
