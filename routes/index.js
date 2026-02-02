const express = require('express')
const router = express.Router()

// 鉴权路由
const authController = require('../controllers/authController')
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// 中间件：保护以下路由
const authMiddleware = require('../middleware/auth')

// 用户管理路由
const userController = require('../controllers/userController')
router.get('/users', authMiddleware, userController.getUsers)
router.get('/users/:id', authMiddleware, userController.getUser)
router.put('/users/:id', authMiddleware, userController.updateUser)
router.delete('/users/:id', authMiddleware, userController.deleteUser)

// 订单路由
const orderController = require('../controllers/orderController')
router.post('/orders', authMiddleware, orderController.createOrder)
router.get('/orders', authMiddleware, orderController.getOrders)
router.put('/orders/:id', authMiddleware, orderController.updateOrder)
router.delete('/orders/:id', authMiddleware, orderController.deleteOrder)

// 余额路由
const balanceController = require('../controllers/balanceController')
router.get('/balance', authMiddleware, balanceController.getBalance)
router.post('/balance/add', authMiddleware, balanceController.addBalance)
router.post('/balance/deduct', authMiddleware, balanceController.deductBalance)

module.exports = router
