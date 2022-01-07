const searchValue = document.querySelector(".searchValue");
const searchGo = document.querySelector(".searchGo");
const sort = document.querySelector(".sort");
const finds = document.querySelector(".find");
const step1 = document.querySelector(".step1");
const searchValueshow = document.querySelector(".searchValueshow");
const smallbig = document.querySelector(".smallbig");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const tip = document.querySelector(".tips");
let rects = document.querySelectorAll("rect");

let l = 0;
let u = 49;
let m = 0;
let SortArray = [];
searchGo.disabled = true;

function Draw() {
  d3.selectAll("svg").remove();
  var svg = d3
    .select(".show")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);
  svg
    .selectAll("rect")
    .data(SortArray)
    .enter()
    .append("rect")
    .attr("class", "Rect")
    .attr("fill", "#09c")
    .attr("x", (d, i) => {
      return i * (svg_width / SortArray.length);
    })
    .attr("y", (d) => {
      return svg_height - d * 4;
    })
    .attr("width", svg_width / SortArray.length - 4)
    .attr("height", (d) => {
      return d * 4;
    });
  svg
    .selectAll("text")
    .data(SortArray)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("fill", "#ffff00")
    .attr("font-size", "13px")
    .attr("x", (d, i) => {
      return i * (svg_width / SortArray.length) + 3;
    })
    .attr("y", (d) => {
      return svg_height - d * 4 - 3;
    });
  var svgindex = d3
    .select(".index")
    .append("svg")
    .attr("width", svgindex_width)
    .attr("height", svgindex_height);
  svgindex
    .selectAll("text")
    .data(indexArray)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("fill", "#ffa500")
    .attr("font-size", "13px")
    .attr("x", (d, i) => {
      return i * (svgindex_width / indexArray.length) + 3;
    })
    .attr("y", (d) => {
      return svgindex_height;
    });
}

async function Catch() {
  //console.log("Start");
  await Draw();
  rects = document.querySelectorAll("rect");
  //console.log(rects);
  //console.log("Finish waiting");
}

sort.addEventListener("click", () => {
  step1.style.color = "red";
  l = 0;
  u = 49;
  m = 0;
  sort.disabled = true;
  searchGo.disabled = false;
  rects.forEach((rect) => {
    SortArray.push(rect.height.animVal.value / 4);
  });
  SortArray.sort();
  Catch();
});

searchGo.addEventListener("click", () => {
  searchValueshow.innerHTML = searchValue.value;
  step1.style.color = "white";
  searchGo.disabled = true;
  let l = 0;
  let u = 49;
  let m = 0;
  for (let i = 0; i < 50; i++) {
    rects[i].style.fill = "#09c";
  }
  let intervalID = setInterval(() => {
    m = Math.floor((l + u) / 2);
    let change;
    if (l > u) {
      clearInterval(intervalID);
      finds.innerHTML = "Sorry,the value didn't find!!";
      searchGo.disabled = false;
    } else {
      if (SortArray[m] == searchValue.value) {
        rects[m].style.fill = "green";
        clearInterval(intervalID);
        searchGo.disabled = false;
        change = 2;
      } else if (SortArray[m] > searchValue.value) {
        rects[m].style.fill = "red";
        smallbig.innerHTML = "smaller";
        smallbig.style.color = "red";
        change = 1;
        u = m - 1;
      } else if (SortArray[m] < searchValue.value) {
        rects[m].style.fill = "red";
        smallbig.innerHTML = "bigger";
        smallbig.style.color = "red";
        change = 0;
        l = m + 1;
      }
      left.style.color = "white";
      right.style.color = "white";
    }
    setTimeout(() => {
      if (change === 1) {
        left.style.color = "red";
      } else if (change === 0) {
        right.style.color = "red";
      }
    }, 1000);
  }, 3000);
});

tip.addEventListener("click", () => {
  Swal.fire({
    title: "Tips",
    html:
      "Binary search 是針對已“排序好”的資料進行搜尋<br><br>" +
      "設定begin = 0<br>" +
      "以及end = 資料的長度<br><br>" +
      "1.算出中間的位置(middle)<br>middle=(begin+ end)/2<br><br>" +
      "2.若middle位置的數值小於搜尋值，代表middle左邊的值都小於我，所以往右邊尋找，故begin = middle+1<br><br>" +
      "3.若middle位置的數值大於搜尋值，代表middle右邊的值都大於我，所以往左邊尋找，故end = middle-1<br><br>" +
      "重複以上動作直到找到搜尋值或begin >= end(未找到)",
  });
});
