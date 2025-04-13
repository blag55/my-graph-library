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
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
      }

      // Default options
      this.options = {
        width: options.width || 600,
        height: options.height || 400,
        barColor: options.barColor || "steelblue",
        axisColor: options.axisColor || "#333",
        ...options,
      };

      // Initialize the container styles
      this.container.style.position = "relative";
      this.container.style.width = `${this.options.width}px`;
      this.container.style.height = `${this.options.height}px`;
      this.container.style.border = "1px solid #ccc";
      this.container.style.padding = "20px";
    }

    draw(data) {
      if (!data || !data.labels || !data.values) {
        throw new Error("Data must include 'labels' and 'values' arrays.");
      }

      const { labels, values } = data;
      const maxValue = Math.max(...values);

      // Clear the container before rendering
      this.container.innerHTML = "";

      // Create a wrapper for the graph
      const graphWrapper = document.createElement("div");
      graphWrapper.style.display = "flex";
      graphWrapper.style.alignItems = "flex-end";
      graphWrapper.style.justifyContent = "space-between";
      graphWrapper.style.height = `${this.options.height - 40}px`; // Leave space for labels

      // Create bars
      values.forEach((value, index) => {
        const barHeight = (value / maxValue) * 100; // Scale height as percentage

        const barContainer = document.createElement("div");
        barContainer.style.flex = "1";
        barContainer.style.margin = "0 5px";
        barContainer.style.textAlign = "center";

        const bar = document.createElement("div");
        bar.style.height = `${barHeight}%`;
        bar.style.backgroundColor = this.options.barColor;
        bar.style.transition = "height 0.3s ease";

        const label = document.createElement("span");
        label.textContent = labels[index];
        label.style.display = "block";
        label.style.marginTop = "10px";

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        graphWrapper.appendChild(barContainer);
      });

      // Append the graph to the container
      this.container.appendChild(graphWrapper);
    }
  }

  return BarGraph;
});
