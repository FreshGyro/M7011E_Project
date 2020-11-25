
(function() {
	document.getElementById("login-button").addEventListener("click", () => {
		const username = document.getElementById("login-username").value;
		const password = document.getElementById("login-password").value;
		account.login(username, password).then(() => {
			window.location.href = "/prosumer_interface/";
		}).catch((error) => {
			alert("Login failed");
		});
		return false;
	});
})();
