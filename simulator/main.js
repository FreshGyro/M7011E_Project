
console.log("Starting server...");

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

//Random customers
for(let i = 0; i < 12345; ++i) {
	const x = Math.random() * 100000;
	const y = Math.random() * 100000;
	consumption.addProsumer(x, y);
}

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
}

setInterval(() => {
	update();
}, 1000);
update();
