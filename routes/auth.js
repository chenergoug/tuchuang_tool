const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// 验证码
router.get('/captcha', authController.captcha)
// 注册
router.post('/register', authController.register)
// 微信注册
router.post('/wechat-register', authController.wechatRegister)
// 登录
router.post('/login', authController.login)
// 微信登录
router.post('/wechat-login', authController.wechatLogin)
// 退出登录
router.post('/logout', authController.logout)

module.exports = router
