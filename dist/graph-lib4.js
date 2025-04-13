// UMD Wrapper for compatibility with browsers and Node.js
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // Node.js or CommonJS
    module.exports = factory();
  } else {
    // Browser global
    global.BarGraph = factory();
  }
})(this, function () {
  "use strict";

  class BarGraph {
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
        ...options,
      };

      // Apply styles to the container
      this.container.style.position = "relative";
      this.container.style.width = `${this.options.width}px`;
      this.container.style.height = `${this.options.height}px`;
      this.container.style.border = "1px solid #ccc";
      this.container.style.padding = "20px";
      this.container.style.boxSizing = "border-box";
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

      // Clear the container before rendering
      this.container.innerHTML = "";

      // Create a wrapper for the graph
      const graphWrapper = document.createElement("div");
      graphWrapper.style.display = "flex";
      graphWrapper.style.alignItems = "flex-end";
      graphWrapper.style.justifyContent = "space-between";
      graphWrapper.style.height = `${this.options.height - 40}px`; // Leave space for labels

      // Create bars and labels
      values.forEach((value, index) => {
        const barHeight = (value / maxValue) * (this.options.height - 40); // Scale height based on max value

        const barWrapper = document.createElement("div");
        barWrapper.style.display = "flex";
        barWrapper.style.flexDirection = "column";
        barWrapper.style.alignItems = "center";

        const bar = document.createElement("div");
        bar.style.height = `${barHeight}px`;
        bar.style.width = "50px";
        bar.style.backgroundColor = this.options.barColor;
        bar.style.marginBottom = "5px"; // Space between bar and label

        const label = document.createElement("div");
        label.textContent = labels[index];
        label.style.color = this.options.labelColor;

        // Add the bar and label to the wrapper
        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);

        // Add the wrapper to the graph container
        graphWrapper.appendChild(barWrapper);
      });

      // Append the graph to the container
      this.container.appendChild(graphWrapper);
    }
  }

  return BarGraph;
});
