let elementDefaults = {
  "position": "relative",
  "width": "500px",
  "height": "300px"
};

let chartDefaults = {
  "display": "grid",
  "grid-template-areas": "'y-axis tick-values tick-marks graph' 'empty empty empty labels' 'empty empty empty x-axis'",
  "grid-template-rows": "auto 0 0",
  "grid-template-columns": "0 20px 5px auto"
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
  "flex-direction": "column-reverse",
  "align-items": "end",
  "box-sizing": "border-box",
  "width": "100%"
};

let barSectionProperties = {
  "display": "flex",
  "justify-content": "center",
  "width": "100%",
  "box-sizing": "border-box",
  "background-color": "blue"
}

let valueProperties = {
  "padding": "5px",
  "color": "white",
  "font-family": "Helvetica, Georgia, sans-serif"
};

let displayLegend = true;

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
    if (Array.isArray(options.barColor)) {
      barOptions.colors = options.barColor;
    } else {
      barOptions["background-color"] = options.barColor;
    }
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
  let elementOptions = {};

  [ "width", "height" ].forEach(function (prop) {
    if (options[prop]) {
      elementOptions[prop] = options[prop];
      delete options[prop];
    }
  });

  return elementOptions;
};

let drawBar = function (barData, options) {
  let bar = Object.keys(barData).reduce(function (htmlBar, category, idx) {
    let barSection = $("<div class='bar-section'></div>");
    let label = $("<div class='value'>" + barData[category].value + "</div>");
    if (options.colors) {
      barSectionProperties["background-color"] = options.colors[idx];
    }
    if (idx == Object.keys(barData).length - 1) {
      barSectionProperties["border-top-left-radius"] = "4px";
      barSectionProperties["border-top-right-radius"] = "4px";
    } else {
      delete barSectionProperties["border-top-left-radius"];
      delete barSectionProperties["border-top-right-radius"];
    }

    barSection.css(Object.assign(barSectionProperties,
                                 {"height": barData[category].height}));
    label.css(valueProperties);
    barSection.append(label);

    htmlBar.append(barSection);
    return htmlBar;
  }, $("<div class='bar'></div>"));

  bar.css(Object.assign(
    barProperties, options, {"height": "0"}));

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
  // TODO: if a simple array is passed in as data to the drawBarChart method,
  // don't show the labels as they are just made-up ones used to normalize the
  // data structure
  let labelEl = labels.reduce(function (htmlLabel, label) {
    htmlLabel.append($("<div>" + label + "</div>").css({
      "flex": "1 1 " + 100 / labels.length + "%",
      "padding-right": barOptions["margin-left"],
      "font-size": "0.8em",
      "text-align": "center"
    }));
    return htmlLabel;
  }, $("<div class='x-axis-labels'></div>"));

  labelEl.css({
    "grid-area": "labels",
    "display": "flex",
    "justify-content": "space-evenly",
    "margin-left": barOptions["margin-left"]
  });

  return labelEl;
};

let showLabelArea = function () {
  let gridRowHeights = chartDefaults['grid-template-rows'].split(' ');
  gridRowHeights[1] = "1.375em";
  chartDefaults['grid-template-rows'] = gridRowHeights.join(' ');
};

let showXAxisArea = function () {
  let gridRowHeights = chartDefaults['grid-template-rows'].split(' ');
  gridRowHeights[2] = "1.375em";
  chartDefaults['grid-template-rows'] = gridRowHeights.join(' ');
};

let showYAxisArea = function () {
  let gridColumnWidths = chartDefaults['grid-template-columns'].split(' ');
  gridColumnWidths[0] = "1.375em";
  chartDefaults['grid-template-columns'] = gridColumnWidths.join(' ');
};

let hideTickArea = function () {
  let gridColumnWidths = chartDefaults['grid-template-columns'].split(' ');
  gridColumnWidths[1] = 0;
  gridColumnWidths[2] = 0;
  chartDefaults['grid-template-columns'] = gridColumnWidths.join(' ');
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
  let gridColumnWidths = chartDefaults["grid-template-columns"].split(' ');
  gridColumnWidths[1] = tickColWidth + "px";
  chartDefaults["grid-template-columns"] = gridColumnWidths.join(' ');

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
  for (let category in data) {
    for (let sectionCategory in data[category]) {
      let height = data[category][sectionCategory].value / scale * 100;
      data[category][sectionCategory].height = height + "%";
    }
  }

  // Create and add each data item as a bar on the graph
  for (let category in data) {
    graph.append(drawBar(data[category], barOptions));
  }

  // Apply styling to the graph
  graph.css(Object.assign(graphDefaults, options));

  return graph;
};

const drawYAxisElements = function (yAxis, scale, tickInterval, options) {
  let name;
  let ticks, tickValues;
  const intervalHeight = tickInterval / scale * 100;

  if (yAxis) {
    showYAxisArea();
    name = createYAxis(yAxis);
  }

  options = Object.assign({showTicks: true}, options)
  if (options.showTicks) {
    ticks = generateTicks(intervalHeight, scale, tickInterval);
    tickValues = generateTickValues(intervalHeight, scale, tickInterval);
  } else {
    hideTickArea();
  }

  return [name, tickValues, ticks];
};

const drawXAxisElements = function (xAxis, labels, barOptions) {
  let labelsElement;
  let xAxisName;

  if (labels) {
    showLabelArea();
    labelsElement = createLabels(labels, barOptions);
  }

  if (xAxis) {
    showXAxisArea();
    xAxisName = createXAxis(xAxis);
  }

  return [labelsElement, xAxisName];
};

const drawChart = function (height, data, scale, tickInterval, options) {
  let chart = $("<article class='chart'></article>");
  let barOptions = extractBarOptions(options);
  let xAxis, yAxis;
  xAxis = extractXAxis(options);
  yAxis = extractYAxis(options);

  chart.append(drawGraph(data, scale, options, barOptions));
  chart.append(drawYAxisElements(yAxis, scale, tickInterval, options));
  chart.append(drawXAxisElements(xAxis, Object.keys(data), barOptions));
  chart.css(Object.assign(chartDefaults, { "height": height }));

  return chart;
};

const drawLegend = function (data, legendColors) {
  let legendEl = $("<aside class='legend'></aside>")
  let legendData = {};

  for (let xCat in data) {
    let xCatData = Object.keys(data[xCat]).reduce(function (obj, category, idx) {
      obj[category] = legendColors[idx];
      return obj;
    }, {});
    Object.assign(legendData, xCatData);
  }

  for (let item in legendData) {
    let legendItem = $("<div class='legend-item'></div>");
    let swatch = $("<div class'swatch'></div>");
    swatch.css({
      "height": "1em",
      "width": "1em",
      "float": "left",
      "background-color": legendData[item]
    });
    legendItem.append(swatch);
    let label = $("<div class='label'>" + item + "</div>")
    label.css({
      "padding-left": "1.5em",
      "font-size": "0.8em"
    });
    legendItem.append(label);
    legendEl.append(legendItem);
  }

  legendEl.css({
    "position": "absolute",
    "width": "100%",
    "top": "0",
    "left": "30px",
    // "border": "1px solid black",
    "display": "flex",
    "flex-direction": "column"
  });

  return legendEl;
};

const normalizeXCategory = function (data) {
  // 1. Turn a single number value into an array
  if (typeof data === 'number') {
    data = [ data ];
  }

  // 2. Turn an array into an object with the indexes as the property names
  if (Array.isArray(data)) {
    // [ 1, 2, 3 ] => { 0: 1, 1: 2, 2: 3 }
    data = data.reduce(function (obj, value, idx) {
      obj[idx] = value;
      return obj;
    }, {});
    displayLegend = false;
  }

  // 3. Turn the value of each category into an object with a value property
  for (let category in data) {
    data[category] = { value: data[category] };
  }

  return data;
};

const normalize = function (data) {
  // Turn array into an object with categories as properties
  if (Array.isArray(data)) {
    data = data.reduce(function (obj, value, idx) {
      obj[idx] = value;
      return obj;
    }, {});
  }

  // Ensure each category value is represented as an array, even if it only
  // contains a single value
  for (let category in data) {
    data[category] = normalizeXCategory(data[category]);
  }

  return data;
};

const getMaxFor = function (data) {
  // TODO: What if the data includes negative numbers?
  let max = 0;
  for (let category in data) {
    let categorySum = Object.values(data[category]).reduce(function (sum, num) {
      return sum + num.value;
    }, 0);

    max = categorySum > max ? categorySum : max;
  }
  return max;
};

const drawBarChart = function (data, options, element) {
  // Normalize the data
  data = normalize(data);

  // Determine scale
  const max = getMaxFor(data);
  const tickInterval = bestTick(max, 8);
  const scale = Math.ceil(max / tickInterval) * tickInterval;

  // Extract options
  let elementOptions = extractElementProperties(options);
  let elementProperties = Object.assign(elementDefaults, elementOptions);
  let legendColors = options.barColor;

  let titleHeight = 0;
  if (options.title) {
    let titleEl = $("<header class='title'><h1>" + options.title + "</h1></header>");
    let titleSize = options.titleSize || "";
    let titleColor = options.titleColor || "";
    element.append(titleEl);
    titleEl.css({ "font-size": titleSize, "color": titleColor });

    let h1 = $("h1", titleEl);
    titleHeight = h1.outerHeight(true);
    titleHeight -= parseInt(h1.css("margin-top"));
  }

  let chartHeight = parseInt(elementProperties.height) - titleHeight + "px";
  element.append(drawChart(chartHeight, data, scale, tickInterval, options));

  if (displayLegend) { element.append(drawLegend(data, legendColors)); }

  // Apply some styling to the element that holds the graph
  element.css(elementProperties);

  // Animate the bars
  $(".bar").animate({height: "100%"}, 333 /* Third of a second */);
};
