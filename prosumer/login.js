
const bcrypt = require("bcrypt");

const users = new Map();
const userIDs = new Map();

function registerUser(username, password, simulator) {
	return new Promise((resolve, reject) => {
		const passwordSaltRounds = 5;
		bcrypt.hash(password, passwordSaltRounds, (error, hash) => {
			if(error) {
				reject("bcrypt failed: " + error);
			} else if(users.has(username)) {
				reject("User already exist");
			} else {
				simulator.createProsumer().then((id) => {
					userIDs.set(username, id);
					users.set(username, hash);
					resolve(id);
				}).catch((error) => {
					reject("Failed to create prosumer: " + error);
				});
			}
		});
	});
}
exports.registerUser = registerUser;

function loginUser(username, password) {
	return new Promise((resolve, reject) => {
		if(!users.has(username)) {
			reject("User does not exist");
		} else {
			const passwordHash = users.get(username);
			bcrypt.compare(password, passwordHash).then((success) => {
				if(success == true) {
					resolve(usernameToID(username));
				} else {
					reject("Incorrect password");
				}
			}).catch((error) => {
				reject("bcrypt failed: " + error);
			});
		}
	});
}
exports.loginUser = loginUser;

function usernameToID(username) {
	return userIDs.get(username);
}
exports.usernameToID = usernameToID;
