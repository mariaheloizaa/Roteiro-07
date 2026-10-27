const express = require("express");
const path = require("path");

const app = express();

// Permite receber JSON no corpo das requisições
app.use(express.json());

// Serve os arquivos estáticos da pasta public da API
app.use(express.static(path.join(__dirname, "public")));

// Importa as rotas de livros a partir da pasta externa /routes
const livrosRoutes = require("../routes/livros");

// Cria a rota base /livros
app.use("/livros", livrosRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});