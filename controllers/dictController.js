const db = require('../models')
const { commonSuccess, commonFailure, commonError } = require('../config/callback')

// 获取所有字典项-字典分类列表
exports.getAllDicts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const dicts = await db.Dict.findAndCountAll({
      where: {
        parent_id: 0
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'ASC']]
    })
    res.json(
      commonSuccess('获取所有字典项成功', {
        dicts: dicts.rows,
        total: dicts.count
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 根据类型获取字典项
exports.getDictsByType = async (req, res) => {
  try {
    const { parent_id, type } = req.query
    if (!parent_id || !type) {
      return res.status(400).json(commonFailure('参数错误'))
    }
    const dicts = await db.Dict.findAndCountAll({
      where: {
        parent_id,
        type
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sort', 'ASC']]
    })
    res.json(
      commonSuccess('根据类型获取字典项成功', {
        dicts: dicts.rows,
        total: dicts.count
      })
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 获取字典项详情
exports.getDictById = async (req, res) => {
  try {
    const dict = await db.Dict.findByPk(req.params.id)
    if (!dict) {
      return res.status(404).json(commonFailure('字典项不存在'))
    }
    res.json(commonSuccess('获取字典项成功', dict))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 创建字典项
exports.createDict = async (req, res) => {
  try {
    const dict = await db.Dict.create(req.body)
    res.json(commonSuccess('创建字典项成功', dict))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 更新字典项
exports.updateDict = async (req, res) => {
  try {
    const dict = await db.Dict.findByPk(req.params.id)
    if (!dict) {
      return res.status(404).json(commonFailure('字典项不存在'))
    }
    await dict.update(req.body)
    res.json(commonSuccess('更新字典项成功', dict))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}

// 删除字典项
exports.deleteDict = async (req, res) => {
  try {
    const dict = await db.Dict.findByPk(req.params.id)
    if (!dict) {
      return res.status(404).json(commonFailure('字典项不存在'))
    }
    await dict.destroy()
    res.json(commonSuccess('删除字典项成功'))
  } catch (err) {
    console.error(err.message)
    res.status(500).send(commonError('服务器错误'))
  }
}
