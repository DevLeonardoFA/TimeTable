const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE_PATH = "./timetable.json";

// Carregar os horários do arquivo JSON
app.get("/classes", (req, res) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao ler o arquivo" });
        }
        res.json(JSON.parse(data));
    });
});

// Salvar os horários no arquivo JSON
app.post("/classes", (req, res) => {
    const classes = req.body;
    fs.writeFile(FILE_PATH, JSON.stringify(classes, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao salvar o arquivo" });
        }
        res.json({ message: "Horários salvos com sucesso!" });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
