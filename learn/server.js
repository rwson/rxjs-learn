"use strict";

const fs = require("fs"),
    path = require("path"),
    Rx = require("rx");

require("rxjs-fs");

const files = ["./dist/file1.txt", "./dist/file2.txt", "./dist/file3.txt"];

const writeFile = Rx.Observable.fromNodeCallback(fs.writeFile);
const readFile = Rx.Observable.fromNodeCallback(fs.readFile);

const fileMap = {};

let currentFile;

Rx.Observable
    .for(files, (file, index) => (() => {
        console.log(file);
        console.log(index);
        currentFile = file;
        return readFile(file);
    })())
    .subscribe(
        (res) => {
            fileMap[currentFile] = res.toString();
        },
        (ex) => {
            // console.log(ex);
        },
        () => {
            // console.log(fileMap);
        }
    );


function randomString() {
    let strArr = [];
    for (let i = 0; i < 10; i++) {
        strArr.push(Math.random().toString(36).replace(/\W/, ""));
    }
    return strArr.join("-");
}
