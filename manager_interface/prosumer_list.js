
(function() {
	const table = document.getElementById("prosumer-list").children[0];

	function sha512(string) {
		return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(string)).then(buffer => {
			return Array.prototype.map.call(new Uint8Array(buffer), (char) => {
				return ("00" + char.toString(16)).slice(-2);
			}).join("");
		});
	}

	function refreshList() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);

				table.innerHTML = "<tr><th>Username</th><th>ID</th><th>Status</th><th>Battery</th><th>Max battery</th><th>Consumption</th><th>Production</th><th>Wind</th><th>Edit Username</th><th>Edit Password</th></tr>";
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

					td = document.createElement("td");
					const changeUsername = document.createElement("button");
					changeUsername.className = "button";
					changeUsername.textContent = "Edit";
					changeUsername.addEventListener("click", () => {
						const userID = user["id"];
						const newUsername = prompt("Enter new username");
						if(newUsername != null) {
							const request = new XMLHttpRequest();
							request.open("POST", "http://127.0.0.1:81/changeusername", true);
							request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							request.send("id=" + userID + "&newUsername=" + newUsername);
						}
					});
					td.appendChild(changeUsername);
					tr.appendChild(td);

					td = document.createElement("td");
					const changePassword = document.createElement("button");
					changePassword.className = "button";
					changePassword.textContent = "Edit";
					changePassword.addEventListener("click", () => {
						const userID = user["id"];
						const newPassword = prompt("Enter new password");
						if(newPassword != null) {
							sha512(newPassword).then((newPasswordHash) => {
								const request = new XMLHttpRequest();
								request.open("POST", "http://127.0.0.1:81/changepassword", true);
								request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
								request.send("id=" + userID + "&newPassword=" + newPasswordHash);
							});
						}
					});
					td.appendChild(changePassword);
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
