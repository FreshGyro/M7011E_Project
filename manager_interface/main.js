
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
					"Max Battery"
				];
				const values = [
					json["status"],
					json["production"],
					json["consumption"],
					json["production"] - json["consumption"],
					json["battery"],
					json["max_battery"]
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

const image = document.getElementById("image");
image.src = "http://127.0.0.1:82/uploads/manager.jpg";
