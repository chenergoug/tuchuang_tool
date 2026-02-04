module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '排序'
      },
      label: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '角色标签'
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '角色值'
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '状态'
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '备注'
      }
    },
    {
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  return Role
}
