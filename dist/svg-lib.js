// UMD Wrapper for compatibility with browsers and Node.js
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // Node.js or CommonJS
    module.exports = factory();
  } else {
    // Browser global
    global.BarGraphSVG = factory();
  }
})(this, function () {
  "use strict";

  class BarGraphSVG {
    constructor(containerId, options = {}) {
      // Find the container element
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
      }

      // Default options for the bar graph
      this.options = {
        width: options.width || 600,
        height: options.height || 400,
        barColor: options.barColor || "steelblue",
        labelColor: options.labelColor || "#000",
        margin: options.margin || 20,
        ...options,
      };

      // Create the SVG element
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("width", this.options.width);
      this.svg.setAttribute("height", this.options.height);
      this.svg.style.border = "2px solid black";
      this.container.appendChild(this.svg);
    }

    draw(data) {
      // Validate data
      if (!data || !data.labels || !data.values) {
        throw new Error("Data must include 'labels' and 'values' arrays.");
      }

      const { labels, values } = data;
      const maxValue = Math.max(...values);

      if (maxValue === 0) {
        console.error("All values are zero; no bars to display.");
        return;
      }

      const barWidth = (this.options.width - this.options.margin * 2) / labels.length;
      const chartHeight = this.options.height - this.options.margin * 2;

      // Clear the SVG before rendering
      this.svg.innerHTML = "";

      labels.forEach((label, index) => {
        const value = values[index];
        const barHeight = (value / maxValue) * chartHeight;

        // Calculate positions
        const x = this.options.margin + index * barWidth;
        const y = this.options.height - this.options.margin - barHeight;

        // Create the bar (rect element)
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth - 5); // Add spacing between bars
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", this.options.barColor);

        // Create the label (text element)
        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        labelText.setAttribute("x", x + barWidth / 2 - 5);
        labelText.setAttribute("y", this.options.height - this.options.margin + 15); // Position below bars
        labelText.setAttribute("text-anchor", "middle");
        labelText.style.fill = this.options.labelColor;
        labelText.textContent = label;

        // Create the value text above the bar
        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", x + barWidth / 2 - 5);
        valueText.setAttribute("y", y - 5); // Position above bars
        valueText.setAttribute("text-anchor", "middle");
        valueText.style.fill = "#000";
        valueText.textContent = value;

        // Append elements to the SVG
        this.svg.appendChild(bar);
        this.svg.appendChild(labelText);
        this.svg.appendChild(valueText);
      });
    }
  }

  return BarGraphSVG;
});
