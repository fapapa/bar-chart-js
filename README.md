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
* `valueLabelPosition`: one of "top" (default), "center", or "bottom",
  specifying the positioning of the value label for each bar on the bar chart.

`element` is the html (or jQuery) element that you want the chart to be inserted
into.

### Examples

```javascript
drawBarChart([1, 2, 3, 4, 5], {
  "height": "500px",
  "labelPosition": "bottom"
});
```
