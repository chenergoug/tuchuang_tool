const express = require('express')
const router = express.Router()

// 鉴权路由
const AuthRouter = require('./auth')

// 认证路由
router.use('/auth', AuthRouter)

module.exports = router
