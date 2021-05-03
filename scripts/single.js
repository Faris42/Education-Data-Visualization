/**
 * Function to render the entire page for the single state view. Renders
 * mosaic at top, graph, state info box, and all labels/text
 * @param {StateDict} sd - object that contains all state/year information
 * @param {string} stateName - name of state being viewed
 * @param {list} yrs - a list of all the years we have data for
 * @param {number} activeYear - the active year on the slider
 * @returns
 */
function renderSingle(sd, stateName, yrs, activeYear) {
	const records = sd.getRecords(stateName);
	const currRecord = records.years[activeYear];

	// fill in the labels in the info box with info from record, use helper
	// functions to format numbers accordingly
	d3.select("#single_gdp").text(floatToDollars(currRecord.GDP * 1000000));
	d3.select("#single_gdp_per").text(
		floatToDollars(currRecord.GDP_PER_CAPITA * 1000000)
	);
	d3.select("#single_scores").text(
		decimalToPercent(currRecord.AVG_SCORE_PERCENTAGE)
	);
	d3.select("#single_expenditures").text(
		floatToDollars(currRecord.EXPENDITURE_PER_STUDENT * 1000)
	);
	d3.select("#single_pop").text(numberWithCommas(currRecord.POPULATION));
	d3.select("#single_enroll").text(numberWithCommas(currRecord.ENROLL));

	other_costs =
		currRecord.OTHER_EXPENDITURE +
		(currRecord.TOTAL_EXPENDITURE -
			(currRecord.INSTRUCTION_EXPENDITURE +
				currRecord.CAPITAL_OUTLAY_EXPENDITURE +
				currRecord.OTHER_EXPENDITURE +
				currRecord.SUPPORT_SERVICES_EXPENDITURE));

	const barSvg = d3.select("svg#singleBarSvg");
	const graphSvg = d3.select("svg#singleGraphSvg");

	// clear any existing elements
	barSvg.selectAll("*").remove();
	graphSvg.selectAll("*").remove();

	// ====================BAR SVG==========================

	let width = barSvg.attr("width");
	let height = barSvg.attr("height");

	let margin = { top: 0, right: 0, bottom: 0, left: 0 };
	let strokeWidth = 3;
	let chartWidth = width - margin.left - margin.right;
	let chartHeight = height - margin.top - margin.bottom;

	// Renders all rectangles for mosaic at top
	const percentScale = d3
		.scaleLinear()
		.domain([0, currRecord.TOTAL_EXPENDITURE])
		.range([0, chartWidth]);

	const mosaic = barSvg
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	mosaic
		.append("rect")
		.attr("x", 0)
		.attr("y", 5)
		.attr("width", percentScale(currRecord.INSTRUCTION_EXPENDITURE))
		.attr("height", 50)
		.attr("fill", "#202c49");

	mosaic
		.append("rect")
		.attr("x", percentScale(currRecord.INSTRUCTION_EXPENDITURE))
		.attr("y", 5)
		.attr("width", percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE))
		.attr("height", 50)
		.attr("fill", "#274c6f");

	mosaic
		.append("rect")
		.attr(
			"x",
			percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
				percentScale(currRecord.INSTRUCTION_EXPENDITURE)
		)
		.attr("y", 5)
		.attr("width", percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE))
		.attr("height", 50)
		.attr("fill", "#16b6eb");

	mosaic
		.append("rect")
		.attr(
			"x",
			percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
				percentScale(currRecord.INSTRUCTION_EXPENDITURE) +
				percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE)
		)
		.attr("y", 5)
		.attr("width", percentScale(other_costs))
		.attr("height", 50)
		.attr("fill", "#2979a3");

	// renders percentage labels for the mosaic
	const percentages = barSvg
		.append("g")
		.attr("transform", `translate(0,${margin.top + 75} )`);

	percentages
		.append("text")
		.attr("x", percentScale(currRecord.INSTRUCTION_EXPENDITURE) / 2)
		.text(
			decimalToPercent(
				currRecord.INSTRUCTION_EXPENDITURE / currRecord.TOTAL_EXPENDITURE
			)
		)
		.attr("text-anchor", "middle")
		.style("fill", "white");
	percentages
		.append("text")
		.attr(
			"x",
			percentScale(currRecord.INSTRUCTION_EXPENDITURE) +
				percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) / 2
		)
		.text(
			decimalToPercent(
				currRecord.CAPITAL_OUTLAY_EXPENDITURE / currRecord.TOTAL_EXPENDITURE
			)
		)
		.attr("text-anchor", "middle")
		.style("fill", "white");
	percentages
		.append("text")
		.attr(
			"x",
			percentScale(currRecord.INSTRUCTION_EXPENDITURE) +
				percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
				percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE) / 2
		)
		.text(
			decimalToPercent(
				currRecord.SUPPORT_SERVICES_EXPENDITURE / currRecord.TOTAL_EXPENDITURE
			)
		)
		.attr("text-anchor", "middle")
		.style("fill", "white");

	let subtract = 0;
	if (other_costs / currRecord.TOTAL_EXPENDITURE < 0.08) {
		subtract = 5;
	}
	percentages
		.append("text")
		.attr(
			"x",
			percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
				percentScale(currRecord.INSTRUCTION_EXPENDITURE) +
				percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE) +
				percentScale(other_costs) / 2 -
				subtract
		)
		.attr("text-anchor", "middle")
		.text(decimalToPercent(other_costs / currRecord.TOTAL_EXPENDITURE))
		.style("fill", "white");

	// renders legend for mosaic
	const legend = barSvg
		.append("g")
		.attr("transform", `translate(${margin.left + 50},${margin.top + 85} )`);

	legend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", "#202c49");

	legend
		.append("text")
		.attr("x", 14)
		.attr("y", 10)
		.text("Instruction")
		.style("fill", "white");

	legend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 100)
		.style("fill", "#274c6f");

	legend
		.append("text")
		.attr("x", 114)
		.attr("y", 10)
		.text("Capital Outlay")
		.style("fill", "white");

	legend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 230)
		.style("fill", "#16b6eb");

	legend
		.append("text")
		.attr("x", 244)
		.attr("y", 10)
		.text("Support Services")
		.style("fill", "white");

	legend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 380)
		.style("fill", "#2979a3");

	legend
		.append("text")
		.attr("x", 394)
		.attr("y", 10)
		.text("Other")
		.style("fill", "white");

	// ====================GRAPH SVG==========================

	width = graphSvg.attr("width");
	height = graphSvg.attr("height");

	margin = { top: 0, right: 15, bottom: 30, left: 15 };
	chartWidth = width - margin.left - margin.right;
	chartHeight = height - margin.top - margin.bottom;

	const graph = graphSvg
		.append("g")
		.attr("transform", "translate(" + margin.left + ",0)");

	// graphSvg
	// 	.append("text")
	// 	.attr("x", 0)
	// 	.attr("y", 80)
	// 	.text("GDP per Capita vs. Expenditure per Student vs Average Student Score")
	// 	.style("fill", "white")
	// 	.attr("font-weight", "bold")
	// 	.attr("font-size", "14px");

	const expendExtent = d3.extent(
		yrs,
		(d) => records.years[d].EXPENDITURE_PER_STUDENT
	);

	const gdpExtent = d3.extent(
		yrs,
		(d) => records.years[d].GDP_PER_CAPITA * 1000
	);

	const scoreExtent = d3.extent(
		yrs,
		(d) => records.years[d].AVG_SCORE_PERCENTAGE
	);

	const moneyScale = d3
		.scaleLinear()
		.domain([
			Math.min(expendExtent[0], gdpExtent[0]),
			Math.max(expendExtent[1], gdpExtent[1]),
		])
		.range([chartHeight - margin.bottom, 15]);

	const scoreScale = d3
		.scaleLinear()
		.domain(scoreExtent)
		.range([chartHeight - margin.bottom, 15]);

	const yearScale = d3
		.scaleLinear()
		.domain([2003, 2015])
		.range([margin.right + 30, chartWidth - margin.right - 50]);

	let leftAxis = d3.axisLeft(moneyScale).tickFormat(d3.format("$,")).ticks(6);
	graph
		.append("g")
		.lower()
		.attr("class", "y axis")
		.attr("transform", "translate(" + (margin.left + 25) + "," + 0 + ")")
		.call(leftAxis);

	graphSvg
		.append("text")
		.attr("x", -chartHeight / 2)
		.attr("y", margin.left + 3)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text("Dollars (thousands)");

	let rightAxis = d3
		.axisRight(scoreScale)
		.tickFormat((d) => decimalToPercent(d))
		.ticks(5);
	graphSvg
		.append("g")
		.lower()
		.attr("class", "y axis")
		.attr(
			"transform",
			"translate(" + (chartWidth - margin.right - 30) + "," + 0 + ")"
		)
		.style("color", "#16b6eb")
		.call(rightAxis);

	graphSvg
		.append("text")
		.attr("x", chartHeight / 2)
		.attr("y", -chartWidth - margin.left + 5)
		.attr("transform", "rotate(90)")
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text("Avg. Score");

	let bottomAxis = d3.axisBottom(yearScale).tickFormat(d3.format("")).ticks(7);
	graph
		.append("g")
		.lower()
		.attr("class", "x axis")
		.attr(
			"transform",
			"translate(" + 0 + "," + (chartHeight - margin.bottom + 5) + ")"
		)
		.call(bottomAxis);

	graph
		.append("path")
		.datum(yrs)
		.attr("fill", "none")
		.attr("stroke", "yellow")
		.attr("stroke-width", 3)
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return yearScale(d);
				})
				.y(function (d) {
					return moneyScale(records.years[d].EXPENDITURE_PER_STUDENT);
				})
		);

	graph
		.append("path")
		.datum(yrs)
		.attr("fill", "none")
		.attr("stroke", "green")
		.attr("stroke-width", 3)
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return yearScale(d);
				})
				.y(function (d) {
					return moneyScale(records.years[d].GDP_PER_CAPITA * 1000);
				})
		);

	graph
		.append("path")
		.datum(yrs)
		.attr("fill", "none")
		.attr("stroke", "#16b6eb")
		.attr("stroke-width", 3)
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return yearScale(d);
				})
				.y(function (d) {
					return scoreScale(records.years[d].AVG_SCORE_PERCENTAGE);
				})
		);

	graphSvg.select("#timeMarker").remove();

	graph
		.append("line")
		.attr("fill", "none")
		.attr("class", "line")
		.attr("stroke", "red")
		.attr("stroke-width", 1.5)
		.style("stroke-dasharray", "6, 3")
		.attr("id", "timeMarker")
		.attr("x1", yearScale(activeYear))
		.attr("x2", yearScale(activeYear))
		.attr("y1", chartHeight - margin.bottom)
		.attr("y2", 15);

	const graphLegend = graphSvg
		.append("g")
		.attr("transform", `translate(${margin.left},${chartHeight - 5} )`);

	graphLegend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 10)
		.attr("y", 5)
		.style("fill", "green");

	graphLegend
		.append("text")
		.attr("x", 24)
		.attr("y", 15)
		.text("GDP per capita")
		.style("fill", "white");

	graphLegend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 100)
		.attr("y", 22)
		.style("fill", "yellow");

	graphLegend
		.append("text")
		.attr("x", 114)
		.attr("y", 32)
		.text("Education expenditure")
		.style("fill", "white");

	graphLegend
		.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("x", 186)
		.attr("y", 5)
		.style("fill", "#16b6eb");

	graphLegend
		.append("text")
		.attr("x", 200)
		.attr("y", 15)
		.text("Average Student Score")
		.style("fill", "white");

	// graphLegend
	// 	.append("rect")
	// 	.attr("width", 10)
	// 	.attr("height", 10)
	// 	.attr("x", 380)
	// 	.style("fill", "#2979a3");

	// graphLegend
	// 	.append("text")
	// 	.attr("x", 394)
	// 	.attr("y", 10)
	// 	.text("Other")
	// 	.style("fill", "white");

	return;
}
