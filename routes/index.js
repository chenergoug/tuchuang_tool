const express = require('express')
const router = express.Router()

// 鉴权路由
const authController = require('../controllers/authController')
const UserRouter = require('./user')

router.get('/captcha', authController.captcha)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.use('/users', UserRouter)

module.exports = router
