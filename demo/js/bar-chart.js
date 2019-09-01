let elementDefaults = {
  "width": "500px",
  "height": "300px"
};

let graphDefaults = {
  "display": "flex",
  "justify-content": "space-evenly",
  "align-items": "flex-end",
  "height": "100%",
  "border-left": "1px solid black",
  "border-bottom": "1px solid black"
};

let barProperties = {
  "box-sizing": "border-box",
  "width": "50px",
  "background-color": "blue",
  "border": "1px solid black"
};

const drawBarChart = function (data, options, element) {
  const max = Math.max.apply(Math, data);
  let graph = $("<div class='graph'></div>");

  // Turn each data item into a percentage of the largest item in the set
  data = data.map(function (datum) { return datum / max * 100; });

  // Apply some styling to the element that holds the graph
  let elementOptions = {};
  [ "width", "height" ].forEach(function (prop) {
    if (options[prop]) {
      elementOptions[prop] = options[prop];
      delete options[prop];
    }
  });
  element.css(Object.assign(elementDefaults, elementOptions));

  // Apply styling to the graph itself
  graph.css(Object.assign(graphDefaults, options));

  // Create and add each data item as a bar on the graph
  data.forEach(function (value) {
    let bar = $('<div class="chart-datum-bar"></div>');
    bar.css(Object.assign(barProperties, {"height": value + "%"}));
    graph.append(bar);
  });

  // add the graph to the element specified
  element.append(graph);
};
