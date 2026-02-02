const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 注册
exports.register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // 检查用户是否已存在
    let user = await db.User.findOne({ where: { username } })
    if (user) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    user = await db.User.findOne({ where: { email } })
    if (user) {
      return res.status(400).json({ message: '邮箱已被注册' })
    }

    // 创建新用户
    user = await db.User.create({
      username,
      email,
      password
    })

    // 初始化余额
    await db.Balance.create({
      user_id: user.id,
      amount: 0.0
    })

    res.status(201).json({ message: '注册成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 登录
exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await db.User.findOne({ where: { username } })
    if (!user) {
      return res.status(400).json({ message: '无效的凭据' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: '无效的凭据' })
    }

    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 退出登录 (前端通常只需删除本地 Token)
exports.logout = (req, res) => {
  // 如果使用黑名单 JWT，这里可以添加逻辑
  res.json({ message: '退出成功' })
}
