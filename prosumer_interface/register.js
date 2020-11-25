
(function() {
	document.getElementById("register-button").addEventListener("click", () => {
		const username = document.getElementById("register-username").value;
		const password = document.getElementById("register-password").value;
		account.register(username, password).then(() => {
			window.location.href = "/prosumer_interface/";
		}).catch((error) => {
			alert("Register failed");
		});
		return false;
	});
})();
