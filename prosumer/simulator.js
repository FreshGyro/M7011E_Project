
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function createProsumer() {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve(json["id"]);
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://127.0.0.1/createprosumer", true);
		request.send();
	});
}
module.exports.createProsumer = createProsumer;

function getProsumerData(id) {
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
		request.open("GET", "http://127.0.0.1/getprosumerdata?id=" + id, true);
		request.send();
	});
}
module.exports.getProsumerData = getProsumerData;

function setMarketRatio(id, ratio) {
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
		request.open("GET", "http://127.0.0.1/setmarketratio?id=" + id + "&ratio=" + ratio, true);
		request.send();
	});
}
module.exports.setMarketRatio = setMarketRatio;