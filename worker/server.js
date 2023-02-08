import http from 'http';
import path from 'path'
import fs from 'fs'
import fsp from 'fs/promises'
import { Transform } from 'stream';
import formidable from 'formidable';
import { createReadStream, createWriteStream, readFile } from 'fs'
import { Server } from 'socket.io';
import {
    Worker, isMainThread
} from 'worker_threads';
import { count } from 'console';


const host = 'localhost';
const port = 3000;

function start(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

function showWhatDir(dirname) {
    let list = '';
    return fsp
        .readdir(dirname)
        .then((indir) => {
            for (const item of indir) {
                list += `<li><a href='${path.join(dirname, item)}'>${item}</a></li>`
            }
            return `<ul>${list}</ul>`
        })
        .catch(console.log.bind(console));
}

function addDataFile(path, line_search, line_insert, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    const re = new RegExp(line_search, 'ig');
    const readStream = createReadStream(path, 'utf-8');
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {

            const transformedChunk = chunk.toString().replace(re, line_insert);
            this.push(transformedChunk);
            callback();
        }
    });
    readStream.pipe(transformStream).pipe(response);
}

const server = http.createServer(async (req, res) => {
    const curDir = process.cwd();
    const url = req.url.split('?')[0]
    const curUrl = url == '/' ? curDir : url;
    const indexFile = path.join(curDir, './index.html')

    switch (req.method) {
        case 'GET': {

            fs.stat(curUrl, (err, stats) => {
                if (err) {
                    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                    console.error(err);
                    res.end('Path not defined');
                    return;
                }
                if (stats.isFile(curUrl)) {
                    addDataFile(indexFile, '#filelinks#',
                        `<form  action='${curUrl}' method="POST" enctype="multipart/form-data">
                                <div> Введите строку для поиска:  <input type="text" name="search" /></div>
                                <input type="submit" value='Найти'>
                            </form>\n`,
                        res);
                } else {
                    showWhatDir(curUrl)
                        .then((data) => {
                            addDataFile(indexFile, '#filelinks#', data, res)
                        })
                        .catch(err => console.error(err))
                }
            })
            break;
        }
        case 'POST': {

            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                    res.end(String(err));
                    return;
                }

                start({
                    search: fields.search,
                    url: curUrl,
                })
                    .then(result => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        addDataFile(indexFile, '#filelinks#', `<div id='file'>${result}</div>`, res);
                    })
                    .catch(err => console.error(err));

            });
            break;
        }
        default: {
            res.statusCode = 405
            res.end('Method not allowed')
        }
    }
});

const io = new Server(server);
let counts = 0;

io.on('connection', (client) => {


    client.on('newUser', () => {
        ++counts;
        client.broadcast.emit('setCount', counts);
        client.emit('setCount', counts);

        client.on('disconnect', (reason) => {
            --counts;
            client.broadcast.emit('setCount', counts);
        });
    });
});
server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));