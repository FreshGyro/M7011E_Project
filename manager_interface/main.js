
const info = document.getElementById("info");

function updateInfo() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			info.innerHTML = "";
			const json = JSON.parse(request.responseText);
			if(json.hasOwnProperty("error")) {
				info.innerHTML = "Error: " + json["error"];
			} else {
				const keys = [
					"Status",
					"Production",
					"Consumption",
					"Delta",
					"Battery",
					"Max Battery",
					"Suggested Price",
					"Market Price"
				];
				const values = [
					json["status"],
					json["production"],
					json["consumption"],
					json["production"] - json["consumption"],
					json["battery"],
					json["max_battery"],
					json["suggested_price"],
					json["market_price"]
				];

				for(let i = 0; i < keys.length; ++i) {
					const p = document.createElement("p");
					p.innerText = keys[i] + ": " + values[i];
					info.appendChild(p);
				}
			}
		}
	};
	request.open("GET", "http://127.0.0.1:82/getpowerplantdata", true);
	request.send();
}
setInterval(updateInfo, 1000);

function setPowerPlantEnabled(enabled) {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			const json = JSON.parse(request.responseText);
			if(json.hasOwnProperty("error")) {
				console.error("Error: " + json["error"]);
			}
		}
	};
	request.open("GET", "http://127.0.0.1:82/setpowerplantenabled?enabled=" + enabled, true);
	request.send();
}
document.getElementById("start").onclick = function(){setPowerPlantEnabled(true)};
document.getElementById("stop").onclick = function(){setPowerPlantEnabled(false)};

function setMarketPrice(price) {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			const json = JSON.parse(request.responseText);
			if(json.hasOwnProperty("error")) {
				console.error("Error: " + json["error"]);
			}
		}
	};
	request.open("GET", "http://127.0.0.1:82/setmarketprice?price=" + price, true);
	request.send();
}
document.getElementById("setprice").onclick = function(){setMarketPrice(document.getElementById("inputprice").value)};


const image = document.getElementById("image");
image.src = "http://127.0.0.1:82/uploads/manager.jpg";
