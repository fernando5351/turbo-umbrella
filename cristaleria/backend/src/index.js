const path = require('path');
const express = require('express');
const cors = require('cors');
const routesHandler = require('./routes/routes');
const { boomErrorHandler, logErrors, ormErrorHandler, errorHandler } = require('../middleware/errorHandler');
const app = express();
const server = require('http').Server(app);
const multer = require('multer');
const WebSocketServer = require('websocket').server;
const { storage } = require('../config/multer');
const port = process.env.PORT || 3000;
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUI = require('swagger-ui-express');

const wsServer= new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

app.set('port', port);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(multer({storage}).single('file'))
app.use(express.static(path.join(__dirname, "../public")));

function originIsAllowed(origin) {
    const whiteList = ['http://localhost:4200']
    if(whiteList.includes(origin)){
        return true;
    }
    return false;
}

wsServer.on("request", (request) =>{
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Conexión del origen ' + request.origin+ ' rechazada.');
        return;
    }
    const connection = request.accept(null,request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);
        connection.sendUTF("Recibido: " + message.utf8Data);
    });
    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconecto");
    });
});

const yamlFilePath = path.join(__dirname, '../doc/swagger.yaml');
let yamlObject;
try {
    const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
    yamlObject = yaml.load(yamlContent);
} catch (error) {
    console.error('Error al leer el archivo YAML:', error);
}
app.use('/doc/swagger', swaggerUI.serve, swaggerUI.setup(yamlObject));

routesHandler(app);
require('./auth');
app.use('/', async(req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        message: 'Hello World :)',
        data: 'Pets Works'
    });
})

app.use(logErrors);
app.use(boomErrorHandler);
app.use(ormErrorHandler);
app.use(errorHandler);

module.exports = {
    server,
    app
};
