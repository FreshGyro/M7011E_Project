
const marketRatioSlider = document.getElementById("marketRatio");
const imageUpload = document.getElementById("imageUpload");

marketRatioSlider.onchange = function() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			//Success
		}
	};
	request.open("POST", "http://" + prosumerServerAddress + ":" + prosumerServerPort + "/setmarketratio", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("ratio=" + (parseFloat(this.value) / 100) + "&username=" + account.getUsername() + "&password=" + account.getPasswordHash());
};
