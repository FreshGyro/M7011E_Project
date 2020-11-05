
const perlin = require("./perlin.js");

function getWindSpeed(x, y) {
	const time = new Date().getTime() / 10;
	return perlin(1337, 8, 10000, x, y, time);
}
module.exports.getWindSpeed = getWindSpeed;
