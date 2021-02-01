
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getPowerPlantData() {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/getpowerplantdata", true);
		request.send();
	});
}
module.exports.getPowerPlantData = getPowerPlantData;

function setPowerPlantMarketRatio(ratio) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/setpowerplantmarketratio?ratio=" + ratio, true);
		request.send();
	});
}
module.exports.setPowerPlantMarketRatio = setPowerPlantMarketRatio;

function setPowerPlantEnabled(enabled) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/setpowerplantenabled?enabled=" + enabled, true);
		request.send();
	});
}
module.exports.setPowerPlantEnabled = setPowerPlantEnabled;

function setMarketPrice(price) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/setmarketprice?price=" + price, true);
		request.send();
	});
}
module.exports.setMarketPrice = setMarketPrice;

function blockUser(id, seconds) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/blockuser?id=" + id + "&seconds=" + seconds, true);
		request.send();
	});
}
module.exports.blockUser = blockUser;
