const router = require('express').Router();
const httpProxy = require('http-proxy');
const querystring = require('querystring');

const logger = console.log;


// ref:https://arkgame.com/2022/02/21/post-305058://arkgame.com/2022/02/21/post-305058/ 
function remoteAddress(req) {
  if (req.headers['x-forwarded-for']) 
  {
    return req.headers['x-forwarded-for'];
  }
  else if (req.connection && req.connection.remoteAddress) 
  {
    return req.connection.remoteAddress;
  }
  else if (req.connection.socket && req.connection.socket.remoteAddress) 
  {
    return req.connection.socket.remoteAddress;
  }
  else if (req.socket && req.socket.remoteAddress) 
  {
    return req.socket.remoteAddress;
  }
  return '0.0.0.0';
};


const proxy = httpProxy.createServer({});
const proxy_nopath = httpProxy.createServer({'ignorePath': true});

// to proxy post,
// from https://github.com/http-party/node-http-proxy/issues/180#issuecomment-405946427 
proxy.on('proxyReq', (proxyReq, req) => {
  if (req.body) {
    var contentType = proxyReq.getHeader('Content-Type');
    var bodyData;

    if (contentType === 'application/json') {
        bodyData = JSON.stringify(req.body);
    }

    if (contentType === 'application/x-www-form-urlencoded') {
        bodyData = querystring.stringify(req.body);
    }

    if (bodyData) {
        logger("------", bodyData);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
  }
});


router.get("/gate", (req, res) => {  // an endpoint processed on node
  res.send("Hello");
});

router.all("/ipaddress", (req, res) => {  // reverse proxy to another server, ignore path
  proxy_nopath.web(req, res, { target: 'http://www.cman.jp/network/support/go_access.cgi' });
});

router.all("/[^\\.](*)?", (req, res) => {  // reverse proxy with path
  proxy.web(req, res, { target: 'http://wonderhorn.net/' });
});
router.all("/", (req, res) => {
  proxy.web(req, res, { target: 'http://wonderhorn.net/' });
});
A

module.exports = router;
