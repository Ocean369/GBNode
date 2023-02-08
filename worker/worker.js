import { workerData, parentPort } from 'worker_threads'
import { Transform } from 'stream';
import { createReadStream } from 'fs'

const { search,
    url } = workerData;
console.log(url.slice(url.lastIndexOf('.')));
const re = new RegExp(search, 'ig');
const rsFind = createReadStream(url, 'utf-8');
const tf = new Transform({
    transform(chunk, encoding, callback) {
        let transline = chunk.toString().replace(/</g, '&lt;');
        transline = transline.replace(/>/g, '&gt;')
        transline = transline.replace(re, `<span style='color: red;'>${search}</span>`);
        transline = transline.replace(/\n/g, '<br>');
        this.push(transline);
        callback();
    }
});
let data = '';
rsFind.pipe(tf).on('data', (chunk) => {
    data += chunk.toString('utf-8');
})

rsFind.on('close', () => {
    parentPort.postMessage(data);
})


