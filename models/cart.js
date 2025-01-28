const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Product = require('./product');

const Cart = sequelize.define('Cart', { 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

Cart.sync({ alter: true })
  .then(() => {
      console.log("Tabela do carrinho sincronizada com sucesso!");
  })
  .catch((error) => {
      console.error("Erro ao sincronizar a tabela do carrinho:", error);
  });


module.exports = Cart;