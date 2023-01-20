import { createReadStream, createWriteStream, WriteStream } from 'fs'
import { once } from 'events'
import { createInterface } from 'readline'

const IP = ['127.0.0.1'];
let ws = [];
let re = [];

class WS extends WriteStream {
    constructor(path, options) {
        super(path, options)
        this._start();
    }

    _start() {
        this.on('error', (err) => {
            console.log(err.message)
        })
    }
}

(async function processLineByLine() {
    try {
        const rl = createInterface({
            input: createReadStream('./access_tmp.log'),
            crlfDelay: Infinity
        });

        IP.forEach((val, i) => {
            ws[i] = new WS(`${val}_requests.log`, {
                flags: 'a',
                encoding: 'utf8'
            });
            re[i] = /^127\.0\.0\.1/g;
        })

        console.log(re)

        rl.on('line', (line) => {
            re.forEach((val, i) => {
                if (val.test(line)) {
                    ws[i].write(`${line}\n`)
                }
            })
        });

        rl.on('close', () => {
            ws.forEach((val, i) => {
                val.end(() => console.log(`File ${IP[i]}_requests.log writing finished`))
            })
            console.log('File processed.');
        })

    } catch (err) {
        console.error(err);
    }
})();
