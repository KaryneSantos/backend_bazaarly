const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { parse } = require('dotenv');

// Adicionar um produto ao carrinho
router.post('/add', authenticateToken, async(req, res) => {
    try {
        const {productId, quantity} = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const userId = req.userId; // ID do usuário autenticado
        const product = await Product.findByPk(productId);
        if(!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        const [cart, created] = await Cart.findOrCreate({
            where: {userId, productId},
            defaults: {quantity}
        });

        if(!created) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }

        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso.' });

    } catch (error) {
        console.error('Erro ao cadastrar produto no carrinho:', error);
        res.status(500).json({
            message: 'Erro ao cadastrar produto no carrinho.',
            error: error.message || error
        });

    }
});

// Listar itens do carrinho
router.get('/:userId', authenticateToken, async(req, res) => {
    try {
        const userId = req.params.userId; // ID do usuário autenticado

        if(parseInt(userId) !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado.' });
    }

    const cartItems = await Cart.findAll({
        where: {userId},
        include: {Product}
    });

    if(!cartItems.length) {
        return res.status(404).json({ message: 'Carrinho de compras vazio.' });
    }

    res.status(200).json(cartItems);
} catch (error) {
    console.error('Erro ao listar carrinho:', error);
        res.status(500).json({
            message: 'Erro ao listar carrinho.',
            error: error.message || error
        });
}});

// Atualizar item no carrinho

router.put('/update', authenticateToken, async(req, res) => {
    try {
        const {productId, quantity} = req.body;

        if(!productId || !quantity) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const userId = req.userId; // ID do usuário autenticado
        const cartItem = await Cart.findOne({
           where: {userId, productId} 
        });

        if(!cartItem) {
            return res.status(404).json({ message: 'Item do carrinho nao encontrado.' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: 'Item do carrinho atualizado com sucesso.' });

    } catch (error) {
        console.error('Erro ao atualizar item do carrinho:', error);
        res.status(500).json({
            message: 'Erro ao atualizar item do carrinho.',
            error: error.message || error
        });
    }
});

// Deletar item do carrinho

router.delete('/delete', authenticateToken, async(req, res) => {

    try {
        const {productId} = req.body;

        if(!productId) {
            return res.status(400).json({ error: 'Todos os campos Sao obrigatórios.' });
        }

        const userId = req.userId; // ID do usuário autenticado
        const cartItem = await Cart.findOne({
            where: {userId, productId}
        });

        if(!cartItem) {
            return res.status(404).json({ message: 'Item do carrinho nao encontrado.' });
        }

        await cartItem.destroy();

        res.status(200).json({ message: 'Item do carrinho excluido com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar item do carrinho:', error);
        res.status(500).json({
            message: 'Erro ao deletar item do carrinho.',
            error: error.message || error
        });
    }
});

module.exports = router;


















module.exports = router;