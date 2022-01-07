class NodeInfo {
    constructor(index, level, x, y, value) {
        this.index = index;
        this.level = level;
        this.x = x;
        this.y = y;
        this.value = value;
    }
}

class NodeStructure {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
};

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.arr = [];
    }
    insertNode(data) {
        let newNode = new NodeStructure(data);
        if (this.root === null) this.root = newNode;
        else this.insert(this.root, newNode);
    }
    insert(node, newNode) {
        if (newNode.data < node.data) {
            if (node.left === null)
                node.left = newNode;
            else//still have l child
                this.insert(node.left, newNode);
        }
        else {
            if (node.right === null)
                node.right = newNode;
            else//still have r child
                this.insert(node.right, newNode);
        }
    }
    search(node, data) {
        if (node === null)
            return 'Not found';
        else if (data < node.data)
            return this.search(node.left, data);
        else if (data > node.data)
            return this.search(node.right, data);
        else if (data === node.data) {
            return 'Found it'
        }
    }
    getRoot() {
        return this.root;
    }
    inOrder(node) {
        if (node !== null) {
            this.inOrder(node.left);
            this.arr.push(node.data);
            this.inOrder(node.right);
        }
    }
}

//variables
const nodePosition_X = [800, 390, 1210, 190, 590, 1010, 1410, 90, 290, 490, 690, 910, 1110, 1310, 1510, 40, 140, 240, 340, 440, 540, 640, 740, 860, 960, 1060, 1160, 1260, 1360, 1460, 1560]
const nodePosition_Y = [50, 140, 230, 320, 410]
let temp = 0
let alpha = 0;
let isBucketEmpty = true
let isRoot = true
let goToRight = false
let fontOffset = 0
let theLastNode = 0;

let insert_anime = false;

let preOrder_anime = false
let inOrder_anime = false
let postOrder_anime = false
let traversalArr = []
let traversalOutput = []
let traversalIndex = 0;
let changeWhite = false;

let searchStart = false;
let searchIndex = 0;
//for setting node's index, level, x, y, data
let nodeBucket = new Array(31).fill(null);

//canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
update();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTree();

    OrderAnime();

    searchAnime();

    requestAnimationFrame(update);
}

function drawTree() {
    alpha += 0.05
    ctx.lineWidth = 4;
    if (!isBucketEmpty) {
        for (let i = 0; i < nodeBucket.length; i++) {
            if (nodeBucket[i] === null) {
                continue;
            }

            if (i === theLastNode && !changeWhite) {
                ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
                ctx.fillStyle = `rgba(255,0,0,${alpha})`;
            } else {
                ctx.strokeStyle = `rgba(255,255,255)`;
                ctx.fillStyle = `rgba(255,255,255)`;
            }

            //draw node
            drawNode(nodeBucket[i].x, nodeBucket[i].y)

            //draw line
            drawLine(nodePosition_X[Math.floor((i - 1) / 2)], nodePosition_Y[nodeBucket[i].level - 1] + 30, nodePosition_X[i], nodePosition_Y[nodeBucket[i].level] - 30)

            //draw data
            drawData(nodeBucket[i].value, nodePosition_X[i], nodePosition_Y[nodeBucket[i].level], i)
        }
    }
}

function drawNode(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.stroke();
}

function drawLine(beginX, beginY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(beginX, beginY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawData(data, x, y, index) {
    ctx.font = '25px Arial';
    offset(data)
    ctx.fillText(`${data}`, x + fontOffset, y + 9);
    ctx.font = '20px Arial';
    ctx.fillText(`${index}`, x + 35, y - 15);
    ctx.fill();
}
//font offset
function offset(value) {
    let length = value.toString().length
    if (length > 2) {
        fontOffset = -20;
    }
    else if (length > 1) {
        fontOffset = -13;
    }
    else {
        fontOffset = -7;
    }
}

function searchAnime() {
    if (nodeBucket[searchIndex] == null) {
        return;
    }
    if (searchStart) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.arc(nodePosition_X[searchIndex], nodePosition_Y[nodeBucket[searchIndex].level], 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

//eventListener
const insertValue = document.querySelector('.insertValue');
const insertGo = document.querySelector('.insertGo');
const searchValue = document.querySelector('.searchValue');
const searchGo = document.querySelector('.searchGo');


insertGo.addEventListener('click', () => {
    changeWhite = false
    alpha = 0
    if (insertValue.value == "") {
        return
    }

    let index = 0
    let level = 0
    temp = parseInt(insertValue.value);

    //已有根節點
    if (!isBucketEmpty) {
        isRoot = false

        insert_anime = true

        while (nodeBucket[index] != null) {//遇到空格前
            if (temp < nodeBucket[index].value) {//左子點
                index = index * 2 + 1
                level++
                goToRight = false
            }
            else {//右子點
                index = index * 2 + 2
                level++
                goToRight = true
            }
            if (level == 5) {
                Swal.fire({
                    icon: 'info',
                    title: `抱歉為了視覺化的效果,我們將高度控制在5,但若在程式中只要記憶體空間足夠您就可以繼續新增`,
                })
                insertValue.value = ""
                return
            }
        }
    }

    //index level x y value
    let node = new NodeInfo(index, level, nodePosition_X[index], nodePosition_Y[level], temp)
    nodeBucket[index] = node
    theLastNode = index;

    isBucketEmpty = false
    insertValue.value = ""
})

searchGo.addEventListener('click', () => {
    changeWhite = true
    searchIndex = 0;
    temp = parseInt(searchValue.value);
    searchStart = true;
    let timer = setInterval(() => {
        if (nodeBucket[searchIndex] != null) {
            if (temp > nodeBucket[searchIndex].value) {
                searchIndex = searchIndex * 2 + 2
            }
            else if (temp < nodeBucket[searchIndex].value) {
                searchIndex = searchIndex * 2 + 1
            }
            else {
                Swal.fire({
                    title: `Found element ${temp} in index ${searchIndex}`,
                })
                searchStart = false;
                clearInterval(timer);
            }
        } else {
            Swal.fire({
                title: `Not found!`,
            })
            searchStart = false;
            clearInterval(timer);
        }
    }, 800);
    searchValue.value = "";
})

//traversal
const preOrder = document.querySelector('.preOrder');
const inOrder = document.querySelector('.inOrder');
const postOrder = document.querySelector('.postOrder');

preOrder.addEventListener('click', () => {
    orderEvent('preOrder', true, false, false)
})

inOrder.addEventListener('click', () => {
    orderEvent('inOrder', false, true, false)
})

postOrder.addEventListener('click', () => {
    orderEvent('postOrder', false, false, true)
})

function orderEvent(whichOrder, preO, inO, postO) {
    if (nodeBucket.every(element => element === null)) {
        return;
    }
    traversalIndex = 0
    changeWhite = true
    preOrder_anime = preO
    inOrder_anime = inO
    postOrder_anime = postO

    // hide btn
    isBtnShow(true)

    // make preOrder array
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

    //one second plus one if index comes to completeBT_data.length means we traversal to the last node  
    let timer = setInterval(() => {
        let str = ""
        traversalIndex++
        if (traversalIndex === traversalArr.length) {
            //show traversal ans
            if (whichOrder === 'inOrder') {
                str = "Did you find out that the result output with inorder in BST will change to the sorted result"
            }
            else {
                str = "";
            }
            Swal.fire({
                title: `${whichOrder} output`,
                html: `${traversalOutput.join('->')}<br><br>${str}`
            })

            traversalOutput = []//init
            traversalArr = []//init
            isBtnShow(false)//show btn
            clearInterval(timer)
        }
    }, 800);
}

function preOrder_traversal(index) {
    if (index < nodeBucket.length && preOrder_anime && nodeBucket[index] != null) {
        //for traversal path
        traversalArr.push([nodePosition_X[index], nodePosition_Y[nodeBucket[index].level]]);
        //for traversal output
        traversalOutput.push(nodeBucket[index].value);
        preOrder_traversal(index * 2 + 1);
        preOrder_traversal(index * 2 + 2);
    }
}

function inOrder_traversal(index) {
    if (index < nodeBucket.length && inOrder_anime && nodeBucket[index] != null) {
        inOrder_traversal(index * 2 + 1);
        //for traversal path
        traversalArr.push([nodePosition_X[index], nodePosition_Y[nodeBucket[index].level]]);
        //for traversal output
        traversalOutput.push(nodeBucket[index].value);
        inOrder_traversal(index * 2 + 2);
    }
}

function postOrder_traversal(index) {
    if (index < nodeBucket.length && postOrder_anime && nodeBucket[index] != null) {
        postOrder_traversal(index * 2 + 1);
        postOrder_traversal(index * 2 + 2);
        //for traversal path
        traversalArr.push([nodePosition_X[index], nodePosition_Y[nodeBucket[index].level]]);
        //for traversal output
        traversalOutput.push(nodeBucket[index].value);
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

//tips
const tip = document.querySelector('.tips');
tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "Binary Search Tree(二元搜尋樹),顧名思義就是他的搜索過程非常快,而二元搜尋樹必須滿足<br>" +
            "1.若任意節點的左子樹不空，則左子樹上所有節點的值均小於它的根節點的值<br>" +
            "2.若任意節點的右子樹不空，則右子樹上所有節點的值均大於它的根節點的值<br>" +
            "3.任意節點的左、右子樹也分別為二元搜尋樹<br><br>" +
            "Insert(value) //新增節點至樹中,由根節點開始比對,大於往右子樹,小於往左子樹,直到走到底則插入<br>" +
            "Search(value) //找尋value,由根節點開始比對,大於往右子樹,小於往左子樹,等於則輸出該節點index值<br><br>" +
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
