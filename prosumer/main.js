
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")({dest:"./uploads"});
const fs = require("fs");

const activity = require("./activity.js");
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

const users = new Map();

app.post("/register", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.registerUser(username, password, simulator).then((userID) => {
		users.set(userID, {
			id:userID,
			username:username
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

app.post("/login", (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	login.loginUser(username, password).then((userID) => {
		activity.userHeartbeat(userID);
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
		activity.userHeartbeat(userID);
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
		activity.userHeartbeat(userID);
		const ratio = parseFloat(request.body.ratio);
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
		activity.userHeartbeat(userID);
		fs.rename(request.file.path, "./uploads/" + encodeURIComponent(username) + ".jpg", (error) => {
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

app.get("/getprosumerlist", (request, response) => {
	const userData = [];
	const idList = [];
	users.forEach((user) => {
		userData.push({
			id:user.id,
			username:user.username,
			isActive:activity.isUserActive(user.id)
		});
		idList.push(user.id);
	});
	simulator.getProsumersData(idList).then((prosumerData) => {
		const json = [];
		for(let i = 0; i < idList.length; i++) {
			json.push({
				"id":userData[i].id,
				"username":userData[i].username,
				"isActive":userData[i].isActive,
				"wind":prosumerData[i]["wind"],
				"production":prosumerData[i]["production"],
				"consumption":prosumerData[i]["consumption"],
				"battery":prosumerData[i]["battery"],
				"max_battery":prosumerData[i]["max_battery"],
				"market_ratio":prosumerData[i]["market_ration"],
				"blackout":prosumerData[i]["blackout"]
			});
		}
		response.json(json);
	});
});

//Manager actions
//TODO manager verification

app.post("/changeusername", (request, response) => {
	const id = parseInt(request.body.id, 10);
	const newUsername = request.body.newUsername;

	const user = users.get(id);
	if(user != null) {
		if(login.usernameToID(newUsername) != null) {
			//Username is already taken
			response.json({
				success:false
			});
		} else {
			user.username = newUsername;
			login.changeUsername(id, newUsername);
			response.json({
				success:true
			});
		}
	} else {
		response.json({
			success:false
		});
	}
});

app.post("/changepassword", (request, response) => {
	const id = parseInt(request.body.id, 10);
	const newPassword = request.body.newPassword;

	const user = users.get(id);
	if(user != null) {
		login.changePassword(id, newPassword).then(() => {
			response.json({
				success:true
			});
		});
	} else {
		response.json({
			success:false
		});
	}
});


app.post("/deleteuser", (request, response) => {
	const id = parseInt(request.body.id, 10);

	if(users.has(id)) {
		users.delete(id);
		login.removeUser(id);
		simulator.deleteProsumer(id).then(() => {
			response.json({
				success:true
			});
		});
	} else {
		response.json({
			success:false
		});
	}
});

app.listen(81);
console.log("Server is running!");
