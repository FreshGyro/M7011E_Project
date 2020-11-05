
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const consumption = require("./consumption.js");

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
	consumption.addCustomer(x, y);
}

app.get("/totalconsumption", (request, response) => {
	response.json(consumption.getTotalConsumption());
});

app.listen(80);
console.log("Server is running!");
