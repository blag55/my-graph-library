(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
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

      this.options = {
        width: options.width || 600,
        height: options.height || 400,
        barColor: options.barColor || "steelblue",
        axisColor: options.axisColor || "#333",
        ...options,
      };

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

      if (maxValue === 0) {
        console.error("All values are zero; no bars to display.");
        return;
      }

      this.container.innerHTML = "";

      const graphWrapper = document.createElement("div");
      graphWrapper.style.display = "flex";
      graphWrapper.style.alignItems = "flex-end";
      graphWrapper.style.justifyContent = "space-between";
      graphWrapper.style.height = `${this.options.height - 40}px`;

      values.forEach((value, index) => {
        const barHeight = (value / maxValue) * 100;

        const barContainer = document.createElement("div");
        barContainer.style.flex = "1";
        barContainer.style.margin = "0 5px";
        barContainer.style.textAlign = "center";

        const bar = document.createElement("div");
        bar.style.height = `${barHeight}%`;
        bar.style.width = "100%";
        bar.style.backgroundColor = this.options.barColor;
        bar.style.border = "1px solid black"; // Add a border for better visibility
        bar.style.transition = "height 0.3s ease";

        const label = document.createElement("span");
        label.textContent = labels[index];
        label.style.display = "block";
        label.style.marginTop = "10px";

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        graphWrapper.appendChild(barContainer);
      });

      this.container.appendChild(graphWrapper);
    }
  }

  return BarGraph;
});
