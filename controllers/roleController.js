const db = require('../models')
const { commonSuccess, commonFailure, commonError } = require('../config/callback')

// 获取所有角色
exports.getAllRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const roles = await db.Role.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sort', 'ASC']]
    })

    res.json(
      commonSuccess('获取所有角色成功', {
        roles: roles.rows,
        total: roles.count
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 获取角色详情
exports.getRoleById = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id)
    if (!role) {
      return res.status(404).json(commonFailure('角色不存在'))
    }
    res.json(commonSuccess('获取角色成功', role))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 创建角色
exports.createRole = async (req, res) => {
  try {
    const role = await db.Role.create(req.body)
    res.json(commonSuccess('创建角色成功', role))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 更新角色
exports.updateRole = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id)
    if (!role) {
      return res.status(404).json(commonFailure('角色不存在'))
    }
    await role.update(req.body)
    res.json(commonSuccess('更新角色成功', role))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 删除角色
exports.deleteRole = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id)
    if (!role) {
      return res.status(404).json(commonFailure('角色不存在'))
    }
    await role.destroy()
    res.json(commonSuccess('删除角色成功'))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 角色状态切换
exports.toggleRoleStatus = async (req, res) => {
  try {
    const role = await db.Role.findByPk(req.params.id)
    if (!role) {
      return res.status(404).json(commonFailure('角色不存在'))
    }
    role.status = role.status === 1 ? 0 : 1
    await role.save()
    res.json(commonSuccess('角色状态切换成功', role))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}
