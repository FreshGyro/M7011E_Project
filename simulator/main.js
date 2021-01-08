
console.log("Starting server...");

const Prosumer = require("./prosumer.js");
const Consumer = require("./consumer.js");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const simulation = require("./simulation.js");
const weather = require("./weather.js");

const app = express();

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Random consumers
for(let i = 0; i < 10; ++i) {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	simulation.addProsumer(new Consumer(x, y));
}

app.get("/createprosumer", (request, response) => {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	const id = simulation.addProsumer(new Prosumer(x, y));

	response.json({
		id:id
	});
});

app.get("/deleteprosumer", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const prosumer = simulation.getProsumerById(id);
	if(prosumer == null) {
		response.json({
			error:"Unknown prosumer"
		});
	} else {
		simulation.deleteProsumer(prosumer);
		response.json({
			success:true
		});
	}
});

app.get("/blockuser", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const seconds = parseInt(request.query.seconds, 10);

	const prosumer = simulation.getProsumerById(id);
	if(prosumer == null) {
		response.json({
			error:"Unknown prosumer"
		});
	} else {
		prosumer.block(seconds);
		response.json({
			success:true
		});
	}
});

app.get("/getprosumerdata", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const prosumer = simulation.getProsumerById(id);
	if(prosumer == null) {
		response.json({
			error:"Unknown prosumer"
		});
	} else {
		response.json({
			"wind":prosumer.getWindSpeed(simulation.getCurrentTime()),
			"production":prosumer.getProduction(simulation.getCurrentTime()),
			"consumption":prosumer.getConsumption(),
			"battery":prosumer.getBatteryLevel(),
			"max_battery":prosumer.getMaxBatteryLevel(),
			"market_ratio":prosumer.getMarketRatio(),
			"market_price":simulation.getMarketPrice(),
			"blackout":prosumer.getBlackout(),
			"blocked":prosumer.isBlocked()
		});
	}
});

app.get("/getprosumersdata", (request, response) => {
	const prosumers = simulation.getProsumersByList(JSON.parse(request.query.idList));
	const prosumersData = [];
	prosumers.forEach(prosumer => prosumersData.push({
		"wind":prosumer.getWindSpeed(simulation.getCurrentTime()),
		"production":prosumer.getProduction(simulation.getCurrentTime()),
		"consumption":prosumer.getConsumption(),
		"battery":prosumer.getBatteryLevel(),
		"max_battery":prosumer.getMaxBatteryLevel(),
		"market_ratio":prosumer.getMarketRatio(),
		"blackout":prosumer.getBlackout(),
		"blocked":prosumer.isBlocked()
		})
	);
	response.json(prosumersData);
});

app.get("/setmarketratio", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const ratio = parseFloat(request.query.ratio);
	if(ratio < 0 && ratio > 1) {
		response.json({
			error:"Invalid ratio"
		});
	} else {
		const prosumer = simulation.getProsumerById(id);
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
		simulation.setMarketPrice(price);
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
		"time":simulation.getCurrentTime(),
		"production":simulation.getMarketProduction(),
		"demand":simulation.getMarketDemand()
	});
});

app.get("/getbatterystats", (request, response) => {
	response.json({
		"time":simulation.getCurrentTime(),
		"battery":simulation.getTotalBattery(),
		"max_battery":simulation.getTotalMaxBattery()
	});
});

app.get("/getpowerplantdata", (request, response) => {
	const time = simulation.getCurrentTime();
	const powerPlant = simulation.getPowerPlant();
	response.json({
		"status":powerPlant.getStatus(time),
		"production":powerPlant.getProduction(time),
		"consumption":powerPlant.getConsumption(),
		"battery":powerPlant.getBatteryLevel(),
		"max_battery":powerPlant.getMaxBatteryLevel(),
		"suggested_price":simulation.getSuggestedMarketPrice(),
		"market_price":simulation.getMarketPrice()
	});
});

app.get("/setpowerplantenabled", (request, response) => {
	const enabled = (request.query.enabled == "true");
	const time = simulation.getCurrentTime();
	const powerPlant = simulation.getPowerPlant();
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
	simulation.update();
	console.log("Market production: " + simulation.getMarketProduction());
	console.log("Market demand: " + simulation.getMarketDemand());
	console.log("Delta: " + (simulation.getMarketProduction() - simulation.getMarketDemand()));
	console.log("Suggested price: " + simulation.getSuggestedMarketPrice());
	console.log("Current price: " + simulation.getMarketPrice());
}

setInterval(() => {
	update();
}, 1000);
update();
