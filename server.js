const http = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const fs = require('fs');
const hbs = require('hbs'); // Importa express-handlebars aquí

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configura Handlebars como motor de plantillas
app.set('view engine', 'hbs'); // Usa directamente hbs

// Indica la ubicación de las vistas
app.set('views', path.join(__dirname, 'views'));

// Ruta para mostrar el JSON en Handlebars
app.get("/home", (req, res) => {
    const jsonData = fs.readFileSync('products.json', 'utf8');
    const textStorage = JSON.parse(jsonData);

    // Renderiza la plantilla home.hbs con los datos del JSON
    res.render("home", { texts: textStorage });
});

app.get("/", (req, res) => {
    const jsonData = fs.readFileSync('products.json', 'utf8');
    const textStorage = JSON.parse(jsonData);
    res.render("index.hbs", { texts: textStorage.texts });
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('addText', (text, descripcion) => {
        const jsonData = fs.readFileSync('products.json', 'utf8');
        const textStorage = JSON.parse(jsonData);

        textStorage.push(text, descripcion);

        fs.writeFile('products.json', JSON.stringify(textStorage), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
            } else {
                console.log('JSON almacenado en el archivo products.json');
            }
        });

        io.emit('addText', textStorage);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
