
const bcrypt = require("bcrypt");

const users = new Map();
const userIDs = new Map();

const passwordSaltRounds = 5;

function registerUser(username, password, simulator) {
	return new Promise((resolve, reject) => {
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

function changeUsername(id, newUsername) {
	let oldUsername = null;
	userIDs.forEach((userID, username) => {
		if(userID == id) {
			oldUsername = username;
		}
	});

	if(oldUsername == null) {
		throw "Can't change username of unknown user";
	} else {
		const passwordHash = users.get(oldUsername);
		userIDs.delete(oldUsername);
		users.delete(oldUsername);

		userIDs.set(newUsername, id);
		users.set(newUsername, passwordHash);
	}
}
exports.changeUsername = changeUsername;

function changePassword(id, newPassword) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(newPassword, passwordSaltRounds, (error, hash) => {
			if(error) {
				reject("bcrypt failed: " + error);
			} else {
				let username = null;
				userIDs.forEach((userID, name) => {
					if(userID == id) {
						username = name;
					}
				});

				if(username == null) {
					reject("Can't change password of unknown user");
				} else {
					users.set(username, hash);
					resolve();
				}
			}
		});
	});
}
exports.changePassword = changePassword;

function usernameToID(username) {
	return userIDs.get(username);
}
exports.usernameToID = usernameToID;
