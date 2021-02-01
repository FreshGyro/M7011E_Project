
const PowerPlant = require("./power_plant.js");

const prosumers = [];
let nextProsumerID = 0;
const prosumerMap = new Map();

function addProsumer(prosumer) {
	const id = nextProsumerID++;
	prosumers.push(prosumer);
	prosumerMap.set(id, prosumer);
	return id;
}
module.exports.addProsumer = addProsumer;

function deleteProsumer(prosumer) {
	for(let i = 0; i < prosumers.length; ++i) {
		if(prosumers[i] == prosumer) {
			prosumers.splice(i, 1);
			break;
		}
	}

	let prosumerID = null;
	prosumerMap.forEach((p, id) => {
		if(p == prosumer) {
			prosumerID = id;
		}
	});

	if(prosumerID == null) {
		throw "Can't remove unknown prosumer";
	} else {
		prosumerMap.delete(prosumerID);
	}
}
module.exports.deleteProsumer = deleteProsumer;

function getProsumerById(id) {
	return prosumerMap.get(id);
}
module.exports.getProsumerById = getProsumerById;

function getProsumersByList(list) {
 	const prosumerList = [];
	list.forEach(id => prosumerList.push(prosumerMap.get(id)));
	return prosumerList;
}
module.exports.getProsumersByList = getProsumersByList;

const powerPlant = new PowerPlant();
addProsumer(powerPlant);

function getPowerPlant() {
	return powerPlant;
}
module.exports.getPowerPlant = getPowerPlant;

let totalMarketProduction = 0;
let totalMarketDemand = 0;
let marketPrice = 0;

let currentTime = 0;
function update() {
	++currentTime;

	let marketProduction = 0;
	for(let i = 0; i < prosumers.length; ++i) {
		const p = prosumers[i];

		const production = p.getProduction(currentTime);
		const consumption = p.getConsumption();

		p.blockTimerTick();

		if(production == consumption) {
			//Evens out
		} else if(production > consumption) {
			//Charge battery
			let marketRatio;
			if(p.isBlocked() || p == powerPlant) {
				marketRatio = 0;
			} else {
				marketRatio = p.getMarketRatio();
			}

			const spaceInBattery = p.getMaxBatteryLevel() - p.getBatteryLevel();
			if(spaceInBattery >= (1 - marketRatio) * (production - consumption)) {
				//There is room in the battery for all the charge
				p.chargeBattery((1 - marketRatio) * (production - consumption));
				if(!p.isBlocked()) {
					marketProduction += marketRatio * (production - consumption);
				}
			} else {
				//There is not enough room in the battery, sell excess electricity
				p.chargeBattery(spaceInBattery);
				if(!p.isBlocked()) {
					marketProduction += production - consumption - spaceInBattery;
				}
			}
		}
	}

	//Add power plant battery power, will be refilled later
	const powerPlantBatteryProduction = Math.min(powerPlant.getBatteryLevel(), powerPlant.getMaxBatteryLevel() * powerPlant.getMarketRatio());
	marketProduction += powerPlantBatteryProduction;
	powerPlant.useBattery(powerPlantBatteryProduction);

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
					p.setBlackout(false);
				} else {
					//Blackout
					p.setBlackout(true);
				}
				marketAmount -= demand;
			} else {
				p.setBlackout(false);
			}

			marketDemand += demand;
		} else {
			p.setBlackout(false);
		}
	}

	if(marketAmount > 0) {
		//Charge the power plant battery with remaining power
		powerPlant.chargeBattery(marketAmount);
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

function getSuggestedMarketPrice() {
	if(getMarketProduction() - getMarketDemand() > 0) {
		return getMarketDemand() / (getMarketProduction() - getMarketDemand());
	} else {
		return getMarketDemand()**1.1;
	}
}
module.exports.getSuggestedMarketPrice = getSuggestedMarketPrice;

function getMarketPrice() {
	return marketPrice;
}
module.exports.getMarketPrice = getMarketPrice;

function setMarketPrice(price) {
	marketPrice = price;
}
module.exports.setMarketPrice = setMarketPrice;
