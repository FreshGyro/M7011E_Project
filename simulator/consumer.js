const Prosumer = require("./prosumer.js");

class Consumer extends Prosumer {
	constructor(posX, posY) {
		super(posX, posY);
		this._marketRatio = 0;
	}

	getMaxBatteryLevel() {
		return 0;
	}
	getProduction(time) {
		return 0;
	}
}
module.exports = Consumer;
