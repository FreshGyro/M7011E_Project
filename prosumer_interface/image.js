
(function() {
	const image = document.getElementById("image");
	const button = document.getElementById("image-upload-button");
	const imageUpload = document.getElementById("image-upload");

	button.addEventListener("click", () => {
		imageUpload.click();
	});
	imageUpload.addEventListener("input", () => {
		const image = imageUpload.files[0];
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					console.error(json["error"]);
				} else {
					refreshImage();
				}
			}
		};
		const formData = new FormData();
		formData.append("photo", image);
		formData.append("username", account.getUsername());
		formData.append("password", account.getPasswordHash());
		request.open("POST", "http://" + prosumerServerAddress + ":" + prosumerServerPort + "/uploadimage");
		request.send(formData);
	});

	function refreshImage() {
		image.src = "http://" + prosumerServerAddress + ":" + prosumerServerPort + "/uploads/" + encodeURIComponent(account.getUsername()) + ".jpg";
	}
	image.onerror = function() {
		this.src = "/prosumer_interface/no_image.svg";
	};
	refreshImage();
})();
