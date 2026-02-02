const db = require('../models')

// 获取余额
exports.getBalance = async (req, res) => {
  try {
    const balance = await db.Balance.findOne({
      where: { user_id: req.user.id }
    })

    if (!balance) {
      return res.status(404).json({ message: '余额记录未找到' })
    }

    res.json(balance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 充值 (增加余额)
exports.addBalance = async (req, res) => {
  const { amount } = req.body

  if (amount <= 0) {
    return res.status(400).json({ message: '充值金额必须大于 0' })
  }

  try {
    const t = await db.sequelize.transaction() // 使用事务保证一致性

    const balance = await db.Balance.findOne({
      where: { user_id: req.user.id },
      transaction: t
    })

    if (!balance) {
      await t.rollback()
      return res.status(404).json({ message: '余额记录未找到' })
    }

    balance.amount = parseFloat(balance.amount) + parseFloat(amount)
    await balance.save({ transaction: t })

    // 这里可以添加创建充值记录的逻辑

    await t.commit()
    res.json({ message: '充值成功', balance: balance.amount })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}

// 扣除余额 (例如支付)
exports.deductBalance = async (req, res) => {
  const { amount } = req.body

  try {
    const t = await db.sequelize.transaction()

    const balance = await db.Balance.findOne({
      where: { user_id: req.user.id },
      transaction: t
    })

    if (!balance) {
      await t.rollback()
      return res.status(404).json({ message: '余额记录未找到' })
    }

    if (balance.amount < amount) {
      await t.rollback()
      return res.status(400).json({ message: '余额不足' })
    }

    balance.amount = parseFloat(balance.amount) - parseFloat(amount)
    await balance.save({ transaction: t })

    await t.commit()
    res.json({ message: '扣款成功', balance: balance.amount })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('服务器错误')
  }
}
