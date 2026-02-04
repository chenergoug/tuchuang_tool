const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const svgCaptcha = require('svg-captcha')
const redis = require('../utils/redis')
const { commonSuccess, commonFailure, commonError, authSuccess, authFailure } = require('../config/callback')

// 验证码
exports.captcha = (req, res) => {
  try {
    // 唯一标识
    const captchaId = uuidv4()
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
      background: '#f0f0f0'
    })
    // Redis存储：key设计包含业务类型，方便管理和过期
    const key = `captcha:${type}:${captchaId}`

    // 存储答案，5分钟过期
    redis.setex(key, 300, captcha.text.toLowerCase())

    // 记录日志（可选）
    console.log(`[Captcha] 生成: ${key} = ${captcha.text}`)
    console.log('验证码:', captcha.text.toLowerCase())
    req.session.captcha = captcha.text.toLowerCase()
    res.type('svg')
    res.status(200).send(
      commonSuccess('验证码生成成功', {
        captchaId,
        captcha: captcha.data
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError(`验证码生成失败: ${err.message}`))
  }
}

// 注册
exports.register = async (req, res) => {
  const { username = 'wechat', phone, password, openid, status = 1, role = 'user', captcha } = req.body

  try {
    console.log('注册请求:', captcha, '--->', req.session.captcha, captcha.toLowerCase() !== req.session.captcha)
    // 检查验证码
    if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json(commonFailure('无效的验证码'))
    }

    // 检查用户是否已存在
    let user = await db.User.findOne({ where: { openid } })
    if (user) {
      return res.status(400).json(commonFailure('微信openid已存在'))
    }

    user = await db.User.findOne({ where: { phone } })
    if (user) {
      return res.status(400).json(commonFailure('手机号已被注册'))
    }

    // 检查密码
    if (!password || password.length < 6) {
      return res.status(400).json(commonFailure('密码长度不能小于6位'))
    }

    // 创建新用户
    user = await db.User.create({
      username,
      phone,
      password,
      openid,
      status,
      role
    })

    res.status(201).json(commonSuccess('注册成功', { username, phone }))
  } catch (err) {
    console.error(err.message)
    res.status(500).json(commonError('注册失败'))
  }
}

// 微信注册
exports.wechatRegister = async (req, res) => {
  const { username = 'wechat', phone, openid, status = 1, role = 'user' } = req.body
  try {
    // 检查用户是否已存在
    let user = await db.User.findOne({ where: { openid } })
    if (user) {
      return res.status(400).json(commonFailure('微信openid已存在'))
    }

    user = await db.User.findOne({ where: { phone } })
    if (user) {
      return res.status(400).json(commonFailure('手机号已被注册'))
    }

    // 创建新用户
    user = await db.User.create({
      username,
      phone,
      openid,
      status,
      role
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

// 微信登录
exports.wechatLogin = async (req, res) => {
  const { openid } = req.body
  try {
    // 检查用户是否已存在
    let user = await db.User.findOne({ where: { openid } })
    if (!user) {
      return res.status(400).json(authFailure('微信openid不存在'))
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
  res.json(commonSuccess('退出成功'))
}
