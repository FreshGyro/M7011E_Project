
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
		request.open("GET", "http://127.0.0.1/getpowerplantdata", true);
		request.send();
	});
}
module.exports.getPowerPlantData = getPowerPlantData;
