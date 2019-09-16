const ToChartData = (data) => {
  let values = {};

  if (typeof data === "number") {
    values[data] = { value: data, height: undefined };
  } else if (Array.isArray(data)) {
    values = data.reduce((obj, val, idx) => {
      obj[idx] = ToChartData(val);
      return obj;
    }, {});
  } else {
    values = Object.keys(data).reduce((obj, category) => {
      obj[category] = ToChartData(data[category]);
      return obj;
    }, {});
  }

  return values;
};

function ChartData(data) {
  this.maxTicks = 8;
  this.raw = ToChartData(data);
  this.xCategories = Object.keys(this.raw);
}

function ChartSettings(options) {
  this.containerCss = {
    position: "relative",
    width: options.width || "500px",
    height: options.height || "300px"
  };

  this.chartCss = {
    display: "grid",
    "grid-template-areas":
      "'y-axis tick-values tick-marks graph'" +
      "'empty empty empty labels'" +
      "'empty empty empty x-axis'",
    "grid-template-rows": "auto 0 0",
    "grid-template-columns": "0 0 0 auto"
  };

  this.graphCss = {
    display: "flex",
    "grid-area": "graph",
    "justify-content": "space-evenly",
    "align-items": "flex-end",
    height: "100%",
    "border-bottom": "1px solid black"
  };

  this.barCss = {
    display: "flex",
    "flex-direction": "column-reverse",
    "align-items": "end",
    "box-sizing": "border-box",
    width: "100%"
  };

  this.barSectionCss = {
    display: "flex",
    "justify-content": "center",
    width: "100%",
    "box-sizing": "border-box",
    "background-color": "blue"
  };

  this.valueCss = {
    padding: "5px",
    color: "white",
    "font-family": "Helvetica, Georgia, sans-serif"
  };

  this.legendCss = {
    position: "absolute",
    display: "flex",
    "flex-direction": "column"
  };

  this.title = {
    text: options.title,
    size: options.titleSize,
    color: options.titleColor
  };

  this.xAxis = { name: options.xAxisName };
  this.yAxis = { name: options.yAxisName };

  this.valueLabel = {
    position: options.valueLabelPosition || "top",
    color: options.valueLabelColor
  };

  this.bar = {
    color: options.barColor,
    spacing: options.barSpacing
  };

  this.showTicks = options.showTicks || false;

  this.legend = { position: options.legendPosition };
}

function BarChart(data, options, element) {
  this.data = new ChartData(data);
  this.settings = new ChartSettings(options);
  this.container = $(element);
  this.container.css(this.settings.containerCss);
}

BarChart.prototype.drawTitle = function () {
  let titleArea = $("<header class='title'></header>");
  let titleEl = $("<h1>" + this.settings.title.text + "</h1>");

  titleEl.css({
    "font-size": this.settings.title.size,
    color: this.settings.title.color
  });

  this.container.append(titleEl);

  this.settings.chartCss.height = this.settings.containerCss.height -
    (titleEl.outerHeight(true) - parseInt(titleEl.css("margin-top"), 10));
};

BarChart.prototype.drawBar = function (barData) {
  let bar = Object.keys(barData).reduce((barEl, cat, idx) => {
    let barSection = $("<div class='bar-section'></div>");
    let labelText = barData[cat].value.toLocaleString();
    let label = $("<div class='value'>" + labelText + "</div>");

    return barEl;
  }, $("<div class='bar'></div>"));
};

BarChart.prototype.drawGraph = function () {
  for (let bar in this.data.raw) {
    for (let category in this.data.raw[bar]) {
      let height = this.data.raw[bar][category].value / this.data.scale * 100;
      this.data.raw[bar][category].height = height + "%";
    }
  }

  let graph = this.data.xCategories.reduce((el, xCategory) => {
    el.append(this.drawBar(this.data.raw[xCategory]));
    return el;
  }, $("<div class='graph'></div>"));
};

BarChart.prototype.drawChart = function () {
  let chart = $("<article class='chart'></article>");

  chart.append(this.drawGraph());
  // chart.append(drawYAxisElements());
  // chart.append(drawXAxisElements());

  chart.css(this.settings.chartCss);
  this.container.append(chart);
};

BarChart.prototype.draw = function () {
  if (this.settings.title.text) {
    this.drawTitle();
  }

  this.drawChart();
};

const drawBarChart = (data, options, element) => {
  let barChart = new BarChart(data, options, element);

  barChart.draw();
};
