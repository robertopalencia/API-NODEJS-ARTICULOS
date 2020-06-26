'use strict'

//cargar modulos de node

var express = require('express');

var bodyParser = require('body-parser');
//ejecutar express
var app = express();
//cargar ficheros de ruta
var article_routes = require('./routes/article');
//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//añadir rutas
app.use('/api', article_routes);
//Ruta o metodo de prueba para el API REST

//exportar modulo
module.exports = app;

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
