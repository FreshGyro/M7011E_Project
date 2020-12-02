
(function() {
	const logoutButton = document.getElementById("logout_button");
	logoutButton.addEventListener("click", () => {
		account.logout();
		window.location.href = "/prosumer_interface/login.html";
	});
})();
