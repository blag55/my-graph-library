// UMD Wrapper for compatibility with browsers and Node.js
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // Node.js or CommonJS
    module.exports = factory();
  } else {
    // Browser global
    global.GraphLib = factory();
  }
})(this, function () {
  "use strict";

  class GraphLib {
    constructor(containerId, config = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
      }

      this.config = config;
      this.data = null;

      // Initialize the graph container styles
      this.container.style.position = "relative";
      this.container.style.border = "1px solid #ccc";
    }

    updateData(data) {
      this.data = data;
      this.renderGraph();
    }

    renderGraph() {
      if (!this.data) {
        console.error("No data provided for rendering.");
        return;
      }

      // Clear the container
      this.container.innerHTML = "";

      // Render nodes
      const { nodes, edges } = this.data;
      nodes.forEach((node) => {
        const nodeElement = document.createElement("div");
        nodeElement.style.position = "absolute";
        nodeElement.style.width = "50px";
        nodeElement.style.height = "50px";
        nodeElement.style.backgroundColor = "lightblue";
        nodeElement.style.textAlign = "center";
        nodeElement.style.lineHeight = "50px";
        nodeElement.style.borderRadius = "50%";
        nodeElement.style.left = `${Math.random() * (this.container.clientWidth - 50)}px`;
        nodeElement.style.top = `${Math.random() * (this.container.clientHeight - 50)}px`;
        nodeElement.innerText = node.label;

        this.container.appendChild(nodeElement);
      });

      // Render edges (basic example)
      edges.forEach((edge) => {
        console.log(`Edge from ${edge.from} to ${edge.to}`);
        // Add edge rendering logic here if needed.
      });
    }
  }

  return GraphLib;
});
