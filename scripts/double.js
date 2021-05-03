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

let first = true;

/**
 * Update method for changing the mosaic graphs for double analysis.
 */
function renderDouble(sd, stateNames, yrs, activeYear) {
	// Code to allow constructor to be called once.

	if (first == true) {
		setupDouble();
		first = false;
	}

	// Getting the state records for analysis
	const state1 = sd.getRecord(stateNames[0], activeYear);
	const state2 = sd.getRecord(stateNames[1], activeYear);
	const labelMargin = 10;

	// ycounter for changing the y position of all of the plots
	let yCounter = 30;
	// Function that loops through the different values we want to plot
	values.forEach(function (v) {
		let value1 = state1[v];
		let value2 = state2[v];

		// Changing numbers to their raw form.
		if (v.includes("GDP")) {
			value1 *= 1000000;
			value2 *= 1000000;
		} else if (v.includes("EXPENDITURE")) {
			value1 *= 1000;
			value2 *= 1000;
		}
		// Gets the relative percents of the two values to each other.
		let percent1 = value1 / (value1 + value2);
		let percent2 = value2 / (value1 + value2);

		// Text formatting
		let text = v.replaceAll("_", " ");
		if (text.includes("ENROLL")) {
			text = "ENROLLMENT OF STUDENTS";
		}

		text = text.toLowerCase();
		text = capitalizeWords(text);

		// Value type
		chartArea
			.append("text")
			.attr("x", 0)
			.attr("y", yCounter - 25)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "hanging")
			.attr("class", "comparison_header")
			.text(text);

		// Mosaic plot rectangles
		chartArea
			.append("rect")
			.attr("x", 0)
			.attr("y", yCounter)
			.attr("width", percentScale(percent1))
			.attr("height", 30)
			.attr("fill", "#16b6eb");

		chartArea
			.append("rect")
			.attr("x", percentScale(percent1))
			.attr("y", yCounter)
			.attr("width", percentScale(percent2))
			.attr("height", 30)
			.attr("fill", "#202c49");

		// Dashed line to show halfway point
		chartArea
			.append("line")
			.attr("x1", percentScale(0.5))
			.attr("x2", percentScale(0.5))
			.attr("y1", yCounter - 10)
			.attr("y2", yCounter + 40)
			.style("stroke-dasharray", "5,5") //dashed array for line
			.style("stroke", "white");

		// Shows the text values
		let valueText1 = value1;
		let valueText2 = value2;

		// Formats the text
		if (v.includes("PERCENTAGE")) {
			valueText1 = decimalToPercent(valueText1);
			valueText2 = decimalToPercent(valueText2);
		} else if (v.includes("ENROLL") || v.inclues("POPULATION")) {
			valueText1 = numberWithCommas(valueText1);
			valueText2 = numberWithCommas(valueText2);
		} else {
			valueText1 = floatToDollars(valueText1);
			valueText2 = floatToDollars(valueText2);
		}

		// Adds values to visualization
		chartArea
			.append("text")
			.attr("x", 5)
			.attr("y", yCounter + labelMargin)
			.attr("text-anchor", "start")
			.attr("dominant-baseline", "hanging")
			.attr("class", "valueText")
			.text(valueText1);

		chartArea
			.append("text")
			.attr("x", chartWidth - 5)
			.attr("y", yCounter + labelMargin)
			.attr("text-anchor", "end")
			.attr("dominant-baseline", "hanging")
			.attr("class", "valueText")
			.text(valueText2);

		// Spacing the plots
		yCounter += 100;
	});
	return;
}
/**
 * Constructor to initialize all of our variables for double analysis.
 */
function setupDouble() {
	values = [
		"AVG_SCORE_PERCENTAGE",
		"ENROLL",
		"EXPENDITURE_PER_STUDENT",
		"INSTRUCTION_EXPENDITURE",
		"POPULATION",
		"GDP_PER_CAPITA",
		"GDP",
	];

	div = d3.select("div#screen_double");
	svg = d3.select("svg#doubleSvg");

	svg.selectAll("g").remove();

	width = svg.attr("width");
	height = svg.attr("height");
	style = svg.attr("style");
	margin = { top: 10, right: 10, bottom: 10, left: 10 };
	chartWidth = width - margin.left - margin.right;
	chartHeight = height - margin.top - margin.bottom;

	chartArea = svg
		.append("g")
		.attr("id", "points")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Scale is scaled linearly from 0-1 for percentages
	percentScale = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]);
}

/**
 * Quick function to capitilize words like this: "This Is Normal Words"
 */
function capitalizeWords(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
