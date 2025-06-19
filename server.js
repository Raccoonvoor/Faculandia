const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'HTML')));

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/faculandia', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Requerimento
const Requerimento = mongoose.model('Requerimento', new mongoose.Schema({
    id: Number,
    conteudo: String,
    aluno: String,
    matricula: String,
    data: Date,
    status: String,
    destino: String,
    historico: [{
        acao: String,
        parecer: String,
        descricao: String,
        data: Date,
        por: String,
        area: String,
        observacoes: String,
        para: String
    }]
}));

// Rotas
app.post('/requerimentos', async (req, res) => {
    try {
        const requerimento = new Requerimento({
            ...req.body,
            id: Date.now(),
            data: new Date()
        });
        await requerimento.save();
        res.status(201).send(requerimento);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/requerimentos/:matricula', async (req, res) => {
    try {
        const requerimentos = await Requerimento.find({ matricula: req.params.matricula });
        res.send(requerimentos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/requerimentos/:id', async (req, res) => {
    try {
        const requerimento = await Requerimento.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.send(requerimento);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});