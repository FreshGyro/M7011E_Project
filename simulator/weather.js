
const perlin = require("./perlin.js");

function getWindSpeed(x, y, t) {
	return perlin(1337, 8, 10000, x, y, t * 1000);
}
module.exports.getWindSpeed = getWindSpeed;
