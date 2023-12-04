const express = require('express');

const server = new express();

server.use(express.static('widget'));

module.exports = server;