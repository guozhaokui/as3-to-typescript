/*jshint node:true*/
/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/readline-sync.d.ts" />
"use strict";
const index_1 = require("./parse/index");
const emitter_1 = require("./emit/emitter");
const fs = require("fs-extra");
const path = require("path");
const parseArgs = require("minimist");
const readlineSync = require("readline-sync");
const lock_1 = require("./tool/lock");
function readdir(dir, prefix = '', result = []) {
    fs.readdirSync(dir).forEach(file => {
        let fileName = path.join(prefix, file);
        let filePath = path.join(dir, file);
        if (!fs.statSync(filePath).isDirectory()) {
            result.push(fileName);
        }
        else {
            readdir(filePath, fileName, result);
        }
    });
    return result;
}
function displayHelp() {
    console.log('usage: as3-to-typescript <sourceDir> <outputDir> [options]');
    console.log('');
    console.log('   Available options:');
    console.log('       --commonjs: ignore AS3 packages on TypeScript output.');
    console.log('       --bridge: use custom a output visitor. (--bridge createjs)');
    console.log('       --interactive: ask to write the output in case it was manually modified');
    console.log('       --overwrite: overwrite output files');
    console.log('');
}
function run() {
    let args = parseArgs(process.argv);
    if (args._.length === 2) {
        displayHelp();
        process.exit(0);
    }
    if (args._.length !== 4) {
        throw new Error('source dir and output dir are mandatory');
    }
    let sourceDir = path.resolve(process.cwd(), args._[2]);
    if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
        throw new Error('invalid source dir');
    }
    let outputDir = path.resolve(process.cwd(), args._[3]);
    if (fs.existsSync(outputDir)) {
        if (!fs.statSync(outputDir).isDirectory()) {
            throw new Error('invalid ouput dir');
        }
    }
    else {
        fs.mkdirSync(outputDir);
    }
    let bridge = (args['bridge'] && require("./bridge/" + args['bridge']).default) || null;
    let overwrite = !!args['overwrite'];
    let commonjs = args['commonjs'];
    let interactive = args['interactive'];
    if (overwrite && interactive) {
        console.error("You can't have '--overwrite' and '--interactive' at the same time.");
        process.exit();
    }
    // get last conversion timestamp
    let previousLockTimestamp = lock_1.getLockTimestamp(outputDir);
    let nextLockTimestamp = Math.floor((new Date()).getTime() / 1000);
    let files = readdir(sourceDir).filter(file => /.as$/.test(file));
    let number = 0;
    let length = files.length;
    // get class definitions by namespace
    let definitionsByNamespace = {};
    files.forEach(file => {
        let segments = file.match(/([a-zA-Z]+)/g);
        segments.pop();
        let identifier = segments.pop();
        let ns = segments.join(".");
        if (!definitionsByNamespace[ns]) {
            definitionsByNamespace[ns] = [];
        }
        definitionsByNamespace[ns].push(identifier);
    });
    let emitterOptions = {
        lineSeparator: '\n',
        useNamespaces: !commonjs,
        bridge: bridge,
        definitionsByNamespace: definitionsByNamespace
    };
    files.forEach(file => {
        console.log('(' + (number + 1) + '/' + length + ') \'' + file + '\'');
        let fileTs = file.replace(/.as$/, '.ts');
        let inputFile = path.resolve(sourceDir, file);
        let outputFile = path.resolve(outputDir, fileTs);
        if (!overwrite && fs.existsSync(outputFile)) {
            let stat = fs.statSync(outputFile);
            if (previousLockTimestamp.getTime() !== stat.mtime.getTime()) {
                if (interactive && !readlineSync.keyInYN(`"${fileTs}" has been modified. Overwrite it?`)) {
                    return;
                }
            }
        }
        let content = fs.readFileSync(inputFile, 'UTF-8');
        let ast = index_1.default(path.basename(file), content);
        let contents = emitter_1.emit(ast, content, emitterOptions);
        if (bridge && bridge.postProcessing) {
            contents = bridge.postProcessing(emitterOptions, contents);
        }
        fs.outputFileSync(outputFile, contents.replace(/\r\n/g, "\n"));
        fs.utimesSync(outputFile, nextLockTimestamp, nextLockTimestamp);
        number++;
    });
    lock_1.updateLockTimestamp(outputDir, nextLockTimestamp);
}
exports.run = run;
