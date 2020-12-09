
const price = new function() {
	const inputBox = document.getElementById("price-input");
	const button = document.getElementById("price-button");
	const suggestedPriceElement = document.getElementById("suggested-price");
	const suggestedPriceButton = document.getElementById("suggested-price-button");

	function setMarketPrice(price) {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json.hasOwnProperty("error")) {
					console.error("Error: " + json["error"]);
				}
			}
		};
		request.open("GET", "http://127.0.0.1:82/setmarketprice?price=" + price, true);
		request.send();
	}

	let suggestedPrice = 0;
	this.setPriceInfo = function(marketPrice, newSuggestedPrice) {
		suggestedPrice = Math.floor(newSuggestedPrice);
		inputBox.placeholder = marketPrice;
		suggestedPriceElement.textContent = Math.floor(newSuggestedPrice) + " €";
	};

	button.addEventListener("click", function() {
		setMarketPrice(inputBox.value);
		inputBox.placeholder = inputBox.value;
		inputBox.value = "";
	});

	suggestedPriceButton.addEventListener("click", function() {
		setMarketPrice(suggestedPrice);
		inputBox.placeholder = suggestedPrice;
		inputBox.value = "";
	});
}();
