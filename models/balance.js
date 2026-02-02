module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define(
    'Balance',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0
      }
    },
    {
      tableName: 'balances'
    }
  )

  Balance.associate = function (models) {
    Balance.belongsTo(models.User, { foreignKey: 'user_id' })
  }

  return Balance
}
