
function gaussianDistribution(x) {
	const u = Math.random();
	const v = Math.random();
	return 2 * x * ((Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)) / 10.0 + 0.5);
}
module.exports.gaussianDistribution = gaussianDistribution;
