
const customers = [];

function addCustomer(x, y) {
	customers.push({
		x:x,
		y:y
	});
}
module.exports.addCustomer = addCustomer;

//Get total energy consumption in watts
function getTotalConsumption() {
	const wattsPerCustomer = 800;
	return customers.length * wattsPerCustomer;
}
module.exports.getTotalConsumption = getTotalConsumption;
