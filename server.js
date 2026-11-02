// Carrega as variáveis de ambiente do arquivo .env em desenvolvimento
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
// O Render define a variável PORT automaticamente em produção
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Middleware para entender JSON no corpo da requisição
app.use(express.json());

// 1. Configura a conexão com o MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Conecta ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ', err.stack);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');

  // Cria a tabela 'alunos' caso ela não exista
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS alunos(
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
    )`;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar tabela: ', err.stack);
      return;
    }
    console.log('Tabela alunos pronta para uso!');
  });
});

app.get('/alunos', (req, res) => {
  connection.query('SELECT * FROM alunos', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});