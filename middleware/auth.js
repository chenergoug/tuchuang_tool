// middleware/auth.js
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { authFailure, commonError } = require('../config/callback')

module.exports = {
  // 中间件：验证 JWT Token
  authVerifyToken: (req, res, next) => {
    const authHeader = req.header('Authorization') || req.header('x-auth-token')

    if (!authHeader) {
      return res.status(401).json(authFailure('没有提供 Token，授权被拒绝'))
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded.user
      next()
    } catch (err) {
      console.error('Token 验证失败:', err.message)
      res.status(401).json(authFailure('Token 无效或已过期'))
    }
  },

  // 判断是否是管理员
  authIsAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json(commonError('当前用户权限不足无法操作'))
    }
    next()
  }
}
