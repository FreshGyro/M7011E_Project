
(function() {
	const context = document.getElementById("market-chart").getContext("2d");
	const labels = [];
	const productionData = [];
	const demandData = [];
	const chart = new Chart(context, {
		type:"line",
		data:{
			labels:labels,
			datasets:[{
				label:"Market production",
				backgroundColor:"#d31f55",
				borderColor:"#b51b49",
				fill:false,
				data:productionData
			},{
				label:"Market demand",
				backgroundColor:"#1fd3ac",
				borderColor:"#19aa8b",
				fill:false,
				data:demandData
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
					productionData.push(json["production"]);
					demandData.push(json["demand"]);

					if(labels.length > 100) {
						labels.splice(0, 1);
						productionData.splice(0, 1);
						demandData.splice(0, 1);
					}

					chart.update();
				}
			}
		};
		request.open("GET", "http://" + simulatorServerAddress + ":" + simulatorServerPort + "/getmarketstats", true);
		request.send();
	}, 500);
})();
