let elementDefaults = {
  "display": "grid",
  "grid-template-areas": "'y-axis tick-values tick-marks graph' 'empty empty empty labels' 'empty empty empty x-axis'",
  "grid-template-rows": "auto 0 0",
  "grid-template-columns": "0 20px 5px auto",
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

let drawBar = function (datum, options) {
  let bar = $('<div class="chart-datum-bar"></div>');
  let valueLabel = $("<div class='value'>" + datum[0] + "</div>");

  bar.css(Object.assign(
    barProperties, options, {"height": datum[1] + "%"}));
  valueLabel.css(valueProperties);

  bar.append(valueLabel);

  return bar;
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

let showLabelArea = function (element) {
  let gridRowHeights = elementDefaults['grid-template-rows'].split(' ');
  gridRowHeights[1] = "1.375em";
  elementDefaults['grid-template-rows'] = gridRowHeights.join(' ');
};

let showXAxisArea = function (element) {
  let gridRowHeights = elementDefaults['grid-template-rows'].split(' ');
  gridRowHeights[2] = "1.375em";
  elementDefaults['grid-template-rows'] = gridRowHeights.join(' ');
};

let showYAxisArea = function (element) {
  let gridColumnWidths = elementDefaults['grid-template-columns'].split(' ');
  gridColumnWidths[0] = "1.375em";
  elementDefaults['grid-template-columns'] = gridColumnWidths.join(' ');
};

let bestTick = function (maxValue, mostTicks) {
  let tick;
  const minInterval = maxValue / mostTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(minInterval)));
  const residual = minInterval / magnitude;

  if (residual > 5) {
    tick = 10 * magnitude;
  } else if (residual > 2) {
    tick = 5 * magnitude;
  } else if (residual > 1) {
    tick = 2 * magnitude;
  } else {
    tick = magnitude;
  }

  return tick;
};

const generateTicks = function (intervalHeight, scale, tickInterval) {
  const ticks = scale / tickInterval;
  let tickContainer = $("<div class='ticks'></div>");

  for (let i = 0; i < ticks; i++) {
    let intervalEl = $("<div></div>");
    intervalEl.css({
      "box-sizing": "border-box",
      "border-top": "1px solid black",
      "height": intervalHeight + "%"
    });
    tickContainer.append(intervalEl);
  }
  tickContainer.css({
    "grid-area": "tick-marks"
  });

  return tickContainer;
};

const generateTickValues = function (intervalHeight, scale, tickInterval) {
  let widestTickVal = $("<span id='del'>" + scale.toLocaleString() + "</span>");
  widestTickVal.css({
    "visibility": "none",
    "font-size": "0.8em"
  });
  $("body").append(widestTickVal);
  let tickColWidth = $("#del").width() + 5;
  $("#del").remove();
  let gridColumnWidths = elementDefaults["grid-template-columns"].split(' ');
  gridColumnWidths[1] = tickColWidth + "px";
  elementDefaults["grid-template-columns"] = gridColumnWidths.join(' ');

  let tickValueContainer = $("<div class='tick-values'></div>");
  for (let i = tickInterval; i <= scale; i += tickInterval) {
    let tickValue = $("<div>" + i.toLocaleString() + "</div>");
    tickValue.css({
      "height": intervalHeight + "%",
      "margin-top": "-0.5em",
      "margin-bottom": "0.5em",
      "padding-right": "5px",
      "font-size": "0.8em",
      "text-align": "right"
    });
    tickValueContainer.prepend(tickValue);
  }
  tickValueContainer.css({
    "grid-area": "tick-values"
  });

  return tickValueContainer;
};

const drawGraph = function (data, scale, options, barOptions) {
  let graph = $("<div class='graph'></div>");

  // Get each value's percentage of the scale
  data = data.map(function (datum) { return [ datum, datum / scale * 100 ]; });

  // Create and add each data item as a bar on the graph
  data.forEach(function (datum) { graph.append(drawBar(datum, barOptions)); });

  // Apply styling to the graph
  graph.css(Object.assign(graphDefaults, options));

  return graph;
};

const drawYAxisElements = function (yAxis, scale, tickInterval) {
  let name;
  const intervalHeight = tickInterval / scale * 100;

  if (yAxis) {
    showYAxisArea(element);
    name = createYAxis(yAxis);
  }

  const ticks = generateTicks(intervalHeight, scale, tickInterval);
  const tickValues = generateTickValues(intervalHeight, scale, tickInterval);

  return [name, tickValues, ticks];
};

const drawBarChart = function (data, options, element) {
  // Get the data into an array and collect labels if an object was passed in
  let labels;
  if (!Array.isArray(data)) {
    labels = Object.keys(data);
    data = Object.values(data);
  }

  // Determine scale
  const max = Math.max.apply(Math, data);
  const tickInterval = bestTick(max, 8);
  const scale = Math.ceil(max / tickInterval) * tickInterval;

  // Extract options
  let elementOptions = extractElementProperties(options);
  let xAxis, yAxis;
  xAxis = extractXAxis(options);
  yAxis = extractYAxis(options);

  // add the graph to the element specified
  let barOptions = extractBarOptions(options);
  element.append(drawGraph(data, scale, options, barOptions));

  // Draw the y-axis elements
  element.append(drawYAxisElements(yAxis, scale, tickInterval));

  // Draw the x-axis elements
  if (labels) {
    showLabelArea(element);
    element.append(createLabels(labels, barOptions));
  }
  if (xAxis) {
    showXAxisArea(element);
    element.append(createXAxis(xAxis));
  }



  // Apply some styling to the element that holds the graph
  element.css(Object.assign(elementDefaults, elementOptions));
};
