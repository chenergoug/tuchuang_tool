module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '用户名'
      },
      phone: {
        type: DataTypes.STRING(100),
        // unique: true,
        allowNull: false,
        comment: '手机号'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '密码'
      },
      wechat: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '微信号'
      },
      openid: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'openid'
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '状态 1:正常 2:停用'
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        comment: '角色'
      }
    },
    {
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            const bcrypt = require('bcryptjs')
            user.password = await bcrypt.hash(user.password, 10)
          }
        }
      }
    }
  )
  return User
}
