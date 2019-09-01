const drawBarChart = function (data, options, element) {
  const max = Math.max.apply(Math, data);
  let graph = $("<div class='graph'></div>");

  element.css({
    "width": options.width || "500px",
    "height": options.height || "300px"
  });

  graph.css({
    "height": "100%",
    "border-left": options.lineStyle || "1px solid black",
    "border-bottom": options.lineStyle || "1px solid black"
  });

  element.append(graph);
};
