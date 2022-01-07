class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        return this.items.shift();
    }
    front() {
        return this.items[0];
    }
    size() {
        return this.items.length;
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

//build queue
let queue = new Queue();

let offsetValue = 20;
let enqueueAnime = false;
let dequeueAnime = false;
let temp;

const move = {
    X: 1000,
    alpha: 0
}

update();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawQueueFormat();

    enqueueObj();

    dequeueObj();

    drawQueue();

    //give rear and front
    mark();

    requestAnimationFrame(update);
}

function drawQueueFormat() {
    //setting
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';

    //draw Stack
    ctx.beginPath();
    ctx.moveTo(100, 140);
    ctx.lineTo(900, 140);
    ctx.moveTo(100, 260);
    ctx.lineTo(900, 260);
    ctx.stroke();

    //draw font
    // ctx.fillText('Front', 100, 145)
    // ctx.fillText('Rear', 840, 145)
}

function enqueueObj() {
    let size = queue.size();
    if (move.X < 150 + size * 100 && enqueueAnime) {
        enqueueAnime = false
        queue.enqueue(temp);
        move.X = 1000

        enqueueGo.disabled = false;
        dequeueGo.disabled = false;
    }
    if (enqueueAnime) {
        move.X -= 5;
        ctx.beginPath();
        offset(temp)
        ctx.strokeStyle = `red`;
        ctx.fillStyle = `red`;
        ctx.arc(move.X, 200, 45, 0, Math.PI * 2);
        ctx.fillText(`${temp}`, move.X + offsetValue, 210);
        ctx.stroke();
    }
}

function offset(value) {
    let length = value.toString().length
    if (length > 3) {
        offsetValue = -32;
    }
    else if (length > 2) {
        offsetValue = -25;
    }
    else if (length > 1) {
        offsetValue = -17;
    }
    else {
        offsetValue = -7;
    }
}

function dequeueObj() {
    if (move.X === -100 && dequeueAnime) {
        dequeueAnime = false
        move.X = 1000

        queue.dequeue()
        enqueueGo.disabled = false;
        dequeueGo.disabled = false;
    }
    if (dequeueAnime) {
        move.X -= 5
        offset(temp);
        ctx.strokeStyle = `red`;
        ctx.fillStyle = `red`;
        ctx.beginPath();
        ctx.arc(move.X, 200, 45, 0, Math.PI * 2);
        ctx.fillText(`${temp}`, move.X + offsetValue, 210);
        ctx.stroke();
    }
}

function drawQueue() {
    ctx.strokeStyle = `white`;
    ctx.fillStyle = `white`;
    let size = queue.size();
    let queueValue = queue.show();
    let i;
    (dequeueAnime) ? i = 1 : i = 0
    for (i; i < size; i++) {
        //font offset
        offset(queueValue[i]);
        //draw
        ctx.beginPath();
        ctx.arc(150 + i * 100, 200, 45, 0, Math.PI * 2);
        ctx.fillText(`${queueValue[i]}`, 150 + i * 100 + offsetValue, 210);
        ctx.stroke();
    }
}

function mark() {
    let size = queue.size();
    ctx.font = '25px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${move.alpha})`;
    if (!enqueueAnime && !dequeueAnime) {
        if (size === 1) {
            if (move.alpha < 1) {
                move.alpha += 0.02;
            }
            ctx.fillText(`Front/Rear`, 93, 130);
        }
        else if (size > 1) {
            if (move.alpha < 1) {
                move.alpha += 0.02;
            }
            ctx.fillText(`Front`, 120, 130);
            ctx.fillText(`Rear`, 20 + size * 100, 130);
        }
    }
}

//event listen 
const enqueueValue = document.querySelector('.enqueueValue');

const enqueueGo = document.querySelector('.enqueueGo');
const dequeueGo = document.querySelector('.dequeueGo');

enqueueGo.addEventListener('click', () => {
    if (enqueueValue.value === "") {
        Swal.fire({
            title: 'Please,fill the value',
        })
        return
    }
    if (queue.size() == 8) {
        Swal.fire({
            icon: 'info',
            html: 'Sorry,為了視覺化的呈現我們設定Queue的長度為8,但在程式中只要記憶體空間足夠您就可以繼續Enqueue值進入'
        })
        return;
    }

    move.alpha = 0;
    enqueueGo.disabled = true;
    dequeueGo.disabled = true;
    enqueueAnime = true
    temp = enqueueValue.value
    enqueueValue.value = ""
})

dequeueGo.addEventListener('click', () => {
    dequeueAnime = true
    temp = queue.front();
    move.X = 150
    enqueueGo.disabled = true;
    dequeueGo.disabled = true;
})


//tips
const tip = document.querySelector('.tips');

tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "Queue是一個First in first out的結構,可以想像成是排隊的行為<br><br>" +
            "Enqueue(value): 將數值從queue的尾端加入,並將該節點設成Rear(尾端)<br>" +
            "Dequeue(): 輸出Queue中Front(前端)的值,並將Front移出Queue"

    })
})