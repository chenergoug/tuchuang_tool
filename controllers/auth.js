const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // 从 header 中获取 token
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({ message: '没有 token，授权被拒绝' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token 无效' })
  }
}
