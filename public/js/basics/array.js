const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let arr = new Array(20).fill("");
let offsetValue = 0;
//for knowing insert or delete now
let flag = {
    state: false,
    goto: null
};

let effect = {
    alpha: 0
}

update();

//main
function update() {

    drawArray();

    if (flag.state) {
        drawCircle(flag.goto)
    } else {
        drawSlash(flag.goto)
    }

    requestAnimationFrame(update)
}

function offset(value) {
    let length = value.toString().length
    if (length > 3) {
        offsetValue = 25;
    }
    else if (length > 2) {
        offsetValue = 30;
    }
    else if (length > 1) {
        offsetValue = 35;
    }
    else {
        offsetValue = 45;
    }
}

//draw array
function drawArray() {
    //array setting
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';

    for (let i = 0; i < 20; i++) {
        //adjust font offset
        offset(arr[i]);


        //draw array
        if (i < 10) {
            //first line
            ctx.strokeRect(0 + i * 100, 50, 100, 100)
            ctx.fillText(`${i}`, 45 + i * 100, 45)
            ctx.fillText(`${arr[i]}`, offsetValue + i * 100, 110)
        }
        else {
            //second line
            ctx.strokeRect(0 + (i - 10) * 100, 250, 100, 100)
            ctx.fillText(`${i}`, 35 + (i - 10) * 100, 245)
            ctx.fillText(`${arr[i]}`, offsetValue + (i - 10) * 100, 310)
        }
    }
}


//draw circle
function drawCircle(index) {
    let circle_x = 50;
    let circle_y = 100;

    //effect
    if (effect.alpha < 1) {
        effect.alpha += 0.05;
    }

    //change row
    if (index > 9) {
        circle_y = 300;
    }
    circle_x += (index % 10) * 100;

    ctx.beginPath();
    ctx.arc(circle_x, circle_y, 50, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 0, 0, ${effect.alpha})`;
    ctx.stroke();
}

function drawSlash(index) {
    //effect
    if (effect.alpha < 1) {
        effect.alpha += 0.05;
    }


    if (flag.goto != null) {
        let line_x = 0;
        let line_y = 50;
        if (index > 9) {
            line_y = 250;
        }
        ctx.beginPath();
        ctx.moveTo(line_x + (index % 10) * 100, line_y);
        ctx.lineTo(line_x + (index % 10) * 100 + 100, line_y + 100);
        ctx.strokeStyle = `rgba(255, 0, 0, ${effect.alpha})`;
        ctx.stroke();
    }
}

//event listen
const insertIndex = document.querySelector('.insertIndex');
const insertValue = document.querySelector('.insertValue');
const deleteIndex = document.querySelector('.deleteIndex');

const insertGo = document.querySelector('.insertGo');
const deleteGo = document.querySelector('.deleteGo');

insertGo.addEventListener('click', () => {
    effect.alpha = 0;

    //both need to have value
    if (insertIndex.value == "" || insertValue.value == "") {
        return;
    }

    //out of range
    if (insertIndex.value > 19) {
        insertIndex.value = ""
        Swal.fire({
            icon: 'info',
            title: 'Out of range',
            html: 'Sorry,為了視覺化的呈現我們設定Array的長度為20,但在程式中只要記憶體空間足夠您就可以設定你想要的Array大小'
        })
        return;
    }

    //insert to array
    arr[insertIndex.value] = insertValue.value;

    //effect variable
    flag.state = true
    flag.goto = insertIndex.value

    //init
    insertIndex.value = ""
    insertValue.value = ""
});

deleteGo.addEventListener('click', () => {
    //effect
    effect.alpha = 0;
    //out of range
    if (deleteIndex.value > 19) {
        deleteIndex.value = ""
        Swal.fire({
            icon: 'info',
            title: 'Out of range',
            html: 'Sorry,為了視覺化的呈現我們設定Array的長度為20,但在程式中只要記憶體空間足夠您就可以設定你想要的Array大小'
        })
        return;
    }

    //delete to array
    arr[deleteIndex.value] = "";

    //effect variable
    flag.state = false
    flag.goto = deleteIndex.value

    //init
    deleteIndex.value = "";
});


//tips

const tip = document.querySelector('.tips');

tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "Array是一個連續記憶體配置的資料結構,可以透過索引值去儲存數值,亦可刪除 <br><br>" +
            "Insert(index,value) //於index值位置插入value<br>" +
            "Delete(index) //刪除該index之值<br>"

    })
})