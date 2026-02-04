// utils/redis.js
const Redis = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  db: 0,
  retryDelayOnFailover: 100
})

// 封装常用方法
module.exports = {
  async setex(key, seconds, value) {
    return redis.setex(key, seconds, value)
  },

  async get(key) {
    return redis.get(key)
  },

  async del(key) {
    return redis.del(key)
  },

  // 获取并删除（原子操作，需要Lua脚本）
  async getAndDel(key) {
    const lua = `
      local val = redis.call('get', KEYS[1])
      if val then
        redis.call('del', KEYS[1])
      end
      return val
    `
    return redis.eval(lua, 1, key)
  }
}
