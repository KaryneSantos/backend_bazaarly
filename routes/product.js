const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Product = require('../models/product');
const authenticateToken = require('../middleware/auth');

// Criar um novo produto

router.post('/', authenticateToken, async(req, res) => {
    try {
        const {nome, descricao, preco, estoque, tipo_produtos} = req.body;

        if (!nome || !descricao || !preco || !estoque || !tipo_produtos) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const userId = req.userId; // ID do usuário autenticado
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.tipo_usuario !== 'vendedor') {
            user.tipo_usuario = 'vendedor';
            await user.save();
        }

        const [produto, created] = await Product.findOrCreate({
            where: { nome: nome, vendedorId: userId },
            defaults: {
                nome: nome,
                descricao: descricao || '',
                preco: preco,
                estoque: estoque || 0,
                tipo_produtos: tipo_produtos,
                vendedorId: userId // ID do usuário autenticado
            }
        });

        if (!created) {
            res.status(201).json({ error: 'Produto já existe.' }); 
    }
    return res.status(201).json({ message: 'Produto criado com sucesso!', produto });
} catch(error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
        message: 'Erro ao criar produto.',
        error: error.message || error
    });}

});

// Filtrar produtos  

router.get('/filter', async (req, res) => {
    try {
        const { nome, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (nome) {
            where.nome = {
                [Op.iLike]: `%${nome}%`,
            };
        }
        const products = await Product.findAll({
            where,
            limit: +limit,
            offset: +offset,
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
            message: 'Erro ao buscar produtos.',
            error: error.message || error,
        });
    }
});

// Listar produtos

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAll({ limit: +limit, offset: +offset });
    res.status(200).json(products);
});

// Atualizar produto

router.put('/update', authenticateToken, async (req, res) => {
    try {
        const { id, nome, descricao, preco, estoque, tipo_produtos } = req.body;

        if (!id || (!nome && !descricao && !preco && !estoque && !tipo_produtos)) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Verificar se o produto pertence ao usuário autenticado
        if (product.vendedorId !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        await product.update({
            nome: nome || product.nome,
            descricao: descricao || product.descricao,
            preco: preco || product.preco,
            estoque: estoque || product.estoque,
            tipo_produtos: tipo_produtos || product.tipo_produtos
        });

        res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({
            message: 'Erro ao atualizar o produto.',
            error: error.message || error
        });
    }
});

// Deletar produto

router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID do produto é obrigatório.' });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Verificar se o produto pertence ao usuário autenticado
        if (product.vendedorId !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        await product.destroy();

        res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar o produto:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar o produto.',
            error: error.message || error
        });
    }
});

module.exports = router;