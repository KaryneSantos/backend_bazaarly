require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.secret;


// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const parts = token.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ error: 'Token malformado.' });
    }

    const actualToken = parts[1]; // só o token mesmo

    jwt.verify(actualToken, secret, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });

    req.userId = decoded.userId;
    next();
    });

};

module.exports = authenticateToken;