
console.log("Testing...");

const tests = [];

const Prosumer = require("./prosumer.js");

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getConsumption() < 0) {
		throw "Consumption is negative";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(isNaN(p.getConsumption())) {
		throw "Consumption is NaN";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getWindSpeed(0) < 0) {
		throw "Wind speed is negative";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getWindSpeed(0) > 1) {
		throw "Wind speed is higher than 100%";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(isNaN(p.getWindSpeed(0))) {
		throw "Wind speed is NaN";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getProduction(0) < 0) {
		throw "Production is negative";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getWindSpeed(0) > 1600) {
		throw "Production is higher than 1600 W";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(isNaN(p.getWindSpeed(0))) {
		throw "Production is NaN";
	}
});

tests.push(function() {
	const a = new Prosumer(0, 0);
	const b = new Prosumer(0, 0);
	if(a.getWindSpeed(0) != b.getWindSpeed(0)) {
		throw "Wind speed in same spot is different";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getBatteryLevel() > 0) {
		throw "Battery charged from start";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	if(p.getBatteryLevel() < 0) {
		throw "Battery charge is negative";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	p.chargeBattery(p.getMaxBatteryLevel() + 1);
	if(p.getBatteryLevel() != p.getMaxBatteryLevel()) {
		throw "Max battery charge is not working";
	}
});

tests.push(function() {
	const p = new Prosumer(0, 0);
	p.useBattery(1);
	if(p.getBatteryLevel() != 0) {
		throw "Min battery charge is not working";
	}
});

let passed = 0;
for(let i = 0; i < tests.length; ++i) {
	try {
		tests[i]();
		++passed;
	} catch(error) {
		console.error("Test " + (i + 1) + " failed: " + error);
	}
}

console.log("Testing complete!\nPassed: " + passed + "/" + tests.length);
