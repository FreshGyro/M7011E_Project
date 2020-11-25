
(function() {
	const list = document.getElementById("prosumer-list");

	setInterval(() => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);

				list.innerHTML = "";
				for(let i = 0; i < json.length; ++i) {
					const user = json[i];
					const li = document.createElement("li");

					let activityText;
					if(user.isActive) {
						activityText = "LOGGED IN";
					} else {
						activityText = "LOGGED OUT";
					}

					li.textContent = user.username + " (" + user.id + ") | " + activityText;
					list.appendChild(li);
				}
			}
		};
		request.open("GET", "http://127.0.0.1:81/getprosumerlist", true);
		request.send();
	}, 500);
})();
