// 全局回调配置
module.exports = {
  // 鉴权成功
  authSuccess: (token) => {
    return {
      code: 200,
      data: { token },
      message: '鉴权成功'
    }
  },
  // 鉴权失败/登录失败
  authFailure: (message = '鉴权失败', data = null) => {
    return {
      code: 401,
      data,
      message
    }
  },
  // 通用回调-成功
  commonSuccess: (message, data = null) => {
    return {
      code: 200,
      data,
      message
    }
  },
  // 通用回调-失败
  commonFailure: (message, data = null) => {
    return {
      code: 400,
      data,
      message
    }
  },
  // 通用回调-错误
  commonError: (message, data = null) => {
    return {
      code: 500,
      data,
      message
    }
  },
  // 自定义回调
  customCallback: (code, message, data = null) => {
    return {
      code,
      data,
      message
    }
  }
}
