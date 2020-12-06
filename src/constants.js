export default class Constants {
	static SERVER_PORT = "8080"
	static SERVER_IP   = "localhost"
	static SERVER_URL  = `http://${Constants.SERVER_IP}:${Constants.SERVER_PORT}/api`
	static CAR_ENDPOINT = Constants.SERVER_URL + '/car'
}