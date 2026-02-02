const db = require('../models')
const { v4: uuidv4 } = require('uuid')

// 创建订单
exports.createOrder = async (req, res) => {
  const { amount, status = 'pending' } = req.body

  try {
    const order = await db.Order.create({
      user_id: req.user.id,
      order_number: `ORD- $ {uuidv4()}`, // 生成唯一订单号
      amount,
      status
    })

    res.status(201).json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 获取用户订单列表
exports.getOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    res.json(orders)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 更新订单 (仅限管理员或特定状态)
exports.updateOrder = async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id)
    if (!order) {
      return res.status(404).json({ message: '订单不存在' })
    }

    // 检查权限：只能修改自己的订单，或者管理员
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' })
    }

    await order.update(req.body)
    res.json({ message: '订单更新成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 删除订单
exports.deleteOrder = async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id)
    if (!order) {
      return res.status(404).json({ message: '订单不存在' })
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' })
    }

    await order.destroy()
    res.json({ message: '订单删除成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}
