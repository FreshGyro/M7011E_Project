
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
	origin:"http://127.0.0.1:3000",
	optionsSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post("/test", (request, response) => {
	response.json({
		"message":"Hello world!"
	});
});

app.listen(80);
console.log("Server is running!");
