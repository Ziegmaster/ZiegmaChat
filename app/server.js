const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {

    const extension = path.extname(req.url);

    let contentType;
    let filePath;

    if (req.url === '/favicon.ico') {
        contentType = 'image/x-icon';
        filePath = `${__dirname}/${req.url}`;
    }
    else {
        if (!extension) {
            contentType = 'text/html';
            filePath = `${__dirname}/../widget/index.html`;
        }
        else {
            switch (extension) {
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.jpg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.txt':
                    contentType = 'text/plain';
                    break;
                default:
                    contentType = 'text/html';
                    break;
            }
            filePath = `${__dirname}/../widget${req.url}`;
        }
    }

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        res.writeHead(404);
        res.end();
    }
});

module.exports = {
    startHttpServer: (port) => {
        //At least try to host it on specified port to avoid app crashes
        try {
            server.listen(port);
        }
        catch { }
    },
    stopHttpServer: () => server.close()
};