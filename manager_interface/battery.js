
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
				backgroundColor:"#57ce25",
				borderColor:"#4aaf1f",
				fill:false,
				data:batteryData
			},{
				label:"Max battery",
				backgroundColor:"#9a22d6",
				borderColor:"#8a11c6",
				fill:false,
				data:maxData
			}]
	  },
		options:{
			responsive:true,
			legend:{
				labels:{
					fontColor:"#fff"
				}
			},
			scales:{
				xAxes:[{
					gridLines:{
						color:"rgba(255,255,255,0.1)",
						zeroLineColor:"#fff"
					},
					ticks:{
						beginAtZero:true,
						fontColor:"#fff"
					}
				}],
				yAxes:[{
					gridLines:{
						color:"rgba(255,255,255,0.1)",
						zeroLineColor:"#fff"
					},
					ticks:{
						beginAtZero:true,
						fontColor:"#fff"
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
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/getbatterystats", true);
		request.send();
	}, 500);
})();
