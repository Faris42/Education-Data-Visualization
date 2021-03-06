/**
 * Returns a string representation of a dollar amount from a float.
 * Ex. 50135.0135 => $50,135.01
 * @param {number} num
 * @returns {string}
 */
function floatToDollars(num) {
	return "$" + num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/**
 * Returns a string representation of a percentage from a decimal.
 * Ex. 0.2345253 => 23.45%
 * @param {number} num
 * @returns {string}
 */
function decimalToPercent(num) {
	return (num * 100).toFixed(2) + "%";
}

/**
 * Returns a string representation of a number with commas seperating every 3 digits.
 * Source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @param {number} num
 * @returns {string}
 */
function numberWithCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
