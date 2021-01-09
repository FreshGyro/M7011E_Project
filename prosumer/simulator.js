
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
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/createprosumer", true);
		request.send();
	});
}
module.exports.createProsumer = createProsumer;


function deleteProsumer(userID) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					reject(json["error"]);
				} else {
					resolve();
				}
			} else {
				//TODO error
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/deleteprosumer?id=" + userID, true);
		request.send();
	});
}
module.exports.deleteProsumer = deleteProsumer;

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
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/getprosumerdata?id=" + id, true);
		request.send();
	});
}
module.exports.getProsumerData = getProsumerData;

function getProsumersData(idList) {
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
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/getprosumersdata?idList=" + encodeURIComponent(JSON.stringify(idList)), true);
		request.send();
	});
}
module.exports.getProsumersData = getProsumersData;

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
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/setmarketratio?id=" + id + "&ratio=" + ratio, true);
		request.send();
	});
}
module.exports.setMarketRatio = setMarketRatio;
