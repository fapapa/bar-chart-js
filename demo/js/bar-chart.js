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
  "display": "flex",
  "align-items": "flex-start",
  "justify-content": "center",
  "box-sizing": "border-box",
  "width": "100%",
  "background-color": "blue",
  "border": "1px solid black"
};

let valueProperties = {
  "padding": "5px",
  "color": "white",
  "font-family": "Helvetica, Georgia, sans-serif"
};

let extractBarOptions = function (options) {
  let barOptions = {};

  switch (options.valueLabelPosition) {
  case 'center':
    barOptions["align-items"] = "center";
    delete options.valueLabelPosition;
    break;
  case 'bottom':
    barOptions["align-items"] = "flex-end";
    delete options.valueLabelPosition;
    break;
  default:
    delete options.valueLabelPosition;
  }

  if (options.barSpacing) {
    barOptions["margin-left"] = options.barSpacing;
    graphDefaults["padding-right"] = options.barSpacing;
    delete options.barSpacing;
  }

  if (options.barColor) {
    barOptions["background-color"] = options.barColor;
    delete options.barColor;
  }

  if (options.valueLabelColor) {
    valueProperties["color"] = options.valueLabelColor;
    delete options.valueLabelColor;
  }

  return barOptions;
};

const drawBarChart = function (data, options, element) {
  const max = Math.max.apply(Math, data);
  let graph = $("<div class='graph'></div>");
  let xAxis;

  if (options.xAxisName) {
    xAxis = options.xAxisName;
    delete options.xAxisName
  }

  // Get each value's percentage of the max
  data = data.map(function (datum) { return [ datum, datum / max * 100 ]; });

  let barOptions = extractBarOptions(options);

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
  data.forEach(function (datum) {
    let bar = $('<div class="chart-datum-bar"></div>');
    let valueLabel = $("<div class='value'>" + datum[0] + "</div>");

    bar.css(Object.assign(
      barProperties, barOptions, {"height": datum[1] + "%"}));
    valueLabel.css(valueProperties);

    bar.append(valueLabel);
    graph.append(bar);
  });

  // add the graph to the element specified
  element.append(graph);

  if (xAxis) {
    let title = $("<div class='x-axis'>" + xAxis + "</div>");
    title.css({"text-align": "center"});
    element.append(title);
  }
};
