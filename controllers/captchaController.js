const { v4: uuidv4 } = require('uuid')
const svgCaptcha = require('svg-captcha')
const redis = require('../utils/redis')

const { commonSuccess, commonError } = require('../config/callback')

// 获取验证码
exports.captcha = (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
      background: '#f0f0f0'
    })

    const { text, data } = captcha
    // 唯一标识
    const captchaId = uuidv4()
    // Redis存储：key设计包含业务类型，方便管理和过期
    const key = `captcha:common:${captchaId}`
    // 存储答案，5分钟过期
    redis.setex(key, 300, text.toLowerCase())

    // 记录日志（可选）
    console.log(`[Captcha] 生成: ${key} = ${text}`)
    console.log('验证码:', text.toLowerCase())
    req.session.captcha = text.toLowerCase()
    res.type('svg')
    res.status(200).send(
      commonSuccess('验证码生成成功', {
        captchaId,
        captcha: data
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError(`验证码生成失败: ${err.message}`))
  }
}

// 验证验证码
exports.verify = async (req, res) => {
  const { captchaId, captcha } = req.body
  try {
    // 检查验证码是否存在
    const key = `captcha:common:${captchaId}`
    const storedCaptcha = await redis.get(key)
    if (!storedCaptcha) {
      return res.status(400).json(commonFailure('验证码已过期或不存在'))
    }
    // 检查验证码是否匹配
    if (storedCaptcha !== captcha.toLowerCase()) {
      return res.status(400).json(commonFailure('验证码错误'))
    }
    // 验证成功后，删除验证码
    await redis.del(key)
    res.json(commonSuccess('验证码验证成功'))
    res.status(200).json(commonSuccess('验证码验证成功'))
  } catch (error) {
    console.error(error.message)
    res.status(500).send(commonError(`验证码验证失败: ${error.message}`))
  }
}
