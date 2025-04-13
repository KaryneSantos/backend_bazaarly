require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const session = require("express-session");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();
const port = 3002;

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

sequelize.sync({ force: false}).then(() => {
    console.log('Banco de dados sincronizado.');
}).catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, 
    }
}));

// Configuração da documentação Swagger

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rota de usuário
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// Rota de login de usuário
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Rota de produtos
const productRouter = require('./routes/product');
app.use('/product', productRouter);



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
