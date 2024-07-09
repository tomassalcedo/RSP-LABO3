const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let autos = [
    {
        id: 1,
        titulo: "Chevrolet Corsa",
        transaccion: "venta",
        descripcion: "modelo 2008, nunca taxi",
        precio: 20000,
        puertas: 4,
        kms: 800000,
        potencia: 132
    },
    {
        id: 2,
        titulo: "Volkswagen Bora",
        transaccion: "venta",
        descripcion: "Bora T roja solo para entendidos",
        precio: 999999,
        puertas: 4,
        kms: 30000,
        potencia: 158
    },
    {
        id: 3,
        titulo: "Ford Falcon",
        transaccion: "alquiler",
        descripcion: "Clásico para todo fierrero, excelente andar",
        precio: 150,
        puertas: 2,
        kms: 10000,
        potencia: 450
    },
    {
        id: 4,
        titulo: "Chevrolet Camaro",
        transaccion: "venta",
        descripcion: "Muscle car en venta, perfecto estado.",
        precio: 35000,
        puertas: 2,
        kms: 20000,
        potencia: 275
    },
    {
        id: 5,
        titulo: "Tesla Model 3",
        transaccion: "alquiler",
        descripcion: "Eléctrico, alto rendimiento y comodidad.",
        precio: 300,
        puertas: 4,
        kms: 15000,
        potencia: 283
    }
];

const simulateDelay = (req, res, next) => {
    setTimeout(next, 1000);
};

app.use(simulateDelay);

app.get('/autos', (req, res) => {
    res.json(autos);
});

app.post('/autos', (req, res) => {
    const auto = req.body;
    auto.id = Date.now();
    autos.push(auto);
    res.status(201).json(auto);
});

app.put('/autos/:id', (req, res) => {
    const { id } = req.params;
    const index = autos.findIndex(auto => auto.id === parseInt(id));
    if (index !== -1) {
        autos[index] = req.body;
        autos[index].id = parseInt(id);
        res.json(autos[index]);
    } else {
        res.status(404).send();
    }
});

app.delete('/autos/:id', (req, res) => {
    const { id } = req.params;
    autos = autos.filter(auto => auto.id !== parseInt(id));
    res.status(204).send();
});

app.delete('/autos', (req, res) => {
    autos = [];
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});