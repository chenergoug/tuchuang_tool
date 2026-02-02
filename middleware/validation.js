// middleware/validation.js
// 简单的字段验证中间件
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const errors = []
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        errors.push(field)
      }
    })

    if (errors.length > 0) {
      return res.status(400).json({
        message: `缺少必填字段:  $ {errors.join(', ')}`
      })
    }
    next()
  }
}

module.exports = { validateFields }
