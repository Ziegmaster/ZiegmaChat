const express = require('express');

const server = new express();

server.use(express.static(`${__dirname}/widget`));

module.exports = server;