module.exports = (sequelize, DataTypes) => {
  const Dict = sequelize.define(
    'Dict',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        comment: '父级ID'
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '字典类型'
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '字典编码'
      },
      label: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '字典标签'
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '字典值'
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '状态'
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'dicts',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  return Dict
}
