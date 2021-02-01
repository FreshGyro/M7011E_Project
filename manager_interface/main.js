
(function() {
	const info = document.getElementById("power-info");

	const marketRatioSlider = document.getElementById("marketRatio");

	const consumptionInfo = info.getElementsByTagName("p")[0];
	const batteryInfo = info.getElementsByTagName("p")[1];
	const productionInfo = info.getElementsByTagName("p")[2];

	const consumptionConnection = document.getElementById("consumption-connection");
	const batteryConnection = document.getElementById("battery-connection");
	const productionConnection = document.getElementById("production-connection");
	const marketConnection = document.getElementById("market-connection");

	let isPowerPlantEnabled = false;
	let previousBatteryValue = null;

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
					productionInfo.textContent = json["status"] + " | " + Math.floor(json["production"]) + " W";
					marketRatioSlider.value = json["market_ratio"] * 100;

					if(json["consumption"] > 0) {
						consumptionConnection.className = "connection up red";
					} else {
						consumptionConnection.className = "connection up gray";
					}

					if(json["production"] > 0) {
						productionConnection.className = "connection left green";
					} else {
						productionConnection.className = "connection left gray";
					}

					const marketRatio = json["market_ratio"];
					if(json["consumption"] > json["production"]) {
						if(json["battery"] > 0) {
							batteryConnection.className = "connection right green";
							if(marketRatio == 0) {
								marketConnection.className = "connection up gray";
							} else {
								marketConnection.className = "connection down red";
							}
						} else {
							batteryConnection.className = "connection right gray";
							marketConnection.className = "connection up green";
						}
					} else if(json["consumption"] < json["production"]) {
						if(json["battery"] == json["max_battery"]) {
							batteryConnection.className = "connection left gray";
						} else {
							if(previousBatteryValue == null || json["battery"] >= previousBatteryValue) {
								batteryConnection.className = "connection left red";
							} else {
								batteryConnection.className = "connection right green";
							}
						}

						marketConnection.className = "connection down red";
					}

					price.setPriceInfo(json["market_price"], json["suggested_price"]);

					if(json["status"] != "STOPPED") {
						isPowerPlantEnabled = true;
					} else {
						isPowerPlantEnabled = false;
					}
					refreshPowerPlantButtonLabel();

					previousBatteryValue = json["battery"];
				}
			}
		};
		request.open("GET", "http://" + managerServerAddress + ":" + managerServerPort + "/getpowerplantdata", true);
		request.send();
	}
	updateInfo();
	setInterval(updateInfo, 1000);

	marketRatioSlider.onchange = function() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				//Success
			}
		};
		request.open("GET", "http://" + managerServerAddress + ":" + managerServerPort + "/setpowerplantmarketratio?ratio=" + (parseFloat(this.value) / 100), true);
		request.send();
	};

	const togglePowerPlantButton = document.getElementById("toggle-power-plant-button");
	function refreshPowerPlantButtonLabel() {
		if(isPowerPlantEnabled) {
			togglePowerPlantButton.textContent = "Stop";
		} else {
			togglePowerPlantButton.textContent = "Start";
		}
	}
	function setPowerPlantEnabled(enabled) {
		isPowerPlantEnabled = enabled;
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					console.error("Error: " + json["error"]);
				}
			}
		};
		request.open("GET", "http://" + managerServerAddress + ":" + managerServerPort + "/setpowerplantenabled?enabled=" + enabled, true);
		request.send();
	}
	togglePowerPlantButton.addEventListener("click", () => {
		setPowerPlantEnabled(!isPowerPlantEnabled);
		refreshPowerPlantButtonLabel();
	});
})();
