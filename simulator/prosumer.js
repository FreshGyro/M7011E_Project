const gaussian = require("./gaussian_distribution.js");
const weather = require("./weather.js");

class Prosumer {
	constructor(posX, posY) {
		this._posX = posX;
		this._posY = posY;

		this._batteryLevel = 0;
		this._consumption = gaussian.gaussianDistribution(800);
	}

	useBattery(amount) {
		this._batteryLevel = Math.max(this._batteryLevel - amount, 0);
	}
	chargeBattery(amount) {
		this._batteryLevel = Math.min(this._batteryLevel + amount, this.getMaxBatteryLevel());
	}
	getBatteryLevel() {
		return this._batteryLevel;
	}
	getMaxBatteryLevel() {
		return 3000;
	}

	getProduction(time) {
		return 1600 * weather.getWindSpeed(this._posX, this._posY, time);//Watts
	}

	getConsumption() {
		return this._consumption;//Watts
	}
}

module.exports = Prosumer;