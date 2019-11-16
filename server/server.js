require('./config/config');
const express = require('express');
const colors = require('colors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Rutas
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
    console.log(colors.blue(`Servidor API corriendo en el puerto ${process.env.PORT}`));
});