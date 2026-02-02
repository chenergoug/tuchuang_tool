// middleware/auth.js
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  // 1. 从请求头中获取 Token
  // 通常前端会在 Authorization 头中携带 Token，格式为 "Bearer your_token_here"
  const authHeader = req.header('Authorization') || req.header('x-auth-token')

  if (!authHeader) {
    return res.status(401).json({
      message: '没有提供 Token，授权被拒绝'
    })
  }

  // 2. 去掉 "Bearer " 前缀 (如果有)
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  // 3. 验证 Token
  try {
    // verify 方法会检查 Token 是否过期以及签名是否有效
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. 将解码后的用户信息挂载到 req 对象上，供后续的控制器使用
    req.user = decoded.user // 这里的 decoded.user 对应生成 Token 时的 payload

    // 5. 调用 next() 进入下一个中间件或路由处理函数
    next()
  } catch (err) {
    // 捕获错误：Token 无效、过期或被篡改
    console.error('Token 验证失败:', err.message)
    res.status(401).json({
      message: 'Token 无效或已过期'
    })
  }
}
