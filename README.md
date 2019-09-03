# bar-chart-js

A javascript library (using jQuery) that creates html-and-css-only bar charts.
This is for my submission of the pre-course prep work for the Lighthouse Labs
Full-Stack Web Developer program.

## Usage

```javascript
drawBarChart(data, options, element);
```

`data` is an array of values to chart.

`options` is a javascript literal that can contain the following properties:

* `width`: a string specifying the width of the chart. Must be a CSS unit (px,
  %, em, etc.).
* `height`: a string specifying the height of the chart. Must be a CSS unit (px,
  %, em, etc.).
* `xAxisName`: a string specifying the name of the x-axis to display on the
  chart.
* `yAxisName`: a string specifying the name of the y-axis to display on the
  chart.
* `valueLabelPosition`: one of "top" (default), "center", or "bottom",
  specifying the positioning of the value label for each bar on the bar chart.
* `valueLabelColor`: a string specifying the color of the value label on each
  bar. Must be any valid CSS color (named color, hex value, etc.).
* `barColor`: a string specifying the color of the bars on the chart. Must be
  any valid CSS color (named color, hex value, etc.).
* `barSpacing`: a string specifying the space between (and around) the bars of
  the chart. Must be a CSS unit (px, %, em, etc.).

`element` is the html (or jQuery) element that you want the chart to be inserted
into.

### Examples

```javascript
drawBarChart([1, 2, 3, 4, 5], {
  "height": "500px",
  "labelPosition": "bottom"
});
```
