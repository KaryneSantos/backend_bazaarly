const https = require('https');

function buscarCep(cep) {
    return new Promise((resolve, reject) => {
        https.get(`https://viacep.com.br/ws/${cep}/json/`, (response) => {
            let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const endereco = JSON.parse(data);
                resolve(endereco);
            } catch (error) {
                reject(error);
            }
        });
    }).on('error', (error) => {
        reject(error);
    });
    });
}

module.exports = buscarCep;