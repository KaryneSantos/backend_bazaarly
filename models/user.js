const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo_usuario: {
        type: DataTypes.ENUM('vendedor', 'comprador'),
        allowNull: false,
        defaultValue: 'comprador',
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: true
      },
      logradouro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bairro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      localidade: {
        type: DataTypes.STRING,
        allowNull: true
      },
      uf: {
        type: DataTypes.STRING,
        allowNull: true
      },
      complemento: {
        type: DataTypes.STRING,
        allowNull: true
      }
}, {
    timestamps: true,
});

module.exports = User;