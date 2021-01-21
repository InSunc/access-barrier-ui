export default class Constants {
	static SERVER_PORT = "8080"
	static SERVER_IP   = "localhost"
	static SERVER_URL  = `http://${Constants.SERVER_IP}:${Constants.SERVER_PORT}/api`
	static CAR_ENDPOINT = Constants.SERVER_URL + '/car'
	static CAR_HISTORY_ENDPOINT = (plateNr) => Constants.SERVER_URL + `/car/${plateNr}/parking-histories`
	static PARKING_ENDPOINT = Constants.SERVER_URL + '/parking'
	static BRANDS = [
		{ name: "BMW", color: "gray" },
		{ name: "Mercedes", color: "red" },
		{ name: "Toyota", color: "cyan" },
		{ name: "Tesla", color: "blue" },
		{ name: "Audi", color: "orange" },
		{ name: "Skoda", color: "cyan" },
		{ name: "Volkswagen", color: "geekblue" },
		{ name: "Ford", color: "volcano" },
		{ name: "Mazda", color: "green" },
	]
}