const express = require("express");
const cors = require("cors");
const db = require("./models");
db.sequelize.sync();
const app = express();
var path = require('path');
const fileUpload = require('express-fileupload');

require('dotenv').config()
const whitelist = ['http://localhost:4200', 'https://admin.kenanganmanis.com', 'api.kenanganmanis.com', 'http://api.kenanganmanis.com', '20.55.11.50', 'http://127.0.0.1:4343'];

app.use(function (req, res, next) {
    // console.log(JSON.stringify(req.headers));
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false, } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
// parse requests of content-type - application/json

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var fs = require('fs');
var dir = path.join(__dirname, 'public');
app.use(fileUpload());
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get("/uploads/*", (req, res) => {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    // console.log(mime['jpeg']);
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});


const route = require('./routes/index')(app);
app.use(express.static('public'));
app.get("/*", (req, res) => {
    // console.log(JSON.stringify(req.headers));
    res.render('404.html');
    // respond with json
    if (req.accepts('json')) {
    }
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to welcome api kenagan manis laundry." });
});

db.sequelize.sync({ alter: true, force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
