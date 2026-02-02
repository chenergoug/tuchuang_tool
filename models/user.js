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
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(100),
        // unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
      }
    },
    {
      tableName: 'users',
      hooks: {
        // 在保存前自动加密密码
        beforeSave: async (user) => {
          if (user.changed('password')) {
            const bcrypt = require('bcryptjs')
            user.password = await bcrypt.hash(user.password, 10)
          }
        }
      }
    }
  )

  // 关联关系将在最后同步
  User.associate = function (models) {
    User.hasMany(models.Order, { foreignKey: 'user_id' })
    User.hasOne(models.Balance, { foreignKey: 'user_id' })
  }

  return User
}
