
(function() {
	const info = document.getElementById("power-info");
	const consumptionInfo = info.getElementsByTagName("p")[0];
	const batteryInfo = info.getElementsByTagName("p")[1];
	const productionInfo = info.getElementsByTagName("p")[2];
	const marketInfo = info.getElementsByTagName("p")[3];
	const marketRatioSlider = document.getElementById("marketRatio");

	const consumptionConnection = document.getElementById("consumption-connection");
	const batteryConnection = document.getElementById("battery-connection");
	const productionConnection = document.getElementById("production-connection");
	const marketConnection = document.getElementById("market-connection");

	function updateInfo() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					console.error("Error: " + json["error"]);
				} else {
					consumptionInfo.textContent = Math.floor(json["consumption"]) + " W";
					batteryInfo.textContent = Math.floor(json["battery"]) + " J / " + Math.floor(json["max_battery"]) + " J";
					productionInfo.textContent = Math.floor(json["wind"] * 100) + "% | " + Math.floor(json["production"]) + " W";
					marketInfo.textContent = json["market_price"] + " €";
					marketRatioSlider.value = json["market_ratio"] * 100;

					if(json["consumption"] > json["production"]) {
						if(json["battery"] > 0) {
							batteryConnection.className = "connection right green";
							marketConnection.className = "connection up gray";
						} else {
							batteryConnection.className = "connection right gray";
							marketConnection.className = "connection up green";
						}
					} else if(json["consumption"] < json["production"]) {
						if(json["battery"] < json["max_battery"] && json["market_ratio"] != 1) {
							batteryConnection.className = "connection left red";
						} else {
							batteryConnection.className = "connection left gray";
						}

						if(json["market_ratio"] > 0 || json["battery"] >= json["max_battery"]) {
							marketConnection.className = "connection down red";
						} else {
							marketConnection.className = "connection down gray";
						}
					}
				}
			}
		};
		request.open("POST", "http://" + prosumerServerAddress + ":" + prosumerServerPort + "/getprosumerdata", true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send("username=" + account.getUsername() + "&password=" + account.getPasswordHash());
	}
	updateInfo();
	setInterval(updateInfo, 1000);
})();
