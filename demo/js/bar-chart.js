let elementDefaults = {
  "display": "grid",
  "grid-template-areas": "'y-axis graph'\n'empty labels'\n'empty x-axis'",
  "grid-template-rows": "auto 0 0",
  "grid-template-columns": "0 auto",
  "width": "500px",
  "height": "300px"
};

let graphDefaults = {
  "display": "flex",
  "grid-area": "graph",
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

let extractXAxis = function (options) {
  let xAxis;

  if (options.xAxisName) {
    xAxis = options.xAxisName;
    delete options.xAxisName;
  }

  return xAxis;
};

let extractYAxis = function (options) {
  let yAxis;

  if (options.yAxisName) {
    yAxis = options.yAxisName;
    delete options.yAxisName;
  }

  return yAxis;
};

let extractElementProperties = function (options) {
  let elementOptions;

  [ "width", "height" ].forEach(function (prop) {
    if (options[prop]) {
      elementOptions[prop] = options[prop];
      delete options[prop];
    }
  });

  return elementOptions;
};

let createBar = function (datum, options, graph) {
  let bar = $('<div class="chart-datum-bar"></div>');
  let valueLabel = $("<div class='value'>" + datum[0] + "</div>");

  bar.css(Object.assign(
    barProperties, options, {"height": datum[1] + "%"}));
  valueLabel.css(valueProperties);

  bar.append(valueLabel);
  graph.append(bar);
};

let createXAxis = function (xAxis) {
  let title = $("<div class='x-axis'>" + xAxis + "</div>");

  title.css({
    "grid-area": "x-axis",
    "text-align": "center"
  });

  return title;
};

let createYAxis = function (yAxis) {
  let title = $("<div class='y-axis'>" + yAxis + "</div>");

  title.css({
    "grid-area": "y-axis",
    "writing-mode": "vertical-rl",
    "transform": "rotate(180deg)",
    "text-align": "center"
  })

  return title
};

let createLabels = function (labels, barOptions) {
  let labelEl = $("<div class='x-axis-labels'></div>");

  labels.forEach(function (label) {
    labelEl.append($("<div>" + label + "</div>").css({
      "flex": "1 1 " + 100 / labels.length + "%",
      "padding-right": barOptions["margin-left"],
      "font-size": "0.8em",
      "text-align": "center"
    }));
  });

  labelEl.css({
    "grid-area": "labels",
    "display": "flex",
    "justify-content": "space-evenly",
    "margin-left": barOptions["margin-left"]
  });

  return labelEl;
};

const drawBarChart = function (data, options, element) {
  let graph = $("<div class='graph'></div>");
  let xAxis, yAxis;
  let labels;

  if (!Array.isArray(data)) {
    labels = [];
    data = Object.keys(data).map(function (label, idx) {
      labels.push(label);
      return data[label];
    });
  }
  const max = Math.max.apply(Math, data);

  xAxis = extractXAxis(options);
  yAxis = extractYAxis(options);

  // Get each value's percentage of the max
  data = data.map(function (datum) { return [ datum, datum / max * 100 ]; });

  let barOptions = extractBarOptions(options);

  // Apply some styling to the element that holds the graph
  let elementOptions = extractElementProperties(options);
  element.css(Object.assign(elementDefaults, elementOptions));

  // Apply styling to the graph itself
  graph.css(Object.assign(graphDefaults, options));

  // Create and add each data item as a bar on the graph
  data.forEach(function (datum) { createBar(datum, barOptions, graph); });

  // add the graph to the element specified
  element.append(graph);

  if (labels) { element.append(createLabels(labels, barOptions)); }
  if (xAxis) { element.append(createXAxis(xAxis)); }
  if (yAxis) { element.prepend(createYAxis(yAxis)); }
};
