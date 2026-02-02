// routes/user.js - 用户相关路由
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth')

// 所有用户路由都使用 authMiddleware 进行鉴权
router.get('/', authMiddleware, userController.getUsers) // GET /api/users
router.get('/:id', authMiddleware, userController.getUser) // GET /api/users/:id
router.put('/:id', authMiddleware, userController.updateUser) // PUT /api/users/:id
router.delete('/:id', authMiddleware, userController.deleteUser) // DELETE /api/users/:id

module.exports = router
