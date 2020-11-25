
console.log("Starting server...");

const Prosumer = require("./prosumer.js");
const Consumer = require("./consumer.js");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const consumption = require("./consumption.js");
const weather = require("./weather.js");

const app = express();

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Random prosumers
for(let i = 0; i < 12345; ++i) {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	consumption.addProsumer(new Prosumer(x, y));
}

//Random consumers
for(let i = 0; i < 420; ++i) {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	consumption.addProsumer(new Consumer(x, y));
}

app.get("/createprosumer", (request, response) => {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	const id = consumption.addProsumer(new Prosumer(x, y));

	response.json({
		id:id
	});
});

app.get("/getprosumerdata", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const prosumer = consumption.getProsumerById(id);
	if(prosumer == null) {
		response.json({
			error:"Unknown prosumer"
		});
	} else {
		response.json({
			"wind":prosumer.getWindSpeed(consumption.getCurrentTime()),
			"production":prosumer.getProduction(consumption.getCurrentTime()),
			"consumption":prosumer.getConsumption(),
			"battery":prosumer.getBatteryLevel(),
			"max_battery":prosumer.getMaxBatteryLevel(),
			"market_ratio":prosumer.getMarketRatio(),
			"market_price":consumption.getMarketPrice()
		});
	}
});

app.get("/setmarketratio", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const ratio = parseFloat(request.query.ratio);
	if(ratio < 0 && ratio > 1) {
		response.json({
			error:"Invalid ratio"
		});
	} else {
		const prosumer = consumption.getProsumerById(id);
		if(prosumer == null) {
			response.json({
				error:"Unknown prosumer"
			});
		} else {
			prosumer.setMarketRatio(ratio);
			response.json({
				success:true
			});
		}
	}
});

app.get("/setmarketprice", (request, response) => {
	const price = parseInt(request.query.price, 10);
	if(!isNaN(price)) {
		consumption.setMarketPrice(price);
		response.json({
			success:true
		});
	} else {
		response.json({
			error:"Not a number"
		});
	}
});

app.get("/getmarketstats", (request, response) => {
	response.json({
		"time":consumption.getCurrentTime(),
		"production":consumption.getMarketProduction(),
		"demand":consumption.getMarketDemand()
	});
});

app.get("/getbatterystats", (request, response) => {
	response.json({
		"time":consumption.getCurrentTime(),
		"battery":consumption.getTotalBattery(),
		"max_battery":consumption.getTotalMaxBattery()
	});
});

app.get("/getpowerplantdata", (request, response) => {
	const time = consumption.getCurrentTime();
	const powerPlant = consumption.getPowerPlant();
	response.json({
		"status":powerPlant.getStatus(time),
		"production":powerPlant.getProduction(time),
		"consumption":powerPlant.getConsumption(),
		"battery":powerPlant.getBatteryLevel(),
		"max_battery":powerPlant.getMaxBatteryLevel(),
		"suggested_price":consumption.getSuggestedMarketPrice(),
		"market_price":consumption.getMarketPrice()
	});
});

app.get("/setpowerplantenabled", (request, response) => {
	const enabled = (request.query.enabled == "true");
	const time = consumption.getCurrentTime();
	const powerPlant = consumption.getPowerPlant();
	if(enabled) {
		powerPlant.turnOn(time);
	} else {
		powerPlant.turnOff(time);
	}
	response.json({"success":true});
});

app.get("/windspeed", (request, response) => {
	const x = parseFloat(request.query.x);
	const y = parseFloat(request.query.y);
	const t = parseFloat(request.query.t);
	response.json(weather.getWindSpeed(x, y, t));
});

app.listen(80);
console.log("Server is running!");

function update() {
	consumption.update();
	console.log("Market production: " + consumption.getMarketProduction());
	console.log("Market demand: " + consumption.getMarketDemand());
	console.log("Delta: " + (consumption.getMarketProduction() - consumption.getMarketDemand()));
	console.log("Suggested price: " + consumption.getSuggestedMarketPrice());
	console.log("Current price: " + consumption.getMarketPrice());
}

setInterval(() => {
	update();
}, 1000);
update();
