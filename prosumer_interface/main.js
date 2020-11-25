
const marketRatioSlider = document.getElementById("marketRatio");
const imageUpload = document.getElementById("imageUpload");
const image = document.getElementById("image");

marketRatioSlider.onchange = function() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			//Success
		}
	};
	request.open("POST", "http://127.0.0.1:81/setmarketratio", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("ratio=" + (parseFloat(this.value) / 100) + "&username=" + account.getUsername() + "&password=" + account.getPasswordHash());
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
	request.send("username=" + account.getUsername());
}
setInterval(updateImage, 1000);
