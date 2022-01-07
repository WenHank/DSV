const searchValue = document.querySelector(".searchValue");
const searchGo = document.querySelector(".searchGo");
const rects = document.querySelectorAll("rect");
const finds = document.querySelector(".find");
const tip = document.querySelector(".tips");
let ans //for store find index
searchGo.addEventListener("click", () => {
  searchGo.disabled = true;
  let RectArray = [];
  let flag = 0;
  let i = 0;
  for (let i = 0; i < 50; i++) {
    rects[i].style.fill = "#09c";
  }
  rects.forEach((rect) => {
    RectArray.push(rect.height.animVal.value);
  });
  let intervalID = setInterval(() => {
    if (i > 49) {
      clearInterval(intervalID);
      searchGo.disabled = false;
      if (flag === 0) {
        Swal.fire({
          title: "Sorry, the value didn't found"
        });
      }
      else {
        Swal.fire({
          title: `Find the value ${searchValue.value} in index ${ans}`
        });
      }
      searchValue.value = ""
    } else {
      if (RectArray[i] / 4 == searchValue.value) {
        rects[i].style.fill = "green";
        flag = 1;
        ans = i
      } else {
        rects[i].style.fill = "red";
      }
    }
    i++;
  }, 200);
});

tip.addEventListener("click", () => {
  Swal.fire({
    title: "Tips",
    html:
      "Linear search為線性搜索,搜索過程必須從頭一步步比對,假設數據皆不重複,則搜索直到找到搜尋值或遍歷完數據為止"
  });
});
