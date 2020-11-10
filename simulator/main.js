
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

app.get("/totalproduction", (request, response) => {
	response.json(consumption.getTotalProduction());
});
app.get("/totalconsumption", (request, response) => {
	response.json(consumption.getTotalConsumption());
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
	console.log("Production: " + consumption.getTotalProduction());
	console.log("Consumption: " + consumption.getTotalConsumption());
	console.log("Delta: " + (consumption.getTotalProduction() - consumption.getTotalConsumption()));
}

setInterval(() => {
	update();
}, 1000);
update();
