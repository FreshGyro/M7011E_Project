
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")({dest:"./uploads"});
const fs = require("fs");

const simulator = require("./simulator.js");

const app = express();
app.use("/uploads", express.static("./uploads"));

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

app.get("/setmarketratio", (request, response) => {
	const id = parseInt(request.query.id, 10);
	const ratio = parseFloat(request.query.ratio);
	simulator.setMarketRatio(id, ratio).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/uploadimage", multer.single("photo"), (request, response) => {
	const id = parseInt(request.query.id, 10);
	fs.rename(request.file.path, "./uploads/" + id + ".jpg", (error) => {
		console.error(error);
	});

	return response.json({
		success:true
	});
});

app.listen(81);
console.log("Server is running!");
