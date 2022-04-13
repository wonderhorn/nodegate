const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//https
const fs = require('fs');
const http = require('http');
const https = require('https');
const options = {  // your key location, enxample is in lets encrypt
  key: fs.readFileSync('/etc/letsencrypt/live/wonderhorn.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/wonderhorn.net/cert.pem')
};

//logger
const morgan = require('morgan');
app.use(morgan({ format: 'combined', immediate: true }));

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', require("./gate.js"))

//static files
app.use(express.static('static'));

// redirect http to https
http.createServer((express()).all("*", function (req, res) {
      res.redirect(`https://${req.hostname}${req.url}`);
})).listen(80);

const server = https.createServer(options, app);
server.listen(443);
