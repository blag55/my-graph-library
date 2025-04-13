// UMD Wrapper 3for compatibility with browsers and Node.js
draw(data) {
  if (!data || !data.labels || !data.values) {
    throw new Error("Data must include 'labels' and 'values' arrays.");
  }

  const { labels, values } = data;
  const maxValue = Math.max(...values);

  console.log("Labels:", labels); // Log labels
  console.log("Values:", values); // Log values
  console.log("Max Value:", maxValue); // Log max value

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
  graphWrapper.style.height = `${this.options.height - 40}px`;
  graphWrapper.style.backgroundColor = "#f9f9f9"; // Add a background for visibility

  values.forEach((value, index) => {
    const barHeight = (value / maxValue) * 100;

    console.log(`Bar ${index}: Height ${barHeight}%`); // Log bar height

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

  // Append the graph to the container
  this.container.appendChild(graphWrapper);
}
