// UMD Wrapper for compatibility with browsers and Node.js
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // Node.js or CommonJS
    module.exports = factory();
  } else {
    // Browser global
    global.GraphSVG = factory();
  }
})(this, function () {
  "use strict";

  class GraphSVG {
    constructor(containerId, options = {}) {
      // Find the container element
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
      }

      // Default options
      this.options = {
        width: options.width || 600,
        height: options.height || 400,
        barColor: options.barColor || "steelblue",
        labelColor: options.labelColor || "#000",
        margin: options.margin || 20,
        graphType: options.graphType || "bar", // 'bar', 'column', or 'pie'
        border: options.border || "2px solid black",
        pieColors: options.pieColors || [
          "#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0", "#f44336", "#009688", "#ffc107"
        ],
        ...options,
      };

      // Create the SVG element
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("width", this.options.width);
      this.svg.setAttribute("height", this.options.height);
      this.svg.style.border = this.options.border;
      this.container.appendChild(this.svg);
    }

    draw(data) {
      // Validate data
      if (!data || !data.labels || !data.values) {
        throw new Error("Data must include 'labels' and 'values' arrays.");
      }

      // Clear the SVG before rendering
      this.svg.innerHTML = "";

      if (this.options.graphType === "bar") {
        const maxValue = Math.max(...data.values);
        this.drawBarGraph(data.labels, data.values, maxValue);
      } else if (this.options.graphType === "column") {
        const maxValue = Math.max(...data.values);
        this.drawColumnGraph(data.labels, data.values, maxValue);
      } else if (this.options.graphType === "pie") {
        this.drawPieGraph(data.labels, data.values);
      }
    }

    updateBorder(style) {
      this.svg.style.border = style;
    }

    drawBarGraph(labels, values, maxValue) {
      const barWidth = (this.options.width - this.options.margin * 2) / labels.length;
      const chartHeight = this.options.height - this.options.margin * 2;

      labels.forEach((label, index) => {
        const value = values[index];
        const barHeight = (value / maxValue) * chartHeight;
        const x = this.options.margin + index * barWidth;
        const y = this.options.height - this.options.margin - barHeight;

        // Bar
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth - 5);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", this.options.barColor);

        // Label
        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        labelText.setAttribute("x", x + barWidth / 2 - 5);
        labelText.setAttribute("y", this.options.height - this.options.margin + 15);
        labelText.setAttribute("text-anchor", "middle");
        labelText.style.fill = this.options.labelColor;
        labelText.textContent = label;

        // Value
        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", x + barWidth / 2 - 5);
        valueText.setAttribute("y", y - 5);
        valueText.setAttribute("text-anchor", "middle");
        valueText.style.fill = "#000";
        valueText.textContent = value;

        this.svg.appendChild(bar);
        this.svg.appendChild(labelText);
        this.svg.appendChild(valueText);
      });
    }

    drawColumnGraph(labels, values, maxValue) {
      const columnWidth = (this.options.height - this.options.margin * 2) / labels.length;
      const chartWidth = this.options.width - this.options.margin * 2;

      labels.forEach((label, index) => {
        const value = values[index];
        const columnHeight = (value / maxValue) * chartWidth;
        const y = this.options.margin + index * columnWidth;
        const x = this.options.margin;

        // Column (horizontal bar)
        const column = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        column.setAttribute("x", x);
        column.setAttribute("y", y);
        column.setAttribute("width", columnHeight);
        column.setAttribute("height", columnWidth - 5);
        column.setAttribute("fill", this.options.barColor);

        // Label
        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        labelText.setAttribute("x", x - 5);
        labelText.setAttribute("y", y + columnWidth / 2 + 5);
        labelText.setAttribute("text-anchor", "end");
        labelText.setAttribute("dominant-baseline", "middle");
        labelText.style.fill = this.options.labelColor;
        labelText.textContent = label;

        // Value
        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", x + columnHeight + 5);
        valueText.setAttribute("y", y + columnWidth / 2 + 5);
        valueText.setAttribute("dominant-baseline", "middle");
        valueText.style.fill = "#000";
        valueText.textContent = value;

        this.svg.appendChild(column);
        this.svg.appendChild(labelText);
        this.svg.appendChild(valueText);
      });
    }

    drawPieGraph(labels, values) {
      const total = values.reduce((a, b) => a + b, 0);
      if (total === 0) return;

      const cx = this.options.width / 2;
      const cy = this.options.height / 2;
      const radius = Math.min(this.options.width, this.options.height) / 2 - this.options.margin;
      let startAngle = 0;

      values.forEach((value, i) => {
        const angle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;

        // Calculate coordinates
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);

        // Large arc flag
        const largeArcFlag = angle > Math.PI ? 1 : 0;

        // Path for the slice
        const pathData = [
          `M ${cx} ${cy}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", this.options.pieColors[i % this.options.pieColors.length]);
        this.svg.appendChild(path);

        // Label (optional: place at the middle angle)
        const midAngle = startAngle + angle / 2;
        const labelRadius = radius * 0.6;
        const lx = cx + labelRadius * Math.cos(midAngle);
        const ly = cy + labelRadius * Math.sin(midAngle);

        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        labelText.setAttribute("x", lx);
        labelText.setAttribute("y", ly);
        labelText.setAttribute("text-anchor", "middle");
        labelText.setAttribute("dominant-baseline", "middle");
        labelText.style.fill = this.options.labelColor;
        labelText.style.fontSize = "14px";
        labelText.textContent = labels[i];

        this.svg.appendChild(labelText);

        startAngle = endAngle;
      });
    }
  }

  return GraphSVG;
});
