//implement Stack
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop(element) {
        return this.items.pop(element);
    }
    size() {
        return this.items.length;
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    show() {
        return this.items;
    }
    print() {
        console.log(this.items);
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//build stack
let stack = new Stack();
let offsetValue = 20;
let pushAnime = false;
let popAnime = false;
let temp;
const move = {
    rateY: 0
}
update();

//main
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStackFormat();

    pushObj();

    popObj();

    drawStack();

    requestAnimationFrame(update);
}

function pushObj() {
    if (move.rateY > 420) {
        pushAnime = false;
        move.rateY = 0;
        pushGo.disabled = false;
        popGo.disabled = false;
        stack.push(temp);
    }
    if (pushAnime) {
        move.rateY += 4;
        //setting
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillStyle = 'red';

        //get size to change y
        let size = stack.size();

        //font offset
        offset(temp);

        //draw
        ctx.strokeRect(350, 0 + move.rateY - size * 50, 300, 50);
        ctx.fillText(`${temp}`, 500 + offsetValue, 35 - size * 50 + move.rateY);
    }
}

function popObj() {
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';

    if (popAnime && move.rateY < -50) {
        move.rateY = 0;

        popAnime = false;
        pushGo.disabled = false;
        popGo.disabled = false;
    }
    if (popAnime) {
        move.rateY -= 4;
        //font offset
        offset(temp);

        //draw
        ctx.strokeRect(350, 0 + move.rateY, 300, 50);
        ctx.fillText(`${temp}`, 500 + offsetValue, 35 + move.rateY);
    }
}

function offset(value) {
    let length = value.toString().length
    if (length > 3) {
        offsetValue = -30;
    }
    else if (length > 2) {
        offsetValue = -25;
    }
    else if (length > 1) {
        offsetValue = -18;
    }
    else {
        offsetValue = -10;
    }
}

function drawStackFormat() {
    //setting
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';

    //draw Stack
    ctx.beginPath();
    ctx.moveTo(350, 80);
    ctx.lineTo(350, 480);
    ctx.moveTo(350, 480);
    ctx.lineTo(650, 480);
    ctx.moveTo(650, 480);
    ctx.lineTo(650, 80);
    ctx.stroke();
}

function drawStack() {
    let arr = stack.show();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    for (let i = 0; i < arr.length; i++) {
        //font offset
        offset(arr[i]);
        //draw
        ctx.strokeRect(350, 430 - i * 50, 300, 50);
        ctx.fillText(`${arr[i]}`, 500 + offsetValue, 465 - i * 50);
    }
}


//event listen
const pushValue = document.querySelector('.pushValue');
const pushGo = document.querySelector('.pushGo');
const popGo = document.querySelector('.popGo');


pushGo.addEventListener('click', function () {
    pushGo.disabled = true;
    popGo.disabled = true;
    if (stack.size() === 8) {
        Swal.fire({
            icon: 'info',
            html: 'Sorry,為了視覺化的呈現我們設定Stack的長度為8,但在程式中只要記憶體空間足夠您就可以繼續push值進入'
        })
        pushGo.disabled = false;
        popGo.disabled = false;
        return;
    }
    if (pushValue.value == "") {
        pushGo.disabled = false;
        popGo.disabled = false;
        Swal.fire({
            title: 'Please fill the value'
        })

        return;
    }
    temp = pushValue.value;
    pushValue.value = "";
    pushAnime = true;
})

popGo.addEventListener('click', function () {
    pushGo.disabled = true;
    popGo.disabled = true;

    if (stack.size() === 0) {
        Swal.fire({
            title: 'Stack is empty'
        })
        pushGo.disabled = false;
        popGo.disabled = false;
        return
    }
    //top one
    temp = stack.peek();

    let size = stack.size();

    stack.pop();

    //peek position
    move.rateY = 420 - size * 50;
    popAnime = true;
})

//tips
const tip = document.querySelector('.tips');

tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "Stack是一個First in last out的結構,可以想像成蓋房子必須一層一層堆上去,拆掉的話必須從頂端一層一層拆掉<br><br>" +
            "push(value): 將value值推進Stack,來到Stack頂端<br>" +
            "pop(): 將Stack最頂端的值取出來"

    })
})