const db = require('../models')

// 获取所有用户 (分页)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const users = await db.User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'username', 'email', 'role', 'createdAt']
    })

    res.json({
      total: users.count,
      data: users.rows
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 获取单个用户
exports.getUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt']
    })
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    // 防止修改管理员角色（可选逻辑）
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' })
    }

    await user.update(req.body)
    res.json({ message: '用户更新成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    // 级联删除：订单和余额也会被删除 (取决于外键设置)
    await user.destroy()
    res.json({ message: '用户删除成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}
