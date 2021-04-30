/**
 * CODE BELOW OBTAINED FROM LECTURE NOTES AND MODIFIED SLIGHTLY FOR STYLING.
 */

// Function needs a d3 selected SVG canvas where it will draw the legend and a source color scale
function drawLegend(legend, legendColorScale) {
  // Bonus code here to draw an adaptive gradient legend so we can see different color scales for choropleth maps
  //  Credit Prof. Rz if you are basing a legend on this structure, and note SERIOUS PERFORMANCE CONSIDERATIONS

  //const legend = d3.select("#colorLegend");
  const legendWidth = legend.attr('width');
  const legendHeight = legend.attr('height');
  const legendMinMax = d3.extent(legendColorScale.domain()); // way to recover the minMax from most kinds of scales
  const barHeight = 20;
  const stepSize = 4; // warning, not using a canvas element so lots of rect tags will be created for low stepSize, causing issues with performance
  // Extend the minmax by 1 in either direction to expose more features
  const pixelScale = d3
    .scaleLinear()
    .domain([0, legendWidth - 40])
    .range([legendMinMax[0] - 1, legendMinMax[1] + 1]); // In this case the "data" are pixels, and we get numbers to use in colorScale
  const barScale = d3
    .scaleLinear()
    .domain([legendMinMax[0] - 1, legendMinMax[1] + 1])
    .range([0, legendWidth - 40]);
  const barAxis = d3.axisBottom(barScale);
  // Check if we're using a quantile scale - if so, we can do better
  if (legendColorScale.hasOwnProperty('quantiles')) {
    // Use the quantile breakpoints plus the min and max of the scale as tick values
    barAxis.tickValues(legendColorScale.quantiles().concat(legendMinMax));
  }
  legend
    .append('g')
    .attr('class', 'colorbar axis')
    .attr('transform', 'translate(' + 20 + ',' + (barHeight + 5) + ')')
    .call(barAxis);
  // Draw rects of color down the bar
  let bar = legend
    .append('g')
    .attr('transform', 'translate(' + 20 + ',' + 0 + ')');
  for (let i = 0; i < legendWidth - 40; i = i + stepSize) {
    bar
      .append('rect')
      .attr('x', i)
      .attr('y', 0)
      .attr('width', stepSize)
      .attr('height', barHeight)
      .style('fill', legendColorScale(pixelScale(i))); // pixels => countData => color
  }
  // Put lines in to mark actual min and max of our data
  bar
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', 3)
    .attr('x1', barScale(legendMinMax[0]))
    .attr('x2', barScale(legendMinMax[0]))
    .attr('y1', 0)
    .attr('y1', barHeight + 4);
  bar
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', 3)
    .attr('x1', barScale(legendMinMax[1]))
    .attr('x2', barScale(legendMinMax[1]))
    .attr('y1', 0)
    .attr('y1', barHeight + 4);
}
