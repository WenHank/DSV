//node structure
class NodeStructure {
    constructor(item) {
        this.item = item;
        this.next = null;
    }
}

//implement LinkedList
class LinkedList {
    constructor() {
        this.length = 0;
        this.head = null;
    }

    append(element) {
        let node = new NodeStructure(element);
        if (!this.head) {//head===null
            this.head = node;
        } else {
            let tail = this.head;
            while (tail.next) {
                tail = tail.next;
            }
            tail.next = node;
        }
        this.length++;
    }

    insert(position, element) {
        if (position > -1 && position < this.length) {
            let node = new NodeStructure(element);
            let current = this.head;
            let previous;
            let index = 0;
            if (position === 0) {
                node.next = current;
                this.head = node;
            }
            else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = node;
                node.next = current;
            }
            this.length++;
            return true;
        }
        else {
            return false;
        }
    }

    size() {
        return this.length;
    }

    removeAt(position) {
        if (position > -1 && position < this.length) {
            let current = this.head;
            let previous;
            let index = 0;
            if (position == 0) {
                head = current.next;
            } else {
                while (index++ < position) {//跑完才加
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        } else {
            return null;
        }
    }

    print() {
        let current = this.head;
        let result = [];
        while (current != null) {
            result.push(current.item);
            current = current.next;
        }
        // console.log(result);
        return result;
    }
}

//start canvas part
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let offsetValue = 0;
let indexNow = 0;

//search var.
let searchAnime = false;
let search_index = 0;
let searchY = 75;
let searchTemp;
let isFind = false
let judge;

const effect = {
    r: 255,
    g: 255,
    b: 255,
    alpha: 0
}

let linkedList = new LinkedList();
update();

//main function
function update() {
    drawLinkedList();

    drawSearchCircle();

    requestAnimationFrame(update);
}

function drawLinkedList() {
    const linkedList_contents = linkedList.print();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < linkedList.size(); i++) {
        if (effect.alpha < 1) {
            effect.alpha = effect.alpha + (0.02 / linkedList.size())
        }
        buildLinkedList(i, linkedList_contents[i]);
    }
}

function offset(content) {
    let length = content.toString().length
    if (length > 3) {
        offsetValue = 10;
    }
    else if (length > 2) {
        offsetValue = 5;
    }
    else if (length > 1) {
        offsetValue = 0;
    }
    else {
        offsetValue = -5;
    }
}

function buildLinkedList(index, content) {

    //for data offset
    offset(content)

    //for row change
    let y = 50
    if (index > 9) y = 150
    if (index > 19) y = 250


    //----------------------build LinkedList------------------------
    //effect
    //new one must be red
    if (index == indexNow) {
        effect.r = 255;
        effect.g = 0;
        effect.b = 0;
    }
    else {
        effect.r = 255;
        effect.g = 255;
        effect.b = 255;
    }

    //setting
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${effect.r},${effect.g},${effect.b},${effect.alpha})`;
    ctx.font = '15px Arial';
    ctx.fillStyle = `rgba(${effect.r},${effect.g},${effect.b},${effect.alpha})`;

    //body
    ctx.strokeRect((index % 10) * 100, y, 80, 50)

    //index
    ctx.fillText(`${index}`, (index % 10) * 100 + 30, y - 10)

    //data
    ctx.fillText(content, (index % 10) * 100 + 25 - offsetValue, y + 30)

    //line
    ctx.beginPath();
    ctx.moveTo((index % 10) * 100 + 60, y);
    ctx.lineTo((index % 10) * 100 + 60, y + 50);
    ctx.strokeStyle = `rgba(${effect.r},${effect.g},${effect.b},${effect.alpha})`;
    ctx.stroke();

    //next
    ctx.font = '30px Arial';
    ctx.fillText('➝', (index % 10) * 100 + 70, y + 35)
}

function drawSearchCircle() {
    let linkedList_contents = linkedList.print();
    if (searchAnime) {
        ctx.beginPath();
        ctx.arc((search_index % 10) * 100 + 30, searchY, 30, 0, Math.PI * 2);
        //because setInterval will run immediately and it'll caused to not search for the first one
        if (isFind || searchValue.value === linkedList_contents[judge]) {
            ctx.strokeStyle = 'rgb(0,255, 0)';
        } else {
            ctx.strokeStyle = 'rgb(255,0, 0)';
        }
        ctx.stroke();
    }
}


//event listen
const appendValue = document.querySelector('.appendValue');
const insertIndex = document.querySelector('.insertIndex');
const insertValue = document.querySelector('.insertValue');
const deleteIndex = document.querySelector('.deleteIndex');
const searchValue = document.querySelector('.searchValue');

const appendGo = document.querySelector('.appendGo');
const insertGo = document.querySelector('.insertGo');
const deleteGo = document.querySelector('.deleteGo');
const searchGo = document.querySelector('.searchGo');


//append
appendGo.addEventListener('click', function () {
    effect.alpha = 0
    //out of canvas
    if (linkedList.size() == 30) {
        Swal.fire({
            icon: 'info',
            html: "Sorry, canvas已滿,為了視覺化的呈現,不得再讓您新增節點,但在程式中如果你還有足夠的記憶體空間,就可以再新增節點"
        })
        return;
    }
    //no num
    if (appendValue.value == "") {
        Swal.fire({
            title: 'Please fill the value'
        })
        return;
    }
    linkedList.append(appendValue.value)
    appendValue.value = ""
    //for know effect in which one
    indexNow = linkedList.size() - 1
})

//insert
insertGo.addEventListener('click', function () {
    //effect
    effect.alpha = 0
    //out of canvas
    if (linkedList.size() == 30) {
        Swal.fire({
            icon: 'info',
            html: "Sorry, canvas已滿,為了視覺化的呈現,不得再讓您新增節點,但在程式中如果你還有足夠的記憶體空間,就可以再新增節點"
        })
        return;
    }
    //both need to have value
    if (insertIndex.value == "" || insertValue.value == "") {
        Swal.fire({
            title: 'Please fill both the index and value'
        })
        return;
    }
    //can not insert out of length
    if (insertIndex.value > linkedList.size()) {
        Swal.fire({
            icon: 'error',
            title: '你輸入的index超過目前的鏈結長度'
        })
        insertIndex.value = ""
        insertValue.value = ""
        return
    }
    linkedList.insert(insertIndex.value, insertValue.value)

    //for know effect in which one
    indexNow = insertIndex.value

    insertIndex.value = ""
    insertValue.value = ""

})

//delete
deleteGo.addEventListener('click', function () {
    effect.alpha = 0
    if (deleteIndex.value > linkedList.size()) {
        Swal.fire({
            icon: 'error',
            title: '你想刪除的節點不存在'
        })
        deleteIndex.value = ""
        return;
    }
    linkedList.removeAt(deleteIndex.value)
    deleteIndex.value = ""
    indexNow = null
})

//search
searchGo.addEventListener('click', function () {
    indexNow = null
    searchGo.disabled = true
    searchAnime = true
    let linkedList_length = linkedList.size();
    let linkedList_contents = linkedList.print();
    //init
    let ans = [];
    search_index = 0;
    searchY = 75;
    judge = 0;
    //timer
    let timer = setInterval(() => {
        if (search_index < linkedList_length - 1) {
            if (searchValue.value == linkedList_contents[search_index + 1]) {
                isFind = true
                ans.push(search_index + 1)
            } else {
                isFind = false
            }
            search_index++;
            judge = -1
            //change row
            if (search_index > 9) searchY = 175
            if (search_index > 19) searchY = 275
        }
        else {
            searchGo.disabled = false
            searchAnime = false
            clearInterval(timer);
            if (searchValue.value == linkedList_contents[0]) {
                Swal.fire({
                    title: `Found element "${searchValue.value}" in index 0,${ans}`,
                })
            }
            else if (ans.length === 0) {
                Swal.fire({
                    title: `Not found!`,
                })
            }
            else {
                Swal.fire({
                    title: `Found element ${searchValue.value} in index ${ans}`,
                })
            }
            searchValue.value = ""
        }
    }, 1000)
})

//tips
const tip = document.querySelector('.tips');

tip.addEventListener('click', () => {
    Swal.fire({
        title: 'Tips',
        html: "LinkedList是以串列連接的資料結構,優勢是可以快速插入資料和刪除,但劣勢是搜尋數值必須每次都從頭開始<br><br>" +
            "append(value) //從串列最尾端插入數值<br>" +
            "insert(index,value) //從特定位置插入數值<br>" +
            "delete(index) //從特定位置刪除數值<br>" +
            "search(value) //從List的頭依序尋找數值<br>"
    })
})