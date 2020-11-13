
const PowerPlant = require("./power_plant.js");

const prosumers = [];
let nextProsumerID = 0;
const prosumerMap = new Map();

function addProsumer(prosumer) {
	prosumers.push(prosumer);
	prosumerMap.set(nextProsumerID++, prosumer);
	prosumers.push(prosumer);
}
module.exports.addProsumer = addProsumer;

function getProsumerById(id) {
	return prosumerMap.get(id);
}
module.exports.getProsumerById = getProsumerById;

const powerPlant = new PowerPlant();
addProsumer(powerPlant);

let totalMarketProduction = 0;
let totalMarketDemand = 0;

let currentTime = 0;
function update() {
	++currentTime;

	let marketProduction = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		const production = p.getProduction(currentTime);
		const consumption = p.getConsumption();
		if(production == consumption) {
			//Evens out
		} else if(production > consumption) {
			//Charge battery
			const marketRatio = p.getMarketRatio();

			const spaceInBattery = p.getMaxBatteryLevel() - p.getBatteryLevel();
			if(spaceInBattery >= (1 - marketRatio) * (production - consumption)) {
				//There is room in the battery for all the charge
				p.chargeBattery((1 - marketRatio) * (production - consumption));
				marketProduction += marketRatio * (production - consumption);
			} else {
				//There is not enough room in the battery, sell excess electricity
				p.chargeBattery(spaceInBattery);
				marketProduction += production - consumption - spaceInBattery;
			}
		}
	}


	let marketDemand = 0;
	let marketAmount = marketProduction;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		const production = p.getProduction(currentTime);
		const consumption = p.getConsumption();
		if(production < consumption) {
			//Use battery
			let demand;
			if(consumption - production > p.getBatteryLevel()) {
				demand = consumption - production - p.getBatteryLevel();
			} else {
				//Enough charge in battery, no market demand
				demand = 0;
			}
			p.useBattery(consumption - production);

			if(demand > 0) {
				if(marketAmount > demand) {
					//Used electricity from market
					marketAmount -= demand;
				} else {
					//Blackout
				}
			}

			marketDemand += demand;
		}
	}

	totalMarketProduction = marketProduction;
	totalMarketDemand = marketDemand;
}
module.exports.update = update;

function getCurrentTime() {
	return currentTime;
}
module.exports.getCurrentTime = getCurrentTime;

function getTotalBattery() {
	let total = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		total += p.getBatteryLevel();
	}
	return total;
}
module.exports.getTotalBattery = getTotalBattery;

function getTotalMaxBattery() {
	let total = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];
		total += p.getMaxBatteryLevel();
	}
	return total;
}
module.exports.getTotalMaxBattery = getTotalMaxBattery;


function getMarketProduction() {
	return totalMarketProduction;
}
module.exports.getMarketProduction = getMarketProduction;

function getMarketDemand() {
	return totalMarketDemand;
}
module.exports.getMarketDemand = getMarketDemand;
