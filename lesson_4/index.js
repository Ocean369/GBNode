#!/usr/bin/env node

import fsp from 'fs/promises'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import path from 'path'
import colors from 'colors'
import inquirer from "inquirer";

const __dirname = process.cwd();

start();

function start() {
    inquirer
        .prompt({
            name: "answer",
            type: 'confirm', // input, number, confirm, list, rawlist, expand, checkbox, password
            message: `Хотите ли вы остаться в текущей диретории \n  ${__dirname}`,
        })
        .then(({ answer }) => {
            if (!answer) {
                const rl = createInterface({
                    input: process.stdin,
                    output: process.stdout
                })

                rl.question('Пожалуйста, введите директорию:', (inDir) => {
                    goToDir(inDir, rl);
                })

                rl.on('close', () => process.exit(0))
            } else {
                goToDir(__dirname);
            }

        })
}

function goToDir(__dirname, rlObj = null) {
    fsp
        .readdir(__dirname)
        .then((indir) => {
            const list = []
            for (const item of indir) {
                list.push(item)
            }
            return list
        })
        .then((choices) => {
            return inquirer
                .prompt({
                    name: "fileName",
                    type: 'list', // input, number, confirm, list, rawlist, expand, checkbox, password
                    message: "Выберите файл или директорию: ",
                    choices
                })
        })
        .then(async ({ fileName }) => {
            const fullPath = path.join(__dirname, fileName);
            const src = await fsp.stat(fullPath);
            if (src.isFile()) {
                findPattern(fullPath);
            }
            else {
                goToDir(fullPath);
            }
        })
        .catch((err) => {
            console.error(err);
            process.exit(0)
        })
}

function findPattern(path) {
    inquirer
        .prompt({
            name: "pattern",
            type: 'input', // input, number, confirm, list, rawlist, expand, checkbox, password
            message: "Введите строку для поиска: ",
        })
        .then(({ pattern }) => { searchLineByLine(path, pattern) })
        .catch((err) => {
            console.error(err);
            process.exit(0);
        })
}



function searchLineByLine(path, pattern) {
    try {
        const rlfind = createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity
        });
        let findArray = [];
        const re = new RegExp(pattern, 'ig');
        rlfind.on('line', (line) => {
            if (re.test(line)) findArray.push([...line.match(re)]);
            console.log(line.replace(re, colors.yellow(pattern)));
        });

        rlfind.on('close', () => {
            console.log(colors.green(`В файле найдено ${colors.yellow(findArray.length)} совпадений заданной строки "${colors.yellow(pattern)}"`))
            process.exit(0);
        })

    } catch (err) {
        console.error(err);
    }
}
