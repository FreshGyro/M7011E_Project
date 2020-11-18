
const info = document.getElementById("info");
const marketRatioSlider = document.getElementById("marketRatio");
const imageUpload = document.getElementById("imageUpload");
const image = document.getElementById("image");

const prosumerID = 1;

function updateInfo() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			info.innerHTML = "";
			const json = JSON.parse(request.responseText);
			const keys = [
				"Wind",
				"Production",
				"Consumption",
				"Delta",
				"Battery",
				"Max Battery",
				"Market Ratio"
			];
			const values = [
				json["wind"],
				json["production"],
				json["consumption"],
				json["production"] - json["consumption"],
				json["battery"],
				json["max_battery"],
				json["market_ratio"]
			];

			for(let i = 0; i < keys.length; ++i) {
				const p = document.createElement("p");
				p.innerText = keys[i] + ": " + values[i];
				info.appendChild(p);
			}

			marketRatioSlider.value = json["market_ratio"] * 100;
		}
	};
	request.open("GET", "http://127.0.0.1:81/getprosumerdata?id=" + prosumerID, true);
	request.send();
}
setInterval(updateInfo, 1000);

marketRatioSlider.onchange = function() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			//Success
		}
	};
	request.open("GET", "http://127.0.0.1:81/setmarketratio?id=" + prosumerID + "&ratio=" + (this.value / 100), true);
	request.send();
};

image.src = "http://127.0.0.1:81/uploads/" + prosumerID + ".jpg";
