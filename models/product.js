const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    tipo_produtos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendedorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
});

User.hasMany(Product, { foreignKey: 'vendedorId' });
Product.belongsTo(User, { foreignKey: 'vendedorId' });

module.exports = Product;
