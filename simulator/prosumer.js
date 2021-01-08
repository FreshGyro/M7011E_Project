const gaussian = require("./gaussian_distribution.js");
const weather = require("./weather.js");

class Prosumer {
	constructor(posX, posY) {
		this._posX = posX;
		this._posY = posY;
		this._consumption = gaussian.gaussianDistribution(800);
		this._batteryLevel = 0;
		this._marketRatio = 0.3;
		this._blackout = false;
		this._blockTimer = -Infinity;
	}

	setBlackout(b) {
		this._blackout = b;
	}
	getBlackout() {
		return this._blackout;
	}

	block(seconds) {
		this._blockTimer = seconds;
	}
	blockTimerTick() {
		--this._blockTimer;
	}
	isBlocked() {
		return (this._blockTimer > 0);
	}

	setMarketRatio(ratio) {
		this._marketRatio = ratio;
	}
	getMarketRatio() {
		return this._marketRatio;
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

	getWindSpeed(time) {
		return weather.getWindSpeed(this._posX, this._posY, time);
	}
	getProduction(time) {
		return 1600 * this.getWindSpeed(time);
	}

	getConsumption() {
		return this._consumption;//Watts
	}
}

module.exports = Prosumer;
