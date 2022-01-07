var svg_width = 1300;
var svg_height = 400;
var svgindex_width = 1300;
var svgindex_height = 20;
let dataset = [];
let indexArray = [];
// for (let i = 0; i < 50; i++) {
//   dataset[i] = Math.floor(Math.random() * 70) + 10;
// }
for (let i = 0; i < 50; i++) {
  indexArray[i] = i;
}
dataset = [
  73, 49, 78, 47, 36, 23, 58, 20, 11, 27, 37, 33, 57, 68, 25, 56, 59, 38, 50,
  55, 61, 69, 72, 46, 17, 15, 74, 30, 79, 21, 43, 65, 32, 53, 45, 62, 26, 70,
  71, 51, 31, 52, 60, 75, 28, 42, 54, 41, 35, 29,
];

var svg = d3
  .select(".show")
  .append("svg")
  .attr("width", svg_width)
  .attr("height", svg_height);
svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "Rect")
  .attr("fill", "#09c")
  .attr("x", (d, i) => {
    return i * (svg_width / dataset.length);
  })
  .attr("y", (d) => {
    return svg_height - d * 4;
  })
  .attr("width", svg_width / dataset.length - 4)
  .attr("height", (d) => {
    return d * 4;
  });
svg
  .selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function (d) {
    return d;
  })
  .attr("fill", "#ffff00")
  .attr("font-size", "13px")
  .attr("x", (d, i) => {
    return i * (svg_width / dataset.length) + 3;
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
