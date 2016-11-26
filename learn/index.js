"use strict";

let time = new Date();

//	control output string
function main() {
    return Rx.Observable.timer(0, 1000)
        .map(i => {
            time = new Date();
            return getTimeStr(time);
        });
}

//	conyrol DOM display
function display($text) {
    $text.subscribe((text) => {
        const container = document.querySelector("#timer");
        container.textContent = text;
    });
}

display(main());

Rx.Observable.timer(0, 1000)
    .map(i => `current count is ${i}`)
    .subscribe(text => {
        document.querySelector("#app").textContent = text;
    }, ex => {
        console.log(ex);
    }, () => {
        console.log("done");
    });

function getTimeStr(date) {
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    return `${year}-${toDouble(month)}-${toDouble(day)} ${toDouble(hour)}:${toDouble(minute)}:${toDouble(second)}`;
}

function toDouble(num) {
    return num < 10 ? ("0" + num) : num;
}

let source = [0, 1, 2, 3, 4, 5, 6, 7];
source = Rx.Observable.fromArray(source);
source.filter(x => (x % 2 === 1))
    .map(x => `${x}!`)
    .forEach((x) => {
        console.log(x);
    });

console.log("========================");

//	每隔0.5s生成一个数字元素,直到数组长度达到10个
let source2 = Rx.Observable.interval(500).take(10);
source2.filter(x => x % 2 === 1)
    .map(x => `${x}!`)
    .forEach((x) => {
        console.log(x);
    });

let source3 = Rx.Observable.return(42);
let observer = Rx.Observer.create(
    x => console.log(x),
    ex => console.log(ex),
    () => console.log("all done"));
const subscrition = source3.subscribe(observer);
