const drawBarChart = function (data, options, element) {
  const max = Math.max.apply(Math, data);
  let graph = $("<div class='graph'></div>");

  // Turn each data item into a percentage of the largest item in the set
  data = data.map(function (datum) { return datum / max * 100; });

  // Apply some styling to the element that holds the graph
  element.css({
    "width": options.width || "500px",
    "height": options.height || "300px"
  });

  // Apply styling to the graph itself; use flex-box for layout
  graph.css({
    "display": "flex",
    "justify-content": "space-evenly",
    "align-items": "flex-end",
    "height": "100%",
    "border-left": options.lineStyle || "1px solid black",
    "border-bottom": options.lineStyle || "1px solid black"
  });

  // Create and add each data item as a bar on the graph
  data.forEach(function (value) {
    let bar = $('<div class="chart-datum-bar"></div>');
    bar.css({
      "box-sizing": "border-box",
      "height": value + "%",
      "width": "50px",
      "background-color": "blue",
      "border": "1px solid black"
    });
    graph.append(bar);
  });

  // add the graph to the element specified
  element.append(graph);
};
