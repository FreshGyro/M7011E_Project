
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const simulator = require("./simulator.js");

const app = express();

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/getprosumerdata", (request, response) => {
	const id = parseInt(request.query.id, 10);
	simulator.getProsumerData(id).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.listen(81);
console.log("Server is running!");
