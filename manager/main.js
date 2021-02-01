
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")({dest:"./uploads"});
const fs = require("fs");
const vm = require("vm");

vm.runInThisContext(fs.readFileSync(__dirname + "/../config.js"));

const simulator = require("./simulator.js");

const app = express();
app.use("/uploads", express.static("./uploads"));

let corsOrigin = "http://" + webServerAddress;
if(webServerPort != 80) {
	corsOrigin += ":" + webServerPort;
}
app.use(cors({
	origin:corsOrigin,
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/getpowerplantdata", (request, response) => {
	simulator.getPowerPlantData().then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.get("/setpowerplantmarketratio", (request, response) => {
	simulator.setPowerPlantMarketRatio(request.query.ratio).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.get("/setpowerplantenabled", (request, response) => {
	simulator.setPowerPlantEnabled(request.query.enabled).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.get("/setmarketprice", (request, response) => {
	simulator.setMarketPrice(request.query.price).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.get("/blockuser", (request, response) => {
	simulator.blockUser(request.query.id, request.query.seconds).then((data) => {
		response.json(data);
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/uploadimage", multer.single("photo"), (request, response) => {
	fs.rename(request.file.path, "./uploads/manager.jpg", (error) => {
		if(error) {
			console.error(error);
		}
	});

	response.json({
		success:true
	});
});

app.listen(managerServerPort);
console.log("Server is running!");
