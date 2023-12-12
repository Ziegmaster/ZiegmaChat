const express = require('express');

const httpServer = new express();

module.exports = { 
    httpServer,
    setPublic: (path) => {
        httpServer.use(express.static(path));
    }
};