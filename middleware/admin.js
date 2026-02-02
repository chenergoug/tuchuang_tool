// middleware/admin.js
const User = require('../models').User

// 中间件：检查当前登录用户是否为管理员
module.exports = async (req, res, next) => {
  try {
    // 1. 从 req.user (由 auth.js 中间件设置) 获取用户 ID
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'role']
    })

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    // 2. 检查角色
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: '权限不足：需要管理员权限'
      })
    }

    // 3. 是管理员，放行
    next()
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}
