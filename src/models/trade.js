/* jshint indent: 2 */

module.exports= function(sequelize, DataTypes) {
  return sequelize.define('trade', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ticker_symbol: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    trade_type: {
      type: DataTypes.ENUM("BUY","SELL"),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'trade',
    schema: 'public',
    timestamps: false
  });
};
