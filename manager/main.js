
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer")({dest:"./uploads"});
const fs = require("fs");

const app = express();
app.use("/uploads", express.static("./uploads"));

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

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

app.listen(82);
console.log("Server is running!");
