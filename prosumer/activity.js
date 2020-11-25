
const activeUsers = new Map();

function userHeartbeat(userID) {
	activeUsers.set(userID, new Date().getTime());
}
exports.userHeartbeat = userHeartbeat;

function isUserActive(userID) {
	if(!activeUsers.has(userID)) {
		return false;
	} else {
		//If more than 5 seconds has passed show as inactive
		return (new Date().getTime() - activeUsers.get(userID) < 5000);
	}
}
exports.isUserActive = isUserActive;
