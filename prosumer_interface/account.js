
const account = new function() {
	function sha512(string) {
		return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(string)).then(buffer => {
			return Array.prototype.map.call(new Uint8Array(buffer), (char) => {
				return ("00" + char.toString(16)).slice(-2);
			}).join("");
		});
	}

	this.login = function(username, password) {
		return new Promise((resolve, reject) => {
			sha512(password).then((passwordHash) => {
				const request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						const json = JSON.parse(request.responseText);
						if(json.success == true) {
							localStorage.setItem("prosumer_login", JSON.stringify({
								username:username,
								passwordHash:passwordHash
							}));
							resolve();
						} else {
							reject();
						}
					}
				};
				request.open("POST", "http://127.0.0.1:81/login", true);
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send("username=" + username + "&password=" + passwordHash);
			});
		});
	};

	this.register = function(username, password) {
		return new Promise((resolve, reject) => {
			sha512(password).then((passwordHash) => {
				const request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						const json = JSON.parse(request.responseText);
						if(json.success == true) {
							localStorage.setItem("prosumer_login", JSON.stringify({
								username:username,
								passwordHash:passwordHash
							}));
							resolve();
						} else {
							reject();
						}
					}
				};
				request.open("POST", "http://127.0.0.1:81/register", true);
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send("username=" + username + "&password=" + passwordHash);
			});
		});
	};

	this.getUsername = function() {
		let loginData = localStorage.getItem("prosumer_login");
		if(loginData) {
			loginData = JSON.parse(loginData);
			return loginData["username"];
		} else {
			return null;
		}
	};
	this.getPasswordHash = function() {
		let loginData = localStorage.getItem("prosumer_login");
		if(loginData) {
			loginData = JSON.parse(loginData);
			return loginData["passwordHash"];
		} else {
			return null;
		}
	};
}();
