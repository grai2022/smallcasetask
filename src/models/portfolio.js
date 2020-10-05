/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('portfolio', {
    port_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    ticker_symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    average_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'portfolio',
    schema: 'public',
    timestamps: false
  });
};
