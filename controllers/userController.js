const db = require('../models')
const { commonSuccess, commonFailure, commonError } = require('../config/callback')

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const users = await db.User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    })
    res.json(
      commonSuccess('获取所有用户成功', {
        users: users.rows,
        total: users.count
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 获取用户详情
exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json(commonFailure('用户不存在'))
    }
    res.json(commonSuccess('获取用户成功', user))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json(commonFailure('用户不存在'))
    }
    await user.update(req.body)
    res.json(commonSuccess('更新用户成功', user))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json(commonFailure('用户不存在'))
    }
    await user.destroy()
    res.json(commonSuccess('删除用户成功'))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 修改密码
exports.updatePassword = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json(commonFailure('用户不存在'))
    }
    await user.update({ password: req.body.password })
    res.json(commonSuccess('修改密码成功'))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 停用用户
exports.disableUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json(commonFailure('用户不存在'))
    }
    await user.update({ status: 2 })
    res.json(commonSuccess('停用用户成功'))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}
