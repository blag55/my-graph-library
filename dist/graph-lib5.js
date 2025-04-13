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
        borderColor: options.borderColor || "black",
        ...options,
      };

      // Apply styles to the container
      this.container.style.display = "flex";
      this.container.style.justifyContent = "space-around";
      this.container.style.alignItems = "flex-end";
      this.container.style.width = `${this.options.width}px`;
      this.container.style.height = `${this.options.height}px`;
      this.container.style.margin = "20px auto";
      this.container.style.border = `2px solid ${this.options.borderColor}`;
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

      // Create bars and labels
      values.forEach((value, index) => {
        // Create a wrapper for the bar and its label
        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";
        barWrapper.style.display = "flex";
        barWrapper.style.flexDirection = "column";
        barWrapper.style.alignItems = "center";

        // Create the bar element
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = "50px";
        bar.style.backgroundColor = this.options.barColor;
        bar.style.textAlign = "center";
        bar.style.color = "#fff";
        bar.style.marginBottom = "5px"; // Space between bar and label
        bar.style.transition = "height 0.3s ease";

        // Scale height based on max value and container height
        const containerHeight = this.options.height - 40; // Leave space for labels
        bar.style.height = `${(value / maxValue) * containerHeight}px`;
        bar.textContent = value;

        // Create the label element
        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = labels[index];
        label.style.color = this.options.labelColor;

        // Add the bar and label to the wrapper
        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);

        // Add the wrapper to the graph container
        this.container.appendChild(barWrapper);
      });
    }
  }

  return BarGraph;
});
