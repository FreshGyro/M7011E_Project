
const Prosumer = require("./prosumer.js");

const prosumers = [];

function addProsumer(x, y) {
	prosumers.push(new Prosumer(x, y));
}
module.exports.addProsumer = addProsumer;

let currentTime = 0;
function update() {
	++currentTime;

	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		const production = p.getProduction(currentTime);
		const consumption = p.getConsumption();
		if(production == consumption) {
			//Evens out
		} else if(production > consumption) {
			//Charge battery
			p.chargeBattery(production - consumption);
		} else if(production < consumption) {
			//Use battery
			p.useBattery(consumption - production);

			if(p.getBatteryLevel() == 0) {
				//BLACKOUT
			}
		}
	}
}
module.exports.update = update;

//Get total energy production in watts
function getTotalProduction() {
	let total = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		const production = p.getProduction(currentTime);
		total += production;
	}
	return total;
}
module.exports.getTotalProduction = getTotalProduction;

//Get total energy consumption in watts
function getTotalConsumption() {
	let total = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		const consumption = p.getConsumption();
		total += consumption;
	}
	return total;
}
module.exports.getTotalConsumption = getTotalConsumption;
