# bar-chart-js

A javascript library (using jQuery) that creates html-and-css-only bar charts.
This is for my submission of the pre-course prep work for the Lighthouse Labs
Full-Stack Web Developer program.

## Usage

```javascript
drawBarChart(data, options, element);
```

`data` can be either an array of values to chart, or an object literal with
labels as keys, and values to chart. With the latter, each bar is labeled.

`options` is a javascript literal that can contain the following properties:

* `title`: a string specifying the title to display for the chart
* `width`: (default `500px`) a string specifying the width of the chart. Must be
  a CSS unit (px, %, em, etc.).
* `height`: (default `300px`) a string specifying the height of the chart. Must
  be a CSS unit (px, %, em, etc.).
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
* `showTicks`: a boolean value (default is `true`) specifying whether to show
  tick marks and values on the y-axis

`element` is the html (or jQuery) element that you want the chart to be inserted
into.

### Examples

```javascript
drawBarChart([1, 2, 3, 4, 5], {
  "height": "500px",
  "labelPosition": "bottom"
});
```
