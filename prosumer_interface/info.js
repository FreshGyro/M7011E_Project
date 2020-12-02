
(function() {
	const info = document.getElementById("info");
	const consumptionInfo = info.getElementsByTagName("p")[0];
	const batteryInfo = info.getElementsByTagName("p")[1];
	const productionInfo = info.getElementsByTagName("p")[2];
	const marketInfo = info.getElementsByTagName("p")[3];
	const marketRatioSlider = document.getElementById("marketRatio");

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
				}
			}
		};
		request.open("POST", "http://127.0.0.1:81/getprosumerdata", true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send("username=" + account.getUsername() + "&password=" + account.getPasswordHash());
	}
	updateInfo();
	setInterval(updateInfo, 1000);
})();
