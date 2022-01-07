let completeBT_data = [];
let middle = [] //store node's x
let height = []//store node's y
let traversalOutput = []

//node structure
const nodeStructure = {
    nodeX: 800,
    nodeY: 50,
    size: 20,
    lineSize: 20,
    lineOffset: 5
}

//effect
let effect = {
    alpha: 0,
    lineX: 0,
    lineY: 0
}

//global variables
let recordMiddle, recordHeight;
let fontOffset = 0;
let row_count = 0;
let have_rChild = false
let changeWhite = false
let preOrder_anime = false
let inOrder_anime = false
let postOrder_anime = false
let lChild_color = 'white'
let rChild_color = 'white'
let traversalArr = []
let traversalIndex = 0
let ans = ""
//canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
update();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTree();

    OrderAnime();

    requestAnimationFrame(update);
}

function drawTree() {
    let level = 1;
    let exp = 0;
    let count = 0;

    for (let i = 0; i < completeBT_data.length; i++) {
        //calculate height
        count++;
        if (i === 0) {
            level = 1
            //for next round
            exp++
            count = 0
        }
        else if (count <= Math.pow(2, exp)) {
            level = exp + 1
        }
        else if (count > Math.pow(2, exp)) {//change row
            exp++;
            count = 1;
            level = exp + 1;
        }

        //effect alpha
        if (effect.alpha < 1) {
            effect.alpha += 0.02 / completeBT_data.length //maintain the rate
        }

        drawNode(i, level - 1)//what type we need to draw(start from level 0)
        drawLine(middle)
        drawData()
    }
}

//using Dynamic Programming draw Node
function drawNode(nodeNumber, level) {
    //effect
    ctx.lineWidth = 4;
    if (changeWhite) {
        ctx.strokeStyle = 'white';
    }
    else if (nodeNumber === completeBT_data.length - 1) {//the last one
        ctx.strokeStyle = `rgba(255,0,0,${effect.alpha})`;
    }
    else {//others
        ctx.strokeStyle = 'white';
    }

    //draw
    ctx.beginPath();
    if (nodeNumber === 0) {
        //root x and y
        recordMiddle = 800;
        recordHeight = 50;

        ctx.arc(middle[0], height[0], 30, 0, Math.PI * 2);
    }
    else if (nodeNumber % 2 === 1) {
        recordMiddle = middle[Math.floor(nodeNumber / 2)] - nodeSpacing(nodeNumber)
        recordHeight = 50 + level * 90

        ctx.arc(recordMiddle, recordHeight, 30, 0, Math.PI * 2);
    }
    else if (nodeNumber % 2 === 0) {
        recordMiddle = middle[Math.floor(nodeNumber / 2) - 1] + nodeSpacing(nodeNumber)
        recordHeight = nodeStructure.nodeY + level * 90

        ctx.arc(recordMiddle, recordHeight, 30, 0, Math.PI * 2);
    }

    //store node's x using map
    middle[nodeNumber] = recordMiddle

    //store node's y using map
    height[nodeNumber] = recordHeight

    row_count++;
    ctx.stroke();
}

//draw line
function drawLine(middle) {
    //variable
    let level = 0
    let y = 80
    let yOffset = -10
    //effect
    ctx.strokeStyle = `rgba(255,255,255,${effect.alpha})`;

    //draw
    for (let i = 1; i < middle.length; i++) {//root don't need branch
        //change level
        if (i === 1 || i === 3 || i === 7 || i === 14) {
            level++
            yOffset += 10
        }

        //start from the left child
        if (i % 2 === 0) continue

        //formula
        let beginX = middle[Math.ceil(i / 2) - 1]//find father
        let beginY = y * level + yOffset
        let endX_lChild = middle[Math.floor(i / 2) * 2 + 1]//find leftChild position
        let endX_rChild = middle[Math.floor(i / 2) * 2 + 2]//find rChild position
        let endY = y * level + yOffset + 30

        if (changeWhite) {
            lChild_color = 'white';
            rChild_color = 'white';
        }
        else if (have_rChild && i === middle.length - 2) {// have rChild the last one draw red
            lChild_color = 'white'
            rChild_color = `rgba(255,0,0,${effect.alpha})`;
        }
        else if (i === middle.length - 1) {// only lChild the last one draw red
            lChild_color = `rgba(255,0,0,${effect.alpha})`;
        }
        else {//others
            lChild_color = 'white'
            rChild_color = 'white'

        }


        //draw Left child
        ctx.strokeStyle = lChild_color;
        ctx.beginPath();
        ctx.moveTo(beginX, beginY);
        ctx.lineTo(endX_lChild, endY);
        ctx.stroke();

        //draw Right child
        ctx.strokeStyle = rChild_color;
        ctx.beginPath();
        ctx.moveTo(beginX, beginY);
        ctx.lineTo(endX_rChild, endY);
        ctx.stroke();
    }

    //reset
    level = 0
    yOffset = -10
}

//draw data
function drawData() {
    let yOffset = 60

    //draw
    for (let i = 0; i < completeBT_data.length; i++) {
        ctx.font = '28px Arial';
        //effect
        if (changeWhite) {
            ctx.fillStyle = 'white';
        }
        else if (i === completeBT_data.length - 1) {//the last one
            ctx.fillStyle = `rgba(255,0,0,${effect.alpha})`;
        }
        else {//others
            ctx.fillStyle = 'white';
        }

        offset(completeBT_data[i])
        if (i === 1 || i === 3 || i === 7 || i === 15) {
            yOffset += 90
        }
        ctx.fillText(`${completeBT_data[i]}`, middle[i] + fontOffset, yOffset);
        ctx.font = '20px Arial';
        ctx.fillText(`${i}`, middle[i] + 38, yOffset - 18);
    }
}

//font offset
function offset(value) {
    let length = value.toString().length
    if (length > 2) {
        fontOffset = -23;
    }
    else if (length > 1) {
        fontOffset = -15;
    }
    else {
        fontOffset = -7;
    }
}

//node spacing decrease
function nodeSpacing(nodeNumber) {
    if (nodeNumber >= 1 && nodeNumber <= 2) {
        return 410
    }
    else if (nodeNumber >= 3 && nodeNumber <= 6) {
        return 200
    }
    else if (nodeNumber >= 7 && nodeNumber <= 14) {
        return 100
    }
    else return 50
}

//traversal
const preOrder = document.querySelector('.preOrder');
const inOrder = document.querySelector('.inOrder');
const postOrder = document.querySelector('.postOrder');

preOrder.addEventListener('click', () => {
    orderEvent('preOrder', true, false, false)
})

inOrder.addEventListener('click', () => {
    orderEvent('inOrder', false, true, false);
})

postOrder.addEventListener('click', () => {
    orderEvent('postOrder', false, false, true);
})

function orderEvent(whichOrder, preO, inO, postO) {
    if (completeBT_data.length === 0) {
        return;
    }

    traversalIndex = 0
    changeWhite = true
    preOrder_anime = preO
    inOrder_anime = inO
    postOrder_anime = postO

    switch (whichOrder) {
        case 'preOrder':
            preOrder_traversal(0);
            break;
        case 'inOrder':
            inOrder_traversal(0);
            break;
        case 'postOrder':
            postOrder_traversal(0);
            break;
        default:
            break;
    }

    //hide btn
    isBtnShow(true);

    //one second plus one if index comes to completeBT_data.length means we traversal to the last node  
    let timer = setInterval(() => {
        traversalIndex++
        if (traversalIndex === completeBT_data.length) {
            //show traversal ans
            Swal.fire({
                title: `${whichOrder} output`,
                html: `${traversalOutput.join('->')}`
            })
            traversalOutput = []//init
            traversalArr = []//init
            isBtnShow(false)//show btn
            clearInterval(timer)
        }
    }, 1000);
}

//traversal function
function preOrder_traversal(index) {
    if (index < middle.length && preOrder_anime) {
        //for traversal path
        traversalArr.push([middle[index], height[index]]);
        //for traversal output
        traversalOutput.push(completeBT_data[index]);
        preOrder_traversal(index * 2 + 1);
        preOrder_traversal(index * 2 + 2);
    }
}

function inOrder_traversal(index) {
    if (index < middle.length && inOrder_anime) {
        inOrder_traversal(index * 2 + 1);
        traversalArr.push([middle[index], height[index]])
        //for traversal output
        traversalOutput.push(completeBT_data[index]);
        inOrder_traversal(index * 2 + 2);
    }
}

function postOrder_traversal(index) {
    if (index < middle.length && postOrder_anime) {
        postOrder_traversal(index * 2 + 1);
        postOrder_traversal(index * 2 + 2);
        traversalArr.push([middle[index], height[index]])
        //for traversal output
        traversalOutput.push(completeBT_data[index]);
    }
}

//keep drawing
function OrderAnime() {
    if (preOrder_anime || inOrder_anime || postOrder_anime) {
        if (traversalIndex < traversalArr.length) {
            ctx.fillStyle = 'rgba(255,0,0,0.5)';
            ctx.beginPath();
            ctx.arc(traversalArr[traversalIndex][0], traversalArr[traversalIndex][1], 30, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

//hide & show btn
function isBtnShow(bool) {
    if (bool) {
        //hide btn
        preOrder.disabled = true
        inOrder.disabled = true
        postOrder.disabled = true
    }
    else {
        //hide btn
        preOrder.disabled = false
        inOrder.disabled = false
        postOrder.disabled = false
    }
}
//methods
const insertValue = document.querySelector('.insertValue');
const insertGo = document.querySelector('.insertGo');
const deleteIndex = document.querySelector('.deleteIndex');
const deleteGo = document.querySelector('.deleteGo');


insertGo.addEventListener('click', () => {
    changeWhite = false
    if (completeBT_data.length === 31) {
        Swal.fire({
            icon: 'info',
            title: 'Out of range',
            html: 'Sorry,為了視覺化的呈現我們設定樹的節點上限設為31,但在程式中只要記憶體空間足夠您就可以繼續insert'
        })
        return;
    }
    if (insertValue.value == "") {
        Swal.fire({
            icon: 'Error',
            title: 'Please fill the value'
        })
        return;
    }

    //push
    completeBT_data.push(insertValue.value)
    if ((completeBT_data.length - 1) % 2 === 0) {//have rChild
        have_rChild = true
    }
    else {
        have_rChild = false
    }

    //initial
    insertValue.value = ""
    effect.alpha = 0
})

deleteGo.addEventListener('click', () => {
    changeWhite = true //change all to white
    if (deleteIndex.value === "") {
        Swal.fire({
            icon: 'Error',
            title: 'Please fill the index'
        })
        return
    }
    completeBT_data.splice(deleteIndex.value, 1)
    middle.splice(deleteIndex.value, 1)
    deleteIndex.value = ""
})


//tips
const tip = document.querySelector('.tips');
tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "每次新增節點到Complete Binary Tree中都必須由上而下,由左至右" +
            ",刪除節點後必須將該刪除點後的所有點向左填補空缺<br><br>" +
            "Insert(value) //新增節點至樹中<br>" +
            "Delete(index) //刪除樹中的index號節點<br><br>" +
            "<strong>樹的走訪</strong><br>" +
            "從樹的根節點(Root)開始走訪,有的步驟是<br>" +
            "A.輸出該點<br>" +
            "B.前往左子樹(直到無左子點)<br>" +
            "C.前往右子樹(直到無右子點)<br><br>" +
            "走訪方式有以下三種<br>" +
            "PreOrder : A->B->C 當前進到新的點就要從A步驟開始<br>" +
            "InOrder : B->A->C 當前進到新的點就要從B步驟開始<br>" +
            "PostOrder :B->C->A 當前進到新的點就要從B步驟開始<br>"
    })
})