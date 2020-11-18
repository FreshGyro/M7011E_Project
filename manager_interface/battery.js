
(function() {
	const context = document.getElementById("battery-chart").getContext("2d");
	const labels = [];
	const batteryData = [];
	const maxData = [];
	const chart = new Chart(context, {
		type:"line",
		data:{
			labels:labels,
			datasets:[{
				label:"Battery charge",
				backgroundColor:"Green",
				borderColor:"Green",
				fill:false,
				data:batteryData
			},{
				label:"Max battery",
				backgroundColor:"Purple",
				borderColor:"Purple",
				fill:false,
				data:maxData
			}]
	  },
		options:{
			responsive:true,
			scales:{
				yAxes:[{
					ticks:{
						beginAtZero:true
					}
				}]
			}
		}
	});

	let time = 0;
	setInterval(() => {
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(request.responseText);
				if(json["time"] > time) {
					time = json["time"];

					labels.push(++json["time"]);
					batteryData.push(json["battery"]);
					maxData.push(json["max_battery"]);

					if(labels.length > 100) {
						labels.splice(0, 1);
						batteryData.splice(0, 1);
						maxData.splice(0, 1);
					}

					chart.update();
				}
			}
		};
		request.open("GET", "http://127.0.0.1/getbatterystats", true);
		request.send();
	}, 500);
})();
