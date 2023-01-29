import http from 'http';
import path from 'path'
import fsp from 'fs/promises'
import { htmlDoc } from './html.js'
import formidable from 'formidable';
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const host = 'localhost'
const port = 3000

function showWhatDir(__dirname) {
    let list = '';
    return fsp
        .readdir(__dirname)
        .then((indir) => {
            for (const item of indir) {
                list += `<li><a href='${path.join(__dirname, item)}'>${item}</a></li>`
            }
            return `<ul>${list}</ul>`
        })
        .catch(console.log.bind(console));
}

const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url !== '/favicon.ico') {
        let __dirname = "";
        if (req.url === '/') {
            __dirname = process.cwd();
        } else {
            __dirname = req.url
        }

        const src = await fsp.stat(__dirname);

        if (src.isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlDoc(`  <form  action='${__dirname}' method="POST" enctype="multipart/form-data">
                                    <div> Введите строку для поиска:  <input type="text" name="search" /></div>
                                    <input type="submit" value='Найти'>
                                </form>`))
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            showWhatDir(__dirname)
                .then((list) => {
                    res.end(htmlDoc(list))
                })
                .catch(err => console.error(err))
        }

    } else if (req.method === 'POST') {
        const form = formidable({ multiples: true });
        const __dirname = req.url;

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }
            // res.writeHead(200, { 'Content-Type': 'application/json' });
            // fsp.readFile(__dirname, 'utf-8')
            //     .then(data => {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' });
            // console.log('function => ', searchLineByLine(__dirname, fields.search));
            // console.log('field', fields.search);

            const rlfind = createInterface({
                input: createReadStream(__dirname),
                crlfDelay: Infinity
            });

            let data = '';

            const re = new RegExp(fields.search, 'ig');

            rlfind.on('line', (line) => {
                if (re.test(line)) {
                    data += `${line.replace(re, `<span >${fields.search}</span>`)}\n`;
                } else { data += `${line}\n` }
            });

            rlfind.on('close', () => {
                res.end(htmlDoc(`<pre class='file'>${data}</pre>`));
            })

        });
    }
    else {
        res.statusCode = 405
        res.end('Method not allowed')
    }
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));