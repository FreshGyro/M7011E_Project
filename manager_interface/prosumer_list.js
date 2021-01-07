
(function() {
	const table = document.getElementById("prosumer-list").children[0];

	function refreshList() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);

				table.innerHTML = "<tr><th>Username</th><th>ID</th><th>Status</th><th>Battery</th><th>Max battery</th><th>Consumption</th><th>Production</th><th>Wind</th></tr>";
				for(let i = 0; i < json.length; ++i) {
					const user = json[i];

					const tr = document.createElement("tr");

					let td = document.createElement("td");
					td.textContent = user["username"];
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = user["id"];
					tr.appendChild(td);

					td = document.createElement("td");
					if(user["isActive"]) {
						td.textContent = "LOGGED IN";
					} else {
						td.textContent = "LOGGED OUT";
					}
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = Math.floor(user["battery"]) + " J";
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = Math.floor(user["max_battery"]) + "J";
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = Math.floor(user["consumption"]) + " W";
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = Math.floor(user["production"]) + " W";
					tr.appendChild(td);

					td = document.createElement("td");
					td.textContent = Math.floor(user["wind"] * 100) + "%";
					tr.appendChild(td);

					table.appendChild(tr);
				}
			}
		};
		request.open("GET", "http://127.0.0.1:81/getprosumerlist", true);
		request.send();
	}

	refreshList();
	setInterval(refreshList, 500);
})();
