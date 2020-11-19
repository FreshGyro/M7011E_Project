const Prosumer = require("./prosumer.js");

class PowerPlant extends Prosumer {
	constructor() {
		super(0, 0);
		this._consumption = 1000;
		this._marketRatio = 1;
		this._isOn = false;
		this._timestamp = 0;
	}

	getMaxBatteryLevel() {
		return 30000;
	}
	getProduction(time) {
		if(this.isOn() && (time - this._timestamp) >= 3) {
			return 300000;
		} else if(!this.isOn() && (time - this._timestamp) < 3) {
			return 300000;
		} else {
			return 0;
		}
	}

	getStatus(time) {
		if(this.isOn() && (time - this._timestamp) < 3) {
			return "STARTING";
		} else if(this.isOn() && (time - this._timestamp) >= 3) {
			return "STARTED";
		} else if(!this.isOn() && (time - this._timestamp) < 3) {
			return "STOPPING";
		} else {
			return "STOPPED";
		}
	}

	isOn() {
		return this._isOn;
	}
	turnOn(time) {
		if(!this.isOn() && (time - this._timestamp) < 3) {
			this._timestamp = time;
			this._isOn = true;
		} else {
			this._timestamp = -Infinity;
		}
	}
	turnOff(time) {
		if(this.isOn() && (time - this._timestamp) >= 3) {
			this._timestamp = time;
			this._isOn = false;
		} else {
			this._timestamp = -Infinity;
		}
	}
}
module.exports = PowerPlant;
