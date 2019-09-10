drawBarChart([ 1, 2, 3, 4, 5 ], {}, $("#basic"));

drawBarChart([ 1, 2, 3, 4, 5 ], {
  title: "Dunder Mifflin&mdash;Quabity Assuance Over Time",
  height: "500px",
  width: "800px",
  barSpacing: "5%",
  barColor: "#ace",
  showTicks: true,
  yAxisName: "Blunders (per month)"
}, $("#options"));

drawBarChart({
  "Northwest": { "Qtr 1": 3767341, "Qtr 2": 3298694, "Qtr 3": 2448772, "Qtr 4": 1814281 },
  "Northeast": { "Qtr 1": 2857163, "Qtr 2": 3607148, "Qtr 3": 1857156, "Qtr 4": 1983931 },
  "Central": { "Qtr 1": 3677108, "Qtr 2": 3205014, "Qtr 3": 2390120, "Qtr 4": 1762757 },
  "Southwest": { "Qtr 1": 2851432, "Qtr 2": 3571335, "Qtr 3": 1932932, "Qtr 4": 1653192 }
}, {
  title: "Sales by Division and by Quarter&mdash;2018",
  yAxisName: "Dollars (CAD)",
  xAxisName: "Division",
  showTicks: true,
  barColor: [ "#ace", "#eac", "#cea", "#cae" ],
  legendPosition: { top: "2em", right: "100px" }
}, $("#stacked-extra"));
