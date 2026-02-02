const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const svgCaptcha = require('svg-captcha')
const callbackMsg = require('../config/callback')
const { commonSuccess, commonFailure, commonError, authSuccess, authFailure } = callbackMsg

// 验证码
exports.captcha = (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
      background: '#f0f0f0'
    })
    req.session.captcha = captcha.text
    res.type('svg')
    res.status(200).send(commonSuccess('验证码生成成功', captcha.data))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError(`验证码生成失败: ${err.message}`))
  }
}

// 注册
exports.register = async (req, res) => {
  const { username, phone, password, captcha } = req.body

  try {
    // 检查验证码
    if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json(commonFailure('无效的验证码'))
    }

    // 检查用户是否已存在
    let user = await db.User.findOne({ where: { username } })
    if (user) {
      return res.status(400).json(commonFailure('用户名已存在'))
    }

    user = await db.User.findOne({ where: { phone } })
    if (user) {
      return res.status(400).json(commonFailure('手机号已被注册'))
    }

    // 创建新用户
    user = await db.User.create({
      username,
      phone,
      password
    })

    // 初始化余额
    await db.Balance.create({
      user_id: user.id
    })

    res.status(201).json(commonSuccess('注册成功', { username, phone }))
  } catch (err) {
    console.error(err.message)
    res.status(500).json(commonError('注册失败'))
  }
}

// 登录
exports.login = async (req, res) => {
  const { username, password, captcha } = req.body

  try {
    const user = await db.User.findOne({ where: { username } })
    if (!user) {
      return res.status(400).json(authFailure('用户名不存在'))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json(authFailure('密码错误'))
    }

    if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json(authFailure('无效的验证码'))
    }

    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json(authSuccess(token))
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 退出登录 (前端通常只需删除本地 Token)
exports.logout = (req, res) => {
  // 如果使用黑名单 JWT，这里可以添加逻辑
  res.json(commonSuccess('退出成功'))
}
