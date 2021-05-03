let values;
let div;
let svg;
let width;
let height;
let style;

let margin;
let chartWidth;
let chartHeight;
let chartArea;
let percentScale;


function renderDouble(sd, stateNames, yrs, activeYear) {

  let first = true;
  if(first == true) {
    
    setupDouble();
    first = false;
  }
  
	const state1 = sd.getRecord(stateNames[0], activeYear);
  const state2 = sd.getRecord(stateNames[1], activeYear);
  
	let yCounter = 30;
	values.forEach(function (v) {
		let value1 = state1[v];
		let value2 = state2[v];

		let percent1 = value1 / (value1 + value2);
		let percent2 = value2 / (value1 + value2);

		let text = v.replaceAll("_", " ");
		text = text.toLowerCase();
		text = capitalize_Words(text);

		chartArea
			.append("text")
			.attr("x", 0)
			.attr("y", yCounter - 25)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "hanging")
			.style("font", "14px Arial")
			.style("font-weight", "bold")
			.text(text);

		// chartArea
		// 	.append("rect")
		// 	.attr("x", 0)
		// 	.attr("y", yCounter)
		// 	.attr("width", percentScale(percent1))
		// 	.attr("height", 50)
		// 	.attr("fill", "#16b6eb");

		// chartArea
		// 	.append("rect")
		// 	.attr("x", percentScale(percent1))
		// 	.attr("y", yCounter)
		// 	.attr("width", percentScale(percent2))
		// 	.attr("height", 50)
		// 	.attr("fill", "#2979a3");


		// chartArea
		// 	.append("line")
		// 	.attr("x1", percentScale(0.5))
		// 	.attr("x2", percentScale(0.5))
		// 	.attr("y1", yCounter - 10)
		// 	.attr("y2", yCounter + 59)
		// 	.style("stroke-dasharray", "5,5") //dashed array for line
		// 	.style("stroke", "black");

		// chartArea
		// 	.append("text")
		// 	.attr("x", percentScale(percent1) - 5)
		// 	.attr("y", yCounter + 60)
		// 	.attr("text-anchor", "end")
		// 	.attr("dominant-baseline", "hanging")
		// 	.style("font", "14px Arial")
		// 	.text(value1);

		// chartArea
		// 	.append("text")
		// 	.attr("x", percentScale(percent1) + 5)
		// 	.attr("y", yCounter + 60)
		// 	.attr("text-anchor", "start")
		// 	.attr("dominant-baseline", "hanging")
		// 	.style("font", "14px Arial")
    // 	.text(value2);
    const leftName = "rect.left."+v;
    chartArea.selectAll(leftName)
      .join( enter => enter.append("rect")
                            .attr("x", 0)
                            .attr("y", yCounter)
                            .attr("width", percentScale(percent1))
                            .attr("height", 50)
                            .attr("fill", "#16b6eb")
                            .attr("opacity", 0)
                            .call( enter => enter.transition().attr('opacity', 1)),
              update => update.call( update => update.transition()
                                                    .attr("x", 0)
                                                    .attr("y", yCounter)
                                                    .attr("width", percentScale(percent1))
                                                    .attr("height", 50)
                                                    .attr("fill", "#16b6eb")),
              exit => exit.call( exit => exit.transition().attr('opacity', 0).remove));
    
    const rightName = "rect.right."+v;
    chartArea.selectAll(rightName)
      .join( enter => enter.append("rect")
                            .attr("x", percentScale(percent1))
                            .attr("y", yCounter)
                            .attr("width", percentScale(percent2))
                            .attr("height", 50)
                            .attr("fill", "#2979a3")
                            .attr("opacity", 0)
                            .call( enter => enter.transition().attr('opacity', 1)),
              update => update.call( update => update.transition()
                                                      .attr("x", percentScale(percent1))
                                                      .attr("y", yCounter)
                                                      .attr("width", percentScale(percent2))
                                                      .attr("height", 50)
                                                      .attr("fill", "#2979a3")),
              exit => exit.call( exit => exit.transition().attr('opacity', 0).remove));
    

    console.log(leftName);
    console.log(rightName);
		// chartArea
		// 	.append("rect")
		// 	.attr("x", percentScale(percent1))
		// 	.attr("y", yCounter)
		// 	.attr("width", percentScale(percent2))
		// 	.attr("height", 50)
		// 	.attr("fill", "#2979a3");


		chartArea
			.append("line")
			.attr("x1", percentScale(0.5))
			.attr("x2", percentScale(0.5))
			.attr("y1", yCounter - 10)
			.attr("y2", yCounter + 59)
			.style("stroke-dasharray", "5,5") //dashed array for line
			.style("stroke", "black");

		chartArea
			.append("text")
			.attr("x", percentScale(percent1) - 5)
			.attr("y", yCounter + 60)
			.attr("text-anchor", "end")
			.attr("dominant-baseline", "hanging")
			.style("font", "14px Arial")
			.text(value1);

		chartArea
			.append("text")
			.attr("x", percentScale(percent1) + 5)
			.attr("y", yCounter + 60)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "hanging")
			.style("font", "14px Arial")
			.text(value2);

		yCounter += 150;
	});
	return;
}

function setupDouble() {

	values = ["GDP", "GDP_PER_CAPITA", "INSTRUCTION_EXPENDITURE"];

	div = d3.select("div#screen_double");
  svg = d3.select("svg#doubleSvg");

  svg.selectAll('g').remove();
  
	width = svg.attr("width");
	height = svg.attr("height");
	style = svg.attr("style");
	margin = { top: 10, right: 10, bottom: 10, left: 10 };
	chartWidth = width - margin.left - margin.right;
	chartHeight = height - margin.top - margin.bottom;

  //let annotations = svg.append("g").attr("id", "annotations");
	chartArea = svg
		.append("g")
		.attr("id", "points")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    
  percentScale = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]);
  
}

function capitalize_Words(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
