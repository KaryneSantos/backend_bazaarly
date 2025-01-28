const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Produto = sequelize.define('Produto', {
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
    modelName: 'Produto',
    timestamps: true,
});

User.hasMany(Produto, { foreignKey: 'vendedorId' }); // Associação de um para muitos
Produto.belongsTo(User, { foreignKey: 'vendedorId' }); // Associação de muitos para um

module.exports = Produto;