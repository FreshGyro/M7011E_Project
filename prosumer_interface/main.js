
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");

const info = document.getElementById("info");
const marketRatioSlider = document.getElementById("marketRatio");
const imageUpload = document.getElementById("imageUpload");
const image = document.getElementById("image");

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
					"Wind",
					"Production",
					"Consumption",
					"Delta",
					"Battery",
					"Max Battery",
					"Market Ratio",
					"Market Price"
				];
				const values = [
					json["wind"],
					json["production"],
					json["consumption"],
					json["production"] - json["consumption"],
					json["battery"],
					json["max_battery"],
					json["market_ratio"],
					json["market_price"]
				];

				for(let i = 0; i < keys.length; ++i) {
					const p = document.createElement("p");
					p.innerText = keys[i] + ": " + values[i];
					info.appendChild(p);
				}

				marketRatioSlider.value = json["market_ratio"] * 100;
			}
		}
	};
	request.open("POST", "http://127.0.0.1:81/getprosumerdata", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("username=" + usernameField.value + "&password=" + passwordField.value);
}
setInterval(updateInfo, 1000);

marketRatioSlider.onchange = function() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			//Success
		}
	};
	request.open("POST", "http://127.0.0.1:81/setmarketratio", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("ratio=" + (this.value / 100) + "&username=" + usernameField.value + "&password=" + passwordField.value);
};

function updateImage() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			const json = JSON.parse(request.responseText);
			if(json.hasOwnProperty("error")) {
				console.error(json["error"]);
			} else {
				image.src = "http://127.0.0.1:81/" + json["url"];
			}
		}
	};
	request.open("POST", "http://127.0.0.1:81/getimageurl", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("username=" + usernameField.value);
}
setInterval(updateImage, 1000);
