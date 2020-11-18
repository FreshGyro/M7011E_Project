
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")({dest:"./uploads"});
const fs = require("fs");

const login = require("./login.js");
const simulator = require("./simulator.js");

const app = express();
app.use("/uploads", express.static("./uploads"));

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post("/register", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.registerUser(username, password, simulator).then(() => {
		response.json({
			success:true
		});
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/getprosumerdata", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.loginUser(username, password).then((userID) => {
		simulator.getProsumerData(userID).then((data) => {
			response.json(data);
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/setmarketratio", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.loginUser(username, password).then((userID) => {
		const ratio = parseFloat(request.query.ratio);
		simulator.setMarketRatio(userID, ratio).then((data) => {
			response.json(data);
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/uploadimage", multer.single("photo"), (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.loginUser(username, password).then((userID) => {
		fs.rename(request.file.path, "./uploads/" + userID + ".jpg", (error) => {
			if(error) {
				console.error(error);
			}
		});

		response.json({
			success:true
		});
	}).catch((error) => {
		response.json({
			error:error
		});
	});
});

app.post("/getimageurl", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	const userID = login.usernameToID(username);
	if(userID == null) {
		response.json({
			"error":"Invalid username"
		});
	} else {
		response.json({
			"url":"uploads/" + userID + ".jpg"
		});
	}
});

app.listen(81);
console.log("Server is running!");
